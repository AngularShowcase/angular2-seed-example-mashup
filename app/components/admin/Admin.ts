import {Component} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {Authentication} from '../../services/Authentication';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {Menu} from './Menu';
import {Users} from './Users';
import {Roles} from './Roles';

@RouteConfig([
  { path: '/', component: Users, as: 'UsersDefault', useAsDefault: true },
  { path: '/Users', component: Users, as: 'Users' },
  { path: '/Roles', component: Roles, as: 'Roles' }
])

@Component({
    selector: 'admin',
    templateUrl: './components/admin/Admin.html',
    styleUrls: ['./components/admin/Admin.css'],
    directives: [CORE_DIRECTIVES, ROUTER_DIRECTIVES, Menu]
})
export class Admin {

    constructor(public authentication:Authentication) {
    }

    ngOnInit() {

        if (!this.authentication.authenticate()) {
            return;
        }
    }
}
