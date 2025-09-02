import { Add } from "@mui/icons-material";
import { Card, Box } from "@mui/material";

export default function AddMoreButton({
  onClick,
  height,
}: {
  onClick?: () => void;
  height?: number | string;
}) {
  return (
    <Card
      sx={{
        height: height || "100%",
        minHeight: height || 200,
        bgcolor: "rgba(0, 0, 0, 0.05)",
        cursor: "pointer",
      }}
      onClick={onClick}
    >
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{ height: "100%" }}
      >
        <Add fontSize="large" />
      </Box>
    </Card>
  );
}
