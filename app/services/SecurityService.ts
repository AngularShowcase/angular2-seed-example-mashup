import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {Http, Headers, RequestOptions, RequestOptionsArgs} from 'angular2/http';
import {IRole, IUser} from '../../common/interfaces/SecurityInterfaces';

@Injectable()
export class SecurityService {

	constructor(public http: Http) {
        console.log('Constructing the security service.');
	}

	getUsers() : Observable<IUser[]> {
		var result = this.http.get('/api/users')
			.map(response => {
                return response.json();
            });

		return result;
	}

    addRole(role:IRole) : Observable<IRole[]> {

        var result = this.http.post('/api/Roles', JSON.stringify(role), this.getPostOptions())
			.map(response => response.json());

		return result;
    }

	getRoles() : Observable<IRole[]> {
		var result = this.http.get('/api/Roles')
			.map(response => {
                return response.json();
            });

		return result;
	}

	getPostOptions(): RequestOptions {
		var headers = new Headers();
		headers.append('Content-Type', 'application/json');

		var options: RequestOptionsArgs = {
			headers: headers
		};

		return new RequestOptions(options);
	}
}
