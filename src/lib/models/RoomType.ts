import { Door } from './Door';
import type { Hotspot } from './Hotspot';

export interface RoomType {
	/** The key used to identify this room type */
	key: string;
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
	hotspots: Hotspot[];
	/** The foreground color used for the name of the room, defaults to 'white' */
	color?: string;
	/** True if there are stairs present in the room, false (default) otherwise */
	stairs?: boolean;
	/** True if the room is open and does not support building above it, false (default) otherwise */
	open?: boolean;
	/** If present, acts as a whitelist limiting on which floors the room can be built */
	floors?: number[];
}

export const ROOM_TYPES: RoomType[] = [
	{
		key: 'garden',
		name: 'Garden',
		cost: 1000,
		minLvl: 1,
		doors: [Door.North, Door.East, Door.South, Door.West],
		bg: '#034a03',
		hotspots: [
			{
				name: 'Centrepiece',
				options: ['exit_portal', 'decorative_rock', 'pond', 'imp_statue', 'dungeon_entrance']
			},
			{
				name: 'Tree',
				options: []
			},
			{
				name: 'Big Tree',
				options: []
			},
			{
				name: 'Small Plant 1',
				options: ['plant', 'small_fern', 'fern']
			},
			{
				name: 'Small Plant 2',
				options: ['dock_leaf', 'thistle', 'reeds']
			},
			{
				name: 'Big Plant 1',
				options: []
			},
			{
				name: 'Big Plant 2',
				options: []
			}
		],
		open: true,
		floors: [0]
	},
	{
		key: 'parlour',
		name: 'Parlour',
		cost: 1000,
		minLvl: 1,
		doors: [Door.East, Door.South, Door.West],
		bg: '#424242',
		hotspots: []
	},
	{
		key: 'kitchen',
		name: 'Kitchen',
		cost: 5000,
		minLvl: 5,
		doors: [Door.East, Door.South],
		bg: '#542808',
		hotspots: []
	},
	{
		key: 'dining_room',
		name: 'Dining Room',
		cost: 5000,
		minLvl: 10,
		doors: [Door.East, Door.South, Door.West],
		bg: '#424242',
		hotspots: []
	},
	{
		key: 'workshop',
		name: 'Workshop',
		cost: 10000,
		minLvl: 15,
		doors: [Door.North, Door.South],
		bg: '#542808',
		hotspots: []
	},
	{
		key: 'bedroom',
		name: 'Bedroom',
		cost: 10000,
		minLvl: 20,
		doors: [Door.East, Door.South],
		bg: '#424242',
		hotspots: []
	},
	{
		key: 'skill_hall',
		name: 'Skill Hall',
		cost: 15000,
		minLvl: 25,
		doors: [Door.North, Door.East, Door.South, Door.West],
		bg: '#3f0569',
		hotspots: [],
		stairs: true
	},
	{
		key: 'games_room',
		name: 'Games Room',
		cost: 25000,
		minLvl: 30,
		doors: [Door.East, Door.South, Door.West],
		bg: '#731e4c',
		hotspots: []
	},
	{
		key: 'combat_room',
		name: 'Combat Room',
		cost: 25000,
		minLvl: 30,
		doors: [Door.East, Door.South, Door.West],
		bg: '#731e4c',
		hotspots: []
	},
	{
		key: 'quest_hall',
		name: 'Quest Hall',
		cost: 25000,
		minLvl: 32,
		doors: [Door.North, Door.East, Door.South, Door.West],
		bg: '#3f0569',
		hotspots: [],
		stairs: true
	},
	{
		key: 'menagerie',
		name: 'Menagerie',
		cost: 30000,
		minLvl: 37,
		doors: [Door.North, Door.East, Door.South, Door.West],
		bg: '#034a03',
		hotspots: [],
		open: true,
		floors: [0]
	},
	{
		key: 'study',
		name: 'Study',
		cost: 50000,
		minLvl: 40,
		doors: [Door.East, Door.South, Door.West],
		bg: '#542808',
		hotspots: []
	},
	{
		key: 'costume_room',
		name: 'Costume Room',
		cost: 50000,
		minLvl: 42,
		doors: [Door.South],
		bg: '#731e4c',
		hotspots: []
	},
	{
		key: 'chapel',
		name: 'Chapel',
		cost: 50000,
		minLvl: 45,
		doors: [Door.East, Door.South],
		bg: '#542808',
		hotspots: []
	},
	{
		key: 'portal_chamber',
		name: 'Portal Chamber',
		cost: 100000,
		minLvl: 50,
		doors: [Door.South],
		bg: '#542808',
		hotspots: []
	},
	{
		key: 'formal_garden',
		name: 'Formal Garden',
		cost: 75000,
		minLvl: 55,
		doors: [Door.North, Door.East, Door.South, Door.West],
		bg: '#034a03',
		hotspots: [],
		open: true,
		floors: [0]
	},
	{
		key: 'throne_room',
		name: 'Throne Room',
		cost: 150000,
		minLvl: 60,
		doors: [Door.South],
		bg: '#040459',
		hotspots: [],
		floors: [0]
	},
	{
		key: 'aquarium',
		name: 'Aquarium',
		cost: 200000,
		minLvl: 63,
		doors: [Door.North, Door.East, Door.South, Door.West],
		bg: '#542808',
		hotspots: [],
		floors: [0]
	},
	{
		key: 'oubliette',
		name: 'Oubliette',
		cost: 150000,
		minLvl: 65,
		doors: [Door.North, Door.East, Door.South, Door.West],
		bg: '#800303',
		hotspots: [],
		floors: [-1]
	},
	{
		key: 'dungeon_corridor',
		name: 'Dungeon Corridor',
		cost: 7500,
		minLvl: 70,
		doors: [Door.North, Door.South],
		bg: '#800303',
		hotspots: [],
		floors: [-1]
	},
	{
		key: 'dungeon_junction',
		name: 'Dungeon Junction',
		cost: 7500,
		minLvl: 70,
		doors: [Door.North, Door.East, Door.South, Door.West],
		bg: '#800303',
		hotspots: [],
		floors: [-1]
	},
	{
		key: 'dungeon_stairs',
		name: 'Dungeon Stairs',
		cost: 7500,
		minLvl: 70,
		doors: [Door.North, Door.East, Door.South, Door.West],
		bg: '#800303',
		hotspots: [],
		stairs: true,
		floors: [-1]
	},
	{
		key: 'dungeon_pit',
		name: 'Dungeon Pit',
		cost: 10000,
		minLvl: 70,
		doors: [Door.North, Door.East, Door.South, Door.West],
		bg: '#800303',
		hotspots: [],
		floors: [-1]
	},
	{
		key: 'treasure_room',
		name: 'Treasure Room',
		cost: 250000,
		minLvl: 75,
		doors: [Door.South],
		bg: '#800303',
		hotspots: [],
		floors: [-1]
	}
];

const map: Map<string, RoomType> = new Map();
for (const type of ROOM_TYPES) {
	if (map.has(type.key)) {
		throw new Error(`Duplicate room type ${type.key}`);
	}
	map.set(type.key, type);
}

export const getRoomTypeByKey = (key: string): RoomType => {
	const type = map.get(key);
	if (!type) {
		throw new Error(`Unknown room type ${key}`);
	}
	return type;
};
