import {WeatherService} from './workers/WeatherService';
import {IWeatherUpdate} from '../common/interfaces/WeatherInterfaces';

export class RtBroker {

	weatherService: WeatherService;

	constructor(public io:SocketIO.Server) {

		this.weatherService = new WeatherService(this);

		this.io.on('connection', function(socket:SocketIO.Socket){
			//console.log(`Connect from ${socket.client.id}!`);
			console.log('Got a connection.');
		});

	}

	weatherUpdate(update:IWeatherUpdate) {
		this.io.emit('weatherUpdate', update);
	}
}
