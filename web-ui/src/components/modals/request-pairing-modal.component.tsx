import {
  useGetMessageChannelQuery,
  useRequestChannelPairingMutation,
} from "@/lib/api/client";
import {
  MessageChannelResponse,
  MessageChannelStatus,
  PairingType,
} from "@/lib/api/dtos";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  Avatar,
  DialogActions,
  Button,
  CircularProgress,
} from "@mui/material";
import ApiErrorAlert from "../alerts/api-error-alert.component";
import QRCode from "react-qr-code";
import { useCallback, useEffect } from "react";

export default function RequestPairingModal({
  channelId,
  onClose,
  open,
}: {
  channelId?: string;
  onClose: () => void;
  open: boolean;
}) {
  const [
    requestPairing,
    { data: pairingData, isLoading: isPairingLoading, error: pairingError },
  ] = useRequestChannelPairingMutation();

  const {
    data: channel,
    isLoading: isChannelLoading,
    refetch: refreshChannel,
    error: channelError,
  } = useGetMessageChannelQuery(channelId || "", {
    skip: !channelId || !open,
  });

  const isLoading = isPairingLoading || isChannelLoading;
  const error = pairingError || channelError;

  const requestPairingData = useCallback(() => {
    if (!channel) return;
    requestPairing(channel.id);
  }, [channel, requestPairing]);

  useEffect(() => {
    if (channel && open) {
      if (
        [MessageChannelStatus.CONNECTING, MessageChannelStatus.OPEN].includes(
          channel.status
        )
      ) {
        onClose();
        return;
      }
      if (!pairingData) requestPairingData();
    }
  }, [channel, open, pairingData, requestPairingData, onClose]);

  useEffect(() => {
    const refetchRoutine = setInterval(() => {
      refreshChannel();
    }, 10000);

    return () => clearInterval(refetchRoutine);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Connect</DialogTitle>
      {isLoading && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      )}
      {channel && pairingData && (
        <DialogContent>
          <Typography>
            To connect your <b>{channel.type}</b> account to this channel,
            please{" "}
            {pairingData.type === PairingType.QR_CODE
              ? "scan the QR code "
              : "use the code "}
            bellow:
          </Typography>
          {pairingData?.type === PairingType.QR_CODE && (
            <Box flex={1} display="flex" justifyContent="center" my={2}>
              <QRCode
                value={pairingData.data}
                size={256}
                style={{ maxWidth: "100%", height: "auto" }}
              />
            </Box>
          )}
          {pairingData?.type === PairingType.RAW && (
            <Box
              mt={4}
              p={2}
              bgcolor="background.paper"
              border="1px solid"
              borderColor="divider"
              borderRadius={1}
              textAlign="center"
              fontFamily="monospace"
              fontSize="1.2em"
              sx={{ overflow: "auto" }}
            >
              {pairingData.data}
            </Box>
          )}
          {error && <ApiErrorAlert error={error} />}
        </DialogContent>
      )}
      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          onClick={requestPairingData}
          variant="contained"
          disabled={isLoading}
        >
          Refresh
        </Button>
      </DialogActions>
    </Dialog>
  );
}
