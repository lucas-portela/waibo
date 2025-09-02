import { PrecisionManufacturing } from "@mui/icons-material";
import { Chip, Stack } from "@mui/material";

export default function MessageChannelBotChip({
  botName: name,
}: {
  botName?: string;
}) {
  return (
    <Chip
      label={
        <Stack
          direction="row"
          gap={1}
          alignItems="center"
          sx={{ width: "100%" }}
        >
          <PrecisionManufacturing fontSize="small" />
          {name || "Loading..."}
        </Stack>
      }
      color="info"
    />
  );
}
