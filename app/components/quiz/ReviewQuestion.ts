import {Component} from 'angular2/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';
import {QuizServices} from '../../services/QuizServices';
import * as RouterMod from 'angular2/router';
import {IQuiz, ITest} from '../../../common/interfaces/QuizInterfaces';

@Component({
    templateUrl: './components/quiz/ReviewQuestion.html',
    styleUrls: ['./components/quiz/ReviewQuestion.css'],

    providers: [QuizServices],
    directives: [FORM_DIRECTIVES, CORE_DIRECTIVES, RouterMod.ROUTER_DIRECTIVES]
})
export class ReviewQuestion {

    questionNumber:number = 0;

    quiz:IQuiz = {
        quizId: 0,
        categories: [],
        questionCount: 0,
        userQuestions: []
    };

    constructor(public quizServices:QuizServices, public routeParams:RouterMod.RouteParams) {
    }

    ngOnInit() {
        this.readQuiz();
    }

    readQuiz() {
        this.questionNumber = parseInt(this.routeParams.get('questionNumber'));
    }
}
