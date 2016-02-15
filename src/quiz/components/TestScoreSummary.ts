import {Component, EventEmitter} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {ITest} from '../../../common/interfaces/QuizInterfaces';

@Component({
    selector: 'test-score-summary',
    templateUrl: './quiz/components/TestScoreSummary.html',
    styleUrls: ['./quiz/components/TestScoreSummary.css'],
    inputs: ['test'],
    outputs: ['selectedCategory'],
    providers: [],
    directives: [CORE_DIRECTIVES]
})
export class TestScoreSummary {

    test:ITest;
    selectedCategory:EventEmitter<string> = new EventEmitter<string>();

    onSelectedCategory(category:string) {
        this.selectedCategory.next(category);
    }
}
