import {EventEmitter, Injectable} from 'angular2/core';
import {IWeatherUpdate} from '../common/interfaces/WeatherInterfaces';
import {IAccident} from '../common/interfaces/TrafficInterfaces';
import {IChatMessage} from '../common/interfaces/ChatInterfaces';

@Injectable()
export class MessageBroker {

	io: SocketIOClientStatic;
	socket: SocketIOClient.Socket;
	weatherUpdates: EventEmitter<IWeatherUpdate>;
	accidentUpdates: EventEmitter<IAccident>;
    chatMessages: EventEmitter<IChatMessage>;

    weatherUpdateCount: number = 0;

	constructor() {
        console.log(`Constructed MessageBroker at ${new Date()}`);

		// Connect to the server
		this.io = io;
		this.socket = io.connect();

		// Create publications
		this.weatherUpdates = new EventEmitter<IWeatherUpdate>();
		this.accidentUpdates = new EventEmitter<IAccident>();
        this.chatMessages = new EventEmitter<IChatMessage>();

		// Set up publication updating
		this.socket.on('weatherUpdate', (update:IWeatherUpdate) => {
			this.weatherUpdates.next(update);
            this.weatherUpdateCount += 1;
            //this.socket.emit('chat', `Thanks.  You've sent me ${this.weatherUpdateCount} weather updates.`);
		});

		this.socket.on('accident', (accident:IAccident) => {
			//console.log(`Accident involving ${accident.vehiclesInvolved} vehicles in ${accident.state} at ${accident.time}.`);
			this.accidentUpdates.next(accident);
		});

        // For some reason, dates are coming across
        // the wire as strings.  We need to convert them.
		this.socket.on('usermessage', (message:IChatMessage) => {
            if (typeof(message.time) === 'string') {
                message.time = new Date(<any> message.time);
            }
			console.log(`Server sent chat message from ${message.username} at ${message.time}.`);
            this.chatMessages.next(message);
		});
	}

	getWeatherUpdates() : EventEmitter<IWeatherUpdate> {
		return this.weatherUpdates;
	}

    getAccidentUpdate() : EventEmitter<IAccident> {
        return this.accidentUpdates;
    }

    getChatMessages() : EventEmitter<IChatMessage> {
        return this.chatMessages;
    }

    sendChatMessage(message:IChatMessage) {
        if (!this.socket) {
            return;
        }

        this.socket.emit('chat', message);
    }
}
