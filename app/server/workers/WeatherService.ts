import {RtBroker} from '../RtBroker';

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
			let now = new Date();
			let update = `Weather update at ${now}`;
			rtBroker.weatherUpdate(update);
		}
	}
}
