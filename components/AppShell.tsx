"use client";
import * as React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  CssBaseline,
  Avatar,
  Badge,
  Tooltip,
  Divider,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ListIcon from "@mui/icons-material/List";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import Link from "next/link";
import { usePathname } from "next/navigation";

const drawerWidth = 240;

export const AppShell: React.FC<{
  children: React.ReactNode;
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ children, darkMode, setDarkMode }) => {
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      document.body.style.background = darkMode
        ? "linear-gradient(135deg, #18181b 0%, #6366f1 100%)"
        : "linear-gradient(135deg, #6366f1 0%, #e0e7ff 100%)";
      localStorage.setItem("theme", darkMode ? "dark" : "light");
    }
  }, [darkMode]);
  const [notifOpen, setNotifOpen] = React.useState(false);
  const notifications = [
    { id: 1, message: "Scan completed", type: "success" },
    { id: 2, message: "New user registered", type: "info" },
    { id: 3, message: "Password changed", type: "success" },
  ];
  const [open, setOpen] = React.useState(true);
  const [sidebarHovered, setSidebarHovered] = React.useState(false);
  const pathname = usePathname();
  const hideSidebar = pathname === "/login" || pathname === "/register";
  // Always read user from localStorage for sidebar rendering
  const [user, setUser] = React.useState<{
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
  } | null>(null);

  React.useEffect(() => {
    const userStr =
      typeof window !== "undefined" ? localStorage.getItem("user") : null;
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch {}
    }
    // Listen for avatar change event
    window.addEventListener("avatarChanged", () => {
      const userStr =
        typeof window !== "undefined" ? localStorage.getItem("user") : null;
      if (userStr) {
        try {
          setUser(JSON.parse(userStr));
        } catch {}
      }
    });
    return () => {
      window.removeEventListener("avatarChanged", () => {});
    };
  }, []);

  const router =
    typeof window !== "undefined"
      ? require("next/navigation").useRouter()
      : null;
  const handleLogout = () => {
    localStorage.removeItem("token");
    if (router) router.push("/login");
    window.location.href = "/login";
  };
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", background: "#fff" }}>
      <CssBaseline />
      {!hideSidebar && (
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            zIndex: (t) => t.zIndex.drawer + 1,
            backdropFilter: "blur(12px)",
            background: darkMode ? "#18181b" : "#fff",
            color: darkMode ? "#fff" : "#222",
            boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setOpen(!open)}
              sx={{
                mr: 2,
                transition: "transform 0.3s",
                transform: open ? "rotate(0deg)" : "rotate(-90deg)",
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: 1 }}
            >
              Diagnostic Suite Pro
            </Typography>
            <Tooltip
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              <IconButton
                color="inherit"
                sx={{ mr: 2 }}
                onClick={() => setDarkMode((m) => !m)}
              >
                {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Notifications">
              <IconButton
                color="inherit"
                sx={{ mr: 2 }}
                onClick={() => setNotifOpen(!notifOpen)}
              >
                <Badge badgeContent={notifications.length} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            {notifOpen && (
              <Box
                sx={{
                  position: "absolute",
                  top: 64,
                  right: 32,
                  width: 320,
                  bgcolor: "#fff",
                  boxShadow: 4,
                  borderRadius: 2,
                  zIndex: 9999,
                  animation: "fadeIn 0.3s",
                }}
              >
                <Typography variant="h6" sx={{ p: 2 }}>
                  Notifications
                </Typography>
                <Divider />
                {notifications.length === 0 ? (
                  <Typography sx={{ p: 2 }}>No notifications</Typography>
                ) : (
                  notifications.map((n) => (
                    <Box
                      key={n.id}
                      sx={{
                        p: 2,
                        borderBottom: "1px solid #e0e7ff",
                        transition: "background 0.2s",
                        "&:hover": { background: "#f3f4f6" },
                      }}
                    >
                      <Typography
                        color={
                          n.type === "success"
                            ? "green"
                            : n.type === "error"
                            ? "red"
                            : "primary"
                        }
                      >
                        {n.message}
                      </Typography>
                    </Box>
                  ))
                )}
              </Box>
            )}
            {user?.avatar ? (
              <Avatar
                alt={user?.name || "User"}
                src={user.avatar}
                sx={{
                  width: 36,
                  height: 36,
                  boxShadow: 2,
                  mr: 2,
                  border: "2px solid #6366f1",
                  transition: "box-shadow 0.3s",
                  "&:hover": { boxShadow: 6 },
                }}
              />
            ) : (
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  boxShadow: 2,
                  mr: 2,
                  border: "2px solid #6366f1",
                  transition: "box-shadow 0.3s",
                  "&:hover": { boxShadow: 6 },
                }}
              >
                {user?.name ? user.name[0].toUpperCase() : ""}
              </Avatar>
            )}
            <Tooltip title="Logout">
              <IconButton color="error" onClick={handleLogout}>
                <Typography fontWeight={700} fontSize={14}>
                  Logout
                </Typography>
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>
      )}
      {!hideSidebar && (
        <Drawer
          variant="permanent"
          open={open}
          onMouseEnter={() => setSidebarHovered(true)}
          onMouseLeave={() => setSidebarHovered(false)}
          sx={{
            width: open ? drawerWidth : 64,
            flexShrink: 0,
            transition: "width 0.3s",
            "& .MuiDrawer-paper": {
              width: open ? drawerWidth : 64,
              boxSizing: "border-box",
              background: darkMode
                ? "linear-gradient(135deg, #18181b 0%, #6366f1 100%)"
                : sidebarHovered
                ? "linear-gradient(135deg, #6366f1 0%, #e0e7ff 100%)"
                : "rgba(255,255,255,0.7)",
              color: darkMode ? "#fff" : "#222",
              backdropFilter: "blur(8px)",
              borderRight: "1px solid #e0e7ff",
              boxShadow: "0 0 24px rgba(0,0,0,0.04)",
              transition: "background 0.3s",
            },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: "auto", pt: 2 }}>
            <List>
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  href="/"
                  selected={pathname === "/"}
                  sx={{
                    borderRadius: 2,
                    mx: 1,
                    my: 0.5,
                    transition: "background 0.2s",
                    "&:hover": { background: "#f3f4f6" },
                  }}
                >
                  <ListItemIcon>
                    <DashboardIcon
                      color={pathname === "/" ? "primary" : "inherit"}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="Dashboard"
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  href="/scans"
                  selected={pathname.startsWith("/scans")}
                  sx={{
                    borderRadius: 2,
                    mx: 1,
                    my: 0.5,
                    transition: "background 0.2s",
                    "&:hover": { background: "#f3f4f6" },
                  }}
                >
                  <ListItemIcon>
                    <ListIcon
                      color={
                        pathname.startsWith("/scans") ? "primary" : "inherit"
                      }
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="Scans"
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </ListItem>
              {user?.role === "Admin" && (
                <ListItem disablePadding>
                  <ListItemButton
                    component={Link}
                    href="/admin"
                    selected={pathname.startsWith("/admin")}
                    sx={{
                      borderRadius: 2,
                      mx: 1,
                      my: 0.5,
                      transition: "background 0.2s",
                      "&:hover": { background: "#f3f4f6" },
                    }}
                  >
                    <ListItemIcon>
                      <Avatar
                        sx={{
                          width: 24,
                          height: 24,
                          bgcolor: "#e5e7eb",
                          color: "#222",
                          fontSize: 16,
                          boxShadow: 0,
                        }}
                      >
                        AD
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary="Admin"
                      sx={{ opacity: open ? 1 : 0 }}
                    />
                  </ListItemButton>
                </ListItem>
              )}
              {user?.role === "User" && (
                <ListItem disablePadding>
                  <ListItemButton
                    component={Link}
                    href="/user"
                    selected={pathname.startsWith("/user")}
                    sx={{
                      borderRadius: 2,
                      mx: 1,
                      my: 0.5,
                      transition: "background 0.2s",
                      "&:hover": { background: "#f3f4f6" },
                    }}
                  >
                    <ListItemIcon>
                      <Avatar
                        sx={{
                          width: 24,
                          height: 24,
                          bgcolor: "#e5e7eb",
                          color: "#222",
                          fontSize: 16,
                          boxShadow: 0,
                        }}
                      >
                        U
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary="User"
                      sx={{ opacity: open ? 1 : 0 }}
                    />
                  </ListItemButton>
                </ListItem>
              )}
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  href="/settings"
                  selected={pathname.startsWith("/settings")}
                  sx={{
                    borderRadius: 2,
                    mx: 1,
                    my: 0.5,
                    transition: "background 0.2s",
                    "&:hover": { background: "#f3f4f6" },
                  }}
                >
                  <ListItemIcon>
                    <Avatar
                      sx={{
                        width: 24,
                        height: 24,
                        bgcolor: "#e5e7eb",
                        color: "#222",
                        fontSize: 16,
                        boxShadow: 0,
                      }}
                    >
                      S
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary="Settings"
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  href="/about"
                  selected={pathname.startsWith("/about")}
                  sx={{
                    borderRadius: 2,
                    mx: 1,
                    my: 0.5,
                    transition: "background 0.2s",
                    "&:hover": { background: "#f3f4f6" },
                  }}
                >
                  <ListItemIcon>
                    <Avatar
                      sx={{
                        width: 24,
                        height: 24,
                        bgcolor: "#e5e7eb",
                        color: "#222",
                        fontSize: 16,
                        boxShadow: 0,
                      }}
                    >
                      A
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary="About"
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </ListItem>
            </List>
            <Divider sx={{ my: 2 }} />
            {/* Add more sidebar items here if needed */}
          </Box>
        </Drawer>
      )}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 1, md: 3 },
          transition: "padding 0.2s",
          minHeight: "100vh",
          background: "rgba(255,255,255,0.6)",
          borderRadius: { xs: 0, md: 6 },
          boxShadow: { md: "0 8px 32px rgba(0,0,0,0.08)" },
          mt: !hideSidebar ? 8 : 0,
        }}
      >
        {!hideSidebar && <Toolbar />}
        {children}
      </Box>
    </Box>
  );
};
