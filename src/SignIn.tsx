import React, { useEffect, useState } from 'react';
import { Auth, User, getAuth, getRedirectResult, signInWithRedirect } from "firebase/auth";
import { GoogleAuthProvider } from 'firebase/auth';
import { Box, Button, Container } from '@mui/material';
import { NavigateFunction, redirect, useNavigate } from 'react-router-dom';


export const SignIn = (props: {
	user: User | null,
	setUser: (u: User | null) => void
}) => {
	const [signingIn, setSigningIn] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		checkSignedIn(setSigningIn, navigate, props.user, props.setUser);
	}, []);

	return (<>
		<Box justifyContent='center' textAlign='center' alignContent='center'>
			<Button variant='contained'
				disabled={signingIn}
				onClick={() => signIn(setSigningIn)}>
				Sign In With Google
			</Button>
		</Box>
	</>);
}

const signIn = async (setSigningIn: (b: boolean) => void) => {
	setSigningIn(true);
	const provider = new GoogleAuthProvider();
	provider.setCustomParameters({
		'login_hint': "user@example.com"
	});
	const auth = getAuth();
	signInWithRedirect(auth, provider);
}

/**
 * 
 * @source https://firebase.google.com/docs/auth/web/google-signin 
 */
const checkSignedIn = async (setSigningIn: (b: boolean) => void,
	navigate: NavigateFunction,
	user: User | null,
	setUser: (u: User | null) => void) => {

	setSigningIn(true);
	try {
		const res = await getRedirectResult(getAuth());
		if (res == null)
			return console.error("Redirect sign in FAILED");
		const credential = GoogleAuthProvider.credentialFromResult(res);
		if (credential == null)
			return console.error("Credential retrieval FAILED");
		const token = credential.accessToken;
		const user = res.user;
		console.log("Logged in: " + user.displayName);
		setUser(user);
		navigate("/home");
	} finally {
		setSigningIn(user != null);
	}
};