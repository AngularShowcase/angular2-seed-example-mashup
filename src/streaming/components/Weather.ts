import {Component, EventEmitter} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {MessageBroker} from '../../services/MessageBroker';
import {IWeatherUpdate} from '../../../common/interfaces/WeatherInterfaces';
import {IAccident} from '../../../common/interfaces/TrafficInterfaces';
import {WeatherMap} from '../../directives/WeatherMap';
import {IStateAccidentStats} from './StateAccidentStats';
import {StateStats} from './StateStats';

@Component({
    selector: 'weather',
    templateUrl: './streaming/components/Weather.html',
    styleUrls: ['./streaming/components/Weather.css'],
    pipes: [],
    directives: [CORE_DIRECTIVES, WeatherMap, StateStats]
})
export class Weather {

    weatherUpdates:EventEmitter<IWeatherUpdate>;
    accidentUpdates:EventEmitter<IAccident>;
    lastUpdate:IWeatherUpdate = { city: '', lnglat: [0,0], tempFarenheit: 0, time: new Date() };
    lastAccident:IAccident = { state: '', vehiclesInvolved: 0, time: new Date() };
    lastAccidentReport:string = '';
    stateStats:IStateAccidentStats[] = [];

    constructor(public messaageBroker:MessageBroker) {
        console.log('Weather constructor');
        this.weatherUpdates = messaageBroker.getWeatherUpdates();
        this.accidentUpdates = messaageBroker.getAccidentUpdate();

        let cumAccidents = this.accidentUpdates.scan((stats, accident) => {
            if (!stats.has(accident.state)) {
                stats.set(accident.state, { state: accident.state, numberOfAccidents: 0, numberOfVehicles: 0});
            }
            let stateStat = stats.get(accident.state);
            stateStat.numberOfAccidents += 1;
            stateStat.numberOfVehicles += accident.vehiclesInvolved;
            return stats;
        }, new Map<string, IStateAccidentStats>());

        this.accidentUpdates.subscribe((accident:IAccident) => {
            this.lastAccident = accident;
            this.lastAccidentReport = `${accident.vehiclesInvolved} vehicle accident reported
                                        in ${accident.state} at ${accident.time}.`;
        });

        cumAccidents.subscribe(stats => {
            this.stateStats = _.sortBy(Array.from(stats.values()), acc => -1 * acc.numberOfAccidents);
        });

        this.weatherUpdates.subscribe(w => {
            this.lastUpdate = w;
        });
    }

    ngOnInit() {
        this.logLifecycleEvent('ngOnInit');
    }

    ngOnDestroy() {
        this.logLifecycleEvent('ngOnDestroy');
    }

    ngOnChanges() {
        this.logLifecycleEvent('ngOnChanges');
    }

    ngAfterContentInit() {
        this.logLifecycleEvent('ngAfterContentInit');
    }

    ngDoCheck() {
        //this.logLifecycleEvent('ngDoCheck');   // Fires frequently
    }

    ngAfterContentChecked() {
        //this.logLifecycleEvent('ngAfterContentChecked'); // Fires frequently
    }

    ngAfterViewChecked() {
        //this.logLifecycleEvent('ngAfterViewChecked');  // Fires frequently
    }

    ngAfterViewInit() {
        this.logLifecycleEvent('ngAfterViewInit');
    }

    logLifecycleEvent(lifecycleMethod:string) {
        console.log(`Lifecycle method ${lifecycleMethod} invoked in Weather component.`);
    }
}
