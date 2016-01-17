import {Component} from 'angular2/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';
import {QuizServices} from '../../services/QuizServices';
import * as RouterMod from 'angular2/router';
import {IQuiz, ITest} from '../../../common/interfaces/QuizInterfaces';
import {TestScoreSummary} from './TestScoreSummary';
import {TestScoreDetail} from './TestScoreDetail';

@Component({
    selector: 'review-test',
    templateUrl: './components/quiz/ReviewTest.html',
    styleUrls: ['./components/quiz/ReviewTest.css'],

    providers: [QuizServices],
    directives: [FORM_DIRECTIVES, CORE_DIRECTIVES, TestScoreSummary, TestScoreDetail]
})
export class ReviewTest {

    quiz:IQuiz = {
        quizId: 0,
        categories: [],
        questionCount: 0,
        userQuestions: []
    };

    test:ITest = {
        testId: 0,
        quizId: 0,
        user: '',
        questionCount: 0,
        dateTaken: new Date(),
        completed: false,
        answers: [],
        sectionResults: [],
        testResult: {
            sectionName: 'total',
            questionCount: 0,
            correctCount: 0,
            incorrectCount: 0,
            score: 0
        }
    };

    constructor(public quizServices:QuizServices, public routeParams:RouterMod.RouteParams) {
    }

    ngOnInit() {
        this.readTest();
    }

    readTest() {
        let testId = parseInt(this.routeParams.get('testId'));

        this.quizServices.getTest(testId)
            .mergeMap(test => {
                this.test = test;
                return this.quizServices.getQuiz(test.quizId);
            })
            .subscribe((quiz:IQuiz) => this.quiz = quiz);
    }

}
