import { Box, Typography } from "@mui/material";

export default function PageSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <Box mb={12}>
      <Box mb={4}>
        <Typography variant="h4">{title}</Typography>
        {description && (
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        )}
      </Box>
      <Box>{children}</Box>
    </Box>
  );
}
