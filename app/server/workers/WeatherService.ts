import {IWeatherUpdate} from '../../common/interfaces/WeatherInterfaces';
import * as Rx from '@reactivex/rxjs';

export class WeatherService {

	sleepTime = 2000;
	weatherPub: Rx.Subject<IWeatherUpdate>;
	timer: any;
	cities:string[];

	constructor() {
		this.cities = ['New York', 'Los Angeles', 'Chicago', 'Miami', 'Dallas', 'Washington'];
		this.weatherPub = new Rx.Subject<IWeatherUpdate>();
		//this.start();
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
		let index:number = Math.floor(Math.random() * this.cities.length);

		let update:IWeatherUpdate = {
			city: this.cities[index],
			time: new Date(),
			tempFarenheit: Math.floor(Math.random() * 80) + 20
		};

		this.weatherPub.next(update);
	}
}
