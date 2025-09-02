"use client";
import { useEffect, useState } from "react";
import { TextField, Button, Box, Alert } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuth } from "@/lib/auth/hooks";
import { isBaseApiError } from "@/lib/api/client";
import { useRouter } from "next/navigation";
import PasswordInput from "../input/password-input.component";

export default function LoginForm() {
  const router = useRouter();
  const { isAuthenticated, signIn, isSigningIn, signInError } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    signIn({
      username,
      password,
    });
  };

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <TextField
        label="Account"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        fullWidth
      />
      <PasswordInput
        label="Password"
        value={password}
        onChange={(value) => setPassword(value)}
        required
        fullWidth
      />
      {signInError && (
        <Alert severity="error">
          {isBaseApiError(signInError)
            ? signInError.data.message
            : "Login failed. Please try again."}
        </Alert>
      )}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        size="large"
        loading={isSigningIn}
        disabled={isAuthenticated || isSigningIn}
      >
        Sign In
      </Button>
    </Box>
  );
}
