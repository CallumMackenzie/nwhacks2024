import React, { useEffect, useState } from 'react';
import { Auth, User } from "firebase/auth";
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { Firestore } from 'firebase/firestore';
import { Backdrop, Box, Button, Grid, Paper, Stack, TextField } from '@mui/material';
import { SignInRequired, useRequiredSignIn } from './UseSignIn';

export const Home = (props: {
	auth: Auth,
	firestore: Firestore
}) => {
	const user = useRequiredSignIn(props.auth);

	return (<>
		<SignInRequired auth={props.auth} user={user}>
			<HomeSignedIn {...props} user={user!!} />
		</SignInRequired>
	</>);
};

const HomeSignedIn = (props: {
	auth: Auth,
	user: User,
	firestore: Firestore,
}) => {
	const navigate = useNavigate();

	return (<>
		<Grid container spacing={2} px={8} justifyContent={'center'} alignItems={'center'}>
			<Grid item xs={12} textAlign='center'>
				<Stack direction="row"
					spacing={5}
					py={2}
					justifyContent='space-around'>
					<p></p>
					<h1><span style={{ color: "#1EB36C" }}>Vit</span><span style={{ color: "#C00F0F" }}>Alert</span></h1>
					<Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
						<Button onClick={() => signOut(props.auth, navigate)}>Sign Out</Button>
					</Box>
				</Stack>
			</Grid>
			<Grid item xs={8}>
				<TextField variant='filled'
					label="Type food and amount"
					sx={{
						width: "100%"
					}}>
				</TextField>
			</Grid>
			<Grid item textAlign={'center'}>
				<Button variant='contained'>Submit</Button>
			</Grid>
			<Grid item xs={12}>
				<YourFoods />
			</Grid>
			<Grid item xs={12}>
				<MissingNutrients />
			</Grid>
		</Grid>
	</>);
}

const YourFoods = () => {
	return (<>
		<Paper>
			<Grid container p={3}>
				<Grid item>
					<h2>Your Foods ...</h2>
				</Grid>
			</Grid>
		</Paper>
	</>);
};

const MissingNutrients = () => {
	return (<>
		<Paper>
			<Grid container p={3}>
				<Grid item>
					<h2>You may be deficient in ...</h2>
				</Grid>
			</Grid>
		</Paper>
	</>);
};

const signOut = (auth: Auth, navigate: NavigateFunction) => {
	auth.signOut();
	navigate("/");
};