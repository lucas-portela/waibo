import { useUpdateChatMutation } from "@/lib/api/client";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ApiErrorAlert from "../alerts/api-error-alert.component";
import { ChatResponse } from "@/lib/api/dtos";

export default function UpdateChatModal({
  open,
  chat,
  onClose,
  afterMutate,
}: {
  open: boolean;
  chat: ChatResponse | null;
  onClose: () => void;
  afterMutate?: (data: ChatResponse) => void;
}) {
  const [updateChat, { isLoading: isUpdating, error: updateError }] =
    useUpdateChatMutation();

  const isLoading = isUpdating;
  const error = updateError;

  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [botMemory, setBotMemory] = useState("");

  useEffect(() => {
    if (open && chat) {
      setName(chat.name);
      setContact(chat.contact);
      setBotMemory(chat.botMemory || "");
    } else if (!open) {
      setName("");
      setContact("");
      setBotMemory("");
    }
  }, [open, chat]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!chat) return;

    updateChat({
      chatId: chat.id,
      data: {
        name,
        contact,
        botMemory: botMemory.trim() || undefined,
      },
    }).then(({ data, error }) => {
      if (error) return;
      onClose();
      if (afterMutate) afterMutate(data);
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      component={"form"}
      fullWidth
      onSubmit={handleSubmit}
      maxWidth="sm"
    >
      <DialogTitle id="modal-modal-title">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Update Chat
          {isLoading && <CircularProgress size={24} sx={{ ml: 1 }} />}
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Chat Name"
            variant="outlined"
            fullWidth
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            helperText="A friendly name for this chat"
          />
          <TextField
            label="Contact"
            variant="outlined"
            fullWidth
            required
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            helperText="Contact information (phone number, email, etc.)"
          />
          <TextField
            label="Bot Memory"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={botMemory}
            onChange={(e) => setBotMemory(e.target.value)}
            helperText="Optional context or memory for the bot to remember and use in this chat"
            placeholder="Enter any important context about this conversation..."
          />
        </Box>
        {error && !isLoading && (
          <ApiErrorAlert error={error} defaultMessage="Failed to update chat" />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit" sx={{ color: "grey" }}>
          Cancel
        </Button>
        <Button
          disabled={isLoading}
          loading={isLoading}
          variant="contained"
          color="primary"
          type="submit"
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
}
