import { Direction, getDirName, rotateClockwise } from './Direction';
import { FURNITURE_TYPES, type FurnitureType } from './FurnitureType';
import { ROOM_TYPES, type RoomType } from './RoomType';
import type { FurnitureHotspot } from './FurnitureHotspot';
import type { Room } from './Room';

export const SIZE_X = 9;
export const SIZE_Y = 9;

export type Plot = (Room | null)[][];

export interface ExtendedDoor {
	key: Direction;
	name: string;
	connected: boolean;
}

export interface ExtendedFurnitureType extends FurnitureType {
	key: string;
}

export interface ExtendedFurnitureHotspot extends FurnitureHotspot {
	key: string;
	options: ExtendedFurnitureType[];
}

export interface ExtendedRoom extends Room {
	x: number;
	y: number;
	typeKey: string;
	type: RoomType;
	doors: ExtendedDoor[];
	orientationName: string;
	furnitureHotspots: ExtendedFurnitureHotspot[];
}

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

				const roomType = ROOM_TYPES[room.typeKey];

				extendedPlot[y].push({
					...room,
					x,
					y,
					type: roomType,
					doors: roomType.doors
						.map((door) => rotateClockwise(door, room.orientation))
						.map((door) => ({
							key: door,
							name: getDirName(door),
							connected: false
						})),
					orientationName: getDirName(room.orientation),
					furnitureHotspots: Object.entries(roomType.furnitureHotspots).map(([key, hotspot]) => ({
						...hotspot,
						key,
						options: hotspot.optionKeys.map((key) => ({ ...FURNITURE_TYPES[key], key }))
					}))
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
					const neighbour = neighbours[door.key];
					if (!neighbour) {
						continue;
					}

					door.connected = neighbour.doors.some((d) => d.key === rotateClockwise(door.key, 2));
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
