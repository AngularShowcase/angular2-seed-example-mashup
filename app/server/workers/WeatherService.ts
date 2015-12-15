import {IWeatherUpdate} from '../../common/interfaces/WeatherInterfaces';
import * as Rx from '@reactivex/rxjs';

interface ILocation {
	name: string;
	lnglat: [number, number];
};

export class WeatherService {

	sleepTime = 2000;
	weatherPub: Rx.Subject<IWeatherUpdate>;
	timer: any;
	cities:ILocation[];

	constructor() {
		this.cities = [
			{ name: 'New York', lnglat: [ -71.926802380749692, 41.290122059153795 ] },
			{ name: 'Chicago', lnglat: [ -87.532776, 39.971077 ] },
			{ name: 'Los Angeles', lnglat: [ -122.430957929966013, 37.8722420698438 ] },
			{ name: 'Miami', lnglat: [ -85.114268, 29.688658 ] },
			{ name: 'Washington DC', lnglat: [ -76.029463, 37.953775 ] },
			{ name: 'Dallas', lnglat: [ -97.132473080391691, 27.8977671032813 ] },
			{ name: 'Las Vegas', lnglat: [ -114.050167, 36.624978 ] }
			];
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
		let index:number = Math.floor(Math.random() * this.cities.length);

		let update:IWeatherUpdate = {
			city: this.cities[index].name,
			lnglat: this.cities[index].lnglat,
			time: new Date(),
			tempFarenheit: Math.floor(Math.random() * 80) + 20
		};

		this.weatherPub.next(update);
	}
}
