export interface IRole {
    name: string;
    description: string;
}

export interface IUser {
	userId: number;
	username: string;
	emailAddress:string;
	firstName:string;
	lastName:string;
    roles: IRole[];
}
