import { useCreateUserMutation } from "@/lib/api/client";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ApiErrorAlert from "../alerts/api-error-alert.component";
import SelectInput from "../input/select-input.component";
import { UserResponse, UserRole } from "@/lib/api/dtos";

export default function CreateUserModal({
  open,
  onClose,
  afterMutate,
}: {
  open: boolean;
  onClose: () => void;
  afterMutate?: (data: UserResponse) => void;
}) {
  const [createUser, { isLoading: isCreating, error: createError }] =
    useCreateUserMutation();

  const isLoading = isCreating;
  const error = createError;

  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>(UserRole.USER);

  useEffect(() => {
    if (open) return;
    setUsername("");
    setName("");
    setPassword("");
    setRole(UserRole.USER);
  }, [open]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    createUser({ username, name, password, role }).then(({ data, error }) => {
      if (error) return;
      onClose();
      if (afterMutate && data) afterMutate(data);
    });
  };

  const roleOptions = [
    { value: UserRole.USER, label: "User" },
    { value: UserRole.ADMIN, label: "Admin" },
  ];

  return (
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
          Create User
          {isLoading && <CircularProgress size={24} sx={{ ml: 1 }} />}
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            helperText="Must be unique"
          />
          <TextField
            label="Full Name"
            variant="outlined"
            fullWidth
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <SelectInput
            required
            fullWidth
            label="Role"
            id="role-select"
            value={role}
            onChange={(value) => setRole(value as UserRole)}
            options={roleOptions}
          />
        </Box>
        {error && !isLoading && (
          <ApiErrorAlert error={error} defaultMessage="Failed to create user" />
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
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
