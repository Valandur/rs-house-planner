export interface FurnitureType {
	key: string;
	name: string;
	minLvl: number;
	exp: number;
	materials: { [key: string]: number };
}

export const FURNITURE_TYPES: FurnitureType[] = [
	{
		key: 'exit_portal',
		name: 'Exit Portal',
		minLvl: 1,
		exp: 100,
		materials: {
			iron_bar: 10
		}
	},
	{
		key: 'decorative_rock',
		name: 'Decorative Rock',
		minLvl: 5,
		exp: 100,
		materials: {
			limestone_brick: 5
		}
	},
	{
		key: 'pond',
		name: 'Pond',
		minLvl: 10,
		exp: 100,
		materials: {
			soft_clay: 10
		}
	},
	{
		key: 'imp_statue',
		name: 'Imp Statue',
		minLvl: 15,
		exp: 150,
		materials: {
			limestone_brick: 5,
			soft_clay: 5
		}
	},
	{
		key: 'dungeon_entrance',
		name: 'Dungeon Entrance',
		minLvl: 70,
		exp: 500,
		materials: {
			marble_block: 1
		}
	},
	{
		key: 'plant',
		name: 'Plant',
		minLvl: 1,
		exp: 31,
		materials: {
			bagged_plant_1: 1
		}
	},
	{
		key: 'small_fern',
		name: 'Small Fern',
		minLvl: 6,
		exp: 70,
		materials: {
			bagged_plant_2: 1
		}
	},
	{
		key: 'fern',
		name: 'Fern',
		minLvl: 12,
		exp: 100,
		materials: {
			bagged_plant_3: 1
		}
	},
	{
		key: 'dock_leaf',
		name: 'Dock Leaf',
		minLvl: 1,
		exp: 31,
		materials: {
			bagged_plant_1: 1
		}
	},
	{
		key: 'thistle',
		name: 'Thistle',
		minLvl: 6,
		exp: 70,
		materials: {
			bagged_plant_2: 1
		}
	},
	{
		key: 'reeds',
		name: 'Reeds',
		minLvl: 12,
		exp: 100,
		materials: {
			bagged_plant_3: 1
		}
	}
];

const map: Map<string, FurnitureType> = new Map();
for (const type of FURNITURE_TYPES) {
	if (map.has(type.key)) {
		throw new Error(`Duplicate furniture type ${type.key}`);
	}
	map.set(type.key, type);
}

export const getFurnitureTypeByKey = (key: string): FurnitureType => {
	const type = map.get(key);
	if (!type) {
		throw new Error(`Unknown furniture type ${key}`);
	}
	return type;
};
