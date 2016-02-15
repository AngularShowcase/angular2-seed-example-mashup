import {Component, EventEmitter} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {QuizServices} from '../../services/QuizServices';
import {ITest} from '../../../common/interfaces/QuizInterfaces';
import {TestCategoryFilter} from './TestCategoryFilter';
import {SortOrder} from '../../models/SortOrder';
import {FieldSortPipe} from '../../pipes/FieldSortPipe';
import {Sortable} from '../../directives/Sortable';
import {SortKey} from '../../directives/SortKey';

@Component({
    selector: 'user-test-list',
    templateUrl: './quiz/components/UserTestList.html',
    styleUrls: ['./quiz/components/UserTestList.css'],
    inputs: ['username', 'filterCategory'],
    outputs: ['selectedTest'],
    pipes: [TestCategoryFilter, FieldSortPipe],
    providers: [QuizServices],
    directives: [CORE_DIRECTIVES, Sortable, SortKey]
})
export class UserTestList {

    username:string = '';
    userTests:ITest[] = [];
    filterCategory:string = null;
    sortOrder:SortOrder;

    selectedTest:EventEmitter<number> = new EventEmitter<number>();
    constructor(public quizServices:QuizServices) {
    }

    ngOnInit() {

        console.log(`UserTestList invoked with username ${this.username}.`);
        this.sortOrder = new SortOrder('testId');

        if (this.username) {
            this.quizServices.getUserTests(this.username)
                .subscribe(userTests => this.userTests = userTests);
        }
    }

    reviewTest(testId:number) {
        console.log(`Selected test ${testId}.`);
        this.selectedTest.next(testId);
    }

    sortOn(newSortOrder:SortOrder) {
        this.sortOrder = newSortOrder;
    }
}
