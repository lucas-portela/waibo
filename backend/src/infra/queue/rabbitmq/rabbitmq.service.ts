import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  QueueOnce,
  QueuePublish,
  QueueService,
  QueueSubscribe,
  QueueSubscription,
} from 'src/application/queue/ports/queue.service';
import { InvalidConfigurationError } from 'src/core/error/invalid-configuration-error';
import { AmqpConnectionManager, ChannelWrapper } from 'amqp-connection-manager';
import * as amqp from 'amqp-connection-manager';
import { RABBIT_MQ_CONFIG } from './rabbitmq.config';
import { ConsumeMessage } from 'amqplib';
import { ZodError } from 'zod';

const EXCHANGE = 'amq.topic';

export type RabbitMQMessage<Type> = {
  data: Type;
  topic: string;
  sentAt: Date;
};

@Injectable()
export class RabbitMQService implements QueueService {
  private readonly logger = new Logger(RabbitMQService.name);

  private conn: AmqpConnectionManager;
  private channel: ChannelWrapper;
  private topics: string[] = [];

  constructor(private readonly config: ConfigService) {}

  async onModuleInit() {
    try {
      const connectionString = this._getConnectionString();
      this.conn = amqp.connect([connectionString]);
      this.channel = this.conn.createChannel({
        json: true,
        publishTimeout: 30000,
        setup: async (channel: amqp.Channel) => {
          await channel.assertExchange(EXCHANGE, 'topic', { durable: true });

          for (const topic of this.topics) {
            await channel.assertQueue(topic, { durable: true });
            await channel.bindQueue(topic, EXCHANGE, topic);
          }
        },
      });
      await this.channel.waitForConnect();
    } catch (error) {
      this.logger.error('Failed to start service: ', error);
      throw error;
    }
  }

  onModuleDestroy() {
    this.channel.close();
    this.conn.close();
  }

  async publish<Type>({ data, dto, topic }: QueuePublish<Type>): Promise<void> {
    data = dto.parse(data);

    try {
      await this.channel.publish(EXCHANGE, topic, {
        data,
        topic,
        sentAt: new Date(),
      } as RabbitMQMessage<Type>);
    } catch (error) {
      this.logger.error(`Error publishing message to ${topic}:`, error);
      throw error;
    }
  }

  async subscribe<Type>(
    subscription: QueueSubscribe<Type>,
  ): Promise<QueueSubscription> {
    await this.channel.waitForConnect();

    this.topics.push(subscription.topic);

    const queue = await this.channel.assertQueue(subscription.topic, {
      durable: true,
    });
    await this.channel.bindQueue(
      subscription.topic,
      EXCHANGE,
      subscription.topic,
    );

    const consumer = await this.channel.consume(
      queue.queue,
      (msg) => {
        this._handleMessage<Type>({ msg, subscription })
          .then(() => {
            if (msg) {
              this.channel.ack(msg);
            }
          })
          .catch((err) => {
            if (err instanceof ZodError) {
              this.logger.error(
                `Invalid dto in topic ${subscription.topic}:`,
                msg?.content.toString(),
                err,
              );
              this.channel.ack(msg);
              return;
            }
            this.logger.error(
              `Error processing message for ${subscription.topic}:`,
              err,
            );

            if (msg) {
              setTimeout(() => {
                if (!this.conn.isConnected()) return;
                this.channel.nack(msg, false, true);
              }, this._getRequeueDelayMs());
            }
          });
      },
      { noAck: false },
    );

    return {
      unsubscribe: async () => {
        await this.channel.cancel(consumer.consumerTag);
      },
    };
  }

  async once<Type>(params: QueueOnce<Type>): Promise<Type | null> {
    let completed = false;
    let resolve: (value: Type | null) => void;
    const promise = new Promise<Type | null>((res) => (resolve = res));

    const subscription = await this.subscribe<Type>({
      topic: params.topic,
      dto: params.dto,
      handler: async ({ data }) => {
        completed = true;
        resolve(data);
        await new Promise((r) => setTimeout(r, 0));
        await subscription.unsubscribe();
      },
    });

    if (params.afterSubscribe) {
      try {
        await params.afterSubscribe();
      } catch (error) {
        subscription.unsubscribe();
        throw error;
      }
    }

    if (params.timeout) {
      setTimeout(async () => {
        if (completed) return;
        completed = true;
        resolve(null);
        await subscription.unsubscribe();
      }, params.timeout);
    }

    return await promise;
  }

  // Helpers
  private async _handleMessage<Type>({
    msg,
    subscription,
  }: {
    msg: ConsumeMessage;
    subscription: QueueSubscribe<Type>;
  }) {
    if (!msg || !msg.content) return;
    const content = JSON.parse(msg.content.toString()) as RabbitMQMessage<Type>;
    content.data = subscription.dto.parse(content.data);
    content.sentAt = new Date(content.sentAt);

    await subscription.handler(content);
  }

  private _getConnectionString() {
    const value = this.config.get<string>(RABBIT_MQ_CONFIG.CONNECTION_STRING);
    if (!value)
      throw new InvalidConfigurationError(RABBIT_MQ_CONFIG.CONNECTION_STRING);
    return value;
  }

  private _getRequeueDelayMs() {
    const value = this.config.get<number>(RABBIT_MQ_CONFIG.REQUEUE_DELAY_MS);
    if (!value || isNaN(value) || value <= 0)
      throw new InvalidConfigurationError(RABBIT_MQ_CONFIG.REQUEUE_DELAY_MS);
    return value;
  }
}
