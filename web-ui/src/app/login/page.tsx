import LoginForm from "@/components/login/login-form.component";
import { WhatsApp } from "@mui/icons-material";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Waibo",
  description: "Login to Waibo",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-md rounded-lg bg-white px-8 py-12 shadow-sm">
        <CardContent>
          <Typography variant="h4" align="center" gutterBottom>
            <WhatsApp
              className="mb-1 mr-1 inline-block"
              color="primary"
              fontSize={"large"}
            />
            Waibo
          </Typography>
          <Box mt={4}>
            <LoginForm />
          </Box>
        </CardContent>
      </Card>
    </div>
  );
}
