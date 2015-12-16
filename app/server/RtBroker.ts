import {WeatherService} from './workers/WeatherService';
import {IWeatherUpdate} from '../common/interfaces/WeatherInterfaces';
import {IAccident} from '../common/interfaces/TrafficInterfaces';
import {TrafficService} from './workers/TrafficService';

import * as Rx from '@reactivex/rxjs';

export class RtBroker {

	weatherService: WeatherService;
	trafficService: TrafficService;

	weatherPub: Rx.Subject<IWeatherUpdate>;
	accidentPub: Rx.Subject<IAccident>;
    online:number = 0;

	constructor(public io:SocketIO.Server) {

		this.weatherService = new WeatherService();
		this.trafficService = new TrafficService();

		this.io.on('connection', (socket:SocketIO.Socket) => {
			console.log(`Connect from ${socket.client.id}!`);
            this.online += 1;
            console.log(`${this.online} clients online.`);
		});

        this.io.on('disconnect',  (who) => {
            console.log(`Disconnect from ${who}.`);
            this.online -= 1;
            console.log(`${this.online} clients online.`);
        });


		this.weatherPub = this.weatherService.getWeatherUpdatePub();
		this.weatherPub.subscribe(weatherUpdate => this.io.emit('weatherUpdate', weatherUpdate));

		this.accidentPub = this.trafficService.getAccidentPub();
		this.accidentPub.subscribe(accident => this.io.emit('accident', accident));
	}
}
