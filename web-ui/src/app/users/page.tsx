"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  IconButton,
  Stack,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Avatar,
  Tooltip,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
} from "@mui/icons-material";
import MainLayout from "@/components/layout/main-layout.component";
import ApiErrorAlert from "@/components/alerts/api-error-alert.component";
import CreateUserModal from "@/components/modals/create-user-modal.component";
import UpdateUserModal from "@/components/modals/update-user-modal.component";
import { useGetAllUsersQuery, useDeleteUserMutation } from "@/lib/api/client";
import { UserResponse, UserRole } from "@/lib/api/dtos";
import { formatDate } from "@/lib/utils/format.utils";
import { useAuth } from "@/lib/auth/hooks";

export default function UsersPage() {
  const { isAdmin } = useAuth();
  const {
    data: users,
    isLoading: usersLoading,
    error: usersError,
    refetch: refreshUsers,
  } = useGetAllUsersQuery();

  const [deleteUser, { isLoading: deletingUser }] = useDeleteUserMutation();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);

  const handleCreateUser = () => {
    setCreateModalOpen(true);
  };

  const handleEditUser = (user: UserResponse) => {
    setSelectedUser(user);
    setUpdateModalOpen(true);
  };

  const handleDeleteUser = (user: UserResponse) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      await deleteUser(selectedUser.id).unwrap();
      setDeleteDialogOpen(false);
      setSelectedUser(null);
      refreshUsers();
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const handleAfterMutate = () => {
    refreshUsers();
  };

  const getRoleIcon = (role: UserRole) => {
    return role === UserRole.ADMIN ? (
      <AdminIcon color="warning" fontSize="small" />
    ) : (
      <PersonIcon color="primary" fontSize="small" />
    );
  };

  const getRoleColor = (role: UserRole) => {
    return role === UserRole.ADMIN ? "primary" : "warning";
  };

  return (
    <MainLayout title="Users Management">
      <Box sx={{ p: 3 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h4" component="h1">
            Users
          </Typography>
          {isAdmin && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateUser}
              size="large"
            >
              Create User
            </Button>
          )}
        </Stack>

        {usersError && <ApiErrorAlert error={usersError} />}

        {usersLoading && (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        )}

        {users && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 3,
            }}
          >
            {users.map((user) => (
              <Card
                key={user.id}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Stack spacing={2}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar
                        sx={{
                          bgcolor: getRoleColor(user.role) + ".main",
                          width: 48,
                          height: 48,
                          color: "white",
                        }}
                      >
                        {user.name[0]}
                      </Avatar>
                      <Box flex={1}>
                        <Typography variant="h6" component="div" noWrap>
                          {user.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          noWrap
                        >
                          @{user.username}
                        </Typography>
                      </Box>
                    </Box>

                    <Chip
                      label={user.role}
                      color={getRoleColor(user.role)}
                      size="small"
                      sx={{ alignSelf: "flex-start", color: "white" }}
                    />

                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Created: {formatDate(user.createdAt)}
                      </Typography>
                      <br />
                      <Typography variant="caption" color="text.secondary">
                        Updated: {formatDate(user.updatedAt)}
                      </Typography>
                    </Box>

                    {isAdmin && (
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="flex-end"
                      >
                        <Tooltip title="Edit User">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditUser(user);
                            }}
                            color="primary"
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete User">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteUser(user);
                            }}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}

        {users && users.length === 0 && (
          <Box textAlign="center" mt={4}>
            <Typography variant="h6" color="text.secondary">
              No users found
            </Typography>
            {isAdmin && (
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleCreateUser}
                sx={{ mt: 2 }}
              >
                Create First User
              </Button>
            )}
          </Box>
        )}
      </Box>

      {/* Create User Modal */}
      <CreateUserModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        afterMutate={handleAfterMutate}
      />

      {/* Update User Modal */}
      {selectedUser && (
        <UpdateUserModal
          user={selectedUser}
          open={updateModalOpen}
          onClose={() => {
            setUpdateModalOpen(false);
            setSelectedUser(null);
          }}
          afterMutate={handleAfterMutate}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete user &quot;{selectedUser?.name}
            &quot; (@{selectedUser?.username})? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={confirmDeleteUser}
            color="error"
            variant="contained"
            disabled={deletingUser}
            startIcon={
              deletingUser ? <CircularProgress size={16} /> : <DeleteIcon />
            }
          >
            {deletingUser ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
}
