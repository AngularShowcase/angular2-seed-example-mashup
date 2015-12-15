import {EventEmitter, Injectable} from 'angular2/angular2';
import {IWeatherUpdate} from '../common/interfaces/WeatherInterfaces';
import {IAccident} from '../common/interfaces/TrafficInterfaces';

@Injectable()
export class MessageBroker {

	io: SocketIOClientStatic;
	socket: SocketIOClient.Socket;
	weatherUpdates: EventEmitter<IWeatherUpdate>;
	accidentUpdates: EventEmitter<IAccident>;

	constructor() {
		// Connect to the server
		this.io = io;
		this.socket = io.connect();

		// Create publications
		this.weatherUpdates = new EventEmitter<IWeatherUpdate>();
		this.accidentUpdates = new EventEmitter<IAccident>();

		// Set up publication updating
		this.socket.on('weatherUpdate', (update:IWeatherUpdate) => {
			this.weatherUpdates.next(update);
		});

		this.socket.on('accident', (accident:IAccident) => {
			console.log(`Accident involving ${accident.vehiclesInvolved} vehicles in ${accident.state} at ${accident.time}.`);
			this.accidentUpdates.next(accident);
		});
	}

	getWeatherUpdates() : EventEmitter<IWeatherUpdate> {
		return this.weatherUpdates;
	}
}
