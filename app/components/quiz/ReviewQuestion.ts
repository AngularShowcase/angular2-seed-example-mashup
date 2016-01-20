import {Component} from 'angular2/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';
import {QuizServices} from '../../services/QuizServices';
import * as RouterMod from 'angular2/router';
import {IQuiz, IQuizQuestion, IUserQuestion} from '../../../common/interfaces/QuizInterfaces';

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
    quiz:IQuiz;
    userQuestion:IUserQuestion;
    //  = {
    //     	questionNumber: 0,
    //         question: '',
    //         category: '',
    //         questionId: 0,
    //         answerCategory: '',
    //         responsesShown: [],
    //         correctAnswer: ''
    // };

    constructor(public quizServices:QuizServices, public routeParams:RouterMod.RouteParams) {
    }

    ngOnInit() {
        this.readQuiz();
    }

    readQuiz() {
        this.questionId = parseInt(this.routeParams.get('questionId'));
        this.quizId = parseInt(this.routeParams.get('quizId'));

        this.quizServices.getQuiz(this.quizId)
            .zip(this.quizServices.getQuestion(this.questionId))
            .subscribe((result:any[]) => {
                this.quiz = result[0];
                this.question = result[1];
                this.userQuestion = this.quiz.userQuestions.find(uq => uq.questionId === this.questionId);
                console.log(this.userQuestion);
            });
    }
}
