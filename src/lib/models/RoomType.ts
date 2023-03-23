import { Door } from './Door';
import type { FurnitureHotspots } from './FurnitureHotspot';

export interface RoomType {
	/** The name of the room type */
	name: string;
	/** The cost in gold to build a room of this type */
	cost: number;
	/** The minimum required construction level to build a room of this type */
	minLvl: number;
	/** The locations at which there are door hotspots to connect the room to its neighbours */
	doors: Door[];
	/** The color used for the background of rooms of this type */
	bg: string;
	/** The furniture hotspots that are available for building in this type of room */
	furnitureHotspots: FurnitureHotspots;
	/** The foreground color used for the name of the room, defaults to 'white' */
	color?: string;
	/** True if there are stairs present in the room, false (default) otherwise */
	stairs?: boolean;
	/** True if the room is open and does not support building above it, false (default) otherwise */
	open?: boolean;
	/** If present, acts as a whitelist limiting on which floors the room can be built */
	floors?: number[];
}

export const ROOM_TYPES: { [key: string]: RoomType } = {
	garden: {
		name: 'Garden',
		cost: 1000,
		minLvl: 1,
		doors: [Door.North, Door.East, Door.South, Door.West],
		bg: '#034a03',
		furnitureHotspots: {
			centrepiece: {
				name: 'Centrepiece',
				optionKeys: ['exit_portal', 'decorative_rock', 'pond', 'imp_statue', 'dungeon_entrance']
			},
			tree: {
				name: 'Tree',
				optionKeys: []
			},
			big_tree: {
				name: 'Big Tree',
				optionKeys: []
			},
			small_plant_1: {
				name: 'Small Plant 1',
				optionKeys: ['plant', 'small_fern', 'fern']
			},
			small_plant_2: {
				name: 'Small Plant 2',
				optionKeys: ['dock_leaf', 'thistle', 'reeds']
			},
			big_plant_1: {
				name: 'Big Plant 1',
				optionKeys: []
			},
			big_plant_2: {
				name: 'Big Plant 2',
				optionKeys: []
			}
		},
		open: true,
		floors: [0]
	},
	parlour: {
		name: 'Parlour',
		cost: 1000,
		minLvl: 1,
		doors: [Door.East, Door.South, Door.West],
		bg: '#424242',
		furnitureHotspots: {}
	},
	kitchen: {
		name: 'Kitchen',
		cost: 5000,
		minLvl: 5,
		doors: [Door.East, Door.South],
		bg: '#542808',
		furnitureHotspots: {}
	},
	dining_room: {
		name: 'Dining Room',
		cost: 5000,
		minLvl: 10,
		doors: [Door.East, Door.South, Door.West],
		bg: '#424242',
		furnitureHotspots: {}
	},
	workshop: {
		name: 'Workshop',
		cost: 10000,
		minLvl: 15,
		doors: [Door.North, Door.South],
		bg: '#542808',
		furnitureHotspots: {}
	},
	bedroom: {
		name: 'Bedroom',
		cost: 10000,
		minLvl: 20,
		doors: [Door.East, Door.South],
		bg: '#424242',
		furnitureHotspots: {}
	},
	skill_hall: {
		name: 'Skill Hall',
		cost: 15000,
		minLvl: 25,
		doors: [Door.North, Door.East, Door.South, Door.West],
		bg: '#3f0569',
		furnitureHotspots: {},
		stairs: true
	},
	games_room: {
		name: 'Games Room',
		cost: 25000,
		minLvl: 30,
		doors: [Door.East, Door.South, Door.West],
		bg: '#731e4c',
		furnitureHotspots: {}
	},
	combat_room: {
		name: 'Combat Room',
		cost: 25000,
		minLvl: 30,
		doors: [Door.East, Door.South, Door.West],
		bg: '#731e4c',
		furnitureHotspots: {}
	},
	quest_hall: {
		name: 'Quest Hall',
		cost: 25000,
		minLvl: 32,
		doors: [Door.North, Door.East, Door.South, Door.West],
		bg: '#3f0569',
		furnitureHotspots: {},
		stairs: true
	},
	menagerie: {
		name: 'Menagerie',
		cost: 30000,
		minLvl: 37,
		doors: [Door.North, Door.East, Door.South, Door.West],
		bg: '#034a03',
		furnitureHotspots: {},
		open: true,
		floors: [0]
	},
	study: {
		name: 'Study',
		cost: 50000,
		minLvl: 40,
		doors: [Door.East, Door.South, Door.West],
		bg: '#542808',
		furnitureHotspots: {}
	},
	costume_room: {
		name: 'Costume Room',
		cost: 50000,
		minLvl: 42,
		doors: [Door.South],
		bg: '#731e4c',
		furnitureHotspots: {}
	},
	chapel: {
		name: 'Chapel',
		cost: 50000,
		minLvl: 45,
		doors: [Door.East, Door.South],
		bg: '#542808',
		furnitureHotspots: {}
	},
	portal_chamber: {
		name: 'Portal Chamber',
		cost: 100000,
		minLvl: 50,
		doors: [Door.South],
		bg: '#542808',
		furnitureHotspots: {}
	},
	formal_garden: {
		name: 'Formal Garden',
		cost: 75000,
		minLvl: 55,
		doors: [Door.North, Door.East, Door.South, Door.West],
		bg: '#034a03',
		furnitureHotspots: {},
		open: true,
		floors: [0]
	},
	throne_room: {
		name: 'Throne Room',
		cost: 150000,
		minLvl: 60,
		doors: [Door.South],
		bg: '#040459',
		furnitureHotspots: {},
		floors: [0]
	},
	aquarium: {
		name: 'Aquarium',
		cost: 200000,
		minLvl: 63,
		doors: [Door.North, Door.East, Door.South, Door.West],
		bg: '#542808',
		furnitureHotspots: {},
		floors: [0]
	},
	oubliette: {
		name: 'Oubliette',
		cost: 150000,
		minLvl: 65,
		doors: [Door.North, Door.East, Door.South, Door.West],
		bg: '#800303',
		furnitureHotspots: {},
		floors: [-1]
	},
	dungeon_corridor: {
		name: 'Dungeon Corridor',
		cost: 7500,
		minLvl: 70,
		doors: [Door.North, Door.South],
		bg: '#800303',
		furnitureHotspots: {},
		floors: [-1]
	},
	dungeon_junction: {
		name: 'Dungeon Junction',
		cost: 7500,
		minLvl: 70,
		doors: [Door.North, Door.East, Door.South, Door.West],
		bg: '#800303',
		furnitureHotspots: {},
		floors: [-1]
	},
	dungeon_stairs: {
		name: 'Dungeon Stairs',
		cost: 7500,
		minLvl: 70,
		doors: [Door.North, Door.East, Door.South, Door.West],
		bg: '#800303',
		furnitureHotspots: {},
		stairs: true,
		floors: [-1]
	},
	dungeon_pit: {
		name: 'Dungeon Pit',
		cost: 10000,
		minLvl: 70,
		doors: [Door.North, Door.East, Door.South, Door.West],
		bg: '#800303',
		furnitureHotspots: {},
		floors: [-1]
	},
	treasure_room: {
		name: 'Treasure Room',
		cost: 250000,
		minLvl: 75,
		doors: [Door.South],
		bg: '#800303',
		furnitureHotspots: {},
		floors: [-1]
	}
};

export const ROOM_TYPES_LIST = Object.entries(ROOM_TYPES).sort(([, a], [, b]) =>
	a.name.localeCompare(b.name)
);
