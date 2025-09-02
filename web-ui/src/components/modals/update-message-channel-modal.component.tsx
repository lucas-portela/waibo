import {
  useUpdateMessageChannelMutation,
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
import {
  BotResponse,
  MessageChannelResponse,
  UpdateMessageChannelRequest,
} from "@/lib/api/dtos";
import { Add } from "@mui/icons-material";
import CreateBotModal from "./create-bot-modal.component";

export default function UpdateMessageChannelModal({
  open,
  onClose,
  messageChannel,
  afterMutate,
}: {
  open: boolean;
  onClose: () => void;
  messageChannel: MessageChannelResponse | null;
  afterMutate?: (data: MessageChannelResponse) => void;
}) {
  const [updateChannel, { isLoading: isUpdating, error: updateError }] =
    useUpdateMessageChannelMutation();
  const {
    data: channelTypes,
    isLoading: isLoadingChannelTypes,
    error: channelTypesError,
  } = useGetAvailableChannelTypesQuery();

  const {
    data: bots,
    isLoading: isLoadingBots,
    error: botsError,
  } = useGetMyBotsQuery();

  const isLoading = isUpdating || isLoadingChannelTypes || isLoadingBots;
  const error = updateError || channelTypesError || botsError;

  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [type, setType] = useState("");
  const [botId, setBotId] = useState("");

  const [createBotModalOpen, setCreateBotModalOpen] = useState(false);

  useEffect(() => {
    if (open && messageChannel) {
      setName(messageChannel.name);
      setContact(messageChannel.contact);
      setType(messageChannel.type);
      setBotId(messageChannel.botId);
    } else if (!open) {
      setName("");
      setContact("");
      setType("");
    }
  }, [open, messageChannel]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!messageChannel) return;

    const updateData: UpdateMessageChannelRequest = {};
    if (name !== messageChannel.name) updateData.name = name;
    if (contact !== messageChannel.contact) updateData.contact = contact;
    if (type !== messageChannel.type) updateData.type = type;
    if (botId !== messageChannel.botId) updateData.botId = botId;

    updateChannel({
      channelId: messageChannel.id,
      data: updateData,
    }).then(({ data, error }) => {
      if (error) return;
      onClose();
      if (afterMutate && data) afterMutate(data);
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
            Update Message Channel
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
              defaultMessage="Failed to update channel"
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
    </React.Fragment>
  );
}
