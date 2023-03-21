import { createEmptyPlot, SIZE_Y, type Plot } from './models/Plot';
import { FLOORS } from './models/Floor';

export const getUrl = (plots: Plot[]): URLSearchParams => {
	const query = new URLSearchParams();

	for (let i = 0; i < FLOORS.length; i++) {
		const rooms = plots[i].flat();

		let last = -1;
		const parts: string[] = [];
		for (let i = 0; i < rooms.length; i++) {
			const room = rooms[i];

			if (!room) {
				continue;
			}

			const prefix =
				i - last - 1 < `${i}.`.length ? '-'.repeat(Math.max(0, i - last - 1)) : `${i}.`;
			parts.push(`${prefix}${room.type}.${room.orientation}`);
			last = i;
		}

		const url = parts.join('-');
		query.set(`f${FLOORS[i]}`, url);
	}

	return query;
};

export const parseUrl = (urlSearchParams: URLSearchParams): Plot[] => {
	const plots: Plot[] = [];

	for (let i = 0; i < FLOORS.length; i++) {
		const plot = createEmptyPlot();

		const url = urlSearchParams.get(`f${FLOORS[i]}`);
		if (!url) {
			plots.push(plot);
			continue;
		}

		let lastI = 0;
		let lastIdx = 0;
		const parts = url.split('-');
		for (let i = 0; i < parts.length; i++) {
			const splits = parts[i].split('.');
			if (splits.length < 2) {
				continue;
			}

			if (splits.length === 3) {
				const idx = Number(splits[0]);
				const dir = Number(splits[2]);
				plot[Math.floor(idx / SIZE_Y)][idx % SIZE_Y] = { type: splits[1], orientation: dir };
				lastI = i;
				lastIdx = idx;
			} else {
				const idx = lastIdx + (i - lastI);
				const dir = Number(splits[1]);
				plot[Math.floor(idx / SIZE_Y)][idx % SIZE_Y] = { type: splits[0], orientation: dir };
			}
		}

		plots.push(plot);
	}

	return plots;
};
