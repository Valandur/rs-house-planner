export interface SizeLimit {
	level: number;
	rooms: number;
	extent: [number, number];
}

export const SIZE_LIMITS: SizeLimit[] = [
	{ level: 0, rooms: 0, extent: [0, 0] },
	{ level: 1, rooms: 21, extent: [3, 3] },
	{ level: 15, rooms: 21, extent: [4, 4] },
	{ level: 30, rooms: 21, extent: [5, 5] },
	{ level: 38, rooms: 22, extent: [5, 5] },
	{ level: 44, rooms: 23, extent: [5, 5] },
	{ level: 45, rooms: 23, extent: [6, 6] },
	{ level: 50, rooms: 24, extent: [6, 6] },
	{ level: 56, rooms: 25, extent: [6, 6] },
	{ level: 60, rooms: 25, extent: [7, 7] },
	{ level: 62, rooms: 26, extent: [7, 7] },
	{ level: 68, rooms: 27, extent: [7, 7] },
	{ level: 74, rooms: 28, extent: [7, 7] },
	{ level: 80, rooms: 29, extent: [7, 7] },
	{ level: 86, rooms: 30, extent: [7, 7] },
	{ level: 92, rooms: 31, extent: [7, 7] },
	{ level: 96, rooms: 32, extent: [7, 7] },
	{ level: 99, rooms: 33, extent: [7, 7] }
];
