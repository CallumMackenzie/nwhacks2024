import React, { useEffect } from "react";
import { Auth } from "firebase/auth";
import { Box, Button } from "@mui/material";
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
			<img
				src={vitAlertImage}
				alt="VITALERT"
				style={{
					objectFit: 'contain',
					height: "70vh",
					maxWidth: "95%",
				}}
			/>
			<Button
				variant="contained"
				disabled={foundUser}
				onClick={() => signInGoogle(props.auth)}>
				Sign In With Google
			</Button>
		</Stack>
	);
};
