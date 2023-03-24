import type { Direction } from './Direction';

export interface Room {
	x: number;
	y: number;
	typeKey: string;
	orientation: Direction;
	furnitureKeys: { [key: string]: string | null };
}
