export interface IRegistration {
	username: string;
	password: string;
	emailAddress:string;
	firstName:string;
	lastName:string;
};

export interface IRegistrationResponse {
	succeeded: boolean;
	failureReason: string;
};

export interface IRegisteredUser {
	userId: number;
	username: string;
	hashedPassword?: string;		//Only set when saving to the database
	emailAddress:string;
	firstName:string;
	lastName:string;
};

export interface ILoginRequest {
	username: string;
	password: string;
};

export interface ILoginResult {
	succeeded: boolean;
	userInfo?:IRegisteredUser;
};
