import {Component} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {QuizServices} from '../../services/QuizServices';
import {ITest} from '../../../common/interfaces/QuizInterfaces';

@Component({
    selector: 'user-test-list',
    templateUrl: './components/quiz/UserTestList.html',
    styleUrls: ['./components/quiz/UserTestList.css'],
    inputs: ['username'],
    providers: [QuizServices],
    directives: [CORE_DIRECTIVES]
})
export class UserTestList {

    username:string = '';
    userTests:ITest[] = [];

    constructor(public quizServices:QuizServices) {
    }

    ngOnInit() {

        this.quizServices.getUserTests(this.username)
            .subscribe(userTests => this.userTests = userTests);
    }

    reviewTest(testId:number, quizId:number) {
        console.log(`He'd like to review test ${testId}.`);
    }
}
