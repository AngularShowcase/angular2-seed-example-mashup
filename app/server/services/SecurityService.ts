import Q = require('q');
import bcrypt = require('bcrypt');

var mongoskin = require('mongoskin');
import {IRegistration, IRegistrationResponse, IRegisteredUser, ILoginResult} from '../../common/interfaces/RegistrationInterfaces';

var config = {
	mongo_url: process.env.SECURITYDATA_URL || 'mongodb://@localhost:27017/security'
};

export class SecurityService {

	static MinPasswordLength: number = 8;

	db: any;
	usersCollection: any;

	constructor() {
		this.db = mongoskin.db(config.mongo_url, { safe: true });
		this.usersCollection = this.db.collection('users');
	}

	public getUserByUsernameInternal(username: string): Q.Promise<IRegisteredUser> {
		let defer = Q.defer<IRegisteredUser>();
		var coll = this.usersCollection;

		coll.findOne({ username: username }, function(e, user: IRegisteredUser) {
			if (e) {
				defer.reject(e);
			} else {
				defer.resolve(user);
			}
		});

		return defer.promise;
	}

	public login(username:string, password:string) : Q.Promise<ILoginResult> {

		var defer = Q.defer<ILoginResult>();

		username = username.trim().toLocaleLowerCase();

		this.getUserByUsernameInternal(username)
			.then(user => {
				if (bcrypt.compareSync(password, user.hashedPassword)) {
					user.hashedPassword = null;
					defer.resolve({succeeded: true, userInfo: user});
				} else {
					defer.resolve({succeeded: false});
				}
			})
			.catch(err => defer.reject(err));

		return defer.promise;
	}

	public registerUser(registration: IRegistration): Q.Promise<IRegistrationResponse> {
		let defer = Q.defer<IRegistrationResponse>();

		registration.password = registration.password.trim();
		if (registration.password.length < SecurityService.MinPasswordLength) {
			defer.resolve({ succeeded: false, failureReason: 'Your password is too short' });
			return defer.promise;
		}

		registration.username = registration.username.trim().toLocaleLowerCase();
		if (!registration.username) {
			defer.resolve({ succeeded: false, failureReason: 'No username specified' });
			return defer.promise;
		}

		registration.emailAddress = registration.emailAddress.trim().toLocaleLowerCase();
		if (!registration.emailAddress) {
			defer.resolve({ succeeded: false, failureReason: 'No email specified' });
			return defer.promise;
		}

		this.getUserByUsernameInternal(registration.username)
			.then(existingUser => {
				if (existingUser) {
					defer.resolve({ succeeded: false, failureReason: 'Username is not available.' });
				} else {
					var coll = this.usersCollection;
					coll.find({}, { _id: 0, userId: 1 }).sort({ userId: -1 }).toArray(function(e, users: any[]) {
						if (e) {
							defer.reject(e);
						} else {
							var lastNumber = (users.length === 0) ? 0 : users[0].userId;
							var nextNumber = lastNumber + 1;

							var newUser: IRegisteredUser = {
								userId: nextNumber,
								username: registration.username,
								firstName: registration.firstName,
								lastName: registration.lastName,
								emailAddress: registration.emailAddress,
								hashedPassword: bcrypt.hashSync(registration.password, 10)
							};

							coll.insert(newUser, {}, function(e, results) {
								if (e) {
									defer.reject(e);
								} else {
									newUser.hashedPassword = null;
									defer.resolve({
										succeeded: true,
										failureReason: ''
									});
								}
							});
						}
					});

				}

			})
			.catch(err => defer.resolve(err));

		return defer.promise;
	}
}
