import {EventEmitter, Injectable} from 'angular2/angular2';
import {IWeatherUpdate} from '../common/interfaces/WeatherInterfaces';

@Injectable()
export class MessageBroker {

	io: SocketIOClientStatic;
	socket: SocketIOClient.Socket;
	weatherUpdates: EventEmitter<IWeatherUpdate>;

	constructor() {
		// Connect to the server
		this.io = io;
		this.socket = io.connect();

		// Create publications
		this.weatherUpdates = new EventEmitter<IWeatherUpdate>();

		// Set up publication updating
		this.socket.on('weatherUpdate', (update:IWeatherUpdate) => {
			this.weatherUpdates.next(update);
		});
	}

	getWeatherUpdates() : EventEmitter<IWeatherUpdate> {
		return this.weatherUpdates;
	}
}
