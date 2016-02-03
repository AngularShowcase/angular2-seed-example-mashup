import {Component} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {SecurityService} from '../../services/SecurityService';
import {IRole, IUser} from '../../../common/interfaces/SecurityInterfaces';
import {RouteParams} from 'angular2/router';

@Component({
    templateUrl: './components/admin/Role.html',
    styleUrls: ['./components/admin/Role.css'],
    directives: [CORE_DIRECTIVES]
})

// Name this class RoleComponent to avoid a name collision with models Role object
export class RoleComponent {

    role:IRole;
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
                }
            });
    }
}
