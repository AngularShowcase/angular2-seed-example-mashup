import {Component, EventEmitter} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {QuizServices} from '../../services/QuizServices';
import {ISectionResult} from '../../../common/interfaces/QuizInterfaces';

@Component({
    selector: 'user-category-review',
    templateUrl: './quiz/components/UserCategoryReview.html',
    styleUrls: ['./quiz/components/UserCategoryReview.css'],
    inputs: ['username'],
    outputs: ['selectedCategory'],
    providers: [QuizServices],
    directives: [CORE_DIRECTIVES]
})
export class UserCategoryReview {

    username:string = '';
    summarizedResults:ISectionResult[] = [];
    selectedCategory:EventEmitter<string>;

    constructor(public quizServices:QuizServices) {
        this.selectedCategory = new EventEmitter<string>();
    }

    ngOnInit() {

        console.log(`UserCategoryReview invoked with username ${this.username}.`);

        if (this.username) {

            // Get all user tests and get a flattened list of all the user's sectionName
            // results;

            let categoryResults
                = this.quizServices.getUserTests(this.username)
                    .map(tests => _.flatten(tests.map(test => test.sectionResults)));

            categoryResults.subscribe(allUserResults => {
                let summary = this.quizServices.aggregateSectionResultsBySectionName(allUserResults);
                this.summarizedResults = _.sortBy(summary, 'sectionName');
                let grandTotals = this.quizServices.aggregateSectionResults(this.summarizedResults);
                grandTotals.sectionName = `All Categories`;
                this.summarizedResults.push(grandTotals);
            });
        }
    }

    categoryClick(categoryName:string, index:number) {
        console.log(`categoryClick for category ${categoryName}; index = ${index}.`);
        let category:string = (index === this.summarizedResults.length - 1) ? null : categoryName;
        this.selectedCategory.next(category);
    }
}
