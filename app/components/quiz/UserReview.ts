import {Component} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {Authentication} from '../../services/Authentication';
import {QuizServices} from '../../services/QuizServices';
//import {IQuiz, ITest} from '../../../common/interfaces/QuizInterfaces';

@Component({
    selector: 'user-review',
    templateUrl: './components/quiz/UserReview.html',
    styleUrls: ['./components/quiz/UserReview.css'],

    providers: [QuizServices],
    directives: [CORE_DIRECTIVES]
})
export class UserReview {

    username:string = '';

    constructor(public authentication:Authentication, public quizServices:QuizServices) {
    }

    ngOnInit() {
        if (!this.authentication.authenticate()) {
            return;
        }

        this.username = this.authentication.user.username;
    }
}
