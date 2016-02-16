import {Component} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {Authentication} from '../../services/Authentication';
import {SecurityService} from '../../services/SecurityService';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {AdminMenu} from './AdminMenu';
import {Users} from './Users';
import {Roles} from './Roles';
import {RoleComponent} from './Role';

@RouteConfig([
  { path: '/', component: Users, name: 'UsersDefault', useAsDefault: true },
  { path: '/Users', component: Users, name: 'Users' },
  { path: '/Roles', component: Roles, name: 'Roles' },
  { path: '/Roles/:roleName', component: RoleComponent, name: 'Role' }
])

@Component({
    selector: 'admin',
    providers: [SecurityService],
    templateUrl: './admin/components/Admin.html',
    styleUrls: ['./admin/components/Admin.css'],
    directives: [CORE_DIRECTIVES, ROUTER_DIRECTIVES, AdminMenu]
})
export class Admin {

    constructor(public authentication:Authentication) {
    }

    ngOnInit() {

        // if (!this.authentication.authenticate()) {
        //     return;
        // }
    }
}
