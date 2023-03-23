export interface FurnitureType {
	name: string;
	minLvl: number;
	exp: number;
	materials: { [key: string]: number };
}

export const FURNITURE_TYPES: { [key: string]: FurnitureType } = {
	exit_portal: {
		name: 'Exit Portal',
		minLvl: 1,
		exp: 100,
		materials: {
			iron_bar: 10
		}
	},
	decorative_rock: {
		name: 'Decorative Rock',
		minLvl: 5,
		exp: 100,
		materials: {
			limestone_brick: 5
		}
	},
	pond: {
		name: 'Pond',
		minLvl: 10,
		exp: 100,
		materials: {
			soft_clay: 10
		}
	},
	imp_statue: {
		name: 'Imp Statue',
		minLvl: 15,
		exp: 150,
		materials: {
			limestone_brick: 5,
			soft_clay: 5
		}
	},
	dungeon_entrance: {
		name: 'Dungeon Entrance',
		minLvl: 70,
		exp: 500,
		materials: {
			marble_block: 1
		}
	},
	plant: {
		name: 'Plant',
		minLvl: 1,
		exp: 31,
		materials: {
			bagged_plant_1: 1
		}
	},
	small_fern: {
		name: 'Small Fern',
		minLvl: 6,
		exp: 70,
		materials: {
			bagged_plant_2: 1
		}
	},
	fern: {
		name: 'Fern',
		minLvl: 12,
		exp: 100,
		materials: {
			bagged_plant_3: 1
		}
	},
	dock_leaf: {
		name: 'Dock Leaf',
		minLvl: 1,
		exp: 31,
		materials: {
			bagged_plant_1: 1
		}
	},
	thistle: {
		name: 'Thistle',
		minLvl: 6,
		exp: 70,
		materials: {
			bagged_plant_2: 1
		}
	},
	reeds: {
		name: 'Reeds',
		minLvl: 12,
		exp: 100,
		materials: {
			bagged_plant_3: 1
		}
	}
};
