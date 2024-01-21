import { useParams } from "react-router-dom";
import {
	Backdrop,
	Box,
	Button,
	Container,
	Divider,
	Grid,
	List,
	ListItem,
	Paper,
	Stack,
	TextField,
	Card, 
	CardContent, 
	Typography
} from "@mui/material";

import symptomsJson from "./data/symptoms2.json";

// https://vitalert.com?nutrient="Vitamin A"
// nutrient = "Vitamin A"
// Find index of Vitamin A in json
// Get the data for the other fields (function, symptoms)
// Put them in UI nicely

export const NutrientView = (props: {
}) => {
	// nutrient is the value of the nutrient query parameter
	// const { nutrient } = useParams();
	const nutrient = "VITAMIN A";
	let index = 0;
	for(let i=0; i<symptomsJson.Name.length; i++){
		if (symptomsJson.Name[i] === nutrient){
			index = i;
			break;
		}
	}
	console.log(index);
	const rarity = symptomsJson.Rarity[index];
	const func = symptomsJson.Function[index];
	const symp = symptomsJson.Symptoms[index];
	const source = symptomsJson.Sources[index];
	return (<>
	<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', paddingTop: '50px' }}>
		<Card variant="outlined" style={{ margin: 'auto', maxWidth: 400 }}>
      	<CardContent>
        	<Typography variant="h2" component="div" align="center" gutterBottom>
          		{nutrient}
        	</Typography>
        	<Typography color="textSecondary" align="center" gutterBottom>
          		<strong>Rarity:</strong> {rarity}
        	</Typography>
        	<Typography color="textSecondary" align="center" gutterBottom>
          		<strong>Symptoms:</strong> {symp}
        	</Typography>
        	<Typography color="textSecondary" align="center">
          		<strong>Food Resource:</strong> {source}
        	</Typography>
      	</CardContent>
    	</Card>
	</div>
	</>);
};