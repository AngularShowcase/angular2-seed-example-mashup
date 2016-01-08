import {Component} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {CORE_DIRECTIVES, FORM_DIRECTIVES, Control, ControlGroup, FormBuilder, Validators} from 'angular2/common';
import {QuizServices} from '../../services/QuizServices';
import {Authentication} from '../../services/Authentication';
import {IQuiz, IQuizQuestion, ITest, IUserQuestion, IScoringResult} from '../../../common/interfaces/QuizInterfaces';

@Component({
    selector: 'quiz-admin',
    templateUrl: './components/quiz/QuizAdmin.html',
    styleUrls: ['./components/quiz/QuizAdmin.css'],

    providers: [QuizServices],
    directives: [FORM_DIRECTIVES, CORE_DIRECTIVES]
})
export class QuizAdmin {

    form:ControlGroup;
    categories:Observable<string[]>;
    answerCategories:Observable<string[]>;
    questions:Observable<IQuizQuestion[]>;

    answerCategory:Control = new Control();
    category:Control = new Control();

    constructor(public quizServices:QuizServices,
                public authentication:Authentication,
                public fb:FormBuilder) {

        this.categories = this.quizServices.getCategories();
        this.answerCategories = this.quizServices.getAnswerCategories();

        this.form = fb.group({
            // 'category' : ['', Validators.required],
            'category' : this.category,
            'answerCategory' : this.answerCategory
        });

        this.questions = this.category.valueChanges.distinctUntilChanged()
            .mergeMap(cat => this.quizServices.getQuestionsForCategory(cat));

        this.answerCategory.valueChanges
            .subscribe(acUpdate => {
                console.log('acUpdate', acUpdate);
            });
        this.answerCategory.valueChanges.distinctUntilChanged()
            .subscribe(acUpdate => {
                console.log('acUpdate distinct', acUpdate);
            });
    }

    updateQuestion(question:IQuizQuestion, answer:Control) {
        console.log(`Updating ${question.question} to ${answer.value}.`);
    }
}
