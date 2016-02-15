import {Component} from 'angular2/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';
import {CellDataServices} from '../../services/CellDataServices';
import {IUsage} from '../../../common/interfaces/CellDataInterfaces';

@Component({
	selector: 'usage-details',
	inputs: ['dataUsage:usage'],
	templateUrl: './celldata/components/UsageDetails.html',
	directives: [FORM_DIRECTIVES, CORE_DIRECTIVES]
})

export class UsageDetails {

	dataUsage:IUsage[] = [];

	constructor(public cellDataServices:CellDataServices) {
	}

	getTotalUsage() : number {
		return this.dataUsage.reduce((acc, u) => u.usage + acc, 0.0);
	}
}
