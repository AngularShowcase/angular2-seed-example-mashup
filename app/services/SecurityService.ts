import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {Http, Headers, RequestOptions, RequestOptionsArgs} from 'angular2/http';
import {IRegisteredUser} from '../../common/interfaces/RegistrationInterfaces';

@Injectable()
export class SecurityService {

	constructor(public http: Http) {
        console.log('Constructing the security service.');
	}

	getUsers() : Observable<IRegisteredUser[]> {
		var result = this.http.get('/api/users')
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
