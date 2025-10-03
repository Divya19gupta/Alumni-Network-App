import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { getAllPost } from "../../config/redux/action/postAction";
import { getAboutUser } from "../../config/redux/action/authAction";
import {
  Avatar,
  Box,
  Card,
  CssBaseline,
  Grid,
  Typography,
  Divider,
  TextField,
  Button,
  IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material";
import DashboardLayout from "../../layout/DashboardLayout";
import { BASE_URL } from "../../config";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { createPost } from "../../config/redux/action/postAction";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import CommentIcon from "@mui/icons-material/Comment";
import SendIcon from "@mui/icons-material/Send";
import { deletePost } from "../../config/redux/action/postAction";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Paper } from "@mui/material";
import { toggleLikePost } from "../../config/redux/action/postAction";

const oliveGreen = "#708238";
const lightOlive = "#E3E8D1";
const bgOlive = "#F4F6EB";

export default function Dashboard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const [isToken, setIsToken] = useState(false);
  const [isStatus, setStatus] = useState('');
  const [postContent, setPostContent] = useState("");
  const [fileContent, setFileContent] = useState(null);
   const [openDialog, setOpenDialog] = useState(false);
  const [blockReason, setBlockReason] = useState("");


  const postState = useSelector((state) => state.posts);

  
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/login");
    } else {
      setIsToken(true);
    }
  }, []);

  useEffect(() => {
    if (isToken) {
      dispatch(getAllPost());
      dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    }
  }, [isToken]);

  const handleUpload = async () => {
    setStatus("Checking post...");
    const res = await fetch(`${BASE_URL}moderate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: postContent }),
    });
    const data = await res.json();
    console.log("Moderation result:", data);

    if (!data.safe) {
      // Build a user-friendly reason string
      const reasons = [];
      if (data.hate) reasons.push("Hateful content");
      if (data.violence) reasons.push("Violence");
      if (data.sexual) reasons.push("Sexual content");
      if (data.harassment) reasons.push("Harassment or bullying");
      if (data.selfharm) reasons.push("Self-harm or suicide");

      setBlockReason(reasons.join(", ") || "Harmful content detected");
      setOpenDialog(true);
      setStatus("Post blocked for harmful content.");
    } else {
      await dispatch(createPost({ file: fileContent, body: postContent }));
      setPostContent("");
      setFileContent(null);
      setStatus("Post is clean! Saved successfully.");
    }
  };

  return (
    <DashboardLayout title="Dashboard">
      {" "}
      <CssBaseline />
      <Box
        sx={{ display: "flex", minHeight: "100vh", backgroundColor: bgOlive }}
      >
        {/* Left Profile Sidebar */}
        <Box
          sx={{
            flex: 0.8,
            backgroundColor: lightOlive,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            py: 5,
            borderRight: `2px solid ${oliveGreen}`,
          }}
        >
          <Box sx={{ position: "relative" }}>
            <Avatar
              src={`${BASE_URL}/${auth.user?.userId?.profilePicture}`}
              sx={{
                width: 120,
                height: 120,
                mb: 2,
                border: `3px solid ${oliveGreen}`,
              }}
            />
            <IconButton
              size="small"
              sx={{
                position: "absolute",
                bottom: 10,
                right: 0,
                backgroundColor: oliveGreen,
                color: "white",
                "&:hover": { backgroundColor: "#556b2f" },
              }}
            >
              <PhotoCameraIcon fontSize="small" />{" "}
            </IconButton>{" "}
          </Box>

          <Typography variant="h5" fontWeight="bold" color="black">
            {auth.user?.userId?.name ?? "Guest"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {auth.user?.location ?? "Unknown Location"}
          </Typography>

          <Box sx={{ my: 3, textAlign: "center" }}>
            <Typography variant="h4" color={oliveGreen}>
              {postState.posts?.length ?? 0}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Posts
            </Typography>
          </Box>

          <Divider sx={{ width: "80%", my: 2 }} />
        </Box>

        {/* Right Content */}
        <Box sx={{ flex: 2.2, p: 4 }}>

          {/* Posts Feed / Create Post */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Create Post */}
              <Card sx={{ p: 3, borderRadius: 3, backgroundColor: "white" }}>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  color={oliveGreen}
                  mb={2}
                >
                  Create a Post
                </Typography>
                <TextField
                  multiline
                  minRows={3}
                  placeholder="What's on your mind?"
                  fullWidth
                  variant="outlined"
                  sx={{
                    mb: 2,
                    backgroundColor: "#fff",
                    borderRadius: 2,
                  }}
                  onChange={(e) => setPostContent(e.target.value)}
                />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Button
                    variant="outlined"
                    component="label"
                    sx={{ color: oliveGreen, borderColor: oliveGreen }}
                  >
                    Upload Image
                    <input
                      type="file"
                      hidden
                      onChange={(e) => setFileContent(e.target.files[0])}
                    />
                  </Button>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: oliveGreen,
                      "&:hover": { backgroundColor: "#556b2f" },
                    }}
                    onClick={handleUpload}
                  >
                    Post
                  </Button>
                  <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                    <DialogTitle>Post Blocked</DialogTitle>
                    <DialogContent>
                      Your post was not published because it contains: <strong>{blockReason}</strong>.
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={() => setOpenDialog(false)} color="primary">
                        Close
                      </Button>
                    </DialogActions>
                  </Dialog>
                </Box>
              </Card>

              {/* Example Feed Item */}
              {/* Feed Items */}
              {Array.isArray(postState.posts) && postState.posts.length > 0 ? (
                postState.posts.map((post, index) => (
                  <Card
                    key={post._id ?? index}
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      backgroundColor: "white",
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                      position: "relative", // to allow absolute delete icon
                    }}
                  >
                    {/* Delete Button */}
                    {auth.user?.userId?._id == post.userId?._id && (<DeleteForeverIcon
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 20,
                        right: 10,
                        color: "oliveGreen",
                        cursor: "pointer",
                        "&:hover": { color: "#556b2f" },
                      }}
                      onClick={async () => {
                        await dispatch(deletePost(post._id));
                        await dispatch(getAllPost());
                      }} 
                    ></DeleteForeverIcon>)}

                    {/* Post Header */}
                    <Typography variant="subtitle2" color="text.secondary">
                      {post.userId?.name ?? "Anonymous"} •{" "}
                      {new Date(post.createdAt).toLocaleString()} <br />
                      {"@" + post.userId?.username}
                    </Typography>

                    {/* Post Body */}
                    <Typography variant="body1">{post.body}</Typography>

                    {/* Post Media */}
                    {post.media && (
                      <Box
                        component="img"
                        src={`${BASE_URL}/${post.media}`}
                        alt="post media"
                        sx={{
                          mt: 1,
                          borderRadius: 2,
                          maxHeight: 300,
                          objectFit: "cover",
                          width: "100%",
                        }}
                      />
                    )}

                    {/* Actions */}
                    <Box sx={{ mt: 1 }}>
                      {/* Likes and Comments Row */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          cursor: "pointer",
                        }}
                      >
                        <FavoriteIcon
                          onClick={async () => {
                            await dispatch(toggleLikePost(post._id));
                          }}
                          sx={{
                            color: post.likedByUser ? "green" : "gray",
                            cursor: "pointer",
                          }}
                        />
                        {/* <Typography variant="body2" color="text.secondary">
                          {post.likes?.length ?? 0} Likes
                        </Typography> */}

                        {/* <IconButton size="small" sx={{ color: "gray" }}>
                          <CommentIcon />
                        </IconButton>
                        <Typography variant="body2" color="text.secondary">
                          {post.comments?.length ?? 0} Comments
                        </Typography> */}
                      </Box>

                      {/* Aesthetic Comment Box */}
                      {/* <Paper
                        sx={{
                          mt: 1,
                          p: 1,
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          borderRadius: 2,
                          boxShadow: 1,
                          backgroundColor: "#f5f5f5",
                        }}
                      >
                        <TextField
                          fullWidth
                          size="small"
                          placeholder="Add a comment..."
                          variant="outlined"
                          sx={{
                            backgroundColor: "white",
                            borderRadius: 1,
                          }}
                        />
                        <IconButton size="small" sx={{ color: "oliveGreen" }}>
                          <SendIcon />
                        </IconButton>
                      </Paper> */}
                    </Box>
                  </Card>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No posts yet.{" "}
                </Typography>
              )}
            </Box>
        </Box>
      </Box>
    </DashboardLayout>
  );
}
