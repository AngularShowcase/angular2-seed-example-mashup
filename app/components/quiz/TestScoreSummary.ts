import {Component} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {ITest} from '../../common/interfaces/QuizInterfaces';

@Component({
    selector: 'test-score-summary',
    templateUrl: './components/quiz/TestScoreSummary.html',
    styleUrls: ['./components/quiz/TestScoreSummary.css'],
    inputs: ['test'],
    viewBindings: [],
    directives: [CORE_DIRECTIVES]
})
export class TestScoreSummary {

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
}
