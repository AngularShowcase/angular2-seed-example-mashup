import {IAccident} from '../../common/interfaces/TrafficInterfaces';
import * as fs from 'fs';
import * as _ from 'underscore';
declare var Promise: any;
import {Subject} from 'rxjs/Subject';

// import 'rxjs/add/operators/map';
// import 'rxjs/add/observable/interval';
// import 'rxjs/add/operators/where';

export class TrafficService {

	mapFile = './app/assets/data/maps/us.json';
	sleepTime = 2500;
	accidentPub: Subject<IAccident>;
	timer: any;
	states:string[] = [];

	constructor() {
		this.accidentPub = new Subject<IAccident>();
		this.readStates();
	}

	readStates() {
		console.log('Current directory is ' + process.cwd());

		fs.readFile(this.mapFile, 'utf-8', (err, data) => {
			if (err) {
				console.log(err.message);
			} else {
				let map = JSON.parse(data);
				_.each(map.features, (f:any) => {
					this.states.push(f.properties.NAME);
				});
				this.processStates();
			}
		});
	}

	processStates() : void {
		this.states = _.sortBy(this.states);
		console.log(`Read ${this.states.length} states from ${this.mapFile}.`);
		this.start();
	}

	getAccidentPub() : Subject<IAccident> {
		return this.accidentPub;
	}

	start() {
		this.timer = setInterval(() => {
			this.monitorTraffic();
		}, this.sleepTime);
	}

	stop() {
		if (this.timer) {
			clearInterval(this.timer);
		}
	}

	monitorTraffic() {
		let stateIndex = Math.floor(Math.random() * this.states.length);
		let vehicleCount = Math.floor(Math.random() * 10) + 1;

		let accident:IAccident = {
			state: this.states[stateIndex],
			vehiclesInvolved: vehicleCount,
			time: new Date()
		};

		this.accidentPub.next(accident);
	}
}
