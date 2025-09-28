import DashboardLayout from '../../layout/DashboardLayout';
import { Box, Typography, Card, CardContent, Avatar, Grid, IconButton, Button, Stack } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ViewListIcon from "@mui/icons-material/ViewList";
import GridViewIcon from "@mui/icons-material/GridView";
import React, { useState } from "react";

// Sample users array for layout (replace with API data later)
const sampleUsers = [
  { id: 1, name: "Alice Johnson", username: "@alice", avatar: "" },
  { id: 2, name: "Bob Smith", username: "@bob", avatar: "" },
  { id: 3, name: "Charlie Lee", username: "@charlie", avatar: "" },
  { id: 4, name: "Diana Prince", username: "@diana", avatar: "" },
];

export default function Discover() {
  const oliveGreen = "#556B2F"; // theme color
  const [view, setView] = useState("grid"); // "grid" or "list"

  return (
    <DashboardLayout title="Discover">
      <Typography
        variant="h5"
        sx={{ mb: 2, fontWeight: "bold", color: oliveGreen }}
      >
        Find Connections
      </Typography>

      {/* View toggle buttons */}
      <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
        <Button
          variant={view === "grid" ? "contained" : "outlined"}
          startIcon={<GridViewIcon />}
          onClick={() => setView("grid")}
          sx={{
            backgroundColor: view === "grid" ? oliveGreen : "#fff",
            color: view === "grid" ? "#fff" : oliveGreen,
            "&:hover": {
              backgroundColor: oliveGreen,
              color: "#fff",
            },
          }}
        >
          Grid
        </Button>
        <Button
          variant={view === "list" ? "contained" : "outlined"}
          startIcon={<ViewListIcon />}
          onClick={() => setView("list")}
          sx={{
            backgroundColor: view === "list" ? oliveGreen : "#fff",
            color: view === "list" ? "#fff" : oliveGreen,
            "&:hover": {
              backgroundColor: oliveGreen,
              color: "#fff",
            },
          }}
        >
          List
        </Button>
      </Stack>

      {view === "grid" ? (
        <Grid container spacing={3}>
          {sampleUsers.map((user) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={user.id}>
              <Card
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: 2,
                  borderRadius: 3,
                  boxShadow: 3,
                  backgroundColor: "#fff",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: 6,
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar
                    src={user.avatar}
                    alt={user.name}
                    sx={{ width: 56, height: 56, bgcolor: oliveGreen }}
                  >
                    {user.name[0]}
                  </Avatar>
                  <Box>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: "bold", color: "#000" }}
                    >
                      {user.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user.username}
                    </Typography>
                  </Box>
                </Box>
                {/* <IconButton
                  sx={{
                    ml: 3,
                    color: "#fff",
                    ,
                  }}
                > */}
                  <PersonAddIcon sx={{ml:3, size: "small", color:'#3e5520', cursor:'pointer'}} />
                {/* </IconButton> */}
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Stack spacing={2}>
          {sampleUsers.map((user) => (
            <Card
              key={user.id}
              sx={{
                display: "flex",
                alignItems: "center",
                p: 2,
                borderRadius: 3,
                boxShadow: 2,
                backgroundColor: "#fff",
              }}
            >
              <Avatar
                src={user.avatar}
                alt={user.name}
                sx={{ width: 56, height: 56, bgcolor: oliveGreen, mr: 2 }}
              >
                {user.name[0]}
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "bold", color: "#000" }}
                >
                  {user.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.username}
                </Typography>
              </Box>
              <IconButton
                sx={{
                  color: "#fff",
                  backgroundColor: oliveGreen,
                  "&:hover": { backgroundColor: "#3e5520" },
                }}
              >
                <PersonAddIcon />
              </IconButton>
            </Card>
          ))}
        </Stack>
      )}
    </DashboardLayout>
  );
}
