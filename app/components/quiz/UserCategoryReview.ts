import {Component, EventEmitter} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {QuizServices} from '../../services/QuizServices';
import {ITest} from '../../../common/interfaces/QuizInterfaces';

@Component({
    selector: 'user-category-review',
    templateUrl: './components/quiz/UserCategoryReview.html',
    styleUrls: ['./components/quiz/UserCategoryReview.css'],
    inputs: ['username'],
    providers: [QuizServices],
    directives: [CORE_DIRECTIVES]
})
export class UserCategoryReview {

    username:string = '';
    constructor(public quizServices:QuizServices) {
    }

    ngOnInit() {

        console.log(`UserCategoryReview invoked with username ${this.username}.`);
        if (this.username) {
        }
    }
}
