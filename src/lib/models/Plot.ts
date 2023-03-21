import { Direction, getDirName, rotateClockwise } from './Direction';
import { ROOM_TYPES } from './RoomType';
import type { ExtendedRoom, Room } from './Room';

export const SIZE_X = 9;
export const SIZE_Y = 9;

export type Plot = (Room | null)[][];

export type ExtendedPlot = (ExtendedRoom | null)[][];

export const getExtendedPlots = (plots: Plot[]): ExtendedPlot[] => {
	const extendedPlots: ExtendedPlot[] = [];

	for (const plot of plots) {
		const extendedPlot: ExtendedPlot = [];

		for (let y = 0; y < SIZE_Y; y++) {
			extendedPlot.push([]);

			for (let x = 0; x < SIZE_X; x++) {
				const room = plot[y][x];
				if (!room) {
					extendedPlot[y].push(null);
					continue;
				}

				const type = ROOM_TYPES[room.type];
				extendedPlot[y].push({
					...type,
					type: room.type,
					doors: type.doors
						.map((door) => rotateClockwise(door, room.orientation))
						.map((door) => ({
							dir: door,
							name: getDirName(door),
							connected: false
						})),
					orientation: getDirName(room.orientation)
				});
			}
		}

		for (let y = 0; y < SIZE_Y; y++) {
			for (let x = 0; x < SIZE_X; x++) {
				const room = extendedPlot[y][x];
				if (!room) {
					continue;
				}

				const neighbours: { [dir in Direction]: ExtendedRoom | null } = {
					[Direction.North]: y === 0 ? null : extendedPlot[y - 1][x],
					[Direction.East]: x >= extendedPlot[y].length - 1 ? null : extendedPlot[y][x + 1],
					[Direction.South]: y >= extendedPlot.length - 1 ? null : extendedPlot[y + 1][x],
					[Direction.West]: x === 0 ? null : extendedPlot[y][x - 1]
				};

				for (const door of room.doors) {
					const neighbour = neighbours[door.dir];
					if (!neighbour) {
						continue;
					}

					door.connected = neighbour.doors.some((d) => d.dir === rotateClockwise(door.dir, 2));
				}
			}
		}

		extendedPlots.push(extendedPlot);
	}

	return extendedPlots;
};

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
