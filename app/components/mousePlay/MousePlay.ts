import {Component} from 'angular2/angular2';
import {HpDrag} from '../../directives/HpDrag';

@Component({
    selector: 'mouse-play',
    templateUrl: './components/mousePlay/MousePlay.html',
    directives: [HpDrag],
    styleUrls: ['./components/mousePlay/mousePlay.css']
})
export class MousePlay {

    dragSubject: Rx.ISubject<any>;
    dragNumber: number;
    x: number;
    y: number;
    maxDrags: number = 300;

    constructor() {
        var lastX:number = 0;
        var lastY:number = 0;

        this.dragSubject = new Rx.Subject();

        var dragCounts = Rx.Observable.generate(1, i => i <= this.maxDrags, i => i + 1, i => i);

        var uniqueDrags = this.dragSubject
            .where(ev => ev.x !== lastX || ev.y !== lastY)
            .do(ev => {
                lastX = ev.x;
                lastY = ev.y;
            });

        Rx.Observable.zip(dragCounts, uniqueDrags,
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
        this.dragSubject.onNext(ev);
    }
}
