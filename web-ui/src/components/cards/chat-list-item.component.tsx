"use client";

import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  IconButton,
  Tooltip,
  Avatar,
  Stack,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Chat as ChatIcon,
  Memory as MemoryIcon,
  AccessTime as TimeIcon,
} from "@mui/icons-material";
import { ChatResponse } from "../../lib/api/dtos/chat.dto";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/utils/format.utils";

interface ChatListItemProps {
  chat: ChatResponse;
  onEdit?: (chat: ChatResponse) => void;
  onDelete?: (chatId: string) => void;
}

export default function ChatListItem({
  chat,
  onEdit,
  onDelete,
}: ChatListItemProps) {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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

  const truncateText = (text: string, maxLength: number = 30) => {
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  const hasMemory = chat.botMemory && chat.botMemory.trim().length > 0;

  return (
    <Card
      sx={{
        cursor: "pointer",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          boxShadow: 3,
          backgroundColor: "action.hover",
        },
        mb: 1,
      }}
      onClick={handleClick}
    >
      <CardContent sx={{ py: 2 }}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          flexWrap={isMobile ? "wrap" : "nowrap"}
          gap={2}
        >
          {/* Left Section - Avatar and Main Info */}
          <Box display="flex" alignItems="center" gap={2} flex={1} minWidth={0}>
            <Avatar
              sx={{
                bgcolor: "success.main",
                width: 48,
                height: 48,
              }}
            >
              <ChatIcon />
            </Avatar>

            <Stack flex={1}>
              <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                <Typography variant="h6" component="div" noWrap>
                  {chat.name}
                </Typography>
                {hasMemory && (
                  <MemoryIcon sx={{ fontSize: 16, color: "info.main" }} />
                )}
              </Box>

              <Typography variant="body2" color="text.secondary" noWrap>
                Contact: {chat.contact}
              </Typography>

              <Box sx={{ pt: 1 }}>
                <Tooltip title="Created At">
                  <Chip
                    icon={<TimeIcon sx={{ fontSize: 12 }} />}
                    label={formatDate(chat.createdAt)}
                    size="small"
                    variant="outlined"
                    color="default"
                    sx={{ height: 24, fontSize: "0.7rem" }}
                  />
                </Tooltip>
              </Box>
            </Stack>
          </Box>

          <Box display="flex" gap={0.5}>
            <Tooltip title="Edit Chat">
              <IconButton
                size="small"
                onClick={handleEdit}
                color="primary"
                sx={{
                  p: 0.5,
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
                  p: 0.5,
                  "&:hover": {
                    backgroundColor: "error.main",
                    color: "white",
                  },
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
