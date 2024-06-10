export type Child = {
	id: number;
	title: string;
};

export type Group = {
	title: string;
	children: Child[];
};

export const data: Group[];
