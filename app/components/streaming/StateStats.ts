import {Component} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {IStateAccidentStats} from './StateAccidentStats';

@Component({
    selector: 'state-stats',
    templateUrl: './components/streaming/StateStats.html',
    styleUrls: ['./components/streaming/StateStats.css'],
    inputs: ['stats'],
    directives: [CORE_DIRECTIVES]
})
export class StateStats {
    stats:IStateAccidentStats[] = [];
}
