import {Directive, ElementRef, Renderer} from 'angular2/core';

interface IPropertyNotification {
    propertyName:string;
    value:any;
}

@Directive({
    selector: '[usage-gauge]',		// Not sure why you need to put it in brackets
    properties: [
        'label',
        'value',
        'min',
        'max',
        'width',
        'height',
        'animationTime:animation-time',
        'animationCount:animation-count'
    ],
    events: [],
    host: {
        '(click)': 'onClick($event)',
        '(load)': 'onLoad($event)',
        '(unload)': 'onUnload($event)'
    }
})
export class UsageGauge {
    eventBufferTime:number = 500;
    _label:string = 'Label';
    _width:number = 400;
    _height:number = 400;
    _value:number = 0.0;
    _min:number = 0.0;
    _max:number = 15.0;
    animationIntervalId:any;

    settingsPub = new Rx.Subject<IPropertyNotification>();

    animationTime:number = 5000;
    animationCount:number = 100;

    get label():string {
        return this._label;
    }

    set label(val:string) {
        this._label = val;
        this.notify('label', val);
    }

    get width() : number {
        return this._width;
    }

    set width(val:number) {
        this._width = val;
        this.notify('width', val);
    }

    get height() : number {
        return this._height;
    }

    set height(val:number) {
        this._height = val;
        this.notify('height', val);
    }

    get max() : number {
        return this._max;
    }

    set max(val:number) {
        this._max = val;
        this.notify('max', val);
    }

    get min() : number {
        return this._min;
    }

    set min(val:number) {
        this._min = val;
        this.notify('min', val);
    }

    get value() : number {
        return this._value;
    }

    set value(val:number) {
        this._value = val;
        this.notify('value', val);
    }

    constructor(public _element: ElementRef, public _renderer: Renderer) {
        console.log('Directive Usage Gauge constructed.');

        this.settingsPub.subscribeOnNext(this.propertyChanged.bind(this));
        this.settingsPub.bufferWithTime(this.eventBufferTime)
                    .where(events => events.length > 0)
                    .subscribeOnNext(this.multiplePropertyChanged.bind(this));
    }

    notify(propertyName:string, value:any) {
        this.settingsPub.onNext({propertyName: propertyName, value: value});
    }

    propertyChanged(event:IPropertyNotification) {
        console.log(`Property ${event.propertyName} changed to ${event.value}.`);
    }

    multiplePropertyChanged(events:IPropertyNotification[]) {
        console.log(`Got ${events.length} time-buffered property change notifications.`);
        events.forEach(event => console.log(` ${event.propertyName} = ${event.value}`));
        this.drawGauge();
    }

    onLoad($event) {
        console.log('onLoad for ', $event);
    }

    onUnload($event) {
        console.log('onUnload for ', $event);
    }

    onClick($event) {
        console.log('click for ', $event);
    }

    drawGauge() {
        // Careful with rentry

        if (this.animationIntervalId) {
            clearInterval(this.animationIntervalId);
            this.animationIntervalId = undefined;
        }

        console.log(`Drawing ${this.label} gauge with an animation time of ${this.animationTime}`);

        var totalDuration = this.animationTime;
        var iterations = this.animationCount;

        var timerDelay = totalDuration / iterations;
        var start = this.min;
        var end = this.value;
        var increment = (end - start) / iterations;

        let i = 0;
        this.drawGuageWithValue(start + i * increment);
        this.animationIntervalId = setInterval(() => {
            i += 1;
            if (i > iterations) {
                if (this.animationIntervalId) {
                    clearInterval(this.animationIntervalId);
                    this.animationIntervalId = undefined;
                }
            } else {
                this.drawGuageWithValue(start + i * increment);
            }
        }, timerDelay);
    }

    drawGuageWithValue(val:number) {
        var data = google.visualization.arrayToDataTable([
          ['Label', 'Value'],
          [this.label, this.toFixed(val,2)]
        ]);

        let majorTicks:string[] = [];

        for (let i = this.min; i <= this.max; ++i) {
            if (this.max > 20) {
                majorTicks.push(i % 4 !== 0 ? '' : i.toString());
            } else {
                majorTicks.push(i.toString());
            }
        }
        //console.log(majorTicks);

        var options = {
          width: this.width, height: this.height,
          redFrom: this.max-2, redTo: this.max,
          yellowFrom:this.max-5, yellowTo: this.max -2,
          majorTicks: majorTicks,
          min:this.min,
          max:this.max
        };

        var chart = new google.visualization['Gauge'](this._element.nativeElement);

        chart.draw(data, options);

    }
    toFixed(n:number, places:number) {
        let factor = Math.pow(10, places);
        return Math.round(n * factor) / factor;
    }
}
