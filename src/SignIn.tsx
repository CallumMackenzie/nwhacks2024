import React, { useState } from 'react';
import { Auth, getAuth, getRedirectResult, signInWithRedirect } from "firebase/auth";
import { GoogleAuthProvider } from 'firebase/auth';
import { Box, Button, Container } from '@mui/material';


export const SignIn = (props: {
	auth: Auth
}) => {
	const [signingIn, setSigningIn] = useState(false);

	return (<>
		<Box justifyContent='center' textAlign='center' alignContent='center'>
			<Button variant='contained'
				disabled={signingIn}
				onClick={() => signIn()}>
				Sign In With Google
			</Button>
		</Box>
	</>);
}

const signIn = () => {
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
const checkSignedIn = async (auth: Auth, setSigningIn: (b: boolean) => void) => {
	setSigningIn(true);
	const res = await getRedirectResult(auth);
	if (res == null)
		return console.error("Redirect sign in FAILED");
	const credential = GoogleAuthProvider.credentialFromResult(res);
	if (credential == null)
		return console.error("Credential retrieval FAILED");
	const token = credential.accessToken;
	const user = res.user;
};