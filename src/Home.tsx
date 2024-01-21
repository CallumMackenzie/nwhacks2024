import React, { useEffect, useState } from "react";
import { Auth, User } from "firebase/auth";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { Firestore } from "firebase/firestore";
import {
	Backdrop,
	Box,
	Button,
	Divider,
	Grid,
	List,
	ListItem,
	ListItemText,
	Paper,
	Stack,
	TextField,
} from "@mui/material";
import { SignInRequired, useRequiredSignIn } from "./UseSignIn";
import LunchDiningIcon from "@mui/icons-material/LunchDining";
import Avatar from "@mui/material/Avatar";
import { FoodNutrientMap, NutrientProfile, combineFoodNutrientMaps, getNutrientValues, sumNutrients } from "./FoodParsing";

type FoodResponseType = {
	total: NutrientProfile,
	foods: FoodNutrientMap
};

export const Home = (props: { auth: Auth; firestore: Firestore }) => {
	const user = useRequiredSignIn(props.auth);

	return (
		<>
			<SignInRequired auth={props.auth} user={user}>
				<HomeSignedIn {...props} user={user!!} />
			</SignInRequired>
		</>
	);
};

const HomeSignedIn = (props: {
	auth: Auth;
	user: User;
	firestore: Firestore;
}) => {
	const navigate = useNavigate();
	const [foodInput, setFoodInput] = useState("");
	const [foods, setFoods] = useState<null | FoodResponseType>(null);

	return (
		<>
			<Grid
				container
				spacing={2}
				px={4}
				justifyContent={"center"}
				alignItems={"center"}
			>
				<Grid item xs={12} textAlign="center">
					<Stack
						direction="row"
						spacing={5}
						py={2}
						justifyContent="space-around"
					>
						<p>{/* Needed for space around */}</p>
						<h1>
							<span style={{ color: "#1EB36C" }}>Vit</span>
							<span style={{ color: "#C00F0F" }}>Alert</span>
						</h1>
						<Box
							display={"flex"}
							justifyContent={"center"}
							alignItems={"center"}
						>
							<Button onClick={() => signOut(props.auth, navigate)}>
								Sign Out
							</Button>
						</Box>
					</Stack>
				</Grid>
				<Grid item xs={12}>
					<Stack
						direction="row"
						spacing={2}
						alignItems={"center"}
						justifyContent={"center"}>
						<Stack>
							<Avatar>
								<LunchDiningIcon></LunchDiningIcon>
							</Avatar>
						</Stack>
						<TextField
							variant="standard"
							onChange={(e) => setFoodInput(e.currentTarget.value)}
							helperText="Ex. 1 apple, 1 slice pizza, 1 cup rice"
							label="Type food and amount"
							sx={{
								width: "75%",
							}}
						></TextField>
						<Button
							disabled={foodInput == ""}
							variant="contained"
							onClick={() =>
								parseFoodInput(props.firestore, props.user, foodInput, foods, setFoods)
							}>
							Submit
						</Button>
					</Stack>
				</Grid>
				<Grid item xs={12} lg={6}>
					<YourFoods foods={foods} setFoods={setFoods} />
				</Grid>
				<Grid item xs={12} lg={6}>
					<MissingNutrients />
				</Grid>
			</Grid>
		</>
	);
};

const YourFoods = (props: {
	foods: FoodResponseType | null,
	setFoods: (f: FoodResponseType | null) => void,
}) => {
	return (
		<>
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
							{props.foods !== null ? Array.from(props.foods.foods.entries())
								.map(set => {
									const key = set[0], value = set[1];
									return (<>
										<ListItemText key={key} primary={key + " " + value.quantity + " " + value.measure} />
									</>);
								}) : (<></>)}
						</List>
					</Grid>
				</Grid>
			</Paper>
		</>
	);
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

const signOut = (auth: Auth, navigate: NavigateFunction) => {
	auth.signOut();
	navigate("/");
};

const parseFoodInput = async (firestore: Firestore,
	user: User,
	input: string,
	foods: FoodResponseType | null,
	setFoods: (f: FoodResponseType | null) => void) => {
	let foodValues = await getNutrientValues(input);
	if (foods !== null)
		foodValues = combineFoodNutrientMaps(foods.foods, foodValues);
	const totals = sumNutrients(Array.from(foodValues.values()).map(v => v.nutrients));
	setFoods({
		total: totals,
		foods: foodValues
	});
};
