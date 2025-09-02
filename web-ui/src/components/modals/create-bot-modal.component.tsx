import { useCreateBotMutation } from "@/lib/api/client";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import ApiErrorAlert from "../alerts/api-error-alert.component";
import {
  BotIntentResponse,
  BotResponse,
  CreateBotRequest,
} from "@/lib/api/dtos";
import { Add, Close, Delete, Message } from "@mui/icons-material";

export default function CreateBotModal({
  open,
  onClose,
  afterMutate,
}: {
  open: boolean;
  onClose: () => void;
  afterMutate?: (bot: BotResponse) => void;
}) {
  const [createBot, { isLoading: isCreating, error: createError }] =
    useCreateBotMutation();

  const isLoading = isCreating;
  const error = createError;

  const mainFormRef = useRef<HTMLFormElement>(null);

  const [name, setName] = useState("");
  const [prompt, setPrompt] = useState("");

  const [intentTrigger, setIntentTrigger] = useState("");
  const [intentResponse, setIntentResponse] = useState("");
  const [intents, setIntents] = useState<CreateBotRequest["intents"]>([]);

  useEffect(() => {
    if (open) return;
    setName("");
    setPrompt("");
    setIntentTrigger("");
    setIntentResponse("");
    setIntents([]);
  }, [open]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    createBot({ name, prompt, intents }).then(({ data, error }) => {
      if (error) return;
      onClose();
      if (afterMutate && data) afterMutate(data);
    });
  };

  const handleAddIntentTrigger = (event: React.FormEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (intentTrigger && intentResponse) {
      setIntents((prev) => [
        ...prev,
        { trigger: intentTrigger, response: intentResponse },
      ]);
      setIntentTrigger("");
      setIntentResponse("");
    }
  };

  const handleDeleteIntent = (index: number) => {
    setIntents((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      fullWidth
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
          Create Bot
          {isLoading && <CircularProgress size={24} sx={{ ml: 1 }} />}
        </Box>
      </DialogTitle>
      <DialogContent>
        <Stack sx={{ mt: 2 }} gap={2}>
          <Stack
            component={"form"}
            onSubmit={handleSubmit}
            gap={2}
            ref={mainFormRef}
          >
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              label="Instructions"
              variant="outlined"
              fullWidth
              required
              multiline
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              helperText="Provide instructions for how the bot should behave and respond"
            />
          </Stack>
          <Divider />
          <Typography variant="body1">Intents (optional)</Typography>
          <List dense>
            {intents.map((intent, index) => (
              <React.Fragment key={index}>
                <ListItem
                  secondaryAction={
                    <IconButton
                      aria-label="delete"
                      onClick={() => handleDeleteIntent(index)}
                    >
                      <Close />
                    </IconButton>
                  }
                >
                  <ListItemIcon>
                    <Message />
                  </ListItemIcon>
                  <ListItemText
                    primary={intent.trigger}
                    secondary={intent.response}
                  />
                </ListItem>
              </React.Fragment>
            ))}
          </List>
          <Stack
            direction="column"
            gap={1}
            sx={{ width: "100%" }}
            component={"form"}
            onSubmit={handleAddIntentTrigger}
          >
            <Stack
              direction="row"
              gap={1}
              alignItems="stretch"
              sx={{ width: "100%" }}
            >
              <TextField
                label="Intent Trigger"
                variant="outlined"
                placeholder="e.g., 'When does the store open?'"
                fullWidth
                required
                size="small"
                value={intentTrigger}
                onChange={(e) => setIntentTrigger(e.target.value)}
              />

              <Button variant="outlined" type="submit">
                <Add />
              </Button>
            </Stack>
            <TextField
              label="Intent Response"
              variant="outlined"
              fullWidth
              required
              size="small"
              placeholder="e.g., 'The store opens at 9 AM every day except Sunday.'"
              value={intentResponse}
              onChange={(e) => setIntentResponse(e.target.value)}
            />
          </Stack>
          <Typography variant="caption" color="text.secondary">
            Intents are predefined answers that allow the bot to identify and
            respond static messages, saving resources and enabling more
            efficient conversations.
          </Typography>
        </Stack>
        {error && !isLoading && (
          <ApiErrorAlert error={error} defaultMessage="Failed to create bot" />
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
          onClick={() => {
            mainFormRef.current?.requestSubmit();
          }}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
