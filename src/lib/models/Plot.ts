import type { Room } from './Room';

export const SIZE_X = 9;
export const SIZE_Y = 9;

export type Plot = (Room | null)[][];

export const createEmptyPlot = () => {
	const plot: Plot = [];
	for (let y = 0; y < SIZE_Y; y++) {
		plot.push([]);
		for (let x = 0; x < SIZE_X; x++) {
			plot[y].push(null);
		}
	}
	return plot;
};
