import React, { useEffect, useState } from 'react';
import { Auth, User, getAuth, getRedirectResult, signInWithRedirect } from "firebase/auth";
import { GoogleAuthProvider } from 'firebase/auth';
import { Box, Button, Container } from '@mui/material';
import { NavigateFunction, redirect, useNavigate } from 'react-router-dom';
import { signInGoogle, useSignIn } from './UseSignIn';

export const SignIn = (props: {
	auth: Auth,
}) => {
	const foundUser = useSignIn(props.auth);
	const navigate = useNavigate();

	useEffect(() => {
		if (foundUser) navigate("/home");
	}, [foundUser]);

	return (<>
		<Box justifyContent='center' textAlign='center' alignContent='center'>
			<Button variant='contained'
				disabled={foundUser}
				onClick={() => signInGoogle(props.auth)}>
				Sign In With Google
			</Button>
		</Box>
	</>);
}