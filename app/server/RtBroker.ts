import {WeatherService} from './workers/WeatherService';

export class RtBroker {

	constructor(public io:SocketIO.Server) {

		WeatherService.StartService(this);

		this.io.on('connection', function(){
			console.log('Connect!');

			setTimeout(function(){
				console.log('sending weather update from broker.');
				io.emit('weatherUpdate', 1);
				io.emit('weatherUpdate', 2);
				io.emit('weatherUpdate', 3);
				io.emit('weatherUpdate', 4);
				io.emit('weatherUpdate', 5);
				console.log('sent weather update');
			}, 1000);
		});

	}

	weatherUpdate(update:string) {
		this.io.emit('weatherUpdate', update);
	}
}
