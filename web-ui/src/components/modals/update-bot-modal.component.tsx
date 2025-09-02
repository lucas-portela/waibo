import {
  useCreateBotIntentMutation,
  useGetBotIntentsQuery,
  useUpdateBotIntentMutation,
  useDeleteBotIntentMutation,
  useUpdateBotMutation,
} from "@/lib/api/client";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ApiErrorAlert from "../alerts/api-error-alert.component";
import {
  BotResponse,
  UpdateBotRequest,
  BotIntentResponse,
} from "@/lib/api/dtos";
import { Close, Edit, Message, Update } from "@mui/icons-material";
import AddMoreButton from "../buttons/add-more-button.component";
import CreateBotIntentModal from "./create-bot-intent-modal.component";
import UpdateBotIntentModal from "./update-bot-intent-modal.component";
import ConfirmationDialog from "./confirmation-dialog.component";

export default function UpdateBotModal({
  open,
  onClose,
  bot,
  afterMutate,
}: {
  open: boolean;
  onClose: () => void;
  bot: BotResponse | null;
  afterMutate?: (data: BotResponse) => void;
}) {
  const maxTriggerResponseSize = 100;
  const [updateBot, { isLoading: isUpdating, error: updateError }] =
    useUpdateBotMutation();

  const {
    data: intents,
    isLoading: isLoadingIntents,
    error: intentsError,
  } = useGetBotIntentsQuery(bot?.id || "", {
    skip: !open || !bot?.id,
  });

  const [
    deleteBotIntent,
    { isLoading: isDeletingIntent, error: deleteIntentError },
  ] = useDeleteBotIntentMutation();

  const isLoading = isUpdating || isLoadingIntents || isDeletingIntent;
  const error = updateError || intentsError || deleteIntentError;

  const [name, setName] = useState("");
  const [prompt, setPrompt] = useState("");

  const [updateIntentModalOpen, setUpdateIntentModalOpen] = useState(false);
  const [editIntentIndex, setEditIntentIndex] = useState<number | null>(null);
  const [createIntentModalOpen, setCreateIntentModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [intentToDelete, setIntentToDelete] = useState<{
    index: number;
    intent: BotIntentResponse;
  } | null>(null);

  const handleEditIntent = (index: number) => {
    setEditIntentIndex(index);
    setUpdateIntentModalOpen(true);
  };

  useEffect(() => {
    if (open && bot) {
      setName(bot.name);
      setPrompt(bot.prompt);
    } else if (!open) {
      setName("");
      setPrompt("");
    }
  }, [open, bot]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!bot) return;

    const updateData: UpdateBotRequest = {};
    if (name !== bot.name) updateData.name = name;
    if (prompt !== bot.prompt) updateData.prompt = prompt;

    updateBot({ id: bot.id, data: updateData }).then(({ data, error }) => {
      if (error) return;
      onClose();
      if (afterMutate && data) afterMutate(data);
    });
  };

  const handleDeleteIntent = (index: number) => {
    if (!intents || !intents[index]) return;
    setIntentToDelete({ index, intent: intents[index] });
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteIntent = async () => {
    if (!intentToDelete || !bot) return;

    try {
      await deleteBotIntent({
        botId: bot.id,
        intentId: intentToDelete.intent.id,
      }).unwrap();
      setDeleteConfirmOpen(false);
      setIntentToDelete(null);
    } catch (error) {
      console.error("Failed to delete bot intent:", error);
    }
  };

  const cancelDeleteIntent = () => {
    setDeleteConfirmOpen(false);
    setIntentToDelete(null);
  };

  return (
    <React.Fragment>
      <CreateBotIntentModal
        botId={bot?.id || ""}
        open={createIntentModalOpen}
        onClose={() => setCreateIntentModalOpen(false)}
      />
      <UpdateBotIntentModal
        botIntent={
          editIntentIndex !== null && intents
            ? intents[editIntentIndex]
            : undefined
        }
        open={updateIntentModalOpen}
        onClose={() => {
          setUpdateIntentModalOpen(false);
          setEditIntentIndex(null);
        }}
      />
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        component={"form"}
        fullWidth
        onSubmit={handleSubmit}
        maxWidth="sm"
        sx={{
          display:
            updateIntentModalOpen || createIntentModalOpen ? "none" : "block",
        }}
      >
        <DialogTitle id="modal-modal-title">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            Update Bot
            {isLoading && <CircularProgress size={24} sx={{ ml: 1 }} />}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Stack gap={2}>
            <Stack sx={{ mt: 2 }} gap={2}>
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
            <Box>
              <Typography variant="body1">Intents (optional)</Typography>
              <Typography variant="caption" color="text.secondary">
                Intents are predefined answers that allow the bot to identify
                and respond static messages, saving resources and enabling more
                efficient conversations.
              </Typography>
            </Box>
            <Stack gap={1}>
              <List dense>
                {intents &&
                  intents.map((intent, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemIcon>
                          <Message />
                        </ListItemIcon>
                        <Stack
                          direction={"row"}
                          alignItems="center"
                          spacing={2}
                          sx={{ width: "100%" }}
                        >
                          <ListItemText
                            primary={intent.name}
                            secondary={
                              <Box>
                                <Typography component="span" variant="body1">
                                  {intent.trigger.slice(
                                    0,
                                    maxTriggerResponseSize
                                  ) +
                                    (intent.trigger.length >
                                    maxTriggerResponseSize
                                      ? "..."
                                      : "")}
                                </Typography>
                                <br />
                                {intent.response.slice(
                                  0,
                                  maxTriggerResponseSize
                                ) +
                                  (intent.response.length >
                                  maxTriggerResponseSize
                                    ? "..."
                                    : "")}
                              </Box>
                            }
                          />
                          <Stack direction="row" spacing={1}>
                            <IconButton
                              aria-label="edit"
                              onClick={() => handleEditIntent(index)}
                              size="small"
                            >
                              <Edit />
                            </IconButton>
                            <IconButton
                              aria-label="delete"
                              size="small"
                              onClick={() => handleDeleteIntent(index)}
                            >
                              <Close />
                            </IconButton>
                          </Stack>
                        </Stack>
                      </ListItem>
                    </React.Fragment>
                  ))}
              </List>
              <AddMoreButton
                onClick={() => setCreateIntentModalOpen(true)}
                height={36}
              />
            </Stack>
          </Stack>
          {error && !isLoading && (
            <ApiErrorAlert
              error={error}
              defaultMessage="Failed to update bot"
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
            Update
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmationDialog
        open={deleteConfirmOpen}
        title="Delete Bot Intent"
        content={`Are you sure you want to delete the intent "${intentToDelete?.intent.name}"? This action cannot be undone.`}
        confirmText="Delete Intent"
        cancelText="Cancel"
        isLoading={isDeletingIntent}
        onConfirm={confirmDeleteIntent}
        onCancel={cancelDeleteIntent}
        confirmColor="error"
      />
    </React.Fragment>
  );
}
