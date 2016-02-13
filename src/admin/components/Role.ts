import {Component} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {SecurityService} from '../../services/SecurityService';
import {IRole, IUser} from '../../../common/interfaces/SecurityInterfaces';
import {RouteParams} from 'angular2/router';
import {UserPickList} from './UserPickList';

@Component({
    templateUrl: './components/admin/Role.html',
    styleUrls: ['./components/admin/Role.css'],
    directives: [CORE_DIRECTIVES, UserPickList]
})

// Name this class RoleComponent to avoid a name collision with models Role object
export class RoleComponent {

    role:IRole;
    selectedUser:IUser = null;

    roleMembers:IUser[] = [];

    constructor(public securityService:SecurityService, public routeParams:RouteParams) {
    }

    ngOnInit() {
        let roleName = this.routeParams.get('roleName');

        this.securityService.getRoles()
            .subscribe(roleList => {
                this.role = roleList.find(r => r.name === roleName);
                if (this.role !== null) {
                    console.log(`Looking up members of role ${this.role.name}.`);
                    this.securityService.getRoleMembers(roleName)
                        .subscribe(members => this.roleMembers = members);
                }
            });
    }

    removeMember(member:IUser) {
        console.log(`Remove user ${member.firstName} ${member.lastName} from group ${this.role.name}.`);
    }

    selectUser(user:IUser) {
        this.selectedUser = user;
        console.log(`Changed selected user to ${this.selectedUser.username}.`);
    }

    addMember(member:IUser) {
        console.log(`Adding ${member.username} to role ${this.role.name}.`);
    }
}
