import {RtBroker} from '../RtBroker';
import {IWeatherUpdate} from '../../common/interfaces/WeatherInterfaces';
import * as Rx from '@reactivex/rxjs';

export class WeatherService {

	sleepTime = 10000;
	weatherPub: Rx.BehaviorSubject<IWeatherUpdate>;
	timer: any;

	constructor(public rtBroker:RtBroker) {
		this.start();
	}

	start() {
		this.timer = setInterval(() => {
			this.monitorWeather();
		}, this.sleepTime);
	}

	stop() {
		if (this.timer) {
			clearInterval(this.timer);
		}
	}

	monitorWeather() {
		let update:IWeatherUpdate = {
			city: 'New York',
			time: new Date(),
			tempFarenheight: 80
		};

		this.rtBroker.weatherUpdate(update);
	}
}
