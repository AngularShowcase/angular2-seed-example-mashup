import {Component, EventEmitter} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {QuizServices} from '../../services/QuizServices';
import {ITest, ISectionResult} from '../../../common/interfaces/QuizInterfaces';
import {SectionResult} from '../../models/SectionResult';

@Component({
    selector: 'user-category-review',
    templateUrl: './components/quiz/UserCategoryReview.html',
    styleUrls: ['./components/quiz/UserCategoryReview.css'],
    inputs: ['username'],
    providers: [QuizServices],
    directives: [CORE_DIRECTIVES]
})
export class UserCategoryReview {

    username:string = '';
    summarizedResults:ISectionResult[] = [];

    constructor(public quizServices:QuizServices) {
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
}
