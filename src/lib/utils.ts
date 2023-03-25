import { createEmptyHouse, type House } from './models/House';
import { FURNITURE_TYPES, type FurnitureType } from './models/FurnitureType';
import { ROOM_TYPES } from './models/RoomType';
import { SIZE_X, type Floor } from './models/Floor';
import type { Room } from './models/Room';

const serializeRoom = (room: Room | null, index: number): string | null => {
	if (!room) {
		return null;
	}

	const furnitureStr = room.hotspots
		.map((furnitureType) => (furnitureType ? FURNITURE_TYPES.indexOf(furnitureType) : ''))
		.join('-');
	return `${index}-${ROOM_TYPES.indexOf(room.type)}-${room.orientation}-${furnitureStr}`;
};

export const serializeHouse = (house: House): URLSearchParams => {
	const query = new URLSearchParams();

	for (const floor of house.floors) {
		const rooms = floor.rooms
			.flat()
			.map(serializeRoom)
			.filter((r) => !!r)
			.join('.');
		query.set(`f${floor.num}`, rooms);
	}

	return query;
};

const parseRoom = (floor: Floor, str: string): Room => {
	const splits = str.split('-');

	const idx = Number(splits[0]);
	const x = idx % SIZE_X;
	const y = Math.floor(idx / SIZE_X);
	const type = ROOM_TYPES[Number(splits[1])];
	if (!type) {
		throw new Error(`Unknown room type ${splits[1]}`);
	}
	const orientation = Number(splits[2]);

	const hotspots: (FurnitureType | null)[] = [];
	for (let i = 0; i < type.hotspots.length; i++) {
		hotspots[i] = splits[i + 3] ? FURNITURE_TYPES[Number(splits[i + 3])] : null;
	}

	return {
		floor,
		x,
		y,
		type,
		orientation,
		hotspots
	};
};

export const parseHouse = (urlSearchParams: URLSearchParams): House => {
	const house: House = createEmptyHouse();

	for (const key of urlSearchParams.keys()) {
		if (!key.startsWith('f')) {
			continue;
		}

		const num = Number(key.substring(1));
		const floor = house.floors.find((f) => f.num === num);
		if (!floor) {
			throw new Error(`Unknown floor ${num}`);
		}

		const data = urlSearchParams.get(key);
		if (data) {
			const splits = data.split('.');
			for (const split of splits) {
				const room = parseRoom(floor, split);
				floor.rooms[room.y][room.x] = room;
			}
		}
	}

	return house;
};
