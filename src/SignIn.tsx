import React from 'react';
import { Auth } from "firebase/auth";
import { GoogleAuthProvider } from 'firebase/auth';
import { Button, Container } from '@mui/material';

const provider = new GoogleAuthProvider();
provider.setCustomParameters({
	'login_hint': "user@example.com"
});

export const SignIn = (props: {
	auth: Auth
}) => {
	return (<>
		<Container>
			<Button variant='contained'>
				Sign In With Google
			</Button>
		</Container>
	</>);
}