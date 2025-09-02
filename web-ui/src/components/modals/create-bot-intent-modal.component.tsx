import { useCreateBotIntentMutation } from "@/lib/api/client";
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
import { BotIntentResponse } from "@/lib/api/dtos";

export default function CreateBotIntentModal({
  open,
  onClose,
  botId,
  afterMutate,
}: {
  open: boolean;
  onClose: () => void;
  botId: string;
  afterMutate?: (data: BotIntentResponse) => void;
}) {
  const [createBotIntent, { isLoading: isCreating, error: createError }] =
    useCreateBotIntentMutation();

  const isLoading = isCreating;
  const error = createError;

  const [name, setName] = useState("");
  const [trigger, setTrigger] = useState("");
  const [response, setResponse] = useState("");

  useEffect(() => {
    if (open) return;
    setName("");
    setTrigger("");
    setResponse("");
  }, [open]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    createBotIntent({
      botId,
      data: { name, trigger, response },
    }).then(({ data, error }) => {
      if (error) return;
      onClose();
      if (afterMutate && data) afterMutate(data);
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
          Create Bot Intent
          {isLoading && <CircularProgress size={24} sx={{ ml: 1 }} />}
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            helperText="A descriptive name for this intent"
          />
          <TextField
            label="Trigger"
            variant="outlined"
            fullWidth
            required
            value={trigger}
            onChange={(e) => setTrigger(e.target.value)}
            placeholder="e.g., 'When does the store open?'"
            helperText="The message that will trigger this intent"
          />
          <TextField
            label="Response"
            variant="outlined"
            fullWidth
            required
            multiline
            rows={3}
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder="e.g., 'The store opens at 9 AM every day except Sunday.'"
            helperText="The bot's response when this intent is triggered"
          />
        </Box>
        {error && !isLoading && (
          <ApiErrorAlert
            error={error}
            defaultMessage="Failed to create bot intent"
          />
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
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
