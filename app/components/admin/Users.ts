import {Component} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {SecurityService} from '../../services/SecurityService';
import {Observable} from 'rxjs/Observable';
import {IRegisteredUser} from '../../../common/interfaces/RegistrationInterfaces';

@Component({
    templateUrl: './components/admin/Users.html',
    styleUrls: ['./components/admin/Users.css'],
    directives: [CORE_DIRECTIVES]
})
export class Users {

    users:Observable<IRegisteredUser[]>;

    constructor(public securityService:SecurityService) {

    }

    ngOnInit() {
        this.users = this.securityService.getUsers();
    }
}
