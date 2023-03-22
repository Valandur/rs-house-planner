import { ROOM_TYPES_LIST, type RoomType } from './RoomType';
import { SIZE_X, SIZE_Y, type ExtendedPlot } from './Plot';
import type { ExtendedRoom } from './Room';

export interface SizeLimit {
	level: number;
	rooms: number;
	extent: [number, number];
}

export const SIZE_LIMITS: SizeLimit[] = [
	{ level: 0, rooms: 0, extent: [0, 0] },
	{ level: 1, rooms: 21, extent: [3, 3] },
	{ level: 15, rooms: 21, extent: [4, 4] },
	{ level: 30, rooms: 21, extent: [5, 5] },
	{ level: 38, rooms: 22, extent: [5, 5] },
	{ level: 44, rooms: 23, extent: [5, 5] },
	{ level: 45, rooms: 23, extent: [6, 6] },
	{ level: 50, rooms: 24, extent: [6, 6] },
	{ level: 56, rooms: 25, extent: [6, 6] },
	{ level: 60, rooms: 25, extent: [7, 7] },
	{ level: 62, rooms: 26, extent: [7, 7] },
	{ level: 68, rooms: 27, extent: [7, 7] },
	{ level: 74, rooms: 28, extent: [7, 7] },
	{ level: 80, rooms: 29, extent: [7, 7] },
	{ level: 86, rooms: 30, extent: [7, 7] },
	{ level: 92, rooms: 31, extent: [7, 7] },
	{ level: 96, rooms: 32, extent: [7, 7] },
	{ level: 99, rooms: 33, extent: [7, 7] }
];

export interface GroupedRooms {
	type: RoomType;
	rooms: ExtendedRoom[];
}

export interface LevelRequirement {
	name: string;
	value: number | string;
	limit: number | string;
	level: number;
}

export interface Stats {
	groupedRooms: GroupedRooms[];
	totalPrice: number;
	levelRequirements: LevelRequirement[];
	extent: [number, number];
	errors: string[];
}

export const getStats = (plots: ExtendedPlot[]): Stats => {
	const rooms = plots
		.flat(2)
		.filter((room) => !!room)
		.map((room) => room as ExtendedRoom);
	const groupedRooms = ROOM_TYPES_LIST.map(([key, type]) => ({
		type,
		rooms: rooms.filter((room) => room.type === key)
	})).sort((a, b) => b.rooms.length - a.rooms.length);

	let cost = 0;
	let minX = SIZE_X;
	let minY = SIZE_Y;
	let maxX = 0;
	let maxY = 0;
	let roomLvlReq: ExtendedRoom | null = null;
	const errors: string[] = [];

	for (const room of rooms) {
		cost += room.cost;
		roomLvlReq = roomLvlReq && room.minLvl <= roomLvlReq.minLvl ? roomLvlReq : room;
		minX = Math.min(minX, room.x);
		maxX = Math.max(maxX, room.x);
		minY = Math.min(minY, room.y);
		maxY = Math.max(maxY, room.y);
	}

	const reqs: LevelRequirement[] = [];
	if (roomLvlReq) {
		reqs.push({
			name: 'Highest Level Room',
			value: roomLvlReq.name,
			limit: '-',
			level: roomLvlReq.minLvl
		});
	}

	if (rooms.length > 0) {
		const reqNumRooms = SIZE_LIMITS.find((limit) => limit.rooms >= rooms.length);
		if (reqNumRooms) {
			reqs.push({
				name: 'Number of Rooms',
				value: rooms.length,
				limit: reqNumRooms.rooms,
				level: reqNumRooms.level
			});
		} else {
			const limit = SIZE_LIMITS[SIZE_LIMITS.length - 1].rooms;
			errors.push(`You have too many rooms (${rooms.length})! You cannot have more than ${limit}`);
		}
	}

	const diffX = Math.max(0, maxX - minX + 1);
	if (diffX > 0) {
		const reqExtentX = SIZE_LIMITS.find((limit) => limit.extent[0] >= diffX);
		if (reqExtentX) {
			reqs.push({
				name: 'Extent X',
				value: diffX,
				limit: reqExtentX.extent[0],
				level: reqExtentX.level
			});
		} else {
			const limit = SIZE_LIMITS[SIZE_LIMITS.length - 1].extent[0];
			errors.push(`Your house is too wide (${diffX})! It can be at most ${limit} wide`);
		}
	}

	const diffY = Math.max(0, maxY - minY + 1);
	if (diffY > 0) {
		const reqExtentY = SIZE_LIMITS.find((limit) => limit.extent[1] >= diffY);
		if (reqExtentY) {
			reqs.push({
				name: 'Extent Y',
				value: diffY,
				limit: reqExtentY.extent[1],
				level: reqExtentY.level
			});
		} else {
			const limit = SIZE_LIMITS[SIZE_LIMITS.length - 1].extent[1];
			errors.push(`Your house is too tall (${diffY})! It can be at most ${limit} tall`);
		}
	}

	reqs.sort((a, b) => b.level - a.level);

	return {
		groupedRooms,
		totalPrice: cost,
		levelRequirements: reqs,
		extent: [diffX, diffY],
		errors
	};
};
