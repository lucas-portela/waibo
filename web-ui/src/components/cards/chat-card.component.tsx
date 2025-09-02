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
  Chat as ChatIcon,
  Memory as MemoryIcon,
} from "@mui/icons-material";
import { ChatResponse } from "../../lib/api/dtos/chat.dto";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/utils/format.utils";

interface ChatCardProps {
  chat: ChatResponse;
  onEdit?: (chat: ChatResponse) => void;
  onDelete?: (chatId: string) => void;
}

export default function ChatCard({ chat, onEdit, onDelete }: ChatCardProps) {
  const router = useRouter();

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(chat);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(chat.id);
    }
  };

  const handleClick = () => {
    router.push(`/chats/${chat.id}`);
  };

  const truncateText = (text: string, maxLength: number = 40) => {
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  const hasMemory = chat.botMemory && chat.botMemory.trim().length > 0;

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
                bgcolor: "success.main",
                width: 40,
                height: 40,
              }}
            >
              <ChatIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" component="div" noWrap>
                {chat.name}
              </Typography>
              <Box display="flex" alignItems="center" gap={0.5}>
                {hasMemory && (
                  <MemoryIcon sx={{ fontSize: 12, color: "info.main" }} />
                )}
                <Typography variant="caption" color="text.secondary">
                  {chat.internalIdentifier}
                </Typography>
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
              {chat.contact}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <Typography
              variant="body2"
              color="text.secondary"
              fontWeight="medium"
            >
              Channel ID:
            </Typography>
            <Typography variant="body2" noWrap>
              {truncateText(chat.messageChannelId)}
            </Typography>
          </Box>
          {hasMemory && (
            <Box display="flex" alignItems="center" gap={1}>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight="medium"
              >
                Memory:
              </Typography>
              <Typography variant="body2" noWrap>
                {truncateText(chat.botMemory!)}
              </Typography>
            </Box>
          )}
        </Stack>
        <Stack sx={{ mt: 2 }} direction="row" spacing={1} flexWrap="wrap">
          <Chip
            label="Chat"
            size="small"
            variant="outlined"
            color="success"
            icon={<ChatIcon sx={{ fontSize: 16 }} />}
          />
          {hasMemory && (
            <Chip
              label="Has Memory"
              size="small"
              variant="outlined"
              color="info"
              icon={<MemoryIcon sx={{ fontSize: 16 }} />}
            />
          )}
          <Chip
            label={formatDate(chat.createdAt)}
            size="small"
            variant="outlined"
            color={"info"}
          />
        </Stack>
      </CardContent>

      <CardActions sx={{ justifyContent: "flex-end", pt: 0 }}>
        <Tooltip title="Edit Chat">
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
        <Tooltip title="Delete Chat">
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
