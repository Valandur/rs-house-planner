import type { Direction } from './Direction';
import type { ExtendedDoor } from './Door';
import type { RoomType } from './RoomType';

export interface Room {
	type: string;
	orientation: Direction;
}

export interface ExtendedRoom extends Omit<RoomType, 'doors'>, Omit<Room, 'orientation'> {
	x: number;
	y: number;
	doors: ExtendedDoor[];
	orientation: string;
}
