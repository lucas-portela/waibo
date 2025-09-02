"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Stack,
  Paper,
  Alert,
  CircularProgress,
  Chip,
  Button,
  Tooltip,
} from "@mui/material";
import { Refresh as RefreshIcon, QrCode } from "@mui/icons-material";
import { useParams, useRouter } from "next/navigation";
import MainLayout from "@/components/layout/main-layout.component";
import {
  useGetBotByIdQuery,
  useGetChatsByChannelIdQuery,
  useGetMessageChannelQuery,
  useDeleteChatMutation,
} from "@/lib/api/client";
import { ChatResponse } from "@/lib/api/dtos/chat.dto";
import ChatListItem from "@/components/cards/chat-list-item.component";
import { formatDate } from "@/lib/utils/format.utils";
import ApiErrorAlert from "@/components/alerts/api-error-alert.component";
import PageSection from "@/components/layout/page-section.component";
import MessageChannelStatusText from "@/components/message-channel/message-channel-status-text.component";
import MessageChannelBotChip from "@/components/message-channel/message-channel-bot-chip.component";
import UpdateChatModal from "@/components/modals/update-chat-modal.component";
import { MessageChannelStatus } from "@/lib/api/dtos";
import RequestPairingModal from "@/components/modals/request-pairing-modal.component";
import ConfirmationDialog from "@/components/modals/confirmation-dialog.component";

export default function ChannelChatsPage() {
  const params = useParams();
  const channelId = params.id as string;
  const router = useRouter();
  const [updateChatModal, setUpdateChatModal] = useState(false);
  const [pairingModalOpen, setPairingModalOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState<ChatResponse | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);

  const {
    data: channel,
    isLoading: isChannelLoading,
    error: channelError,
    refetch: refetchChannel,
  } = useGetMessageChannelQuery(channelId);
  const {
    data: chats,
    isLoading: isChatsLoading,
    error: chatsError,
    refetch: refetchChats,
  } = useGetChatsByChannelIdQuery(channelId);
  const {
    data: bot,
    isLoading: isBotLoading,
    error: botError,
    refetch: refetchBot,
  } = useGetBotByIdQuery(channel?.botId || "", {
    skip: !channel?.botId,
  });

  const [deleteChat, { isLoading: isDeleting }] = useDeleteChatMutation();

  const isLoading = isChannelLoading || isChatsLoading || isBotLoading;
  const error = channelError || chatsError || botError;

  const refresh = () => {
    refetchChannel();
    refetchChats();
    refetchBot();
  };

  const handleEditChat = (chat: ChatResponse) => {
    setSelectedChat(chat);
    setUpdateChatModal(true);
  };

  const handleDeleteChat = async (chatId: string) => {
    setChatToDelete(chatId);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteChat = async () => {
    if (!chatToDelete) return;

    try {
      await deleteChat(chatToDelete).unwrap();
      setDeleteConfirmOpen(false);
      setChatToDelete(null);
      refetchChats();
    } catch (error) {
      console.error("Failed to delete chat:", error);
    }
  };

  const cancelDeleteChat = () => {
    setDeleteConfirmOpen(false);
    setChatToDelete(null);
  };

  const handleConnectClick = () => {
    setPairingModalOpen(true);
  };

  useEffect(() => {
    const refetchRoutine = setInterval(() => {
      refresh();
    }, 10000);

    return () => clearInterval(refetchRoutine);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MainLayout title="Message Channel" onClose={() => router.push("/")}>
      <UpdateChatModal
        open={updateChatModal}
        chat={selectedChat}
        onClose={() => setUpdateChatModal(false)}
      />
      <RequestPairingModal
        channelId={channel?.id}
        onClose={() => setPairingModalOpen(false)}
        open={pairingModalOpen}
      />

      {isLoading && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="400px"
        >
          <CircularProgress />
        </Box>
      )}
      {error && <ApiErrorAlert error={error} />}

      <PageSection
        title={channel?.name || "Loading..."}
        description="Manage channel settings and connection"
      >
        <Stack gap={2}>
          <Stack direction={"row"} spacing={2} alignItems="center">
            <Chip
              label={channel?.type || "Loading..."}
              color="primary"
              sx={{ color: "white" }}
            />
            <MessageChannelBotChip botName={bot?.name} />
            <Tooltip title="Connection Status">
              <Chip
                label={<MessageChannelStatusText status={channel?.status} />}
              />
            </Tooltip>

            {!isLoading &&
              channel &&
              channel.status === MessageChannelStatus.DISCONNECTED && (
                <Button
                  variant="text"
                  color="primary"
                  startIcon={<QrCode />}
                  onClick={handleConnectClick}
                >
                  Connect
                </Button>
              )}
          </Stack>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Stack
              direction={"row"}
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Box>
                <Typography variant="body1" gutterBottom>
                  Chats
                </Typography>
                {chats && chats.length > 0 && (
                  <Typography variant="body2" color="textSecondary">
                    Last updated{" "}
                    {channel
                      ? formatDate(chats[chats.length - 1].createdAt)
                      : "Loading..."}
                  </Typography>
                )}
              </Box>
              <Stack gap={2}>
                <Stack direction={"row"} spacing={2} alignItems="center">
                  <Chip
                    label={chats ? `${chats.length} Chats` : "Loading..."}
                    color="primary"
                    variant="outlined"
                  />

                  {!isLoading &&
                    channel &&
                    channel.status === MessageChannelStatus.DISCONNECTED && (
                      <Button
                        variant="text"
                        color="warning"
                        startIcon={<RefreshIcon />}
                        onClick={refresh}
                      >
                        Refresh
                      </Button>
                    )}
                </Stack>
              </Stack>
            </Stack>
            <Stack spacing={2}>
              {chats && chats.length > 0 ? (
                chats.map((chat) => (
                  <ChatListItem
                    key={chat.id}
                    chat={chat}
                    onEdit={() => handleEditChat(chat)}
                    onDelete={() => handleDeleteChat(chat.id)}
                  />
                ))
              ) : (
                <Alert severity="info">No chats found for this channel.</Alert>
              )}
            </Stack>
          </Paper>
        </Stack>
      </PageSection>

      <ConfirmationDialog
        open={deleteConfirmOpen}
        title="Delete Chat"
        content={`Are you sure you want to delete this chat? This action cannot be undone and all messages in this chat will be permanently lost.`}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
        onConfirm={confirmDeleteChat}
        onCancel={cancelDeleteChat}
        confirmColor="error"
      />
    </MainLayout>
  );
}
