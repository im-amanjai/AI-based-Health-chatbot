import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
  Divider
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function ProfileView() {
  const navigate = useNavigate();

  const [editMode, setEditMode] =
    useState(false);

  const [profile, setProfile] =
    useState({
      name: "",
      email: "",
      age: "",
      gender: "",
      conditions: [],
      habits: []
    });

  const [formData, setFormData] =
    useState({
      age: "",
      gender: "",
      conditions: "",
      habits: ""
    });

  // 📥 Load user profile
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res =
        await API.get(
          "/user/profile"
        );

      setProfile(res.data);

      setFormData({
        age:
          res.data.age || "",
        gender:
          res.data.gender ||
          "",
        conditions:
          res.data.conditions?.join(
            ", "
          ) || "",
        habits:
          res.data.habits?.join(
            ", "
          ) || ""
      });

    } catch (error) {
      alert(
        "Failed to load profile"
      );
    }
  };

  // ✏️ Handle edit changes
  const handleChange = (
    e
  ) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value
    });
  };

  // 💾 Save profile
  const handleSave = async () => {
    try {
      const res =
        await API.put(
          "/user/profile",
          {
            age: Number(
              formData.age
            ),
            gender:
              formData.gender,

            conditions:
              formData.conditions
                .split(",")
                .map((item) =>
                  item.trim()
                )
                .filter(
                  Boolean
                ),

            habits:
              formData.habits
                .split(",")
                .map((item) =>
                  item.trim()
                )
                .filter(
                  Boolean
                )
          }
        );

      setProfile(
        res.data.user
      );

      localStorage.setItem(
        "user",
        JSON.stringify(
          res.data.user
        )
      );

      setEditMode(false);

      alert(
        "Profile updated successfully!"
      );

    } catch (error) {
      alert(
        error.response?.data
          ?.msg ||
          "Profile update failed"
      );
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: 4,
        background:
          "linear-gradient(135deg, #061f2c, #082f3a)"
      }}
    >
      <Container
        maxWidth="lg"
      >
        {/* HEADER */}
        <Paper
          elevation={0}
          sx={{
            p: {
              xs: 3,
              md: 4
            },
            borderRadius: 3,
            color: "white",
            background:
              "linear-gradient(135deg, rgba(5,93,91,0.94), rgba(43,108,176,0.9))",
            mb: 3,
            boxShadow:
              "0 24px 70px rgba(16,37,38,0.16)"
          }}
        >
          <Stack
            direction={{
              xs: "column",
              md: "row"
            }}
            justifyContent="space-between"
            alignItems={{
              xs: "flex-start",
              md: "center"
            }}
            spacing={2}
          >
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
            >
              <PersonIcon
                sx={{
                  fontSize: 40
                }}
              />

              <Box>
                <Typography
                  variant="h4"
                  fontWeight={800}
                >
                  My Health
                  Profile
                </Typography>

                <Typography
                  sx={{
                    color:
                      "rgba(255,255,255,0.82)"
                  }}
                >
                  View and
                  manage your
                  personalized
                  health
                  information.
                </Typography>
              </Box>
            </Stack>

            <Button
              variant="contained"
              startIcon={
                <ArrowBackIcon />
              }
              sx={{
                bgcolor:
                  "#ffffff",
                color:
                  "#087f7a",
                fontWeight: 800,
                "&:hover":
                  {
                    bgcolor:
                      "#eef8f6"
                  }
              }}
              onClick={() =>
                navigate(
                  "/dashboard"
                )
              }
            >
              Back to
              Dashboard
            </Button>
          </Stack>
        </Paper>

        {/* PROFILE CONTENT */}
        <Paper
          elevation={0}
          sx={{
            p: {
              xs: 3,
              md: 4
            },
            borderRadius: 3,
            bgcolor:
              "rgba(7, 35, 46, 0.96)",
            color: "white",
            border:
              "1px solid rgba(255,255,255,0.08)"
          }}
        >
          {!editMode ? (
            <Stack
              spacing={3}
            >
              <Typography
                variant="h5"
                fontWeight={800}
              >
                Profile
                Summary
              </Typography>

              <Divider
                sx={{
                  borderColor:
                    "rgba(255,255,255,0.12)"
                }}
              />

              <Typography>
                <strong>
                  Name:
                </strong>{" "}
                {
                  profile.name
                }
              </Typography>

              <Typography>
                <strong>
                  Email:
                </strong>{" "}
                {
                  profile.email
                }
              </Typography>

              <Typography>
                <strong>
                  Age:
                </strong>{" "}
                {profile.age ||
                  "Not set"}
              </Typography>

              <Typography>
                <strong>
                  Gender:
                </strong>{" "}
                {profile.gender ||
                  "Not set"}
              </Typography>

              <Typography>
                <strong>
                  Conditions:
                </strong>{" "}
                {profile
                  .conditions
                  ?.length
                  ? profile.conditions.join(
                      ", "
                    )
                  : "None"}
              </Typography>

              <Typography>
                <strong>
                  Habits:
                </strong>{" "}
                {profile
                  .habits
                  ?.length
                  ? profile.habits.join(
                      ", "
                    )
                  : "None"}
              </Typography>

              <Button
                variant="contained"
                startIcon={
                  <EditIcon />
                }
                sx={{
                  mt: 2,
                  bgcolor:
                    "#087f7a",
                  fontWeight: 800,
                  "&:hover":
                    {
                      bgcolor:
                        "#055d5b"
                    }
                }}
                onClick={() =>
                  setEditMode(
                    true
                  )
                }
              >
                Edit
                Profile
              </Button>
            </Stack>
          ) : (
            <Stack
              spacing={3}
            >
              <Typography
                variant="h5"
                fontWeight={800}
              >
                Edit
                Profile
              </Typography>

              <TextField
                label="Age"
                type="number"
                name="age"
                value={
                  formData.age
                }
                onChange={
                  handleChange
                }
                fullWidth
                InputLabelProps={{
                  style: {
                    color:
                      "white"
                  }
                }}
              />

              <TextField
                select
                label="Gender"
                name="gender"
                value={
                  formData.gender
                }
                onChange={
                  handleChange
                }
                fullWidth
                InputLabelProps={{
                  style: {
                    color:
                      "white"
                  }
                }}
              >
                <MenuItem value="Male">
                  Male
                </MenuItem>

                <MenuItem value="Female">
                  Female
                </MenuItem>

                <MenuItem value="Other">
                  Other
                </MenuItem>
              </TextField>

              <TextField
                label="Conditions"
                name="conditions"
                value={
                  formData.conditions
                }
                onChange={
                  handleChange
                }
                fullWidth
                multiline
                helperText="Separate by commas"
                InputLabelProps={{
                  style: {
                    color:
                      "white"
                  }
                }}
              />

              <TextField
                label="Habits"
                name="habits"
                value={
                  formData.habits
                }
                onChange={
                  handleChange
                }
                fullWidth
                multiline
                helperText="Separate by commas"
                InputLabelProps={{
                  style: {
                    color:
                      "white"
                  }
                }}
              />

              <Stack
                direction="row"
                spacing={2}
              >
                <Button
                  variant="contained"
                  startIcon={
                    <SaveIcon />
                  }
                  sx={{
                    bgcolor:
                      "#087f7a",
                    fontWeight: 800,
                    "&:hover":
                      {
                        bgcolor:
                          "#055d5b"
                      }
                  }}
                  onClick={
                    handleSave
                  }
                >
                  Save
                  Changes
                </Button>

                <Button
                  variant="outlined"
                  sx={{
                    color:
                      "white",
                    borderColor:
                      "rgba(255,255,255,0.5)"
                  }}
                  onClick={() =>
                    setEditMode(
                      false
                    )
                  }
                >
                  Cancel
                </Button>
              </Stack>
            </Stack>
          )}
        </Paper>
      </Container>
    </Box>
  );
}