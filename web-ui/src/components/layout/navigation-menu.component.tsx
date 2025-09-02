"use client";
import { useAuth } from "@/lib/auth/hooks";
import { NavigationLink } from "@/lib/types/navigation.types";
import {
  Box,
  Typography,
  Divider,
  List,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Badge,
  Chip,
  Stack,
} from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import React, { useMemo, useState } from "react";
import { AccountCircle, Logout } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import UpdateUserModal from "../modals/update-user-modal.component";

export default function NavigationMenu({
  navigation,
}: {
  navigation: NavigationLink[];
}) {
  const router = useRouter();
  const { user, isAdmin, signOut } = useAuth();
  const name = useMemo(() => {
    return user?.name || "Loading...";
  }, [user]);

  const [updateUserModalOpen, setUpdateUserModalOpen] = useState(false);

  const nav = useMemo(() => {
    return navigation.filter((item) => {
      if (item.adminOnly && !isAdmin) {
        return false;
      }
      if (item.userOnly && !user) {
        return false;
      }
      return true;
    });
  }, [navigation, isAdmin, user]);

  const handleLogout = () => {
    signOut();
    router.push("/login");
  };

  return (
    <React.Fragment>
      <UpdateUserModal
        user={user!}
        open={updateUserModalOpen}
        onClose={() => setUpdateUserModalOpen(false)}
      />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
          px: 2,
          py: 4,
        }}
      >
        <WhatsAppIcon color="success" sx={{ mr: 1 }} />
        <Typography variant="h6">Waibo</Typography>
      </Box>
      <Divider />
      <List>
        <ListItemButton onClick={() => setUpdateUserModalOpen(true)}>
          <ListItemIcon>
            <AccountCircle />
          </ListItemIcon>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ width: "100%" }}
          >
            <Box flexGrow={1}>
              <ListItemText primary={name} />
            </Box>
            <Chip
              size="small"
              color={isAdmin ? "primary" : "primary"}
              label={isAdmin ? "admin" : "client"}
              sx={{ color: "white" }}
            />
          </Stack>
        </ListItemButton>

        {nav.map((item) => (
          <ListItemButton key={item.link} component={"a"} href={item.link}>
            <ListItemIcon>{React.createElement(item.icon)}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}

        <ListItemButton onClick={handleLogout}>
          <ListItemIcon>
            <Logout />
          </ListItemIcon>
          <ListItemText primary={"Logout"} />
        </ListItemButton>
      </List>
    </React.Fragment>
  );
}
