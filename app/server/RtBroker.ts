import {WeatherService} from './workers/WeatherService';
import {IWeatherUpdate} from '../common/interfaces/WeatherInterfaces';
import * as Rx from '@reactivex/rxjs';

export class RtBroker {

	weatherService: WeatherService;
	weatherPub: Rx.Subject<IWeatherUpdate>;

	constructor(public io:SocketIO.Server) {

		this.weatherService = new WeatherService();

		this.io.on('connection', function(socket:SocketIO.Socket){
			//console.log(`Connect from ${socket.client.id}!`);
			console.log('Got a connection.');
		});

		this.weatherPub = this.weatherService.getWeatherUpdatePub();
		this.weatherPub.subscribe(weatherUpdate => this.io.emit('weatherUpdate', weatherUpdate));
	}
}
