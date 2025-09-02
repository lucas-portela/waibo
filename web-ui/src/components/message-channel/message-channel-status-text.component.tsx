import { MessageChannelStatus } from "@/lib/api/dtos";
import { CircleNotifications } from "@mui/icons-material";
import { Box, Chip, Typography } from "@mui/material";
import { channel } from "diagnostics_channel";

const getStatusColor = (status: MessageChannelStatus) => {
  switch (status) {
    case MessageChannelStatus.OPEN:
      return "success";
    case MessageChannelStatus.CONNECTING:
      return "warning";
    case MessageChannelStatus.DISCONNECTED:
      return "error";
    case MessageChannelStatus.CLOSE:
      return "default";
    default:
      return "default";
  }
};

const getStatusIcon = (status: MessageChannelStatus) => {
  const color = getStatusColor(status);
  const colorMap = {
    success: "#4caf50",
    warning: "#ff9800",
    error: "#f44336",
    default: "#9e9e9e",
  };

  return (
    <Box
      sx={{
        backgroundColor: colorMap[color],
        width: "8px",
        height: "8px",
        borderRadius: "50%",
        marginBottom: "2px",
      }}
    ></Box>
  );
};

export default function MessageChannelStatusText({
  status,
}: {
  status?: MessageChannelStatus;
}) {
  return (
    <Box display="flex" alignItems="center" gap={0.5}>
      {getStatusIcon(status || MessageChannelStatus.CLOSE)}

      <Typography variant="caption" color="text.secondary">
        {status || "LOADING"}
      </Typography>
    </Box>
  );
}
