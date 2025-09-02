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
  Psychology as IntentIcon,
} from "@mui/icons-material";
import { BotIntentResponse } from "../../lib/api/dtos/bot-intent.dto";
import { useRouter } from "next/navigation";
import { useGetBotByIdQuery } from "@/lib/api/client";
import { formatDate } from "@/lib/utils/format.utils";

interface BotIntentCardProps {
  botIntent: BotIntentResponse;
  onEdit?: (botIntent: BotIntentResponse) => void;
  onDelete?: (botIntentId: string) => void;
}

export default function BotIntentCard({
  botIntent,
  onEdit,
  onDelete,
}: BotIntentCardProps) {
  const router = useRouter();
  const { data: bot } = useGetBotByIdQuery(botIntent.botId);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(botIntent);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(botIntent.id);
    }
  };

  const handleClick = () => {
    router.push(`/bot-intents/${botIntent.id}`);
  };

  const truncateText = (text: string, maxLength: number = 50) => {
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
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
                bgcolor: "secondary.main",
                width: 40,
                height: 40,
              }}
            >
              <IntentIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" component="div" noWrap>
                {botIntent.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Tag: {botIntent.tag}
              </Typography>
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
              Trigger:
            </Typography>
            <Typography variant="body2" noWrap>
              {truncateText(botIntent.trigger)}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <Typography
              variant="body2"
              color="text.secondary"
              fontWeight="medium"
            >
              Response:
            </Typography>
            <Typography variant="body2" noWrap>
              {truncateText(botIntent.response)}
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
            label={botIntent.tag}
            size="small"
            variant="outlined"
            color="secondary"
          />
          <Chip
            label={formatDate(botIntent.createdAt)}
            size="small"
            variant="outlined"
            color={"info"}
          />
        </Stack>
      </CardContent>

      <CardActions sx={{ justifyContent: "flex-end", pt: 0 }}>
        <Tooltip title="Edit Bot Intent">
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
        <Tooltip title="Delete Bot Intent">
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
