import React from "react";
import { useSearchParams as userSearchParams } from "next/navigation";
import {
  Avatar,
  Box,
  Button,
  CssBaseline,
  Divider,
  Grid,
  Typography,
  IconButton,
  Chip,
  Card,
  CardContent,
  CardMedia,
  Stack,
} from "@mui/material";
import { Facebook, Twitter, LinkedIn } from "@mui/icons-material";
import DashboardLayout from "../../layout/DashboardLayout";
import { clientServer } from "@/config";
import { BASE_URL } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { getAllPost } from "@/config/redux/action/postAction";
import SimCardDownloadIcon from "@mui/icons-material/SimCardDownload";
import { useRouter } from "next/router";

const oliveGreen = "#708238";
const darkOlive = "#556B2F";
const lightOlive = "#E3E8D1";
const bgOlive = "#F4F6EB";
export default function ViewProfile({ userProfile }) {
  const searchParams = userSearchParams();
  const auth = useSelector((state) => state.auth);
  const posts = useSelector((state) => state.posts);

  const router = useRouter();
  const [userPosts, setUserPosts] = useState([]);

  const dispatch = useDispatch();
  const getUserPosts = () => {
    dispatch(getAllPost());
  };
  useEffect(() => {
    let userPosts = posts.posts.filter((post) => {
      return post.userId.username === router.query.username;
    });
    setUserPosts(userPosts);
  }, [posts.posts]);

  return (
    <DashboardLayout title="Profile">
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "white",
          py: { xs: 4, md: 8 },
          px: { xs: 2, md: 6 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative abstract background */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: "-10%",
            width: "50%",
            height: "50%",
            bgcolor: lightOlive,
            borderRadius: "50%",
            opacity: 0.3,
            filter: "blur(120px)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            right: "-15%",
            width: "50%",
            height: "50%",
            bgcolor: oliveGreen,
            borderRadius: "50%",
            opacity: 0.15,
            filter: "blur(140px)",
          }}
        />
        {/* Profile Header */}
        <Grid
          container
          spacing={6}
          alignItems="center"
          justifyContent="space-between"
          sx={{
            maxWidth: 1200,
            mx: "auto",
            mb: 10,
            position: "relative",
            zIndex: 2,
          }}
        >
          {/* LEFT: Entire profile info */}
          <Grid item xs={7} md={7}>
            <Box
              sx={{ pr: { md: 4 }, textAlign: { xs: "center", md: "left" } }}
            >
              <Typography
                variant="h3"
                fontWeight="bold"
                color={darkOlive}
                gutterBottom
              >
                {userProfile.userId.name}
              </Typography>

              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6} md={4}>
                  <Typography variant="subtitle2" color="text.secondary">
                    City
                  </Typography>
                  <Typography variant="body1">New York City</Typography>
                </Grid>

                <Grid item xs={6} md={4}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Website
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: oliveGreen, cursor: "pointer" }}
                  >
                    www.jackiederry.com
                  </Typography>
                </Grid>
              </Grid>

              <Typography variant="body1" sx={{ mb: 3 }}>
                {userProfile?.userId?.bio}
              </Typography>

              <Divider sx={{ my: 3, borderColor: "rgba(0,0,0,0.1)" }} />

              <Typography variant="subtitle2" color="text.secondary">
                Bylines
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Food & Wine Magazine, Staff Writer
              </Typography>

              <Typography variant="subtitle2" color="text.secondary">
                Beats
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                Wine, Spirits, Food, Gourmet Culture, Restaurant Industry
              </Typography>

              {/* Buttons */}
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  mt: 2,
                  justifyContent: { xs: "center", md: "flex-start" },
                }}
              >
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: oliveGreen,
                    "&:hover": { backgroundColor: darkOlive },
                  }}
                  disabled
                >
                  Connect
                </Button>
                <Button
                  variant="outlined"
                  sx={{
                    color: oliveGreen,
                    borderColor: oliveGreen,
                    "&:hover": { borderColor: darkOlive, color: darkOlive },
                  }}
                  onClick={async () => {
                    try {
                      const res = await clientServer.get(
                        `/user/download_profile?id=${userProfile.userId._id}`
                      );
                      window.open(`${BASE_URL}/${res.data.message}`, "_blank");
                    } catch (err) {
                      console.error("Download failed", err);
                    }
                  }}
                >
                  <SimCardDownloadIcon
                    sx={{ width: "2" }}
                  ></SimCardDownloadIcon>
                  Download Resume
                </Button>
              </Box>

              {/* Social Links */}
              <Box
                sx={{
                  mt: 4,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  justifyContent: { xs: "center", md: "flex-start" },
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Follow on
                </Typography>
                <IconButton sx={{ color: oliveGreen }}>
                  <Facebook />
                </IconButton>
                <IconButton sx={{ color: oliveGreen }}>
                  <Twitter />
                </IconButton>
                <IconButton sx={{ color: oliveGreen }}>
                  <LinkedIn />
                </IconButton>
              </Box>
            </Box>
          </Grid>

          {/* RIGHT: Avatar */}
          <Grid
            item
            xs={5}
            md={5}
            sx={{
              display: "flex",
              justifyContent: { xs: "center", md: "flex-end" },
              alignItems: "center",
            }}
          >
            <Avatar
              src={`${BASE_URL}/${userProfile?.userId?.profilePicture}`}
              alt="Profile"
              sx={{
                width: { xs: 120, md: 220 },
                height: { xs: 120, md: 220 },
                borderRadius: "50%",
                boxShadow: "0px 10px 40px rgba(0,0,0,0.15)",
              }}
            />
          </Grid>
        </Grid>
        {/* Lower Section */}
        <Box
          sx={{ maxWidth: 1200, mx: "auto", position: "relative", zIndex: 2 }}
        >
          <Grid container spacing={6}>
            {/* Timeline Projects */}
            <Grid item xs={12} md={6}>
              <Typography
                variant="h5"
                fontWeight="bold"
                color={oliveGreen}
                gutterBottom
              >
                Projects Timeline
              </Typography>
              <Box sx={{ borderLeft: `3px solid ${oliveGreen}`, pl: 3 }}>
                <Box sx={{ mb: 3 }}>
                  <Typography fontWeight="bold">2023</Typography>
                  <Typography variant="body2">
                    Wine World Podcast launch
                  </Typography>
                </Box>
                <Box sx={{ mb: 3 }}>
                  <Typography fontWeight="bold">2022</Typography>
                  <Typography variant="body2">
                    “The Spirits Journal” publication
                  </Typography>
                </Box>
                <Box>
                  <Typography fontWeight="bold">2021</Typography>
                  <Typography variant="body2">
                    Food & Wine Expo collaboration
                  </Typography>
                </Box>
              </Box>
            </Grid>
            {/* Interest Cloud */}
            <Grid item xs={12} md={6}>
              <Typography
                variant="h5"
                fontWeight="bold"
                color={oliveGreen}
                gutterBottom
              >
                Interests Cloud
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 2,
                  justifyContent: "center",
                  alignItems: "center",
                  p: 2,
                }}
              >
                {[
                  "Gourmet Food",
                  "Wine Tasting",
                  "Travel",
                  "Photography",
                  "Culture",
                ].map((i, idx) => (
                  <Chip
                    key={idx}
                    label={i}
                    sx={{
                      bgcolor: "#d9e2c8",
                      fontSize: `${12 + (idx % 3) * 2}px`,
                      borderRadius: "20px",
                      px: 2,
                    }}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
          {/* Masonry Showcase */}
          <Box sx={{ mt: 8 }}>
            <Typography
              variant="h5"
              fontWeight="bold"
              color={oliveGreen}
              gutterBottom
            >
              Post Contributions
            </Typography>

            <Grid container spacing={3}>
              {userPosts.map((post, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      bgcolor: "#f5f7f0",
                      boxShadow: 3,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {/* Media */}
                    {post.media && (
                      <CardMedia
                        component="img"
                        height="160"
                        image={`${BASE_URL}/${post.media}`}
                        alt={post.title || "Work media"}
                        sx={{
                          borderTopLeftRadius: 12,
                          borderTopRightRadius: 12,
                          objectFit: "cover",
                        }}
                      />
                    )}

                    <CardContent sx={{ flexGrow: 1 }}>
                      {/* Title */}
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        color={oliveGreen}
                        gutterBottom
                      >
                        {post.title || "Post"}
                      </Typography>

                      {/* Body */}
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                      >
                        {post.body}
                      </Typography>

                      {/* User Info */}
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar
                          src={post.userId?.profilePicture || `${BASE_URL}/images/default.jpg`}
                          alt={post.userId?.name}
                        />
                        <Box>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {post.userId?.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            @{post.userId?.username}
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      </Box>
    </DashboardLayout>
  );
}
export async function getServerSideProps(context) {
  const { username } = context.params;
  const req = await clientServer.get("/user/get_profile_based_on_username", {
    params: { username: context.query.username },
  });
  const res = await req.data;
  return { props: { userProfile: req.data.profile } };
}

/**
 * So below is the reason why the HTML component shows the entire data incase of server side rendering, because
 * incase of Client side rendering the data that is sent is empty HTML with some JavaScript which then fetches the data and builds the page there.
 * So it originally doesnot have any data to show in the HTML component. And the SEO bots do not run JavaScript, so they see an empty page.
 * Client-Side Rendering (CSR)
The browser (client) gets a mostly empty HTML file with some JavaScript.
Then the JavaScript runs in the browser, fetches data, and builds the page there.
Example: React running entirely in your browser.
🚶 The page feels slower at first (blank screen → spinner → then content appears), but later navigation is fast because the browser doesn’t reload the whole page.

 * Server-Side Rendering (SSR)
The server does the work of building the page before sending it.
When you open the page, the HTML already has the content.
Example: Next.js getServerSideProps — the server fetches the data, puts it into HTML, and sends it.
🚀 Faster first load (because you see content immediately), but each navigation reloads data from the server.
 */
