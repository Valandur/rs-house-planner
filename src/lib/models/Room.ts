import type { Direction } from './Direction';
import type { ExtendedDoor } from './Door';

export interface Room {
	type: string;
	orientation: Direction;
}

export interface ExtendedRoom {
	// From type
	type: string;
	name: string;
	cost: number;
	minLvl: number;
	doors: ExtendedDoor[];
	stairs: boolean;
	open: boolean;
	bg: string;

	// From room
	orientation: string;
}
