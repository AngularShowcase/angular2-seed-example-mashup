import {Component, EventEmitter} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {SecurityService} from '../../services/SecurityService';
import {IUser} from '../../../common/interfaces/SecurityInterfaces';

@Component({
    selector: 'userPickList',
    outputs: ['selectedUser'],
    templateUrl: './components/admin/UserPickList.html',
    styleUrls: ['./components/admin/UserPickList.css'],
    directives: [CORE_DIRECTIVES]
})

export class UserPickList {
    users:IUser[];
    selectedUser: EventEmitter<IUser>;

    constructor (public securityService:SecurityService) {
        this.selectedUser = new EventEmitter<IUser>();
    }

    ngOnInit() {
        this.securityService.getUsers()
            .subscribe(userList => {
                    this.users = userList;
                    if (this.users.length > 0) {
                        this.selectedUser.next(this.users[0]);
                    }
                });
    }

    selectUser($event) {
        let username = $event.target.value;
        let user = this.users.find(u => u.username === username);
        if (user !== null) {
            this.selectedUser.next(user);
        }
    }
}
