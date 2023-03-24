import { createEmptyPlot, SIZE_X, type Plot } from './models/Plot';
import { FLOORS } from './models/Floor';
import type { Room } from './models/Room';

const roomToString = (room: Room | null, index: number): string | null => {
	if (!room) {
		return null;
	}

	const furnitureStr = Object.entries(room.furnitureKeys)
		.filter(([, value]) => !!value)
		.map(([key, value]) => `${key}:${value}`)
		.join('-');
	return `${index}-${room.typeKey}-${room.orientation}-${furnitureStr}`;
};

export const getUrl = (plots: Plot[]): URLSearchParams => {
	const query = new URLSearchParams();

	for (let i = 0; i < FLOORS.length; i++) {
		const rooms = plots[i]
			.flat()
			.map(roomToString)
			.filter((r) => !!r)
			.join(',');
		query.set(`f${FLOORS[i]}`, btoa(rooms));
	}

	return query;
};

const stringToRoom = (str: string): Room => {
	const splits = str.split('-');
	const furnitureKeys: { [key: string]: string } = {};
	for (let i = 3; i < splits.length; i++) {
		const parts = splits[i].split(':');
		furnitureKeys[parts[0]] = parts[1];
	}

	const idx = Number(splits[0]);
	const x = idx % SIZE_X;
	const y = Math.floor(idx / SIZE_X);
	return {
		x,
		y,
		typeKey: splits[1],
		orientation: Number(splits[2]),
		furnitureKeys
	};
};

export const parseUrl = (urlSearchParams: URLSearchParams): Plot[] => {
	const plots: Plot[] = [];

	for (let i = 0; i < FLOORS.length; i++) {
		const plot = createEmptyPlot();

		const data = urlSearchParams.get(`f${FLOORS[i]}`);
		if (data) {
			const splits = atob(data).split(',');
			for (const split of splits) {
				const room = stringToRoom(split);
				plot[room.y][room.x] = room;
			}
		}

		plots.push(plot);
	}

	return plots;
};
