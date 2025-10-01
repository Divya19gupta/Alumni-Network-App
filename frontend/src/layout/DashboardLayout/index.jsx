// components/layouts/DashboardLayout.tsx
import React from "react";
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import { useRouter } from "next/router";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import { useDispatch } from "react-redux";
import { reset } from "../../config/redux/action/authAction";
const drawerWidth = 240;
const theme = createTheme({
    palette: {
      primary: {
        main: "#556B2F", // Olive green
      },
      background: {
        default: "#f5f7f2",
        paper: "#fff",
      },
    },
    typography: {
      fontFamily: "Inter, sans-serif",
    },
  });
 

export default function DashboardLayout({ children, title = "Dashboard" }) {
  const router = useRouter();
const dispatch = useDispatch();
  return (
    <ThemeProvider theme={theme}>
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* Top App Bar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: "primary.main",
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            {title}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Left Drawer Sidebar */}
      <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
              bgcolor: "#2e2e2e",
              color: "#fff",
            },
          }}
        >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List sx={{cursor:'pointer'}}>

            <ListItem button onClick={() => router.push("/profile")}>
              <ListItemIcon sx={{ color: "white" }}>
                <PersonIcon />
                
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItem>

            <ListItem button onClick={() => router.push("/dashboard")}>
              <ListItemIcon sx={{ color: "white" }}>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
            
            <ListItem button onClick={() => router.push("/discover")}>
              <ListItemIcon sx={{ color: "white" }}>
                <WorkIcon />
              </ListItemIcon>
              <ListItemText primary="Discover" />
            </ListItem>

            <Divider sx={{ bgcolor: "rgba(255,255,255,0.2)", my: 1 }} />
            <ListItem button onClick={async() =>  {
                const token = localStorage.getItem('token');
                if(token){
                    localStorage.removeItem('token');
                    await router.push('/login');
                    dispatch(reset());
                }
              }}>
              <ListItemIcon sx={{ color: "white" }}>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Logout"/>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          p: 3,
          minHeight: "100vh",
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
    </ThemeProvider>
  );
}
