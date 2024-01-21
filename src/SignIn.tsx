import React, { useEffect, useState } from "react";
import {
  Auth,
  User,
  getAuth,
  getRedirectResult,
  signInWithRedirect,
} from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { Box, Button, Container } from "@mui/material";
import { NavigateFunction, redirect, useNavigate } from "react-router-dom";
import { signInGoogle, useSignIn } from "./UseSignIn";
import vitAlertImage from "./images/VitAlert-Full.png";
import { Stack } from "@mui/material";

export const SignIn = (props: { auth: Auth }) => {
  const foundUser = useSignIn(props.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (foundUser) navigate("/home");
  }, [foundUser]);

  return (
    <Stack alignItems="center" justifyContent="center">
      <div>
        <h1></h1>
        <img
          src={vitAlertImage}
          alt="VITALERT"
          style={{
            height: "70vh",
            maxWidth: "100%",
          }}
        />
      </div>
      <Box justifyContent="center" textAlign="center" alignContent="center">
        <Button
          variant="contained"
          disabled={foundUser}
          onClick={() => signInGoogle(props.auth)}
        >
          Sign In With Google
        </Button>
      </Box>
    </Stack>
  );
};
