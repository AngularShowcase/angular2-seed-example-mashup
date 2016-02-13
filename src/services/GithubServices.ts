import {IGithubUser, IGithubServices} from './ServiceInterfaces';
import {Injectable} from 'angular2/core';
import {Http, Response} from 'angular2/http';

@Injectable()
export class GithubServices implements IGithubServices {

	constructor(public http:Http) {

	}

    // Returns Rx.Observable<IGithubUser>
	getUser(login:string):any {

		console.log('Looking up Github login ' + login);
        var url: string = 'https://api.github.com/users/' + login;

        var result = this.http.get(url)
			.map((response:Response) => {
                console.log('user response', response);
                //console.log('response.headers.values()', response.headers.values());
                return response.json();
            });

		return result;
	}

    // Return was Rx.Observable<any>
	lookupRepo(user: IGithubUser): any {
        var repos_url = user.repos_url;
        console.log('Looking up Github repos at ', repos_url);
        var result = this.http.get(repos_url)
            .map((response:Response) => {
                console.log('repo response', response);
                //console.log('response.headers.values()', response.headers.values());
                return response.json();
            });

		return result;
    }
}
