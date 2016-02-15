import {Component} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {ReplaySubject} from 'rxjs/subject/ReplaySubject';
import {CORE_DIRECTIVES, FORM_DIRECTIVES, Control, ControlGroup, FormBuilder} from 'angular2/common';
import {QuizServices} from '../../services/QuizServices';
import {Authentication} from '../../services/Authentication';
import {IQuizQuestion} from '../../../common/interfaces/QuizInterfaces';
import {EditableField} from '../../common/components/EditableField';

@Component({
    selector: 'quiz-admin',
    templateUrl: './quiz/components/QuizAdmin.html',
    styleUrls: ['./quiz/components/QuizAdmin.css'],

    providers: [QuizServices],
    directives: [FORM_DIRECTIVES, CORE_DIRECTIVES, EditableField]
})
export class QuizAdmin {

    form:ControlGroup;
    categories:Observable<string[]>;
    answerCategories:Observable<string[]>;
    questions:Observable<IQuizQuestion[]>;
    filteredQuestions:Observable<IQuizQuestion[]>;
    answerCategoryList:string[];    //We need this array to pass to the EditableField components in used in our template

    answerCategoryControl:Control = new Control();
    categoryControl:Control = new Control();

    constructor(public quizServices:QuizServices,
                public authentication:Authentication,
                public fb:FormBuilder) {

    }

    ngOnInit() {

        this.form = this.fb.group({
            // 'category' : ['', Validators.required],
            'category' : this.categoryControl,
            'answerCategory' : this.answerCategoryControl
        });

        this.loadData();
    }

    loadData() {

        this.categories = this.quizServices.getCategories();
        let categoryChanges = this.categoryControl.valueChanges.distinctUntilChanged();

        categoryChanges.subscribe(category => console.log(`Category changed to ${category}.`));

        // Whenever the category changes, emit a list of questions for that category
        // We use ReplaySubject so that multiple subscriptions to the new questions
        // do not result in separate HTTP GET requests.  From the documentation of
        // ReplaySubject: "Each notification is broadcasted to all subscribed and FUTURE observers, subject to buffer trimming policies."
        // For a discussion of this, see http://stackoverflow.com/questions/34018252/hot-and-shared-observable-from-an-eventemitter

        let q:Observable<IQuizQuestion[]> = categoryChanges.mergeMap(cat => this.quizServices.getQuestionsForCategory(cat));
        this.questions = new ReplaySubject<IQuizQuestion[]>(1);
        q.subscribe(this.questions);

        // Whenever questions are emitted, emit a list of unique answer categories for those questions
        this.answerCategories = this.questions.map(questions => _.uniq(questions.map(q => q.answerCategory)));

        // Whenever we get a new list of answer categories, clear any selection
        this.answerCategories.subscribe(_ => this.answerCategoryControl.updateValue(''));

        // We need to maintain a separate array of the latest values since this is passed
        // to the EditableField components used in our template.
        this.answerCategories.subscribe(ansCatList => this.answerCategoryList = ansCatList);

        // Observable of selected answer categories including the one set above
        let selectedAnswerCategories:Observable<string> = this.answerCategoryControl.valueChanges.distinctUntilChanged();

        // Whenever the questions change or the selected answer category, refilter the question list
        this.filteredQuestions = this.questions.combineLatest(selectedAnswerCategories,
                (latestQuestions:IQuizQuestion[], latestAnswerCategory:string) =>
                    latestQuestions.filter(q => q.answerCategory === (latestAnswerCategory || q.answerCategory)));
    }

    // Action when update button is pressed

    updateQuestion(question:IQuizQuestion) {

        console.log(`Updating ${question.question} to ${question.answerCategory} - ${question.answer}.`);

        this.quizServices.updateQuestion(question)
            .subscribe( q => {

                // Copy back fields in case they were normalized by the server
                question.answer = q.answer;
                question.answerCategory = q.answerCategory;

                // Cause a requery for the questions category (whatever it may be)

                console.log(`Attempting to change category to ${this.categoryControl.value}`);
                this.categoryControl.updateValue(q.category, {emitEvent: true});

                // Wait a bit to get the new questions

                setTimeout(() =>  {
                    this.answerCategoryControl.updateValue(q.answerCategory, {emitEvent: true});
                }, 1000);

            }, err => console.log('Error: ', err));
    }

    undo(...editableFields) {
        editableFields.forEach(ef => ef.undo());
    }
}
