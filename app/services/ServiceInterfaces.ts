export interface IGithubUser {
    login: string;
    id: number;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    repos_url: string;
    message: string;
}

export interface IGithubServices {
	getUser(login:string):Rx.Observable<IGithubUser>;
    lookupRepo(user: IGithubUser): Rx.Observable<any>;
}
