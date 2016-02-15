import {Component} from 'angular2/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';
import {QuizServices} from '../../services/QuizServices';
import {Authentication} from '../../services/Authentication';
import {MultiCategorySelect} from './MultiCategorySelect';
import {Router} from 'angular2/router';
import {IQuiz, ITest} from '../../../common/interfaces/QuizInterfaces';

@Component({
    selector: 'quiz-creation',
    templateUrl: './quiz/components/QuizCreation.html',
    styleUrls: ['./quiz/components/QuizCreation.css'],

    viewProviders: [QuizServices],
    directives: [FORM_DIRECTIVES, CORE_DIRECTIVES, MultiCategorySelect]
})
export class QuizCreation {

    selectedCategories:string[] = [];
    questionCount:number = 0;
    username:string = '';

    constructor(public quizServices:QuizServices, public router:Router, public authentication:Authentication) {

    }

    ngOnInit() {
        if (!this.authentication.authenticate()) {
            return;
        }

        this.username = this.authentication.user.username;
    }

    selectCategories(categories:string[]) {
        this.selectedCategories = categories;
        if (this.questionCount < this.selectedCategories.length) {
            this.questionCount = this.selectedCategories.length;  //You need at least one question per selected category
        }
    }

    createQuiz() {
        let quiz:IQuiz;

        this.quizServices.createQuiz(this.selectedCategories, this.questionCount)
            .flatMap(q => {
                quiz = q;
                return this.quizServices.createTest(quiz.quizId, this.username);
            })
            .subscribe((test:ITest) => {
                    console.log(`Created quiz ${quiz.quizId} (test ${test.testId}) with ${quiz.questionCount} questions.`);
                    this.router.navigate(['/ProctorExam', {testId:test.testId}]);
                },
                err => console.log('Error', err));
    }
}
