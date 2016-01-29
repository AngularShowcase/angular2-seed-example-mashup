import {Component} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {Authentication} from '../../services/Authentication';

@Component({
    selector: 'admin',
    templateUrl: './components/admin/Admin.html',
    styleUrls: ['./components/admin/Admin.css'],
    directives: [CORE_DIRECTIVES]
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
