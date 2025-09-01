import { Injectable, Logger } from '@nestjs/common';
import makeWASocket, {
  AuthenticationCreds,
  DisconnectReason,
  fetchLatestBaileysVersion,
  useMultiFileAuthState,
  WAMessage,
  WAVersion,
} from 'baileys';
import { MessageChannelDto } from 'src/application/chat/dtos/message-channel.dto';
import { PairingType } from 'src/application/chat/dtos/pairing-data.dto';
import { ChannelPairingService } from 'src/application/chat/services/channel-pairing.service';
import { MessageChannelService } from 'src/application/chat/services/message-channel.service';
import { MessageChannelStatus } from 'src/domain/chat/entities/message-channel.entity';
import * as qrcode from 'qrcode-terminal';
import fs from 'fs';
import { ChatService } from 'src/application/chat/services/chat.service';
import { ChatSender } from 'src/domain/chat/entities/chat-message.entity';
import pino from 'pino';

const CHANNEL_TYPE = 'whatsapp';
const CHANNEL_NAME = 'WhatsApp';
const KEYSTORE_PATH = (channelId: string) =>
  `./.data/baileys_keystore/${channelId}`;

export type BaileysConnection = {
  sock: ReturnType<typeof makeWASocket>;
  channel: MessageChannelDto;
  qrCode?: string;
};

@Injectable()
export class WhatsappBaileysService {
  logger = new Logger(WhatsappBaileysService.name);
  connections: BaileysConnection[] = [];
  waVersion: WAVersion;

  constructor(
    private pairingService: ChannelPairingService,
    private messageChannelService: MessageChannelService,
    private chatService: ChatService,
  ) {}

  async onModuleInit() {
    const { version } = await fetchLatestBaileysVersion();
    this.waVersion = version;
    this.messageChannelService.registerChannelType({
      type: CHANNEL_TYPE,
      name: CHANNEL_NAME,
    });

    const channels = await this.messageChannelService.findByType(CHANNEL_TYPE);
    for (const channel of channels) {
      if (channel.sessionId) {
        await this._assertConnection(channel);
      }
    }

    await this.pairingService.onUnpair({
      channelType: CHANNEL_TYPE,
      handler: async ({ data }) => {
        await this._removeConnection(data.id);
      },
    });

    await this.pairingService.onPairingRequest({
      channelType: CHANNEL_TYPE,
      handler: async ({ data }) => {
        const start = Date.now();
        let elapsed = 0;
        // 1 minute timeout
        while (elapsed < 60000) {
          const connection = await this._assertConnection(data);
          if (connection.qrCode) {
            await this.pairingService.sendPairingData({
              channelId: connection.channel.id,
              channelType: connection.channel.type,
              data: connection.qrCode,
              type: PairingType.QR_CODE,
            });
            break;
          }

          await new Promise((resolve) => setTimeout(resolve, 1000));
          elapsed = Date.now() - start;
        }
      },
    });

    await this.chatService.onOutputEvent({
      channelType: CHANNEL_TYPE,
      handler: async ({ data }) => {
        const connection = this._getConnection(data.channel.id);
        if (!connection) {
          this.logger.error(
            `Cannot send message to ${data.channel.id} without an active connection! The message will not be received.`,
          );
          return;
        }

        try {
          const { remoteJid } = this._parseChatInternalIdentifier(
            data.chat.internalIdentifier,
          );
          await connection.sock.sendMessage(remoteJid, {
            text: data.message.content,
          });
        } catch (err) {
          this.logger.error('Error sending message:', err);
        }
      },
    });
  }

  // Helpers
  private _getConnection(channelId: string) {
    const connection = this.connections.find((c) => c.channel.id === channelId);
    return connection || null;
  }

  private async _updateConnection(connection: BaileysConnection) {
    const existing = this.connections.find(
      (c) => c.channel.id === connection.channel.id,
    );
    if (existing) {
      existing.sock = connection.sock;
      existing.channel = connection.channel;
      existing.qrCode = connection.qrCode;
    } else {
      this.connections.push(connection);
    }
  }

  private async _removeConnection(channelId: string) {
    const connectionIndex = this.connections.findIndex(
      (c) => c.channel.id === channelId,
    );
    if (connectionIndex == -1) return;
    const connection = this.connections[connectionIndex];
    this.connections.splice(connectionIndex, 1);

    try {
      await connection.sock.logout();
    } catch {
      this.logger.error('Failed to logout!');
    }

    await this._disconnect(connection);

    if (fs.existsSync(KEYSTORE_PATH(channelId))) {
      fs.rmSync(KEYSTORE_PATH(channelId), { recursive: true, force: true });
    }

    if (connection.channel.sessionId)
      await this.pairingService.unbindSession(connection.channel.sessionId);
  }

  private async _disconnect(connection: BaileysConnection) {
    await connection.sock.ws.close();
    connection.sock.ev.removeAllListeners('creds.update');
    connection.sock.ev.removeAllListeners('connection.update');
  }

  private async _reconnect(connection: BaileysConnection) {
    await this._disconnect(connection);
    this.connections = this.connections.filter(
      (c) => c.channel.id != connection.channel.id,
    );
    return await this._assertConnection(connection.channel);
  }

  private async _assertConnection(
    channel: MessageChannelDto,
  ): Promise<BaileysConnection> {
    const existing = this._getConnection(channel.id);
    if (existing) return existing;

    const { state, saveCreds } = await useMultiFileAuthState(
      KEYSTORE_PATH(channel.id),
    );

    const sock = makeWASocket({
      auth: state,
      version: this.waVersion,
      getMessage: async () => undefined,
      logger: pino({ level: 'error' }),
    });

    const connection: BaileysConnection = { sock, channel };

    sock.ev.on('creds.update', async () => {
      await saveCreds();
    });

    const updateChannel = async ({
      channel: updatedChannel,
      qrCode,
    }: {
      channel?: MessageChannelDto;
      qrCode?: string;
    }) => {
      await this._updateConnection({
        sock,
        channel: updatedChannel || channel,
        qrCode,
      });
      if (updatedChannel) channel = updatedChannel;
    };

    sock.ev.on('messages.upsert', async ({ messages }) => {
      try {
        for (const message of messages) {
          // TODO: ignore messages from myself
          if (
            // message.key.fromMe ||
            this._isBroadcastMessage(message) ||
            this._isGroupMessage(message)
          )
            continue;

          const content = this._getMessageText(message);
          const chatInternalIdentifier = this._buildChatInternalIdentifier(
            channel,
            message,
          );
          const phoneNumber = this._getMessagePhoneNumber(message);
          const chat = await this.chatService.findChatByInternalIdentifier(
            chatInternalIdentifier,
          );
          if (!chat) {
            await this.chatService.createChat({
              messageChannelId: channel.id,
              internalIdentifier: chatInternalIdentifier,
              name: message.pushName || phoneNumber,
              contact: phoneNumber,
            });
          }
          await this.chatService.createMessage({
            chatInternalIdentifier,
            sender: ChatSender.RECIPIENT,
            content,
          });
        }
      } catch (err) {
        this.logger.error('Error processing incoming message:', err);
      }
    });

    sock.ev.on('connection.update', async (update) => {
      try {
        const sessionId = this._buildSessionId(channel, sock.authState.creds);
        if (sessionId && sessionId !== channel.sessionId) {
          const updatedChannel = await this.pairingService.bindSession({
            channelId: channel.id,
            sessionId,
          });
          await updateChannel({ channel: updatedChannel });
        }
        if (update.connection === 'close' && update.lastDisconnect) {
          const statusCode = (update.lastDisconnect?.error as any)?.output
            ?.statusCode;
          if (statusCode === DisconnectReason.loggedOut) {
            await this._removeConnection(channel.id);
            return;
          } else if (statusCode === DisconnectReason.restartRequired) {
            await this._reconnect({ sock, channel });
            return;
          } else {
            await this._removeConnection(channel.id);
            return;
          }
        }
        if (update.connection !== undefined && sessionId) {
          const newStatus =
            {
              open: MessageChannelStatus.OPEN,
              connecting: MessageChannelStatus.CONNECTING,
              close: MessageChannelStatus.CLOSE,
            }[update.connection] || MessageChannelStatus.DISCONNECTED;

          if (newStatus !== channel.status) {
            const updatedChannel =
              await this.messageChannelService.updateSessionStatus({
                sessionId,
                status: newStatus,
              });
            await updateChannel({ channel: updatedChannel });
          }
        }
        if (update.qr) {
          qrcode.generate(update.qr, { small: true });
          await updateChannel({ qrCode: update.qr });
        }
      } catch (err) {
        this.logger.error('Error in connection update handler:', err);
      }
    });

    this.connections.push(connection);
    return connection;
  }

  private _getMessageText(message: WAMessage) {
    return (
      message.message?.extendedTextMessage?.text ||
      message.message?.conversation ||
      JSON.stringify(message.message)
    );
  }

  private _buildChatInternalIdentifier(
    channel: MessageChannelDto,
    message: WAMessage,
  ) {
    return `${channel.id}|${message.key.remoteJid}`;
  }

  private _parseChatInternalIdentifier(internalIdentifier: string) {
    const [channelId, remoteJid] = internalIdentifier.split('|');
    return { channelId, remoteJid };
  }

  private _buildSessionId(
    channel: MessageChannelDto,
    creds: AuthenticationCreds,
  ) {
    return creds.me ? `${channel.id}|${creds.me.id}` : null;
  }

  private _getMessagePhoneNumber(message: WAMessage) {
    return (message.key.remoteJid || '')
      .replace('@s.whatsapp.net', '')
      .replace('@g.us', '');
  }

  private _isGroupMessage(message: WAMessage) {
    return (message.key.remoteJid || '').endsWith('@g.us');
  }

  private _isBroadcastMessage(message: WAMessage) {
    return (message.key.remoteJid || '').endsWith('@broadcast');
  }
}
