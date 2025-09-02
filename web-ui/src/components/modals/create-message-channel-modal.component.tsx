import {
  useCreateMessageChannelMutation,
  useGetAvailableChannelTypesQuery,
  useGetMyBotsQuery,
} from "@/lib/api/client";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ApiErrorAlert from "../alerts/api-error-alert.component";
import SelectInput from "../input/select-input.component";
import { Add } from "@mui/icons-material";
import CreateBotModal from "./create-bot-modal.component";
import { BotResponse, MessageChannelResponse } from "@/lib/api/dtos";

export default function CreateMessageChannelModal({
  open,
  onClose,
  afterMutate,
}: {
  open: boolean;
  onClose: () => void;
  afterMutate?: (data: MessageChannelResponse) => void;
}) {
  const [createChannel, { isLoading: isCreating, error: createError }] =
    useCreateMessageChannelMutation();
  const {
    data: bots,
    isLoading: isLoadingBots,
    error: botsError,
  } = useGetMyBotsQuery();
  const {
    data: channelTypes,
    isLoading: isLoadingChannelTypes,
    error: channelTypesError,
  } = useGetAvailableChannelTypesQuery();

  const isLoading = isCreating || isLoadingBots || isLoadingChannelTypes;
  const error = createError || botsError || channelTypesError;

  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [type, setType] = useState("");
  const [botId, setBotId] = useState("");

  const [createBotModalOpen, setCreateBotModalOpen] = useState(false);

  useEffect(() => {
    if (open) return;
    setName("");
    setContact("");
    setType("");
    setBotId("");
  }, [open]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    createChannel({ name, contact, type, botId }).then(({ data, error }) => {
      if (error) return;
      onClose();
      if (afterMutate) afterMutate(data);
    });
  };

  const handleAddBotClick = () => {
    setCreateBotModalOpen(true);
  };

  const handleBotCreated = (bot: BotResponse) => {
    setBotId(bot.id);
  };

  return (
    <React.Fragment>
      <CreateBotModal
        open={createBotModalOpen}
        onClose={() => setCreateBotModalOpen(false)}
        afterMutate={handleBotCreated}
      />
      <Dialog
        open={open}
        sx={{ display: createBotModalOpen ? "none" : "block" }}
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
            Create Message Channel
            {isLoading && <CircularProgress size={24} sx={{ ml: 1 }} />}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Channel Name"
              variant="outlined"
              fullWidth
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              label="Contact"
              variant="outlined"
              fullWidth
              required
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
            <SelectInput
              required
              fullWidth
              label="Connection Type"
              id="type-select"
              value={type}
              onChange={(value) => setType(value)}
              options={
                channelTypes
                  ? channelTypes.map((channelType) => ({
                      value: channelType.type,
                      label: channelType.name,
                    }))
                  : []
              }
            />
            <Stack direction="row" alignItems="stretch" gap={1}>
              <SelectInput
                fullWidth
                required
                label="Bot"
                id="bot-select"
                value={botId}
                onChange={(value) => setBotId(value)}
                options={
                  bots
                    ? bots.map((bot) => ({ value: bot.id, label: bot.name }))
                    : []
                }
              />
              <Button onClick={handleAddBotClick} variant="outlined">
                <Add />
              </Button>
            </Stack>
          </Box>
          {error && !isLoading && (
            <ApiErrorAlert
              error={error}
              defaultMessage="Failed to create channel"
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
    </React.Fragment>
  );
}
