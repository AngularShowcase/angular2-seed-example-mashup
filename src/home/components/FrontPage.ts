import {Component} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';

@Component({
    selector: 'front-page',
    templateUrl: './home/components/FrontPage.html',
    styleUrls: ['./home/components/FrontPage.css'],

    directives: [CORE_DIRECTIVES]
})
export class FrontPage {

}
