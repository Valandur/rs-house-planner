import { Direction } from './Direction';

export type Door = Direction;

export const Door = Direction;

export interface ExtendedDoor {
	name: string;
	dir: Direction;
	connected: boolean;
}
