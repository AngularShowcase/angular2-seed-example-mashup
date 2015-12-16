import {Component, EventEmitter, NgFor, AsyncPipe} from 'angular2/angular2';
import {MessageBroker} from '../../services/MessageBroker';
import {IWeatherUpdate} from '../../common/interfaces/WeatherInterfaces';
import {IAccident} from '../../common/interfaces/TrafficInterfaces';
import {WeatherMap} from '../../directives/WeatherMap';

@Component({
    selector: 'weather',
    templateUrl: './components/streaming/Weather.html',
    styleUrls: ['./components/streaming/Weather.css'],
    pipes: [AsyncPipe],
    directives: [NgFor, WeatherMap]
})
export class Weather {

    weatherUpdates:EventEmitter<IWeatherUpdate>;
    accidentUpdates:EventEmitter<IAccident>;

    lastUpdate:IWeatherUpdate = { city: '', lnglat: [0,0], tempFarenheit: 0, time: new Date() };
    lastAccident:IAccident = { state: '', vehiclesInvolved: 0, time: new Date() };

    constructor(public messaageBroker:MessageBroker) {
        this.weatherUpdates = messaageBroker.getWeatherUpdates();
        this.accidentUpdates = messaageBroker.getAccidentUpdate();

        this.accidentUpdates.subscribe(accident => {
            this.lastAccident = accident;
        });

        this.weatherUpdates.subscribe(w => {
            this.lastUpdate = w;
        });
    }
}
