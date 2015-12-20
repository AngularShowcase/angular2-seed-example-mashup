import {Component} from 'angular2/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
// import 'rxjs/add/operators/map';
// import 'rxjs/add/observable/interval';
// import 'rxjs/add/operators/where';
import {HpDrag} from '../../directives/HpDrag';

@Component({
    selector: 'mouse-play',
    templateUrl: './components/mousePlay/MousePlay.html',
    directives: [HpDrag],
    styleUrls: ['./components/mousePlay/mousePlay.css']
})
export class MousePlay {

    dragSubject: Subject<any>;
    dragNumber: number;
    x: number;
    y: number;
    maxDrags: number = 300;

    constructor() {
        var lastX:number = 0;
        var lastY:number = 0;

        this.dragSubject = new Subject();

        var dragCounts = Observable.range(1, this.maxDrags);

        var uniqueDrags = this.dragSubject
            .filter(ev => ev.x !== lastX || ev.y !== lastY)
            .do(ev => {
                lastX = ev.x;
                lastY = ev.y;
            });

        Observable.zip(dragCounts, uniqueDrags,
            (i, e) => {
                return {
                    eventNumber: i,
                    event: e
                };
        })
        .subscribe( this.dragEvent.bind(this),
                    error => console.log('Error', error));
    }

    dragEvent(ev) {

        //console.log('Drag event', ev);

        if (ev.event.x === 0 && ev.event.y === 0) {
            return;
        }

        this.x = ev.event.x;
        this.y = ev.event.y;
        //console.log(x,y);
        //console.log(ev.event.target);
        this.dragNumber = ev.eventNumber;
        ev.event.target.style.left = this.x + 'px';
        ev.event.target.style.top = this.y + 'px';
    }

    gotDrag(ev) {
        this.dragSubject.next(ev);
    }
}
