import {Component} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {Authentication} from '../../services/Authentication';
import {QuizServices} from '../../services/QuizServices';
import {ITest} from '../../../common/interfaces/QuizInterfaces';
import {RouteConfig, ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {ReviewTest} from './ReviewTest';
import {EmptyTestReview} from './EmptyTestReview';

@RouteConfig([
  { path: '/', component: EmptyTestReview, as: 'EmptyTestReview', useAsDefault: true },
  { path: '/test/:testId/review/...', component: ReviewTest, as: 'ReviewTest' }
])
@Component({
    selector: 'user-review',
    templateUrl: './components/quiz/UserReview.html',
    styleUrls: ['./components/quiz/UserReview.css'],

    providers: [QuizServices],
    directives: [CORE_DIRECTIVES, ROUTER_DIRECTIVES]
})
export class UserReview {

    username:string = '';
    userTests:ITest[] = [];

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

    reviewTest(testId:number, quizId:number) {
        console.log(`He'd like to review test ${testId}.`);

        //Switch to the detail tab.
        $('#reviewTabs a[href="#testDetail"]')['tab']('show');
        this.router.navigate(['./ReviewTest', {testId: testId}]);
    }
}
