import {Component} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {Authentication} from '../../services/Authentication';
import {QuizServices} from '../../services/QuizServices';
import {ITest} from '../../../common/interfaces/QuizInterfaces';
import {RouteConfig, ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {ReviewTest} from './ReviewTest';
import {EmptyTestReview} from './EmptyTestReview';
import {UserTestList} from './UserTestList';
import {UserCategoryReview} from './UserCategoryReview';

@RouteConfig([
  { path: '/', component: EmptyTestReview, name: 'EmptyTestReview', useAsDefault: true },
  { path: '/test/:testId/review/...', component: ReviewTest, name: 'ReviewTest' }
])
@Component({
    selector: 'user-review',
    templateUrl: './quiz/components/UserReview.html',
    styleUrls: ['./quiz/components/UserReview.css'],

    providers: [QuizServices],
    directives: [CORE_DIRECTIVES, ROUTER_DIRECTIVES, UserCategoryReview, UserTestList]
})
export class UserReview {

    username:string = '';
    userTests:ITest[] = [];
    filterCategory:string = null;

    constructor(public authentication:Authentication, public quizServices:QuizServices,
                public router:Router) {
    }

    ngOnInit() {
        if (!this.authentication.authenticate()) {
            return;
        }

        this.username = this.authentication.user.username;

        this.quizServices.getUserTests(this.username)
            .subscribe(userTests => this.userTests = userTests);
    }

    reviewTest(testId:number) {
        console.log(`He'd like to review test ${testId}.`);
        this.switchToTab('testDetail');
        this.router.navigate(['./ReviewTest', {testId: testId}]);
    }

    selectCategory(category:string) {
        console.log(`User wants to filter by catgory ${category}.`);
        this.switchToTab('testList');
        this.filterCategory = category;
    }

    switchToTab(tabName:string) {
        console.log(`Switching to tab ${tabName}.`);
        $(`#reviewTabs a[href="#${tabName}"]`)['tab']('show');
    }
}
