import DashboardLayout from '../../layout/DashboardLayout';
import { Box, Typography, Card, Avatar, Stack, IconButton } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllUserProfiles } from '@/config/redux/action/authAction';
import { useRouter } from 'next/router';
import { BASE_URL } from '@/config';
export default function Discover() {
  const oliveGreen = "#556B2F"; // theme color
  const [isToken, setIsToken] = useState(false);

  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/login");
    } else {
      setIsToken(true);
    }
  }, []);

  useEffect(() => {
    if (isToken) {
      dispatch(getAllUserProfiles());
    }
  }, [isToken]);

  const users = auth.connections || [];

  const renderProfileContent = (profile) => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
        {profile.userId.name || "No Name"}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        @{profile.userId.username || "No Username"}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {profile.currenPost || "-"}
      </Typography>

      <Typography variant="body2" sx={{ fontWeight: "bold", mt: 1 }}>
        Bio:
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {profile.bio || "-"}
      </Typography>

      <Typography variant="body2" sx={{ fontWeight: "bold", mt: 1 }}>
        Past Work:
      </Typography>
      {profile.pastWork.length > 0 ? (
        profile.pastWork.map((work) => (
          <Typography key={work._id} variant="body2" color="text.secondary">
            {work.position} at {work.company} 
          </Typography>
        ))
      ) : (
        <Typography variant="body2" color="text.secondary">-</Typography>
      )}

      <Typography variant="body2" sx={{ fontWeight: "bold", mt: 1 }}>
        Education:
      </Typography>
      {profile.education.length > 0 ? (
        profile.education.map((edu) => (
          <Typography key={edu._id} variant="body2" color="text.secondary">
            {edu.degree} in {edu.fieldOfStudy} from {edu.school}
          </Typography>
        ))
      ) : (
        <Typography variant="body2" color="text.secondary">-</Typography>
      )}
    </Box>
  );

  return (
    <DashboardLayout title="Discover">
      <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold", color: oliveGreen }}>
        Find Connections
      </Typography>

      <Stack spacing={2}>
        {users.map((profile) => (
          <Card
          onClick={() => router.push(`/viewProfile/${profile.userId.username}`)}
            key={profile._id}
            sx={{
              p: 2,
              borderRadius: 3,
              boxShadow: 2,
              backgroundColor: "#fff",
              display: "flex",
              gap: 2,
              minHeight: 180,
              alignItems: "flex-start",
              cursor: 'pointer',
            }}
          >
            <Avatar
              src={`${BASE_URL}/${profile.userId?.profilePicture}`}
              alt={profile.userId.name}
              sx={{ width: 56, height: 56, bgcolor: oliveGreen }}
            >
              {profile.userId.name[0]}
            </Avatar>

            <Box sx={{ flexGrow: 1 }}>
              {renderProfileContent(profile)}
            </Box>

            <IconButton
              sx={{
                color: "#fff",
                backgroundColor: oliveGreen,
                "&:hover": { backgroundColor: "#3e5520" },
                alignSelf: "start",
                cursor: 'pointer',
              }}
            >
              <PersonAddIcon />
            </IconButton>
          </Card>
        ))}
      </Stack>
    </DashboardLayout>
  );
}
