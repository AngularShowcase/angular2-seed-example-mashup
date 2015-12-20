import {Component} from 'angular2/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';
import {QuizServices} from '../../services/QuizServices';
import {IQuizQuestion} from '../../common/interfaces/QuizInterfaces';
import {Router} from 'angular2/router';

// The DI will fail if you import from '../../services/authentication' (case matters)
import {Authentication} from '../../services/Authentication';

@Component({
    selector: 'question-entry',
    templateUrl: './components/quiz/QuestionEntry.html',
    styleUrls: ['./components/quiz/QuestionEntry.css'],

    viewProviders: [QuizServices],
    directives: [FORM_DIRECTIVES, CORE_DIRECTIVES]
})

export class QuestionEntry {

    newCategory:string;
    question:string;
    newAnswerCategory:string;
    answer:string;
    allQuestions:IQuizQuestion[] = [];
    categories:string[] = [];
    _selectedCategory:string = '';
    answerCategories:string[] = [];
    _selectedAnswerCategory:string = '';

    get selectedCategory() : string {
        return this._selectedCategory;
    }

    set selectedCategory(value:string) {
        this._selectedCategory = value;
        this.readQuestions();
    }

    get selectedAnswerCategory() : string {
        return this._selectedAnswerCategory;
    }

    set selectedAnswerCategory(value:string) {
        this._selectedAnswerCategory = value;
        this.readQuestions();
    }

    constructor(public quizServices:QuizServices, public authentication:Authentication, public router:Router) {

        if (!this.authentication.authenticate()) {
            return;
        }

        this.readCategories();
    }

    addQuestion() {
        console.log(`Adding question ${this.question} in category ${this.newCategory}`);

        var category = this.newCategory || this.selectedCategory;
        var answerCategory = this.newAnswerCategory || this.selectedAnswerCategory;

        if (!category) {
            alert('Please enter a category');
            return;
        }

        if (!answerCategory) {
            alert('Please enter an answer category.');
            return;
        }

        if (!this.question || !this.answer) {
            alert('Please enter a question and answer.');
            return;
        }

        var newQuestion: IQuizQuestion = {
            questionId: 0,
            question: this.question,
            category: category,
            answerCategory: answerCategory,
            answer: this.answer
        };

        var result = this.quizServices.addQuestion(newQuestion);
        result.subscribe(q => {
            console.log(`Added question ${q.questionId}`);
            this._selectedCategory = category.trim().toLowerCase();   // This will read in the category questions
            this._selectedAnswerCategory = answerCategory.trim().toLocaleLowerCase();
            this.clearInputFields();
            this.readCategories();
            this.readQuestions();
        });
    }

    deleteQuestion(question:IQuizQuestion) {
        var msg = `Do you really want to delete ${question.question} in category ${question.category}?`;
        if (confirm(msg)) {
            alert('Deleting');
        }
    }

    readQuestions() {
        if (!this.selectedCategory) {
            this.allQuestions = [];
            return;
        }

        this.quizServices.getQuestionsForQAndACategory(this.selectedCategory, this.selectedAnswerCategory)
            .subscribe(questions => this.allQuestions = questions);
    }

    readCategories() {
        console.log('Reading categories in QuestionEntry');

        this.quizServices.getCategories()
            .subscribe(categories => {
                this.categories = categories;
                if (!this.selectedCategory && this.categories.length > 0) {
                    this.selectedCategory = this.categories[0];
                }
            },
            err => alert(err));

        this.quizServices.getAnswerCategories()
            .subscribe(categories => {
                this.answerCategories = categories;
                if (!this.selectedAnswerCategory && this.answerCategories.length > 0) {
                    this.selectedAnswerCategory = this.answerCategories[0];
                }
            },
            err => alert(err));
    }

    clearInputFields() {
        this.newCategory = '';
        this.question = '';
        this.answer = '';
        this.newAnswerCategory = '';
    }
}
