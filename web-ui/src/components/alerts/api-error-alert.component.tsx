import { isBaseApiError } from "@/lib/api/client";
import { Alert } from "@mui/material";

export default function ApiErrorAlert({
  error,
  defaultMessage,
}: {
  error?: unknown;
  defaultMessage?: string;
}) {
  if (!error) return null;

  return (
    <Alert severity="error" sx={{ mt: 2 }}>
      {isBaseApiError(error)
        ? error.data.message || error.data.message[0]
        : defaultMessage ?? "An unexpected error occurred"}
    </Alert>
  );
}
