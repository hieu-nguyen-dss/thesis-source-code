import * as React from "react";
import {
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  FormControl,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

import background from "../../assets/images/4783543.png";
import { userApi } from "../../apis";
import { useAuth, useSnackbar } from "../../contexts";
import { ACTOR_TYPE, HTTP_STATUS, SNACKBAR } from "../../constants";

export default function SignUp() {
  const auth = useAuth();
  const navigate = useNavigate();
  const { openSnackbar } = useSnackbar();
  const [userType, setUserType] = React.useState(ACTOR_TYPE.STUDENT);

  const handleSubmit = async (event) => {
    console.log("event: ", event);
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const info = {
      email: data.get("email"),
      userType,
      password: data.get("password"),
      name: `${data.get("firstName")} ${data.get("lastName")}`,
    };
    if (info.email === "" || info.password === "" || info.name.trim() === "") {
      openSnackbar(SNACKBAR.WARNING, "Fill all required field");
      return;
    }
    const {
      status,
      data: { user, accessToken },
    } = await userApi.userSignup(info);
    if (status === HTTP_STATUS.OK) {
      auth.signin(
        { name: user.name, email: user.email, userId: user._id },
        accessToken,
        () => {
          navigate("/", { replace: true });
        }
      );
    } else if (status === HTTP_STATUS.BAD_REQUEST) {
      openSnackbar(SNACKBAR.ERROR, "Try another email");
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: `url(${background})`,
        backgroundColor: "white",
        backgroundSize: "60%",
        backgroundPosition: "right",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Box
        sx={{
          width: "40%",
          height: "100%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: "70%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            m: "auto",
          }}
        >
          <Box sx={{ fontWeight: 500, fontSize: 32, mb: 5, color: "#545185" }}>
            Learning Path
          </Box>
          <Typography
            sx={{ fontSize: 18, fontWeight: 500, color: "lightslategray" }}
          >
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  size="small"
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  size="small"
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <TextField
                    size="small"
                    required
                    fullWidth
                    id="demo-simple-select"
                    label="You are"
                    name="userType"
                    value={userType}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  size="small"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  size="small"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                textTransform: "none",
                background: "#545185",
                color: "white",
                "&:hover": { background: "#545185" },
              }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link style={{ fontSize: 14 }} to="/login">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
