"use client";
import React, { useEffect, useState } from "react";
import {
  Toolbar,
  Typography,
  IconButton,
  Box,
  Paper,
  Grid,
  Stack,
  Container,
  useMediaQuery,
} from "@mui/material";
import NavigationMenu from "./navigation-menu.component";
import { MainNavigation } from "@/values/main-navigation.values";
import { ChevronLeft, ChevronRight, Close } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/hooks";
import theme from "@/theme";

export default function MainLayout({
  title,
  children,
  onClose,
}: {
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
}) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (!isMobile) {
      setDrawerOpen(true);
    } else {
      setDrawerOpen(false);
    }
  }, [isMobile]);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <React.Fragment>
      <Grid
        container
        sx={{
          flexDirection: "row",
          position: "absolute",
          width: "100%",
          display: drawerOpen ? "block" : "none",
          pointerEvents: "none",
          background: "transparent",
          zIndex: 1,
        }}
      >
        <Grid size={{ xs: 8, md: 3, lg: 2 }} sx={{ pointerEvents: "auto" }}>
          <Paper
            sx={{
              minHeight: "100vh",
              width: "100%",
            }}
            elevation={4}
          >
            <NavigationMenu navigation={MainNavigation} />
          </Paper>
        </Grid>
      </Grid>
      <Grid
        container
        sx={{
          display: "flex",
          flexDirection: "row",
          background: "#ffffff",
          zIndex: 0,
        }}
      >
        <Grid
          size={{ xs: 8, md: 3, lg: 2 }}
          sx={{ display: drawerOpen ? "block" : "none" }}
        ></Grid>
        <Grid
          size={drawerOpen ? { xs: 4, md: 9, lg: 10 } : 12}
          sx={{ flexGrow: 1 }}
        >
          <Stack sx={{ height: "100vh" }}>
            <Toolbar sx={{ color: "var(--foreground)" }}>
              <Stack
                direction={"row"}
                alignItems="center"
                gap={2}
                sx={{ width: "100%" }}
              >
                <IconButton
                  color="inherit"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 2 }}
                >
                  {drawerOpen ? <ChevronLeft /> : <ChevronRight />}
                </IconButton>
                <Typography variant="h6" noWrap component="div" color="inherit">
                  {title || "Home"}
                </Typography>
                <Box flexGrow={1}></Box>
                {onClose && (
                  <IconButton
                    color="inherit"
                    edge="start"
                    onClick={onClose}
                    sx={{ mr: 2 }}
                  >
                    <Close />
                  </IconButton>
                )}
              </Stack>
            </Toolbar>

            <Box
              sx={{
                px: 2,
                overflow: "auto",
                flex: 1,
                flexDirection: "column",
                flexGrow: 1,
              }}
              className={
                (drawerOpen ? "opacity-0 " : "") +
                "md:opacity-100 transition-opacity  "
              }
            >
              <Container
                maxWidth="lg"
                sx={{
                  py: 4,
                  height: "100%",
                }}
              >
                {children}
              </Container>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
