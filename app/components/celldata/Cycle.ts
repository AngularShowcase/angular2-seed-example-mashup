import {ICycle} from '../../common/interfaces/CellDataInterfaces';
import {Parser} from '../../services/Parser';

export class Cycle implements ICycle {

	cycleId: number;
	startDate: Date;
	endDate: Date;

	constructor(other:ICycle) {
		this.cycleId = other.cycleId;
		this.startDate = other.startDate;
		this.endDate = other.endDate;
	}

	description() : string {
		let p = new Parser();
		let minDate = p.chopTime(this.startDate.toISOString());
        let maxDate = p.chopTime(this.endDate.toISOString());
        return `From ${minDate} through ${maxDate}`;
	}
}
