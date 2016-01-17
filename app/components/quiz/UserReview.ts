import {Component} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {Authentication} from '../../services/Authentication';
import {QuizServices} from '../../services/QuizServices';
import {ITest} from '../../../common/interfaces/QuizInterfaces';
import {ROUTER_DIRECTIVES} from 'angular2/router';

@Component({
    selector: 'user-review',
    templateUrl: './components/quiz/UserReview.html',
    styleUrls: ['./components/quiz/UserReview.css'],

    providers: [QuizServices],
    directives: [CORE_DIRECTIVES, ROUTER_DIRECTIVES]
})
export class UserReview {

    username:string = '';
    userTests:ITest[] = [];

    constructor(public authentication:Authentication, public quizServices:QuizServices) {
    }

    ngOnInit() {
        if (!this.authentication.authenticate()) {
            return;
        }

        this.username = this.authentication.user.username;

        this.quizServices.getUserTests(this.username)
            .subscribe(userTests => this.userTests = userTests);
    }
}
