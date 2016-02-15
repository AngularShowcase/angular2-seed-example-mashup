import {Component} from 'angular2/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';
import {QuizServices} from '../../services/QuizServices';
import * as RouterMod from 'angular2/router';
import {IQuiz, IUserQuestion} from '../../../common/interfaces/QuizInterfaces';

@Component({
    templateUrl: './quiz/components/ReviewQuestion.html',
    styleUrls: ['./quiz/components/ReviewQuestion.css'],

    providers: [QuizServices],
    directives: [FORM_DIRECTIVES, CORE_DIRECTIVES, RouterMod.ROUTER_DIRECTIVES]
})
export class ReviewQuestion {

    questionId:number = 0;
    quizId:number = 0;
    quiz:IQuiz;
    userQuestion:IUserQuestion;

    constructor(public quizServices:QuizServices, public routeParams:RouterMod.RouteParams) {
    }

    ngOnInit() {
        this.readQuiz();
    }

    readQuiz() {
        this.quizId = parseInt(this.routeParams.get('quizId'));
        this.questionId = parseInt(this.routeParams.get('questionId'));

        this.quizServices.getQuiz(this.quizId)
            .subscribe(quiz => {
                this.quiz = quiz;
                this.userQuestion = this.quiz.userQuestions.find(uq => uq.questionId === this.questionId);
                // console.log(this.userQuestion);
            });
    }

    getChoiceClass(choice:string) : string {
        return (choice === this.userQuestion.correctAnswer) ? 'correct' : '';
    }
}
