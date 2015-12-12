import {Component, NgFor} from 'angular2/angular2';
import {CellDataServices} from '../../services/CellDataServices';
import {FORM_DIRECTIVES, NgClass} from 'angular2/angular2';
import {IUsage} from '../../common/interfaces/CellDataInterfaces';

@Component({
	selector: 'usage-details',
	inputs: ['dataUsage:usage'],
	templateUrl: './components/celldata/UsageDetails.html',
	directives: [FORM_DIRECTIVES, NgClass, NgFor]
})

export class UsageDetails {

	dataUsage:IUsage[] = [];

	constructor(public cellDataServices:CellDataServices) {
	}

	getTotalUsage() : number {
		return this.dataUsage.reduce((acc, u) => u.usage + acc, 0.0);
	}
}
