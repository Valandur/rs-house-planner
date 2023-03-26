import { SIZE_LIMITS } from './SizeLimit';
import { SIZE_X, SIZE_Y } from './Floor';
import type { House } from './House';
import type { Room } from './Room';

export interface LevelRequirement {
	name: string;
	value: number | string;
	limit: number | string;
	level: number;
}

export interface Stats {
	totalPrice: number;
	levelRequirements: LevelRequirement[];
	extent: [number, number];
	errors: string[];
}

export const calculateStats = (house: House): Stats => {
	const rooms = house.floors
		.map((floor) => floor.rooms)
		.flat(2)
		.filter((room) => !!room) as Room[];

	let totalPrice = 0;
	let minX = SIZE_X;
	let minY = SIZE_Y;
	let maxX = 0;
	let maxY = 0;
	let maxRoom: Room | null = null;

	const errors: string[] = [];
	const levelRequirements: LevelRequirement[] = [];

	let hasGarden = false;
	for (const room of rooms) {
		totalPrice += room.type.cost;
		maxRoom = maxRoom && room.type.minLvl <= maxRoom.type.minLvl ? maxRoom : room;
		minX = Math.min(minX, room.x);
		maxX = Math.max(maxX, room.x);
		minY = Math.min(minY, room.y);
		maxY = Math.max(maxY, room.y);
		if (room.type.key === 'garden' || room.type.key === 'formal_garden') {
			hasGarden = true;
		}
	}
	if (!hasGarden) {
		errors.push(
			`You have must have at least one 'Garden' or 'Formal Garden' to place an exit portal!`
		);
	}

	if (maxRoom) {
		levelRequirements.push({
			name: 'Highest Level Room',
			value: maxRoom.type.name,
			limit: '-',
			level: maxRoom.type.minLvl
		});
	}

	if (rooms.length > 0) {
		const reqNumRooms = SIZE_LIMITS.find((limit) => limit.rooms >= rooms.length);
		if (reqNumRooms) {
			levelRequirements.push({
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
			levelRequirements.push({
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
			levelRequirements.push({
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

	levelRequirements.sort((a, b) => b.level - a.level);

	return {
		totalPrice,
		levelRequirements,
		extent: [diffX, diffY],
		errors
	};
};
