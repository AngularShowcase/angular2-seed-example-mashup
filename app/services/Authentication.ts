import {Injectable, Observable} from 'angular2/angular2';
import {Router} from 'angular2/router';
import {Http, Headers, Response, RequestOptions, RequestOptionsArgs} from 'angular2/http';
import {IRegistration, IRegistrationResponse, ILoginRequest,
	    ILoginResult, IRegisteredUser} from '../common/interfaces/RegistrationInterfaces';

@Injectable()
export class Authentication {
	_user: IRegisteredUser;
	lastRoute: string = '';

	constructor(public router: Router, public http: Http) {

		this.router.subscribe(v => {
			if (v === 'login' || v === 'register' ) {
				console.log(`Ignoring setting last route to ${v}`);
			} else {
				this.lastRoute = v;
				console.log(`Set last route to ${this.lastRoute}`);
			}
		});
	}

	authenticate(): boolean {

		if (!this.isLoggedIn()) {
			this.router.navigateByUrl('/login');
			return false;
		}

		return true;
	}

	isLoggedIn(): boolean {
		return !!this._user;
	}

	get user(): IRegisteredUser {
		return this._user;
	}

	login(username: string, password: string): Observable<ILoginResult> {
		var loginRequest: ILoginRequest = { username: username, password: password };

		var result = this.http.post('/api/login',
			JSON.stringify(loginRequest), this.getPostOptions())
			.map<Response, ILoginResult>(response => {
				var loginResult = <ILoginResult>response.json();

				if (loginResult.succeeded) {
					this._user = loginResult.userInfo;
				}
				return loginResult;
			});

		return result;
	}

	logout() {
		this._user = null;
	}

	getLastRoute(): string {
		return this.lastRoute;
	}

	register(registrationRequest: IRegistration): Observable<IRegistrationResponse> {
		var result = this.http.post('/api/users/register/',
			JSON.stringify(registrationRequest),
			this.getPostOptions());

		return result.map<Response, IRegistrationResponse>(r => <IRegistrationResponse>r.json());
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
