import {Component, EventEmitter, NgFor} from 'angular2/angular2';
import {FORM_DIRECTIVES, NgClass} from 'angular2/angular2';

@Component({
    selector: 'tree-display-control',
    inputs: [	'maxLevels:max-levels',
					'leftLabel:left-label',
					'rightLabel:right-label',
					'canvasBackgroundColor:canvas-background-color',
					'nodeColor:node-color',
					'nodeLabelColor:node-label-color',
					'connectorColor:connector-color',
					'connectorLabelColor:connector-label-color',
                    'inputLabelColor:input-label-color',
                    'inputValueColor:input-value-color'
    ],
    outputs: ['valuechange'],
    templateUrl: './directives/TreeDisplayControl.html',
    directives: [FORM_DIRECTIVES, NgClass, NgFor]
})

export class TreeDisplayControl {

    maxTreeLevels = 4;
    canvasBackgroundColor = 'gray';
    nodeColor = 'black';
    nodeLabelColor =  'white';
    connectorColor =  'red';
    connectorLabelColor =  'black';
    valuechange:EventEmitter<any>;
    inputLabelColor:string = 'blue';
    inputValueColor:string = 'black';

    constructor() {
        console.log('Component TreeDisplayControl constructed');
        this.valuechange = new EventEmitter();
    }

    onValueChanged($event) {
        this.valuechange.next($event);
    }
}
