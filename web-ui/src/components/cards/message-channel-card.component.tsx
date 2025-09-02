"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Box,
  IconButton,
  Tooltip,
  Avatar,
  Divider,
  Stack,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Circle as CircleIcon,
} from "@mui/icons-material";
import { MessageChannelResponse } from "../../lib/api/dtos/message-channel.dto";
import { MessageChannelStatus } from "../../lib/api/dtos/common.dto";
import { useRouter } from "next/navigation";
import { useGetBotByIdQuery } from "@/lib/api/client";
import { formatDate } from "@/lib/utils/format.utils";
import MessageChannelStatusText from "../message-channel/message-channel-status-text.component";

interface MessageChannelCardProps {
  channel: MessageChannelResponse;
  onEdit?: (channel: MessageChannelResponse) => void;
  onDelete?: (channelId: string) => void;
}

export default function MessageChannelCard({
  channel,
  onEdit,
  onDelete,
}: MessageChannelCardProps) {
  const router = useRouter();
  const { data: bot } = useGetBotByIdQuery(channel.botId);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(channel);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(channel.id);
    }
  };

  const handleClick = () => {
    router.push(`/channels/${channel.id}`);
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          boxShadow: 4,
          transform: "translateY(-2px)",
        },
      }}
      onClick={handleClick}
    >
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar
              sx={{
                bgcolor: "primary.main",
                width: 40,
                height: 40,
              }}
            >
              {channel.name[0]}
            </Avatar>
            <Box>
              <Typography variant="h6" component="div" noWrap>
                {channel.name}
              </Typography>
              <Box display="flex" alignItems="center" gap={0.5}>
                {<MessageChannelStatusText status={channel.status} />}
              </Box>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Stack spacing={1}>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <Typography
              variant="body2"
              color="text.secondary"
              fontWeight="medium"
            >
              Contact:
            </Typography>
            <Typography variant="body2" noWrap>
              {channel.contact}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography
              variant="body2"
              color="text.secondary"
              fontWeight="medium"
            >
              Bot:
            </Typography>
            <Typography variant="body2" noWrap>
              {bot?.name || "Loading..."}
            </Typography>
          </Box>
        </Stack>
        <Stack sx={{ mt: 2 }} direction="row" spacing={1} flexWrap="wrap">
          <Chip
            label={channel.type}
            size="small"
            variant="outlined"
            color="primary"
          />
          <Chip
            label={formatDate(channel.createdAt)}
            size="small"
            variant="outlined"
            color={"info"}
          />
        </Stack>
      </CardContent>

      <CardActions sx={{ justifyContent: "flex-end", pt: 0 }}>
        <Tooltip title="Edit Channel">
          <IconButton
            size="small"
            onClick={handleEdit}
            color="primary"
            sx={{
              "&:hover": {
                backgroundColor: "primary.main",
                color: "white",
              },
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete Channel">
          <IconButton
            size="small"
            onClick={handleDelete}
            color="error"
            sx={{
              "&:hover": {
                backgroundColor: "error.main",
                color: "white",
              },
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
}
