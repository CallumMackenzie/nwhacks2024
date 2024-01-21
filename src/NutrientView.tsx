import { useNavigate, useParams, useLocation } from "react-router-dom";
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
	Typography,
	ImageList,
	ImageListItem
} from "@mui/material";

import symptomsJson from "./data/symptoms2.json";
import foodJson from "./data/foodImage.json";

// https://vitalert.com?nutrient="Vitamin A"
// http://localhost:3000/nutrient?nutrient=%22Vitamin%20A%22
// nutrient = "Vitamin A"
// Find index of Vitamin A in json
// Get the data for the other fields (function, symptoms)
// Put them in UI nicely

export const NutrientView = (props: {
}) => {
	const navigate = useNavigate();
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const nutrient = queryParams.get('nutrient');

	// console.log(nutrient);

	// nutrient is the value of the nutrient query parameter
	// const { nutrient } = useParams();



	// const nutrient = "ALPHA LIPOIC ACID";
	let index = -1;
	for (let i = 0; i < symptomsJson.Name.length; i++) {
		if (symptomsJson.Name[i] === nutrient) {
			index = i;
			break;
		}
	}
	if (index == -1)
		return (<>
			<Stack spacing='2' direction={'column'} alignItems={'center'}>
				<h2>Not found: {nutrient}!</h2>
				<Button onClick={() => navigate("/home")}>Home</Button>
			</Stack>
		</>);
	const rarity = symptomsJson.Rarity[index];
	const func = symptomsJson.Function[index];
	const symp = symptomsJson.Symptoms[index];
	const source = symptomsJson.Sources[index];
	let itemData: any = [];
	let sourceList = source.split(",");
	sourceList = sourceList.map((data) => (data.trim().toLowerCase()));
	console.log(sourceList);
	sourceList.forEach((item) => {
		if (Object.hasOwn(foodJson,item)){
			itemData.push(foodJson[item as keyof typeof foodJson]);
		}
	})
	let colorString: string;
	
	if (rarity === "MOST COMMON") {
		colorString = "green";
	} else if (rarity === "VERY COMMON") {
		colorString = "cyan";
	} else if (rarity === "COMMON") {
		colorString = "orange";
	} else if (rarity === "LESS COMMON") {
		colorString = "yellow";
	} 
	else {
		colorString = "red";
	}
	
  	return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', paddingTop: '50px' }}>
        <Card variant="outlined" style={{ margin: 'auto', maxWidth: 600 }}>
          	<CardContent>
            	<Typography variant="h2" component="div" align="center" gutterBottom style={{ fontSize: '3.0rem' }}>
              		{nutrient}
            	</Typography>
            	<Typography color={colorString} align="center" gutterBottom style={{ fontSize: '2.0rem' }}>
              		<strong>Rarity:</strong> {rarity}
            	</Typography>
            	<Typography color="textSecondary" align="center" gutterBottom style={{ fontSize: '2.0rem' }}>
              		<strong>Symptoms:</strong> {symp}
            	</Typography>
            	<Typography color="textSecondary" align="center" style={{ fontSize: '2.0rem' }}>
              		<strong>Nutrient Resource:</strong> {source}
            	</Typography>
          	</CardContent>

		  	 <ImageList sx={{ width: 600, height: 300 }} cols={3} rowHeight={164}>
			   	{itemData.map((item: any) => (
					<ImageListItem key={item}>
						<img
							srcSet={`${item}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
							src={`${item}?w=164&h=164&fit=crop&auto=format`}
							loading="lazy"
						/>
					</ImageListItem>
				))}
			</ImageList>
        </Card>
      </div>
    </>
  	);
};
