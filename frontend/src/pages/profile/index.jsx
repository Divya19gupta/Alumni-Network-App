import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { getAboutUser } from "../../config/redux/action/authAction";
import React, { useEffect, useState, useRef } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  IconButton,
  TextField,
  Typography,
  Chip,
  Tooltip,
  Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import AddIcon from "@mui/icons-material/Add";
import CancelIcon from "@mui/icons-material/Cancel";
import DashboardLayout from "../../layout/DashboardLayout"; 
import { BASE_URL, clientServer } from "@/config";

const oliveGreen = "#708238";
const darkOlive = "#556B2F";
const black = "#0a0a0a";
const bgLight = "#fbfdf6";

const TopBanner = styled("div")(({ theme }) => ({
  borderRadius: 14,
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  background: `linear-gradient(135deg, rgba(112,130,56,0.12), rgba(85,107,47,0.04))`,
}));

const StyledCard = styled(Card)({
  borderRadius: 16,
  boxShadow: "0px 8px 30px rgba(0,0,0,0.08)",
  background: "#fff",
  display: "flex",
  flexDirection: "column",
});

const FieldRow = ({ label, children }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: 2,
      mb: 2,
    }}
  >
    <Box sx={{ minWidth: 120 }}>
      <Typography variant="subtitle2" color="text.secondary">
        {label}
      </Typography>
    </Box>
    <Box sx={{ flex: 1 }}>{children}</Box>
  </Box>
);

export default function ProfileEditor({
  onSubmit = (data) => {
    console.log("onSubmit called with", data);
  }
}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const userProfile = useSelector((state) => state.auth);

  const [isToken, setIsToken] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/login");
    } else {
      setIsToken(true);
    }
  }, []);

  useEffect(() => {
    if (isToken) {
      dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    }
  }, [isToken]);

  // Initialize form from userProfile object
  const initialForm = {
    name: userProfile?.user?.userId?.name ?? "",
    email: userProfile?.user?.userId?.email ?? "",
    profilePicture: userProfile?.user?.userId?.profilePicture ?? "",
    bio: userProfile?.user?.bio ?? "",
    currentPost: userProfile?.user?.currenPost ?? "",
    pastWork: Array.isArray(userProfile?.user?.pastWork)
      ? userProfile.user?.pastWork
      : [],
    education: Array.isArray(userProfile?.user?.education)
      ? userProfile.user?.education
      : [],
    mobile: userProfile?.userId?.mobile ?? "",
    role: userProfile?.userId?.role ?? "",
    industries: userProfile?.industries ?? [],
    social: userProfile?.social ?? [],
  };

  const [form, setForm] = useState(initialForm);
  const [globalEditMode, setGlobalEditMode] = useState(false);
  const [localPastWorkDraft, setLocalPastWorkDraft] = useState({
    position: "",
    company: "",
  });
  const [localEducationDraft, setLocalEducationDraft] = useState({
    school: "",
    degree: "",
  });
  const fileInputRef = useRef(null);

  useEffect(() => {
    setForm((prev) => {
      if (globalEditMode) return prev;
      return { ...initialForm };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile.user]);

  const handleChange = (key, val) => {
    setForm((prev) => ({ ...prev, [key]: val }));
  };

  const handleAddPastWork = () => {
    const newEntry = { ...localPastWorkDraft };
    if (!newEntry.position && !newEntry.company) return;
    setForm((prev) => ({ ...prev, pastWork: [...prev.pastWork, newEntry] }));
    setLocalPastWorkDraft({ position: "", company: "" });
  };

  const handleAddEducation = () => {
    const newEntry = { ...localEducationDraft };
    if (!newEntry.school && !newEntry.degree) return;
    setForm((prev) => ({ ...prev, education: [...prev.education, newEntry] }));
    setLocalEducationDraft({ school: "", degree: "" });
  };

  const handleRemoveArrayItem = (arrKey, idx) => {
    setForm((prev) => {
      const copy = [...prev[arrKey]];
      copy.splice(idx, 1);
      return { ...prev, [arrKey]: copy };
    });
  };

  

  const handleGlobalCancel = () => {
    setForm(initialForm);
    setGlobalEditMode(false);
  };

  const handleGlobalSubmit = () => {
    updateUserProfile();
    setGlobalEditMode(false);
  };

  const updateProfilePicture = async (file) => {
    if(!file) return;

  const formData = new FormData();
  formData.append("profile_picture", file);
  formData.append("token", localStorage.getItem("token"));

  await clientServer.post("/upload_profile_picture", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  // Refresh user profile after upload
  dispatch(getAboutUser({ token: localStorage.getItem("token") }));
  }

  const updateUserProfile = async () => {
    const req = await clientServer.post('/update_profile', {
      token: localStorage.getItem('token'),
      name: form.name,
    })
    const res = await clientServer.post('/update_profile_data', {
      token: localStorage.getItem('token'),
      bio: form.bio,
      currentPost: form.currentPost,
      pastWork: Array.isArray(form.pastWork) ? form.pastWork : [form.pastWork],
      education: Array.isArray(form.education) ? form.education : [form.education],
    })

    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
  }

  return (
    <DashboardLayout title="Profile">
      <Box sx={{ maxWidth: 1200, mx: "auto", mt: 6, pb: 6 }}>
        <TopBanner>
          <Typography variant="h4" sx={{ color: black, fontWeight: 700 }}>
            Profile
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            sdjfsdfksjhdakjhsdkjfhaskdjhfkasdjhfkasjdhksadjhfkasdjhkjsdhfksdjhfakjsdhkjsadh
          </Typography>
        </TopBanner>

        <Grid container spacing={4} alignItems="stretch">
          {/* LEFT: Form fields */}
          <Grid item xs={12} md={10} sx={{ display: "flex" }}>
            <StyledCard sx={{ flex: 1 }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, color: darkOlive, mb: 2 }}
                >
                  Personal Information
                </Typography>

                <Divider sx={{ mb: 2 }} />

                {/* Full Name */}
                <FieldRow label="Full name">
                  {globalEditMode ? (
                    <TextField
                      fullWidth
                      value={form.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      size="small"
                    />
                  ) : (
                    <Typography variant="body1">{form.name || "—"}</Typography>
                  )}
                </FieldRow>

                {/* Email */}
                <FieldRow label="Email">
                  {globalEditMode ? (
                    <TextField
                      fullWidth
                      value={form.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      size="small"
                    />
                  ) : (
                    <Typography variant="body1">{form.email || "—"}</Typography>
                  )}
                </FieldRow>

                {/* Mobile */}
                <FieldRow label="Mobile">
                  {globalEditMode ? (
                    <TextField
                      fullWidth
                      value={form.mobile}
                      onChange={(e) => handleChange("mobile", e.target.value)}
                      size="small"
                      placeholder="e.g. +1 555 1234"
                    />
                  ) : (
                    <Typography variant="body1">{form.mobile || "—"}</Typography>
                  )}
                </FieldRow>

                {/* Role */}
                <FieldRow label="Role">
                  {globalEditMode ? (
                    <TextField
                      fullWidth
                      value={form.role}
                      onChange={(e) => handleChange("role", e.target.value)}
                      size="small"
                      placeholder="e.g. Senior Product Designer"
                    />
                  ) : (
                    <Typography variant="body1">{form.role || "—"}</Typography>
                  )}
                </FieldRow>

                {/* Bio */}
                <FieldRow label="Bio">
                  {globalEditMode ? (
                    <TextField
                      fullWidth
                      value={form.bio}
                      onChange={(e) => handleChange("bio", e.target.value)}
                      size="small"
                      multiline
                      minRows={3}
                    />
                  ) : (
                    <Typography variant="body1">
                      {form.bio ||
                        "No bio yet. Share something short about yourself."}
                    </Typography>
                  )}
                </FieldRow>

                {/* Current Post */}
                <FieldRow label="Current post">
                  {globalEditMode ? (
                    <TextField
                      fullWidth
                      value={form.currentPost}
                      onChange={(e) =>
                        handleChange("currentPost", e.target.value)
                      }
                      size="small"
                      placeholder="e.g. Lead Designer at ACME"
                    />
                  ) : (
                    <Typography variant="body1">
                      {form.currentPost || "—"}
                    </Typography>
                  )}
                </FieldRow>

                <Divider sx={{ my: 2 }} />

                {/* Past Work */}
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Past Work
                </Typography>
                <Box sx={{ mb: 2 }}>
                  {form.pastWork.length === 0 && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      No past work added.
                    </Typography>
                  )}

                  {form.pastWork.map((pw, i) => (
                    <Paper
                      variant="outlined"
                      key={i}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        p: 1,
                        mb: 1,
                      }}
                    >
                      <Box>
                        <Typography sx={{ fontWeight: 600 }}>
                          {pw.position || "—"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {pw.company || ""}
                        </Typography>
                      </Box>
                      {globalEditMode && (
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveArrayItem("pastWork", i)}
                        >
                          <CloseIcon />
                        </IconButton>
                      )}
                    </Paper>
                  ))}

                  {globalEditMode && (
                    <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                      <TextField
                        placeholder="Position"
                        size="small"
                        value={localPastWorkDraft.position}
                        onChange={(e) =>
                          setLocalPastWorkDraft((prev) => ({
                            ...prev,
                            position: e.target.value,
                          }))
                        }
                      />
                      <TextField
                        placeholder="Company"
                        size="small"
                        value={localPastWorkDraft.company}
                        onChange={(e) =>
                          setLocalPastWorkDraft((prev) => ({
                            ...prev,
                            company: e.target.value,
                          }))
                        }
                      />
                      <IconButton color="primary" onClick={handleAddPastWork}>
                        <AddIcon />
                      </IconButton>
                    </Box>
                  )}
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Education */}
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Education
                </Typography>
                <Box sx={{ mb: 2 }}>
                  {form.education.length === 0 && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      No education added.
                    </Typography>
                  )}

                  {form.education.map((ed, i) => (
                    <Paper
                      variant="outlined"
                      key={i}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        p: 1,
                        mb: 1,
                      }}
                    >
                      <Box>
                        <Typography sx={{ fontWeight: 600 }}>
                          {ed.school || "—"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {ed.degree || ""}
                        </Typography>
                      </Box>
                      {globalEditMode && (
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveArrayItem("education", i)}
                        >
                          <CloseIcon />
                        </IconButton>
                      )}
                    </Paper>
                  ))}

                  {globalEditMode && (
                    <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                      <TextField
                        placeholder="School"
                        size="small"
                        value={localEducationDraft.school}
                        onChange={(e) =>
                          setLocalEducationDraft((prev) => ({
                            ...prev,
                            school: e.target.value,
                          }))
                        }
                      />
                      <TextField
                        placeholder="Degree"
                        size="small"
                        value={localEducationDraft.degree}
                        onChange={(e) =>
                          setLocalEducationDraft((prev) => ({
                            ...prev,
                            degree: e.target.value,
                          }))
                        }
                      />
                      <IconButton color="primary" onClick={handleAddEducation}>
                        <AddIcon />
                      </IconButton>
                    </Box>
                  )}
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Extras: industries & social */}
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Industry interests
                </Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
                  {(form.industries || []).length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      No industries added.
                    </Typography>
                  ) : (
                    form.industries.map((tag, i) => (
                      <Chip key={i} label={tag} sx={{ borderRadius: 2 }} />
                    ))
                  )}
                </Box>

                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Social
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {(form.social || []).length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      No social links added.
                    </Typography>
                  ) : (
                    form.social.map((s, i) => (
                      <Box
                        key={i}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          p: 1,
                          borderRadius: 1,
                          border: "1px solid #eee",
                        }}
                      >
                        <Typography variant="body2">
                          {s.platform || "Link"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {s.url}
                        </Typography>
                      </Box>
                    ))
                  )}
                </Box>
              </CardContent>

              {/* Actions at bottom of card */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 1,
                  p: 2,
                  borderTop: "1px solid #eee",
                }}
              >
                {!globalEditMode ? (
                  <Button
                    variant="contained"
                    onClick={() => setGlobalEditMode(true)}
                    sx={{
                      backgroundColor: oliveGreen,
                      "&:hover": { backgroundColor: darkOlive },
                      color: "#fff",
                    }}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="contained"
                      startIcon={<CheckIcon />}
                      onClick={handleGlobalSubmit}
                      sx={{
                        backgroundColor: oliveGreen,
                        "&:hover": { backgroundColor: darkOlive },
                        color: "#fff",
                      }}
                    >
                      Submit
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<CancelIcon />}
                      onClick={handleGlobalCancel}
                      sx={{
                        color: oliveGreen,
                        borderColor: oliveGreen,
                        "&:hover": { borderColor: darkOlive, color: darkOlive },
                      }}
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </Box>
            </StyledCard>
          </Grid>

          {/* RIGHT: Avatar + quick meta */}
          <Grid item xs={12} md={2} sx={{ display: "flex" }}>
            <StyledCard sx={{ flex: 1 }}>
              <CardContent sx={{ textAlign: "center", height: "100%" }}>
                <Box sx={{ position: "relative", display: "inline-block", mb: 2 }}>
  <Avatar
    src={
      form.profilePicture
        ? form.profilePicture.startsWith("blob:") ||
          form.profilePicture.startsWith("http")
          ? form.profilePicture
          : `${BASE_URL}/${form.profilePicture}`
        : `/images/default.jpg`
    }
    alt={form.name || "Profile"}
    sx={{
      width: { xs: 160, md: 200 },
      height: { xs: 160, md: 200 },
      borderRadius: "50%",
      boxShadow: "0px 10px 40px rgba(0,0,0,0.15)",
    }}
  />

  {/* Hidden file input */}
  <input
    ref={fileInputRef}
  type="file"
  accept="image/*"
  style={{ display: "none" }}
  onChange={(e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Preview locally
    const preview = URL.createObjectURL(selectedFile);
    setForm((prev) => ({ ...prev, profilePicture: preview }));

    // Upload
    updateProfilePicture(selectedFile);
  }}
  />

  {/* Camera button that triggers input click */}
  <Tooltip title="Change profile picture">
    <IconButton
      onClick={() => fileInputRef.current?.click()}
      sx={{
        position: "absolute",
        bottom: 8,
        right: 8,
        background: oliveGreen,
        color: "#fff",
        "&:hover": { background: darkOlive },
      }}
    >
      <CameraAltIcon />
    </IconButton>
  </Tooltip>
</Box>

                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, color: black, mb: 0.5 }}
                >
                  {form.name || "Unnamed User"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {form.role || "No role set"}
                </Typography>
              </CardContent>
            </StyledCard>
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  );
}
