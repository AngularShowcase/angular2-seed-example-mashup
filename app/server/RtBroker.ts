import {WeatherService} from './workers/WeatherService';
import {WeatherUpdate} from '../common/interfaces/WeatherInterfaces';

export class RtBroker {

	constructor(public io:SocketIO.Server) {

		WeatherService.StartService(this);

		this.io.on('connection', function(socket:SocketIO.Socket){
			//console.log(`Connect from ${socket.client.id}!`);
			console.log('Got a connection.');
		});

	}

	weatherUpdate(update:WeatherUpdate) {
		this.io.emit('weatherUpdate', update);
	}
}
