"use client";
import AddMoreButton from "@/components/buttons/add-more-button.component";
import MessageChannelCard from "@/components/cards/message-channel-card.component";
import CreateMessageChannelModal from "@/components/modals/create-message-channel-modal.component";
import UpdateMessageChannelModal from "@/components/modals/update-message-channel-modal.component";
import ConfirmationDialog from "@/components/modals/confirmation-dialog.component";
import {
  isBaseApiError,
  useGetMyMessageChannelsQuery,
  useDeleteMessageChannelMutation,
} from "@/lib/api/client";
import { MessageChannelResponse } from "@/lib/api/dtos";
import {
  Alert,
  Box,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import PageSection from "../layout/page-section.component";

export default function MessageChannelList() {
  const {
    data: channels,
    isLoading,
    error,
    refetch: refetchMessageChannels,
  } = useGetMyMessageChannelsQuery();
  const [deleteMessageChannel, { isLoading: isDeleting }] =
    useDeleteMessageChannelMutation();
  const [createChannelModal, setCreateChannelModal] = useState(false);
  const [updateChannelModal, setUpdateChannelModal] = useState(false);
  const [selectedMessageChannel, setSelectedMessageChannel] =
    useState<MessageChannelResponse | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [channelToDelete, setChannelToDelete] =
    useState<MessageChannelResponse | null>(null);

  const handleAddMoreClick = () => {
    setCreateChannelModal(true);
  };

  const handleMessageChannelEdit = (channel: MessageChannelResponse) => {
    setSelectedMessageChannel(channel);
    setUpdateChannelModal(true);
  };

  const handleMessageChannelDelete = (channel: MessageChannelResponse) => {
    setChannelToDelete(channel);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteChannel = async () => {
    if (!channelToDelete) return;

    try {
      await deleteMessageChannel(channelToDelete.id).unwrap();
      setDeleteConfirmOpen(false);
      setChannelToDelete(null);
      refetchMessageChannels();
    } catch (error) {
      console.error("Failed to delete message channel:", error);
    }
  };

  const cancelDeleteChannel = () => {
    setDeleteConfirmOpen(false);
    setChannelToDelete(null);
  };

  useEffect(() => {
    const refetchRoutine = setInterval(() => {
      refetchMessageChannels();
    }, 5000);

    return () => clearInterval(refetchRoutine);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageSection
      title="Message Channels"
      description={
        `Channels are used to connect to different platforms and services. ` +
        `For now we only support WhatsApp, but more platforms will be added soon.`
      }
    >
      <CreateMessageChannelModal
        open={createChannelModal}
        onClose={() => setCreateChannelModal(false)}
      />
      <UpdateMessageChannelModal
        messageChannel={selectedMessageChannel}
        open={updateChannelModal}
        onClose={() => setUpdateChannelModal(false)}
      />
      <Stack spacing={3}>
        {isLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        )}
        {error && !isLoading && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {isBaseApiError(error)
              ? error.data.message
              : "Failed to load channels"}
          </Alert>
        )}
        {channels && !isLoading && (
          <Grid container spacing={3}>
            {channels.map((channel) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={channel.id}>
                <MessageChannelCard
                  channel={channel}
                  onEdit={handleMessageChannelEdit}
                  onDelete={() => handleMessageChannelDelete(channel)}
                />
              </Grid>
            ))}
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <AddMoreButton onClick={handleAddMoreClick} />
            </Grid>
          </Grid>
        )}
      </Stack>
      {channels && channels.length > 0 && (
        <Alert severity="info" sx={{ mt: 2 }}>
          Click on a channel card to see the chats and messages within that
          channel.
        </Alert>
      )}

      <ConfirmationDialog
        open={deleteConfirmOpen}
        title="Delete Message Channel"
        content={`Are you sure you want to delete the message channel "${channelToDelete?.name}"? This action cannot be undone and will also delete all associated chats and messages.`}
        confirmText="Delete Channel"
        cancelText="Cancel"
        isLoading={isDeleting}
        onConfirm={confirmDeleteChannel}
        onCancel={cancelDeleteChannel}
        confirmColor="error"
      />
    </PageSection>
  );
}
