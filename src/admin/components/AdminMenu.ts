import {Component} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {ROUTER_DIRECTIVES} from 'angular2/router';

@Component({
    selector: 'admin-menu',
    templateUrl: './admin/components/AdminMenu.html',
    styleUrls: ['./admin/components/AdminMenu.css'],
    directives: [CORE_DIRECTIVES, ROUTER_DIRECTIVES]
})
export class AdminMenu {

}
