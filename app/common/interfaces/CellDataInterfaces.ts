export interface IPerson {
	personId: number;
	firstName: string;
	lastName: string;
};

export interface ICycle {
	cycleId: number;
	startDate: Date;
	endDate: Date;
};

export interface IUsage {
	personId: number;
	date: Date;
	usage: number;
};
