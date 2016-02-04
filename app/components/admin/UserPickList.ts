import {Component} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {SecurityService} from '../../services/SecurityService';
import {IUser} from '../../../common/interfaces/SecurityInterfaces';
import {Observable} from 'rxjs/Observable';

@Component({
    selector: 'userPickList',
    templateUrl: './components/admin/UserPickList.html',
    styleUrls: ['./components/admin/UserPickList.css'],
    directives: [CORE_DIRECTIVES]
})

export class UserPickList {
    users:Observable<IUser[]>;
    selectedUsername: string = '';

    constructor (public securityService:SecurityService) {
    }

    ngOnInit() {
        this.users = this.securityService.getUsers();
        this.users.subscribe(userList => this.selectedUsername = (userList.length === 0) ? '' : userList[0].username);
    }

    selectUser($event) {
        this.selectedUsername = $event.target.value;
        console.log(`Selected username is now ${this.selectedUsername}.`);
    }
}
