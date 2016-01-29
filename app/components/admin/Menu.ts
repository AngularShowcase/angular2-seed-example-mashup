import {Component} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {ROUTER_DIRECTIVES} from 'angular2/router';

@Component({
    selector: 'menu',
    templateUrl: './components/admin/Menu.html',
    styleUrls: ['./components/admin/Menu.css'],
    directives: [CORE_DIRECTIVES, ROUTER_DIRECTIVES]
})
export class Menu {

}
