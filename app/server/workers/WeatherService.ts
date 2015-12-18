import {IWeatherUpdate} from '../../common/interfaces/WeatherInterfaces';
import * as Rx from '@reactivex/rxjs';

interface ILocation {
	name: string;
	lnglat: [number, number];
};

export class WeatherService {

	sleepTime = 500;
	weatherPub: Rx.Subject<IWeatherUpdate>;
	timer: any;
	cities:ILocation[];

	constructor() {
		this.cities = [
			{ name: 'Bangor', lnglat: [ -67.619761107477302, 44.519754357919702 ] },
			{ name: 'New York', lnglat: [ -71.926802380749692, 41.290122059153795 ] },
			{ name: 'Washington DC', lnglat: [ -76.029463, 37.953775 ] },
			{ name: 'Winston-Salem', lnglat: [ -78.541087, 33.851112 ] },
			{ name: 'Miami', lnglat: [ -85.114268, 29.688658 ] },
			{ name: 'Chicago', lnglat: [ -87.532776, 39.971077 ] },
			{ name: 'Detroit', lnglat: [ -88.684434, 48.115785 ] },
			{ name: 'Lincoln', lnglat: [ -95.697281, 40.536985 ] },
			{ name: 'Tulsa', lnglat: [ -94.528927834931892, 33.621839964367602 ] },
			{ name: 'Dallas', lnglat: [ -97.132473080391691, 27.8977671032813 ] },
			{ name: 'Bute', lnglat: [ -104.057698, 44.997431 ] },
			{ name: 'Las Vegas', lnglat: [ -114.050167, 36.624978 ] },
			{ name: 'Boise', lnglat: [ -112.109532, 41.997598 ] },
			{ name: 'Los Angeles', lnglat: [ -122.430957929966013, 37.8722420698438 ] },
			{ name: 'Seattle', lnglat: [ -124.01366, 46.90363 ] }
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
