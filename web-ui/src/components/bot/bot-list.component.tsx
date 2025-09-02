"use client";
import AddMoreButton from "@/components/buttons/add-more-button.component";
import BotCard from "@/components/cards/bot-card.component";
import MainLayout from "@/components/layout/main-layout.component";
import CreateBotModal from "@/components/modals/create-bot-modal.component";
import UpdateBotModal from "@/components/modals/update-bot-modal.component";
import ConfirmationDialog from "@/components/modals/confirmation-dialog.component";
import {
  isBaseApiError,
  useGetMyBotsQuery,
  useDeleteBotMutation,
} from "@/lib/api/client";
import { BotResponse } from "@/lib/api/dtos";
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

export default function BotListComponent() {
  const {
    data: bots,
    isLoading,
    error,
    refetch: refetchBots,
  } = useGetMyBotsQuery();
  const [deleteBot, { isLoading: isDeleting }] = useDeleteBotMutation();
  const [createBotModal, setCreateBotModal] = useState(false);
  const [updateBotModal, setUpdateBotlModal] = useState(false);
  const [selectedBot, setSelectedBot] = useState<BotResponse | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [botToDelete, setBotToDelete] = useState<BotResponse | null>(null);

  const handleAddMoreClick = () => {
    setCreateBotModal(true);
  };

  const handleBotEdit = (bot: BotResponse) => {
    setSelectedBot(bot);
    setUpdateBotlModal(true);
  };

  const handleBotDelete = (bot: BotResponse) => {
    setBotToDelete(bot);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteBot = async () => {
    if (!botToDelete) return;

    try {
      await deleteBot(botToDelete.id).unwrap();
      setDeleteConfirmOpen(false);
      setBotToDelete(null);
      refetchBots();
    } catch (error) {
      console.error("Failed to delete bot:", error);
    }
  };

  const cancelDeleteBot = () => {
    setDeleteConfirmOpen(false);
    setBotToDelete(null);
  };

  useEffect(() => {
    const refetchRoutine = setInterval(() => {
      refetchBots();
    }, 5000);

    return () => clearInterval(refetchRoutine);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageSection
      title="Your Bots"
      description="Manage your bots here. You can create, change, and delete your bots as needed."
    >
      <CreateBotModal
        open={createBotModal}
        onClose={() => setCreateBotModal(false)}
      />
      <UpdateBotModal
        bot={selectedBot}
        open={updateBotModal}
        onClose={() => setUpdateBotlModal(false)}
      />
      <Stack spacing={3}>
        {isLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        )}
        {error && !isLoading && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {isBaseApiError(error) ? error.data.message : "Failed to load bots"}
          </Alert>
        )}
        {bots && !isLoading && (
          <Grid container spacing={3}>
            {bots.map((bot) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={bot.id}>
                <BotCard
                  bot={bot}
                  onEdit={handleBotEdit}
                  onDelete={() => handleBotDelete(bot)}
                />
              </Grid>
            ))}
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <AddMoreButton onClick={handleAddMoreClick} />
            </Grid>
          </Grid>
        )}
      </Stack>

      <ConfirmationDialog
        open={deleteConfirmOpen}
        title="Delete Bot"
        content={`Are you sure you want to delete the bot "${botToDelete?.name}"? This action cannot be undone and will also delete all bot intents and associated data.`}
        confirmText="Delete Bot"
        cancelText="Cancel"
        isLoading={isDeleting}
        onConfirm={confirmDeleteBot}
        onCancel={cancelDeleteBot}
        confirmColor="error"
      />
    </PageSection>
  );
}
