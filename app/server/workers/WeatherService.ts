import {IWeatherUpdate} from '../../common/interfaces/WeatherInterfaces';
import * as Rx from '@reactivex/rxjs';

export class WeatherService {

	sleepTime = 10000;
	weatherPub: Rx.Subject<IWeatherUpdate>;
	timer: any;

	constructor() {
		this.weatherPub = new Rx.Subject<IWeatherUpdate>();
		this.start();
	}

	getWeatherUpdatePub() : Rx.Subject<IWeatherUpdate> {
		return this.weatherPub;
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

		this.weatherPub.next(update);
	}
}
