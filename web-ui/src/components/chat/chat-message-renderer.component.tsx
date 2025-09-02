import { ChatMessageResponse, ChatSender } from "@/lib/api/dtos";
import { formatDate } from "@/lib/utils/format.utils";
import { Box, Stack, Typography } from "@mui/material";

export default function ChatMessageRenderer({
  message,
  contactName,
}: {
  message: ChatMessageResponse;
  contactName: string;
}) {
  const isRecipientMessage = message.sender == ChatSender.RECIPIENT;
  const senderMap = {
    [ChatSender.USER]: "You",
    [ChatSender.RECIPIENT]: contactName,
    [ChatSender.BOT]: "Bot",
  };
  return (
    <Stack
      direction="row"
      sx={{ width: "100%" }}
      justifyContent={isRecipientMessage ? "start" : "end"}
    >
      <Box
        sx={{
          display: "inline-block",
          bgcolor: isRecipientMessage ? "#dcf8c6" : "#f9f9f9",
          color: "black",
          borderRadius: "16px",
          padding: "8px 16px",
          maxWidth: "70%",
          boxShadow: 1,
          margin: "8px 0",
          alignSelf: "flex-end",
        }}
      >
        <pre
          style={{
            whiteSpace: "pre-wrap",
          }}
        >
          {message.content}
        </pre>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="caption" color="text.secondary">
            {senderMap[message.sender] || "Unknown"}
            {" - "}
            {formatDate(message.createdAt)}
          </Typography>
        </Stack>
      </Box>
    </Stack>
  );
}
