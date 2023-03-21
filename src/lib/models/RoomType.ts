import { Door } from './Door';

export interface RoomType {
	name: string;
	cost: number;
	minLvl: number;
	doors: Door[];
	stairs: boolean;
	open: boolean;
	bg: string;
}

export const ROOM_TYPES: { [key: string]: RoomType } = {
	garden: {
		name: 'Garden',
		cost: 1000,
		minLvl: 1,
		doors: [Door.North, Door.East, Door.South, Door.West],
		stairs: false,
		open: true,
		bg: 'green'
	},
	parlour: {
		name: 'Parlour',
		cost: 1000,
		minLvl: 1,
		doors: [Door.East, Door.South, Door.West],
		stairs: false,
		open: false,
		bg: 'gray'
	},
	kitchen: {
		name: 'Kitchen',
		cost: 5000,
		minLvl: 5,
		doors: [Door.East, Door.South],
		stairs: false,
		open: false,
		bg: 'gray'
	},
	dining_room: {
		name: 'Dining Room',
		cost: 5000,
		minLvl: 10,
		doors: [Door.East, Door.South, Door.West],
		stairs: false,
		open: false,
		bg: 'gray'
	},
	workshop: {
		name: 'Workshop',
		cost: 10000,
		minLvl: 15,
		doors: [Door.North, Door.South],
		stairs: false,
		open: false,
		bg: 'gray'
	},
	bedroom: {
		name: 'Bedroom',
		cost: 10000,
		minLvl: 20,
		doors: [Door.East, Door.South],
		stairs: false,
		open: false,
		bg: 'darkred'
	},
	skill_hall: {
		name: 'Skill Hall',
		cost: 15000,
		minLvl: 25,
		doors: [Door.North, Door.East, Door.South, Door.West],
		stairs: true,
		open: false,
		bg: 'midnightblue'
	},
	games_room: {
		name: 'Games Room',
		cost: 25000,
		minLvl: 30,
		doors: [Door.East, Door.South, Door.West],
		stairs: false,
		open: false,
		bg: 'darkorange'
	},
	combat_room: {
		name: 'Combat Room',
		cost: 25000,
		minLvl: 30,
		doors: [Door.East, Door.South, Door.West],
		stairs: false,
		open: false,
		bg: 'red'
	},
	quest_hall: {
		name: 'Quest Hall',
		cost: 25000,
		minLvl: 32,
		doors: [Door.North, Door.East, Door.South, Door.West],
		stairs: true,
		open: false,
		bg: 'indigo'
	},
	menagerie: {
		name: 'Menagerie',
		cost: 30000,
		minLvl: 37,
		doors: [Door.North, Door.East, Door.South, Door.West],
		stairs: false,
		open: true,
		bg: 'forestgreen'
	},
	study: {
		name: 'Study',
		cost: 50000,
		minLvl: 40,
		doors: [Door.East, Door.South, Door.West],
		stairs: false,
		open: false,
		bg: 'gray'
	},
	costume_room: {
		name: 'Costume Room',
		cost: 50000,
		minLvl: 42,
		doors: [Door.South],
		stairs: false,
		open: false,
		bg: 'gray'
	},
	chapel: {
		name: 'Chapel',
		cost: 50000,
		minLvl: 45,
		doors: [Door.East, Door.South],
		stairs: false,
		open: false,
		bg: 'gray'
	},
	portal_chamber: {
		name: 'Portal Chamber',
		cost: 100000,
		minLvl: 50,
		doors: [Door.South],
		stairs: false,
		open: false,
		bg: 'gray'
	},
	formal_garden: {
		name: 'Formal Garden',
		cost: 75000,
		minLvl: 55,
		doors: [Door.North, Door.East, Door.South, Door.West],
		stairs: false,
		open: true,
		bg: 'darkgreen'
	},
	throne_room: {
		name: 'Throne Room',
		cost: 150000,
		minLvl: 60,
		doors: [Door.South],
		stairs: false,
		open: false,
		bg: 'gray'
	},
	aquarium: {
		name: 'Aquarium',
		cost: 200000,
		minLvl: 63,
		doors: [Door.North, Door.East, Door.South, Door.West],
		stairs: false,
		open: false,
		bg: 'gray'
	}
};

export const ROOM_TYPES_LIST = Object.entries(ROOM_TYPES).sort(([, a], [, b]) =>
	a.name.localeCompare(b.name)
);
