import type { House } from './House';
import type { Room } from './Room';

export const SIZE_X = 9;
export const SIZE_Y = 9;

export interface Floor {
	house: House;
	num: number;
	rooms: (Room | null)[][];
}

export const createEmptyFloor = (house: House, num: number): Floor => {
	const floor: Floor = {
		house,
		num,
		rooms: []
	};
	for (let y = 0; y < SIZE_Y; y++) {
		floor.rooms.push([]);
		for (let x = 0; x < SIZE_X; x++) {
			floor.rooms[y].push(null);
		}
	}
	return floor;
};
