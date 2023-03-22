import { Door } from './Door';

export interface RoomType {
	/** The name of the room */
	name: string;
	/** The cost in gold to build the room */
	cost: number;
	/** The minimum required construction level to build the room */
	minLvl: number;
	/** The locations at which there are door hotspots to connect the room to its neighbours */
	doors: Door[];
	/** The color used for the background of the room */
	bg: string;
	/** The foreground color used for the name of the room, defaults to 'white' */
	color?: string;
	/** True if there are stairs present in the room, false otherwise */
	stairs?: boolean;
	/** True if the room is open and does not support building above it, false otherwise */
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
		bg: 'darkgreen',
		open: true,
		floors: [0]
	},
	parlour: {
		name: 'Parlour',
		cost: 1000,
		minLvl: 1,
		doors: [Door.East, Door.South, Door.West],
		bg: '#faebd7',
		color: 'black'
	},
	kitchen: {
		name: 'Kitchen',
		cost: 5000,
		minLvl: 5,
		doors: [Door.East, Door.South],
		bg: '#8b4513'
	},
	dining_room: {
		name: 'Dining Room',
		cost: 5000,
		minLvl: 10,
		doors: [Door.East, Door.South, Door.West],
		bg: '#faebd7',
		color: 'black'
	},
	workshop: {
		name: 'Workshop',
		cost: 10000,
		minLvl: 15,
		doors: [Door.North, Door.South],
		bg: '#8b4513'
	},
	bedroom: {
		name: 'Bedroom',
		cost: 10000,
		minLvl: 20,
		doors: [Door.East, Door.South],
		bg: '#faebd7',
		color: 'black'
	},
	skill_hall: {
		name: 'Skill Hall',
		cost: 15000,
		minLvl: 25,
		doors: [Door.North, Door.East, Door.South, Door.West],
		bg: 'indigo',
		stairs: true
	},
	games_room: {
		name: 'Games Room',
		cost: 25000,
		minLvl: 30,
		doors: [Door.East, Door.South, Door.West],
		bg: '#8b008b'
	},
	combat_room: {
		name: 'Combat Room',
		cost: 25000,
		minLvl: 30,
		doors: [Door.East, Door.South, Door.West],
		bg: '#8b008b'
	},
	quest_hall: {
		name: 'Quest Hall',
		cost: 25000,
		minLvl: 32,
		doors: [Door.North, Door.East, Door.South, Door.West],
		bg: 'indigo',
		stairs: true
	},
	menagerie: {
		name: 'Menagerie',
		cost: 30000,
		minLvl: 37,
		doors: [Door.North, Door.East, Door.South, Door.West],
		bg: 'darkgreen',
		open: true,
		floors: [0]
	},
	study: {
		name: 'Study',
		cost: 50000,
		minLvl: 40,
		doors: [Door.East, Door.South, Door.West],
		bg: '#8b4513'
	},
	costume_room: {
		name: 'Costume Room',
		cost: 50000,
		minLvl: 42,
		doors: [Door.South],
		bg: '#8b008b'
	},
	chapel: {
		name: 'Chapel',
		cost: 50000,
		minLvl: 45,
		doors: [Door.East, Door.South],
		bg: '#8b4513'
	},
	portal_chamber: {
		name: 'Portal Chamber',
		cost: 100000,
		minLvl: 50,
		doors: [Door.South],
		bg: '#48d1cc',
		color: 'black'
	},
	formal_garden: {
		name: 'Formal Garden',
		cost: 75000,
		minLvl: 55,
		doors: [Door.North, Door.East, Door.South, Door.West],
		bg: 'darkgreen',
		open: true,
		floors: [0]
	},
	throne_room: {
		name: 'Throne Room',
		cost: 150000,
		minLvl: 60,
		doors: [Door.South],
		bg: 'darkblue',
		floors: [0]
	},
	aquarium: {
		name: 'Aquarium',
		cost: 200000,
		minLvl: 63,
		doors: [Door.North, Door.East, Door.South, Door.West],
		bg: '#8b4513',
		floors: [0]
	},
	oubliette: {
		name: 'Oubliette',
		cost: 150000,
		minLvl: 65,
		doors: [Door.North, Door.East, Door.South, Door.West],
		bg: '#b22222',
		floors: [-1]
	},
	dungeon_corridor: {
		name: 'Dungeon Corridor',
		cost: 7500,
		minLvl: 70,
		doors: [Door.North, Door.South],
		bg: '#b22222',
		floors: [-1]
	},
	dungeon_junction: {
		name: 'Dungeon Junction',
		cost: 7500,
		minLvl: 70,
		doors: [Door.North, Door.East, Door.South, Door.West],
		bg: '#b22222',
		floors: [-1]
	},
	dungeon_stairs: {
		name: 'Dungeon Stairs',
		cost: 7500,
		minLvl: 70,
		doors: [Door.North, Door.East, Door.South, Door.West],
		bg: '#b22222',
		stairs: true,
		floors: [-1]
	},
	dungeon_pit: {
		name: 'Dungeon Pit',
		cost: 10000,
		minLvl: 70,
		doors: [Door.North, Door.East, Door.South, Door.West],
		bg: '#b22222',
		floors: [-1]
	},
	treasure_room: {
		name: 'Treasure Room',
		cost: 250000,
		minLvl: 75,
		doors: [Door.South],
		bg: '#ffe135',
		color: 'black',
		floors: [-1]
	}
};

export const ROOM_TYPES_LIST = Object.entries(ROOM_TYPES).sort(([, a], [, b]) =>
	a.name.localeCompare(b.name)
);
