"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Box,
  IconButton,
  Tooltip,
  Avatar,
  Divider,
  Stack,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  AdminPanelSettings as AdminIcon,
  Person as UserIcon,
} from "@mui/icons-material";
import { UserResponse } from "../../lib/api/dtos/user.dto";
import { UserRole } from "../../lib/api/dtos/common.dto";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/utils/format.utils";

interface UserCardProps {
  user: UserResponse;
  onEdit?: (user: UserResponse) => void;
  onDelete?: (userId: string) => void;
}

const getRoleColor = (role: UserRole) => {
  switch (role) {
    case UserRole.ADMIN:
      return "error";
    case UserRole.USER:
      return "primary";
    default:
      return "default";
  }
};

const getRoleIcon = (role: UserRole) => {
  switch (role) {
    case UserRole.ADMIN:
      return <AdminIcon sx={{ fontSize: 16 }} />;
    case UserRole.USER:
      return <UserIcon sx={{ fontSize: 16 }} />;
    default:
      return <UserIcon sx={{ fontSize: 16 }} />;
  }
};

export default function UserCard({ user, onEdit, onDelete }: UserCardProps) {
  const router = useRouter();

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(user);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(user.id);
    }
  };

  const handleClick = () => {
    router.push(`/users/${user.id}`);
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          boxShadow: 4,
          transform: "translateY(-2px)",
        },
      }}
      onClick={handleClick}
    >
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar
              sx={{
                bgcolor: "primary.main",
                width: 40,
                height: 40,
              }}
            >
              {user.name[0]}
            </Avatar>
            <Box>
              <Typography variant="h6" component="div" noWrap>
                {user.name}
              </Typography>
              <Box display="flex" alignItems="center" gap={0.5}>
                {getRoleIcon(user.role)}
                <Typography variant="caption" color="text.secondary">
                  {user.role}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Stack spacing={1}>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <Typography
              variant="body2"
              color="text.secondary"
              fontWeight="medium"
            >
              Username:
            </Typography>
            <Typography variant="body2" noWrap>
              {user.username}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography
              variant="body2"
              color="text.secondary"
              fontWeight="medium"
            >
              ID:
            </Typography>
            <Typography variant="body2" noWrap>
              {user.id}
            </Typography>
          </Box>
        </Stack>
        <Stack sx={{ mt: 2 }} direction="row" spacing={1} flexWrap="wrap">
          <Chip
            label={user.role}
            size="small"
            variant="outlined"
            color={getRoleColor(user.role)}
            icon={getRoleIcon(user.role)}
          />
          <Chip
            label={formatDate(user.createdAt)}
            size="small"
            variant="outlined"
            color={"info"}
          />
        </Stack>
      </CardContent>

      <CardActions sx={{ justifyContent: "flex-end", pt: 0 }}>
        <Tooltip title="Edit User">
          <IconButton
            size="small"
            onClick={handleEdit}
            color="primary"
            sx={{
              "&:hover": {
                backgroundColor: "primary.main",
                color: "white",
              },
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete User">
          <IconButton
            size="small"
            onClick={handleDelete}
            color="error"
            sx={{
              "&:hover": {
                backgroundColor: "error.main",
                color: "white",
              },
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
}
