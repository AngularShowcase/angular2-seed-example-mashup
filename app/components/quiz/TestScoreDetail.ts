import {Component} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {ITest, IQuiz, IQuizQuestion} from '../../../common/interfaces/QuizInterfaces';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';

@Component({
    selector: 'test-score-detail',
    templateUrl: './components/quiz/TestScoreDetail.html',
    styleUrls: ['./components/quiz/TestScoreDetail.css'],
    inputs: ['test', 'quiz'],
    providers: [],
    directives: [CORE_DIRECTIVES, ROUTER_DIRECTIVES]
})
export class TestScoreDetail {

    constructor(public router:Router) {

    }

    _quiz:IQuiz = {
        quizId: 0,
        categories: [],
        questionCount: 0,
        userQuestions: []
    };

    _test:ITest = {
        testId: 0,
        quizId: 0,
        user: '',
        questionCount: 0,
        dateTaken: new Date(),
        completed: false,
        answers: [],
        sectionResults: [],
        testResult: null
    };

    questions:any[] = [];

    get quiz():IQuiz {
        return this._quiz;
    }

    set quiz(val:IQuiz) {
        this._quiz = val;
        this.buildResults();
    }

    get test():ITest {
        return this._test;
    }

    set test(val:ITest) {
        this._test = val;
        this.buildResults();
    }

    reviewQuestion(q:IQuizQuestion, questionNumber:number) {
        console.log(`Reviewing question number ${questionNumber} of quiz ${this.quiz.quizId} (questionId: ${q.questionId})`);
        this.router.navigate(['./ReviewQuestion', {quizId: this.quiz.quizId, questionId: q.questionId}]);
    }

    buildResults() {
        if (this.test.testId === 0 || this.quiz.quizId === 0) {
            return;     //Not all necessary properties have been set
        }

        this.questions = this.quiz.userQuestions.map(q => {
            let answer = this.test.answers.find(a => a.questionNumber === q.questionNumber);
            return {
                questionNumber: q.questionNumber,
                questionId: q.questionId,
                question: q.question,
                category: q.category,
                answerCategory: q.answerCategory,
                correctAnswer: q.correctAnswer,
                userAnswer: answer ? answer.userAnswer : '',
                isCorrect: answer ? answer.isCorrect : false
            };
        });
    }
}
