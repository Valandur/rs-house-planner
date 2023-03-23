import type { Direction } from './Direction';

export interface Room {
	typeKey: string;
	orientation: Direction;
	furnitureKeys: { [key: string]: string | null };
}
