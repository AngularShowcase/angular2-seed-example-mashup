import {Component} from 'angular2/core';
import {Router} from 'angular2/router';
import {CORE_DIRECTIVES} from 'angular2/common';
import {SecurityService} from '../../services/SecurityService';
import {IRole} from '../../../common/interfaces/SecurityInterfaces';
import {SortOrder} from '../../models/SortOrder';
import {FieldSortPipe} from '../../pipes/FieldSortPipe';
import {Sortable} from '../../directives/Sortable';
import {SortKey} from '../../directives/SortKey';
import {Role} from '../../models/Role';

@Component({
    templateUrl: './components/admin/Roles.html',
    styleUrls: ['./components/admin/Roles.css'],
    directives: [CORE_DIRECTIVES, Sortable, SortKey],
    pipes: [FieldSortPipe]
})
export class Roles {

    roles:IRole[];
    sortOrder:SortOrder;

    constructor(public securityService:SecurityService, public router:Router) {
    }

    ngOnInit() {
        this.sortOrder = new SortOrder('name');
        this.securityService.getRoles()
            .subscribe(roles => this.roles = roles, err => console.log(err));
    }

    sortOn(newSortOrder:SortOrder) {
        this.sortOrder = newSortOrder;
    }

    addRole(roleName:string, description:string) {
        console.log(`Add new role ${roleName}/${description}.`);
        this.securityService.addRole(new Role(roleName, description))
            .subscribe(roles => this.roles = roles, err => console.log(err));
    }

    selectRole(role:IRole) {
        //this.router.navigate([`./${role.name}`]);
        let url = `/admin/Roles/${role.name}`;
        console.log(`Attempting to navigate to ${url}.`);
        this.router.navigateByUrl(url);
    }
}
