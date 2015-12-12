import {RtBroker} from '../RtBroker';
import {WeatherUpdate} from '../../common/interfaces/WeatherInterfaces';

export module WeatherService {

	let rtBroker:RtBroker = null;
	let sleepTime = 10000;
	let weatherMonitor: WeatherMonitor;

	export function StartService(broker:RtBroker) {
		rtBroker = broker;
		weatherMonitor = new WeatherMonitor();
	}

	export function StopService() {
		if (weatherMonitor) {
			weatherMonitor.stop();
		}
	}

	class WeatherMonitor {

		timer: NodeJS.Timer;

		constructor() {
			this.start();
		}

		start() {
			this.timer = setInterval(() => {
				this.monitorWeather();
			}, sleepTime);
		}

		stop() {
			if (this.timer) {
				clearInterval(this.timer);
			}
		}
		monitorWeather() {
			let update:WeatherUpdate = {
				city: 'New York',
				time: new Date(),
				tempFarenheight: 80
			};

			rtBroker.weatherUpdate(update);
		}
	}
}
