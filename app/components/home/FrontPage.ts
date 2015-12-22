import {Component} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';

@Component({
    selector: 'front-page',
    templateUrl: './components/home/FrontPage.html',
    styleUrls: ['./components/home/FrontPage.css'],

    directives: [CORE_DIRECTIVES]
})
export class FrontPage {

}
