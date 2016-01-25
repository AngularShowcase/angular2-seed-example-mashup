import {Component, EventEmitter} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {QuizServices} from '../../services/QuizServices';
import {ITest, ISectionResult} from '../../../common/interfaces/QuizInterfaces';

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
            // var x = this.quizServices.getUserTests(this.username)
            //     .map(tests => {
            //         let catResults:ISectionResult[] = [];

            //         for (let t of tests) {
            //             for (let s of t.sectionResults) {
            //                 catResults.push(s);
            //             }
            //         }
            //         return catResults;
            //     });

            var categoryResults
                = this.quizServices.getUserTests(this.username)
                    .map(tests => <ISectionResult[]> _.flatten(tests.map(test => test.sectionResults)));

            categoryResults.subscribe(catResults => {
                let dict = _.groupBy(catResults, "sectionName");
                console.log(dict);
            });
        }
    }
}
