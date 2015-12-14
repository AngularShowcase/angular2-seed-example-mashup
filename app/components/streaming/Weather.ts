import {Component, EventEmitter, NgFor, AsyncPipe} from 'angular2/angular2';
import {MessageBroker} from '../../services/MessageBroker';
import {IWeatherUpdate} from '../../common/interfaces/WeatherInterfaces';
import {WeatherMap} from '../../directives/WeatherMap';

@Component({
    selector: 'weather',
    templateUrl: './components/streaming/Weather.html',
    styleUrls: ['./components/streaming/Weather.css'],
    viewProviders: [MessageBroker],
    pipes: [AsyncPipe],
    directives: [NgFor, WeatherMap]
})
export class Weather {

    weatherUpdates:EventEmitter<IWeatherUpdate>;
    updates:IWeatherUpdate[] = [];
    MaxLen:number = 10;
    lastUpdate:IWeatherUpdate = { city: '', lnglat: [0,0], tempFarenheit: 0, time: new Date() };

    constructor(public messaageBroker:MessageBroker) {
        this.weatherUpdates = messaageBroker.getWeatherUpdates();

        this.weatherUpdates.subscribe(w => {
            //console.log('Got ', w);

            this.lastUpdate = w;

            this.updates.unshift(w);

            if (this.updates.length > this.MaxLen) {
                this.updates.pop();
            }
        });
    }
}
