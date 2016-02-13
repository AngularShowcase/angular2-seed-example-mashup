import {Component} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {SecurityService} from '../../services/SecurityService';
import {Observable} from 'rxjs/Observable';
import {IUser} from '../../../common/interfaces/SecurityInterfaces';
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

    users:Observable<IUser[]>;
    sortOrder:SortOrder;

    constructor(public securityService:SecurityService) {
    }

    ngOnInit() {
        this.sortOrder = new SortOrder('lastName');
        console.log(`Setting sort order to ${this.sortOrder.toString()} in ngOnInit.`);
        this.users = this.securityService.getUsers();
    }

    sortOn(newSortOrder:SortOrder) {
        this.sortOrder = newSortOrder;
    }
}
