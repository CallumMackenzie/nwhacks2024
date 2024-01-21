import { useNavigate, useParams } from "react-router-dom";
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

// https://vitalert.com?nutrient="Vitamin A"
// http://localhost:3000/nutrient?nutrient=%22Vitamin%20A%22
// nutrient = "Vitamin A"
// Find index of Vitamin A in json
// Get the data for the other fields (function, symptoms)
// Put them in UI nicely


const itemData = [
  {
    img: 'https://source.unsplash.com/person-pours-milk-into-glass-_8bnn1GqX70', // start of Vitamin A
    title: 'Milk',
  },
  {
    img: 'https://source.unsplash.com/person-holding-brown-egg-on-green-ceramic-bowl-onxjrr3Erwc',
    title: 'Egg',
  },
  {
    img: 'https://source.unsplash.com/brown-ceramic-bowl-with-brown-and-white-beans-UD_hXnHe5ZI',
    title: 'Cereal',
  },
  {
      img: 'https://source.unsplash.com/orange-fruits-on-white-ceramic-plate-A4BBdJQu2co',
      title: 'Orange'
  },
  {
      img: 'https://source.unsplash.com/close-up-photo-of-vegetable-salad--ftWfohtjNw',
      title: 'Salad'
  },
  {
      img: 'https://source.unsplash.com/orange-carrots-on-green-grass-GHRT9j21m2M', // end of Vitamin A
      title: 'Carrot'
  },
  {
    // ommitted ALPHA LIPOIC ACID
    // ommitted ASPARAGINE
    // ommitted BIOTIN

    img: 'https://source.unsplash.com/green-broccoli-on-white-ceramic-plate-jSQxj-Ug0H8', // start of CA (Calcium)
    title: 'Brocolli'
},
{
    img: 'https://source.unsplash.com/green-lettuce-on-red-plastic-container-ipCEymapISc', 
    title: 'Cabbage'
}, 
{
    img: 'https://source.unsplash.com/a-large-pile-of-nuts-sitting-next-to-each-other-gXLFAWv4TCc',
    title: 'Hazelnuts'
},
{
    img: 'https://source.unsplash.com/sliced-fruit-on-black-ceramic-plate-3PNVc3O7Gb4',
    title: 'Oysters'  
  },
  {
    img: 'https://source.unsplash.com/fresh-frozen-anchovy-on-shelves-of-huge-industrial-refrigerator-sib5507yIBA',
    title: 'Sardines'  
  },
  {
    img: 'https://source.unsplash.com/two-black-and-white-dairy-cows-looking-on-white-bottles-ru4jyDiLHsI',
    title: 'Dairy'  
  },
]



export const NutrientView = (props: {
}) => {
	const navigate = useNavigate();
	// nutrient is the value of the nutrient query parameter
	const { nutrient } = useParams();
	// const nutrient = "VITAMIN A";
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
	let sourceList = source.split(",");
	sourceList = sourceList.map((data) => (data.trim().toLowerCase()));
	console.log(sourceList);
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
        <Card variant="outlined" style={{ margin: 'auto', maxWidth: 400 }}>
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
				{itemData.map((item) => (
					<ImageListItem key={item.img}>
						<img
							srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
							src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
							alt={item.title}
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
