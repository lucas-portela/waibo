"use client";
import ApiErrorAlert from "@/components/alerts/api-error-alert.component";
import ChatMessageRenderer from "@/components/chat/chat-message-renderer.component";
import MainLayout from "@/components/layout/main-layout.component";
import {
  useGetChatMessagesQuery,
  useGetChatQuery,
  useGetMessageChannelQuery,
  useSendMessageMutation,
} from "@/lib/api/client";
import { MessageChannelStatus } from "@/lib/api/dtos";
import { Send } from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  IconButton,
  Stack,
  TextField,
} from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

export default function ChatPage() {
  const params = useParams();
  const chatId = params.id as string;
  const router = useRouter();

  const {
    data: chat,
    isLoading: chatIsLoading,
    error: chatError,
  } = useGetChatQuery(chatId);

  const {
    data: messages,
    isLoading: messagesIsLoading,
    error: messagesError,
    refetch: refreshMessages,
  } = useGetChatMessagesQuery(chatId);

  const {
    data: channel,
    isLoading: channelIsLoading,
    error: channelError,
    refetch: refreshChannel,
  } = useGetMessageChannelQuery(chat?.messageChannelId + "", {
    skip: !chat?.messageChannelId,
  });

  const [sendMessage, { isLoading: sendingMessage, error: sendingError }] =
    useSendMessageMutation();

  const isLoading = chatIsLoading || messagesIsLoading || channelIsLoading;
  const error = chatError || messagesError || sendingError || channelError;

  const chatHistory = useRef<HTMLDivElement>(null);
  const [messageText, setMessageText] = useState("");

  const canSendMessage = useMemo(
    () =>
      !sendingMessage &&
      channel &&
      channel.status === MessageChannelStatus.OPEN,
    [sendingMessage, channel]
  );

  const handleSendMessage = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!messageText.trim() || !chat?.internalIdentifier) return;

    sendMessage({
      chatInternalIdentifier: chat.internalIdentifier,
      content: messageText.trim(),
    }).unwrap();
    setMessageText("");
    refreshMessages();
  };

  useEffect(() => {
    const refetchRoutine = setInterval(() => {
      refreshMessages();
      refreshChannel();
    }, 10000);

    return () => clearInterval(refetchRoutine);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (chatHistory.current) {
        chatHistory.current.scrollTop = chatHistory.current.scrollHeight;
      }
    }, 1000);
  }, [messages, chatHistory]);

  return (
    <MainLayout
      title={chat?.name || "Loading..."}
      onClose={() => router.back()}
    >
      {isLoading && (
        <Box textAlign="center" mt={4}>
          <CircularProgress />
        </Box>
      )}
      {error && <ApiErrorAlert error={error} />}
      {!isLoading && messages && (
        <Stack style={{ height: "100%", overflow: "hidden" }}>
          <Stack
            spacing={2}
            mt={2}
            sx={{ overflow: "auto", px: 2 }}
            ref={chatHistory}
          >
            {messages.map((message) => (
              <ChatMessageRenderer
                key={message.id}
                message={message}
                contactName={chat?.name || "Unknown"}
              />
            ))}
          </Stack>
          <Stack direction={"row"} justifyContent="center" mt={2} mb={2}>
            <TextField
              variant="outlined"
              placeholder={
                !canSendMessage
                  ? "Disconnected... Can't send messages"
                  : "Type your message..."
              }
              fullWidth
              maxRows={4}
              sx={{ bgcolor: "background.paper", borderRadius: 2 }}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  handleSendMessage(e);
                }
              }}
              disabled={!canSendMessage}
              slotProps={{
                input: {
                  endAdornment: sendingMessage ? (
                    <CircularProgress size={20} />
                  ) : (
                    <IconButton>
                      <Send />
                    </IconButton>
                  ),
                },
              }}
            />
          </Stack>
        </Stack>
      )}
    </MainLayout>
  );
}
