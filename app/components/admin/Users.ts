import {Component} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {SecurityService} from '../../services/SecurityService';
import {Observable} from 'rxjs/Observable';
import {IRegisteredUser} from '../../../common/interfaces/RegistrationInterfaces';
import {SortOrder} from '../../models/SortOrder';
import {FieldSortPipe} from '../../pipes/FieldSortPipe';
import {Sortable} from '../../directives/Sortable';
import {SortKey} from '../../directives/SortKey';

@Component({
    templateUrl: './components/admin/Users.html',
    styleUrls: ['./components/admin/Users.css'],
    directives: [CORE_DIRECTIVES, Sortable, SortKey],
    pipes: [FieldSortPipe]
})
export class Users {

    users:Observable<IRegisteredUser[]>;
    sortOrder:SortOrder;

    constructor(public securityService:SecurityService) {
    }

    ngOnInit() {
        this.sortOrder = new SortOrder('lastName');
        console.log(`Setting sort order to ${this.sortOrder.toString()} in ngOnInit.`);
        this.users = this.securityService.getUsers();
    }

    sortBy(fieldName:string) {
        this.sortOrder = this.sortOrder.sortOnField(fieldName);
        console.log(`Sort order changing to ${this.sortOrder.toString()}`);
    }

    sortOn(sortOrder:SortOrder) {
        console.log(`Directive Sort order changing to ${sortOrder.toString()}`);
    }

}
