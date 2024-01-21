import React, { useEffect, useRef, useState } from "react";
import { Auth, User } from "firebase/auth";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { Firestore } from "firebase/firestore";
import {
	Backdrop,
	Box,
	Button,
	Divider,
	Grid,
	IconButton,
	List,
	ListItem,
	ListItemButton,
	ListItemText,
	Paper,
	Stack,
	TextField,
	Tooltip,
	Typography,
} from "@mui/material";
import { SignInRequired, useRequiredSignIn } from "./UseSignIn";
import LunchDiningIcon from "@mui/icons-material/LunchDining";
import Avatar from "@mui/material/Avatar";
import { FoodNutrientMap, Nutrient, NutrientProfile, combineFoodNutrientMaps, getNutrientCommonName, getNutrientValues, getSymptomData, removeNutrient, sortByDailyValue, sumNutrients } from "./FoodParsing";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { AdsClick, Delete, DeleteTwoTone } from "@mui/icons-material";
import { fetchOrCreate, save } from "./FirebaseUtils";

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

	useEffect(() => {
		(async () => {
			const val = await fetchOrCreate<FoodResponseType>(props.firestore, "/userdata", props.user.uid, () => ({
				total: new Map(),
				foods: new Map()
			}));
			setFoods(val);
		})();
	}, []);

	useEffect(() => {
		(async () => {
			if (foods !== null)
				await save(props.firestore, "/userdata", props.user.uid, foods);
		})();
	}, [foods]);

	return (
		<>
			<Grid
				container
				spacing={2}
				px={4}
				justifyContent={"center"}
				alignItems={'flex-start'}
			>
				<Grid item xs={12} textAlign="center">
					<Stack
						direction="row"
						spacing={5}
						py={2}
						justifyContent="space-around"
					>
						<Box
							display={"flex"}
							justifyContent={"center"}
							alignItems={"center"}
						>
							<Typography sx={{
								fontSize: '0.6em'
							}}>
								Welcome, {props.user.displayName}!
							</Typography>
						</Box>
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
							onKeyDown={e => {
								if (e.keyCode === 13)
									parseFoodInput(props.firestore, props.user, foodInput, setFoodInput, foods, setFoods)
							}}
							variant="filled"
							value={foodInput}
							placeholder="1 apple, 1 slice pizza, 1 cup rice"
							onChange={(e) => setFoodInput(e.currentTarget.value)}
							label={<span style={{ color: 'white' }}>Type <span style={{ color: "#1EB36C" }}>food</span> and <span style={{ color: "#C00F0F" }}>amount . . .</span></span>}
							sx={{
								width: "75%",
							}}
						></TextField>
						<Button
							disabled={foodInput == ""}
							variant="contained"
							onClick={() =>
								parseFoodInput(props.firestore, props.user, foodInput, setFoodInput, foods, setFoods)
							}>
							Submit
						</Button>
					</Stack>
				</Grid>
				<Grid item xs={12} lg={6}>
					<YourFoods foods={foods} setFoods={setFoods} />
				</Grid>
				<Grid item xs={12} lg={6}>
					<MissingNutrients foods={foods} />
				</Grid>
			</Grid>
		</>
	);
};

const YourFoods = (props: {
	foods: FoodResponseType | null,
	setFoods: (f: FoodResponseType | null) => void,
}) => {
	interface Row {
		id: string,
		measure: string,
		quantity: number
	}

	const [rows, setRows] = useState<Array<Row>>([]);

	useEffect(() => {
		if (props.foods === null)
			return setRows([]);
		const r = Array.from(props.foods.foods)
			.map(set => {
				const key = set[0], value = set[1];
				return ({
					id: key,
					measure: value.measure,
					quantity: value.quantity,
				});
			});
		setRows(r);
	}, [props.foods]);

	return (
		<>
			<Paper>
				<Grid container p={3} alignItems={'flex-start'}>
					<Grid item xs={12}>
						<h2>Your Foods . . .</h2>
					</Grid>
					<Grid item xs={12} paddingBottom={2} >
						<Divider />
					</Grid>
					<Grid item xs={12}>
						<List sx={{
							overflowY: 'scroll',
							height: '41vh'
						}}>
							{rows.map(row => {
								return (<>
									<ListItem
										key={row.id}
										secondaryAction={
											<IconButton edge="end" aria-label="delete"
												onClick={() => {
													if (props.foods === null)
														return;
													const newNutrientList = removeNutrient(props.foods?.foods, row.id);
													const newTotal = sumNutrients(Array.from(newNutrientList.values()).map(x => x.nutrients));
													props.setFoods({
														total: newTotal, foods: newNutrientList
													});
												}}>
												<Delete sx={{
													color: 'white'
												}} />
											</IconButton>
										}>
										<ListItemText key={row.id}>
											{row.id} {row.quantity}
										</ListItemText>
									</ListItem>
								</>);
							})}
						</List>
					</Grid>
				</Grid>
			</Paper >
		</>
	);
};

const MissingNutrients = (props: {
	foods: FoodResponseType | null,
}) => {
	const navigate = useNavigate();

	interface Row {
		id: string,
		percentDaily: number,
		value: number,
		unit: string
	}

	const [rows, setRows] = useState<Array<Row>>([]);

	useEffect(() => {
		if (props.foods == null)
			return setRows([]);
		const belowVal = sortByDailyValue(props.foods.total).map(x => ({
			id: getNutrientCommonName(x[0]),
			percentDaily: Number(x[1].percentDaily?.toPrecision(3)),
			value: Number(x[1].quantity.toPrecision(3)),
			unit: x[1].unit
		})).filter(x => !isNaN(x.value) && !isNaN(x.percentDaily));
		setRows(belowVal);
	}, [props.foods]);

	return (<>
		<Paper>
			<Grid container p={3}>
				<Grid item xs={12}>
					<h2>You may be deficient in . . .</h2>
				</Grid>
				<Grid item xs={12} paddingBottom={2}>
					<Divider />
				</Grid>
				<Grid
					item xs={12}>
					<List sx={{
						overflowY: 'scroll',
						height: '41vh'
					}}>
						{rows.map(row => {
							return (<>
								<ListItem
									key={row.id}
									secondaryAction={
										<Tooltip title={"Information on " + row.id}>
											<ListItemButton key={row.id}
												disabled={getSymptomData(row.id) === undefined}
												onClick={() => {
													navigate(`/nutrient?nutrient=${row.id}`);
												}}>
												<AdsClick />
											</ListItemButton>
										</Tooltip>
									}>
									<ListItemText key={row.id}
										secondary={
											<React.Fragment>
												{getSymptomData(row.id)?.symptoms}
											</React.Fragment>
										}>
										{row.id} {row.value} {row.unit}, daily intake: {row.percentDaily}%
									</ListItemText>
								</ListItem >
							</>);
						})}
					</List>
				</Grid>
			</Grid>
		</Paper >
	</>);
};

const signOut = (auth: Auth, navigate: NavigateFunction) => {
	auth.signOut();
	navigate("/");
};

const parseFoodInput = async (firestore: Firestore,
	user: User,
	input: string,
	setInput: (s: string) => void,
	foods: FoodResponseType | null,
	setFoods: (f: FoodResponseType | null) => void) => {
	setInput("");
	let foodValues = await getNutrientValues(input);
	if (foods !== null)
		foodValues = combineFoodNutrientMaps(foods.foods, foodValues);
	const totals = sumNutrients(Array.from(foodValues.values()).map(v => v.nutrients));
	setFoods({
		total: totals,
		foods: foodValues
	});
};
