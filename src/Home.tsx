import React, { useEffect, useState } from 'react';
import { Auth, User } from "firebase/auth";
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { Firestore } from 'firebase/firestore';
import { Backdrop, Box, Button, Divider, Grid, List, ListItem, Paper, Stack, TextField, Tooltip } from '@mui/material';
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
	const [foodInput, setFoodInput] = useState("");

	return (<>
		<Grid container spacing={2} px={8} justifyContent={'center'} alignItems={'center'}>
			<Grid item xs={12} textAlign='center'>
				<Stack direction="row"
					spacing={5}
					py={2}
					justifyContent='space-around'>
					<p></p>
					<h1><span style={{ color: "#1EB36C" }}>VIT</span><span style={{ color: "#C00F0F" }}>ALERT</span></h1>
					<Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
						<Button variant='outlined'
							onClick={() => signOut(props.auth, navigate)}>Sign Out</Button>
					</Box>
				</Stack>
			</Grid>
			<Grid item xs={12}>
				<Stack direction='row' spacing={2} alignItems={'center'} justifyContent={'center'}>
					<TextField variant='standard'
						onChange={e => setFoodInput(e.currentTarget.value)}
						helperText="Ex. 1 apple, 1 slice pizza, 1 cup rice"
						label="Type food and amount"
						sx={{
							width: "75%"
						}}>
					</TextField>
					<Button
						disabled={foodInput == ""}
						variant='contained'
						onClick={() => parseFoodInput(props.firestore, props.user, foodInput)}>
						Record Foods
					</Button>
				</Stack>
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
				<Grid item xs={12}>
					<h2>Your Foods ...</h2>
				</Grid>
				<Grid item xs={12}>
					<Divider />
				</Grid>
				<Grid item xs={12}>
					<List>
						{/* TODO */}
					</List>
				</Grid>
			</Grid>
		</Paper>
	</>);
};

const MissingNutrients = () => {

	return (<>
		<Paper>
			<Grid container p={3}>
				<Grid item xs={12}>
					<h2>You may be deficient in ...</h2>
				</Grid>
				<Grid item xs={12}>
					<Divider />
				</Grid>
				<Grid item xs={12}>
					<List>
						{/* TODO */}
					</List>
				</Grid>
			</Grid>
		</Paper>
	</>);
};

// const Graphs = () => {
// 	return (<>
// 		<Grid item xs={6}>
// 			<iframe src="https://ourworldindata.org/grapher/prevalence-of-vitamin-a-deficiency-in-children"
// 				loading="lazy"
// 				style={{
// 					width: "100%",
// 					height: "600px"
// 				}} />
// 		</Grid>
// 		<Grid item xs={6}>
// 			<iframe src="https://ourworldindata.org/grapher/prevalence-of-vitamin-a-deficiency-in-children"
// 				loading="lazy"
// 				style={{
// 					width: "100%",
// 					height: "600px"
// 				}} />
// 		</Grid>
// 	</>);
// };

const signOut = (auth: Auth, navigate: NavigateFunction) => {
	auth.signOut();
	navigate("/");
};

const parseFoodInput = (firestore: Firestore, user: User, input: string) => {

};