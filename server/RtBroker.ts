import {WeatherService} from './workers/WeatherService';
import {IWeatherUpdate} from '../common/interfaces/WeatherInterfaces';
import {IAccident} from '../common/interfaces/TrafficInterfaces';
import {TrafficService} from './workers/TrafficService';
import {IChatMessage} from '../common/interfaces/ChatInterfaces';

declare var Promise: any;
import {Subject} from 'rxjs/Subject';

// import 'rxjs/add/operators/map';
// import 'rxjs/add/observable/interval';
// import 'rxjs/add/operators/where';

export class RtBroker {

	weatherService: WeatherService;
	trafficService: TrafficService;

	weatherPub: Subject<IWeatherUpdate>;
	accidentPub: Subject<IAccident>;
    online:number = 0;

	constructor(public io:SocketIO.Server) {

		this.weatherService = new WeatherService();
		this.trafficService = new TrafficService();

		this.io.on('connection', (socket:SocketIO.Socket) => {
			console.log(`Connect from ${socket.client.id}!`);
            this.online += 1;
            console.log(`${this.online} clients online.`);

            socket.on('chat', (msg:IChatMessage) => {
                console.log(`Got chat message from ${socket.client.id} user ${msg.username}.  Msg: ${msg.message}`);
                this.io.emit('usermessage', msg);
            });

            socket.on('disconnect',  (reason) => {
                console.log(`Disconnect from ${socket.client.id}; reason: ${reason}.`);
                this.online -= 1;
                console.log(`${this.online} clients online.`);
            });
		});

		this.weatherPub = this.weatherService.getWeatherUpdatePub();
		this.weatherPub.subscribe(weatherUpdate => this.io.emit('weatherUpdate', weatherUpdate));

		this.accidentPub = this.trafficService.getAccidentPub();
		this.accidentPub.subscribe(accident => this.io.emit('accident', accident));
	}
}
