import React, { useEffect } from "react";

export type NutrientProfile = Map<Nutrient, UnitValue>;
export type FoodNutrientMap = Map<string, FoodInfo>;

export interface FoodInfo {
	name: string,
	quantity: number,
	measure: string,
	nutrients: NutrientProfile,
}

export interface UnitValue {
	unit: string,
	label: string,
	quantity: number,
};

export enum Nutrient {
	Calories = "ENERC_KCAL",
	Fat = "FAT",
	SaturatedFat = "FASAT",
	MonosaturatedFat = "FAMS",
	PolyunsaturatedFat = "FAPU",
	Carbohydrate = "CHOCDF",
	NetCarbohydrate = "CHOCDF.net",
	Fiber = "FIBTG",
	Sugar = "SUGAR",
	Protein = "PROCNT",
	Cholesterol = "CHOLE",
	Sodium = "NA",
	Calcium = "CA",
	Magnesium = "MG",
	Potassium = "K",
	Iron = "FE",
	Zinc = "ZN",
	Phosphorus = "P",
	VitaminA = "VITA_RAE",
	VitaminC = "VITC",
	Thiamin = "THIA",
	Riboflavin = "RIBF",
	Niacin = "NIA",
	VitaminB6 = "VITB6A",
	FolateTotal = "FOLFE",
	FolateFood = "FOLFD",
	FolicAcid = "FOLAC",
	VitaminB12 = "VITB12",
	VitaminD = "VITD",
	VitaminE = "TOCPHA",
	VitaminK = "VITK1",
	Water = "WATER",
}

const edamamConfig = {
	api_id: process.env.REACT_APP_nutritionAnalysisId,
	api_key: process.env.REACT_APP_nutritionAnalysisKey
};

export const getNutrientValues = async (input: string): Promise<FoodNutrientMap> => {
	const nutrients = input.split(/\s*,\s*/gm).filter(v => v.length != 0);
	const responses: FoodNutrientMap = new Map();
	// This could be faster but I want to save time
	for (let i = 0; i < nutrients.length; ++i) {
		const n = nutrients[i];
		const response = await fetch(`https://api.edamam.com/api/nutrition-data?app_id=${edamamConfig.api_id}&app_key=${edamamConfig.api_key}&nutrition-type=cooking&ingr=${n}`, {
			method: "GET"
		});
		const foodNutrients: NutrientProfile = new Map();
		const json = await response.json();
		Object.entries(Nutrient)
			.forEach(v => {
				const nutrientUnitValue = json["totalNutrients"][v[1]] as UnitValue | undefined;
				if (nutrientUnitValue !== undefined)
					foodNutrients.set(v[0] as Nutrient, nutrientUnitValue);
			});
		const parsedJson = json["ingredients"][0]["parsed"][0];
		const foodName = parsedJson["foodMatch"];
		const foodQuantity = parsedJson["quantity"];
		const foodMeasure = parsedJson["measure"];
		const foodInfo: FoodInfo = {
			name: foodName,
			quantity: foodQuantity,
			measure: foodMeasure,
			nutrients: foodNutrients
		};
		responses.set(foodName + " (" + foodMeasure + ")", foodInfo);
	}
	return responses;
}

export const sumNutrients = (input: Array<NutrientProfile>): NutrientProfile => {
	const sum: NutrientProfile = new Map();
	input.forEach(profile => {
		profile.forEach((value: UnitValue, key: Nutrient) => {
			const prevValue = sum.get(key);
			if (prevValue !== undefined && prevValue.unit !== value.unit)
				console.error("UNIT MISMATCH: " + JSON.stringify(prevValue) + JSON.stringify(value));
			sum.set(key, prevValue === undefined ? {
				unit: value.unit,
				quantity: value.quantity,
				label: value.label,
			} : {
				unit: prevValue.unit,
				quantity: prevValue.quantity + value.quantity,
				label: prevValue.label,
			});
		});
	});
	return sum;
}

export const combineFoodNutrientMaps = (a: FoodNutrientMap, b: FoodNutrientMap): FoodNutrientMap => {
	const ret: FoodNutrientMap = new Map();
	a.forEach((value, key) => {
		ret.set(key, value);
	});
	b.forEach((value, key) => {
		const prevVal = ret.get(key);
		if (prevVal !== undefined)
			ret.set(key, {
				nutrients: sumNutrients([prevVal.nutrients, value.nutrients]),
				name: prevVal.name,
				measure: prevVal.measure,
				quantity: prevVal.quantity + value.quantity
			});
		else
			ret.set(key, value);
	});
	return ret;
}