import {Component, EventEmitter} from 'angular2/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';
import {QuizServices} from '../../services/QuizServices';

@Component({
    selector: 'multi-category-select',
    templateUrl: './components/quiz/MultiCategorySelect.html',
    styleUrls: ['./components/quiz/MultiCategorySelect.css'],
    outputs: ['categories'],
    viewBindings: [QuizServices],
    directives: [FORM_DIRECTIVES, CORE_DIRECTIVES]
})
export class MultiCategorySelect {

    categories:EventEmitter<string[]>;
    allCategories:string[] = [];
    selectedCategories:string[] = [];
    checkMarks = [];

    constructor(public quizServices:QuizServices) {
        this.categories = new EventEmitter<string[]>();
        this.readCategories();
    }

    checkedCategory(checkbox:HTMLInputElement, category:string) {
        this.selectedCategories = this.selectedCategories.filter(c => c !== category);

        if (checkbox.checked) {
            this.selectedCategories.push(category);
        }

        this.categories.next(this.selectedCategories);
    }

    readCategories() {
        this.quizServices.getCategories()
            .subscribe(categories => {
                this.allCategories = categories;
                // Make sure all categories are turned off
                this.checkMarks = _.range(0, this.allCategories.length).map(_ => false);
            },
            err => alert(err));
    }
}
