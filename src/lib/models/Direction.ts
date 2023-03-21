export enum Direction {
	North = 0,
	East,
	South,
	West
}

export const getDirName = (dir: Direction) => Direction[dir].toLowerCase();

export const rotateClockwise = (dir: Direction, amount = 1): Direction => {
	return (dir += amount) % 4;
};
