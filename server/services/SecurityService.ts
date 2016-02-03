import Q = require('q');
import bcrypt = require('bcrypt');

var mongoskin = require('mongoskin');
import {IRegistration, IRegistrationResponse, IRegisteredUser, ILoginResult} from '../../common/interfaces/RegistrationInterfaces';
import {IRole, IUser} from '../../common/interfaces/SecurityInterfaces';

var config = {
	mongo_url: process.env.SECURITYDATA_URL || 'mongodb://@localhost:27017/security'
};

export class SecurityService {

	static MinPasswordLength: number = 8;

	db: any;
	usersCollection: any;
    rolesCollection: any;

	constructor() {
		this.db = mongoskin.db(config.mongo_url, { safe: true });
		this.usersCollection = this.db.collection('users');
		this.rolesCollection = this.db.collection('roles');
	}

	public getUsers(): Q.Promise<IUser[]> {
		let defer = Q.defer<IUser[]>();
		this.usersCollection.find().sort({ username: 1 }).toArray((e, users: any[]) => {
			if (e) {
				defer.reject(e);
			} else {
				defer.resolve(<IUser[]>users.map(this.mapUser));
			}
		});

		return defer.promise;
	}

	public getRoles(): Q.Promise<IRole[]> {
		let defer = Q.defer<IRole[]>();
		this.rolesCollection.find().sort({ name: -1 }).toArray(function(e, roles: IRole[]) {
			if (e) {
				defer.reject(e);
			} else {
				defer.resolve(roles);
			}
		});

		return defer.promise;
	}

    public getRoleMembers(roleName:string) : Q.Promise<IUser[]> {
		let defer = Q.defer<IUser[]>();
        this.getUsers()
            .then(users => {
                let groupMembers = users.filter(u => u.roles.indexOf(roleName) >= 0);
                defer.resolve(groupMembers);
            })
            .catch(err => defer.reject(err));

        return defer.promise;
    }

    // Add the new role and return the complete list of revised roles
	public addRole(newRole:IRole): Q.Promise<IRole[]> {

		let defer = Q.defer<IRole[]>();

        try {
            newRole.name = newRole.name.trim().toLowerCase();
            newRole.description = newRole.description.trim().toLowerCase();

            if (!newRole.name) {
                throw new Error('Role name not specified.');
            }

            if (!newRole.description) {
                throw new Error('Description not specified');
            }

            this.rolesCollection.findOne({name:newRole.name}, (e, existingRole:IRole) => {

                try {
                    if (e) {
                        throw e;
                    }

                    if (existingRole) {
                        let errMsg = `Role ${existingRole.name} with description ${existingRole.description} already exists.`;
                        throw { Message: errMsg };
                    }

                    this.rolesCollection.insert(newRole, (e, [addedRole]:IRole[]) => {

                        if (e) {
                            defer.reject(e);
                        } else {
                            console.log(`Added new role named ${addedRole.name} with description ${addedRole.description}.`);
                            this.getRoles()
                                .then(roles => defer.resolve(roles))
                                .catch(err => defer.reject(err));
                        }
                    });
                } catch (err) {
                    defer.reject(err);
                }
            });

        } catch(err) {
            defer.reject(err);
        }

        return defer.promise;
	}

	public login(username:string, password:string) : Q.Promise<ILoginResult> {

		var defer = Q.defer<ILoginResult>();

		username = username.trim().toLocaleLowerCase();

		this.getUserByUsernameInternal(username)
			.then(registeredUser => {
                if (!registeredUser) {
                    defer.resolve({succeeded: false});
                } else if (bcrypt.compareSync(password, registeredUser.hashedPassword)) {
					defer.resolve({succeeded: true, userInfo: this.mapUser(registeredUser)});
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

    private mapUser(registeredUser:any) : IUser {
        return {
            userId: registeredUser.userId,
            username: registeredUser.username,
            emailAddress: registeredUser.emailAddress,
            firstName: registeredUser.firstName,
            lastName: registeredUser.lastName,
            roles: registeredUser.roles || []
        };
    }

	private getUserByUsernameInternal(username: string): Q.Promise<IRegisteredUser> {
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
}
