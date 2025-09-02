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
  PrecisionManufacturing as BotIcon,
} from "@mui/icons-material";
import { BotResponse } from "../../lib/api/dtos/bot.dto";
import { formatDate } from "@/lib/utils/format.utils";

interface BotCardProps {
  bot: BotResponse;
  onEdit?: (bot: BotResponse) => void;
  onDelete?: (botId: string) => void;
}

export default function BotCard({ bot, onEdit, onDelete }: BotCardProps) {
  const maxPromptLength = 300;

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(bot);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(bot.id);
    }
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s ease-in-out",
      }}
    >
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Stack spacing={1} sx={{ height: "100%" }}>
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
                <BotIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" component="div" noWrap>
                  {bot.name}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Divider sx={{ mb: 2 }} />

          <Stack spacing={1} flexGrow={1}>
            <Box display="flex" alignItems="flex-start" gap={1} mb={1}>
              <Typography
                variant="body2"
                sx={{
                  wordBreak: "break-word",
                  display: "-webkit-box",
                  overflow: "hidden",
                }}
              >
                {bot.prompt.slice(0, maxPromptLength) +
                  (bot.prompt.length > maxPromptLength ? "..." : "")}
              </Typography>
            </Box>
          </Stack>
          <Stack sx={{ mt: 2 }} direction="row" spacing={1} flexWrap="wrap">
            <Chip
              label={formatDate(bot.createdAt)}
              size="small"
              variant="outlined"
              color={"info"}
            />
          </Stack>
        </Stack>
      </CardContent>

      <CardActions sx={{ justifyContent: "flex-end", pt: 0 }}>
        <Tooltip title="Edit Bot">
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
        <Tooltip title="Delete Bot">
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
