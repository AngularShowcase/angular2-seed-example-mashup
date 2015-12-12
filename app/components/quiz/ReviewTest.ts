import {Component, FORM_DIRECTIVES, NgFor, NgClass} from 'angular2/angular2';
import {QuizServices} from '../../services/QuizServices';
import * as RouterMod from 'angular2/router';
import {IQuiz, ITest} from '../../common/interfaces/QuizInterfaces';
import {TestScoreSummary} from './TestScoreSummary';
import {TestScoreDetail} from './TestScoreDetail';

@Component({
    selector: 'review-test',
    templateUrl: './components/quiz/ReviewTest.html',
    styleUrls: ['./components/quiz/ReviewTest.css'],

    viewBindings: [QuizServices],
    directives: [FORM_DIRECTIVES, NgFor, NgClass, TestScoreSummary, TestScoreDetail]
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
        this.readTest();
    }

    readTest() {
        let testId = parseInt(this.routeParams.get('testId'));

        this.quizServices.getTest(testId)
            .flatMap(test => {
                this.test = test;
                return this.quizServices.getQuiz(test.quizId);
            })
            .subscribe((quiz:IQuiz) => this.quiz = quiz);
    }

}
