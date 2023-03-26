import { createEmptyFloor, type Floor } from './Floor';

export const MIN_FLOOR = -1;
export const MAX_FLOOR = 1;

export interface House {
	name: string;
	floors: Floor[];
}

export const createEmptyHouse = (name = 'Default'): House => {
	const house: House = { name, floors: [] };
	for (let i = MIN_FLOOR; i <= MAX_FLOOR; i++) {
		house.floors.push(createEmptyFloor(house, i));
	}
	return house;
};
