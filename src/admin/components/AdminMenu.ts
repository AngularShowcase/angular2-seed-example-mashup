import {Component} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {ROUTER_DIRECTIVES} from 'angular2/router';

@Component({
    selector: 'admin-menu',
    templateUrl: './components/admin/AdminMenu.html',
    styleUrls: ['./components/admin/AdminMenu.css'],
    directives: [CORE_DIRECTIVES, ROUTER_DIRECTIVES]
})
export class AdminMenu {

}
