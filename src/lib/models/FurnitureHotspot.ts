export interface FurnitureHotspot {
	name: string;
	optionKeys: string[];
}

export interface FurnitureHotspots {
	[key: string]: FurnitureHotspot;
}
