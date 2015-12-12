export module WeatherService {

	let sleepTime = 60000;
	let weatherMonitor: WeatherMonitor;

	export function StartService() {
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
			console.log(`Weather monitor awake at ${now}`);
		}
	}
}
