import {Component} from 'angular2/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';
import {QuizServices} from '../../services/QuizServices';
import {Authentication} from '../../services/Authentication';
import {MultiCategorySelect} from './MultiCategorySelect';
import {Router} from 'angular2/router';

@Component({
    selector: 'quiz-creation',
    templateUrl: './components/quiz/QuizCreation.html',
    styleUrls: ['./components/quiz/QuizCreation.css'],

    viewProviders: [QuizServices],
    directives: [FORM_DIRECTIVES, CORE_DIRECTIVES, MultiCategorySelect]
})
export class QuizCreation {

    selectedCategories:string[] = [];
    questionCount:number = 0;

    constructor(public quizServices:QuizServices, public router:Router, public authentication:Authentication) {

        if (!this.authentication.authenticate()) {
            return;
        }
    }

    selectCategories(categories:string[]) {
        this.selectedCategories = categories;
        if (this.questionCount < this.selectedCategories.length) {
            this.questionCount = this.selectedCategories.length;  //You need at least one question per selected category
        }
    }

    createQuiz() {
        this.quizServices.createQuiz(this.selectedCategories, this.questionCount)
            .subscribe(q => {
                    console.log(`Created quiz ${q.quizId} with ${q.questionCount} questions.`);
                    this.router.navigateByUrl(`/quiz/proctorexam/${q.quizId}`);
                },
                err => console.log('Error', err));
    }
}
