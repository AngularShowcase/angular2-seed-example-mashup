import {Component} from 'angular2/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';
import {QuizServices} from '../../services/QuizServices';
import * as RouterMod from 'angular2/router';
import {IQuizQuestion} from '../../../common/interfaces/QuizInterfaces';

@Component({
    templateUrl: './components/quiz/ReviewQuestion.html',
    styleUrls: ['./components/quiz/ReviewQuestion.css'],

    providers: [QuizServices],
    directives: [FORM_DIRECTIVES, CORE_DIRECTIVES, RouterMod.ROUTER_DIRECTIVES]
})
export class ReviewQuestion {

    questionId:number = 0;
    quizId:number = 0;
    question:IQuizQuestion;

    constructor(public quizServices:QuizServices, public routeParams:RouterMod.RouteParams) {
    }

    ngOnInit() {
        this.readQuiz();
    }

    readQuiz() {
        this.questionId = parseInt(this.routeParams.get('questionId'));
        this.quizId = parseInt(this.routeParams.get('quizId'));
    }
}
