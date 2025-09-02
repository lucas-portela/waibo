import { useGetUserQuery, useUpdateUserMutation } from "@/lib/api/client";
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
import { UserResponse, UserRole, UpdateUserRequest } from "@/lib/api/dtos";
import { useAuth } from "@/lib/auth/hooks";
import PasswordInput from "../input/password-input.component";

export default function UpdateUserModal({
  user,
  open,
  onClose,
  afterMutate,
}: {
  user: UserResponse;
  open: boolean;
  onClose: () => void;
  afterMutate?: (data: UserResponse) => void;
}) {
  const { user: authenticatedUser, isAdmin, refreshAuth } = useAuth();
  const [updateUser, { isLoading: isUpdating, error: updateError }] =
    useUpdateUserMutation();

  const isLoading = isUpdating;
  const error = updateError;

  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>(UserRole.USER);

  useEffect(() => {
    if (open && user) {
      setUsername(user.username);
      setName(user.name);
      setRole(user.role);
      setPassword("");
    } else if (!open) {
      setUsername("");
      setName("");
      setPassword("");
      setRole(UserRole.USER);
    }
  }, [open, user]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;

    const updateData: UpdateUserRequest = {};
    if (username !== user.username) updateData.username = username;
    if (name !== user.name) updateData.name = name;
    if (role !== user.role) updateData.role = role;
    if (password) updateData.password = password;

    updateUser({ userId: user.id, data: updateData }).then(
      ({ data, error }) => {
        if (error) return;
        if (user.id === authenticatedUser?.id) {
          refreshAuth();
        }
        onClose();
        if (afterMutate && data) afterMutate(data);
      }
    );
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
          Update User
          {isLoading && <CircularProgress size={24} sx={{ ml: 1 }} />}
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Full Name"
            variant="outlined"
            fullWidth
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            helperText="Must be unique"
          />
          <PasswordInput
            label="New Password"
            value={password}
            onChange={(value) => setPassword(value)}
            helperText="Leave empty to keep current password"
            fullWidth
          />
          {isAdmin && (
            <SelectInput
              required
              disabled={user.id === authenticatedUser?.id}
              fullWidth
              label="Role"
              id="role-select"
              value={role}
              onChange={(value) => setRole(value as UserRole)}
              options={roleOptions}
            />
          )}
        </Box>
        {error && !isLoading && (
          <ApiErrorAlert error={error} defaultMessage="Failed to update user" />
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
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
}
