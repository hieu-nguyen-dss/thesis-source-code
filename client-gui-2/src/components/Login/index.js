import React from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../firebase/config";
import { addDocument, generateKeywords } from "../../firebase/services";

export default function Login() {
  const handleLogin = async () => {
    const result = await signInWithPopup(auth, provider);
    if (result?.user) {
      const user = result.user;
      addDocument("users", {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        uid: user.uid,
        providerId: result.providerId,
        keywords: generateKeywords(user.displayName?.toLowerCase()),
      });
    }
  };

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <div
            style={{
              textAlign: "center",
              fontSize: "30px",
              fontWeight: "bold",
            }}
            level={3}
          >
            Chat Room
          </div>
        </Grid>
        <Grid item xs={12} display={"flex"} justifyContent={"center"}>
          <Button
            variant="contained"
            onClick={() => handleLogin()}
            style={{ width: "300px" }}
          >
            Google Auth
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}
