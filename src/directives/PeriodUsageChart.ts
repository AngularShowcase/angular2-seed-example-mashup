import {Directive, ElementRef, Renderer} from 'angular2/core';

@Directive({
    selector: '[period-usage-chart]',		// Not sure why you need to put it in brackets
    properties: [
        'usageData:usage-data',
        'width',
        'height',
        'animationTime:animation-time'
    ],
    host: {
        '(click)': 'onClick($event)',
        '(load)': 'onLoad($event)',
        '(unload)': 'onUnload($event)'
    }
})
export class PeriodUsageChart {

    _usageData: any[];

    get usageData(): any[] {
        return this._usageData;
    }

    _animationTime: number = 1000;

    get animationTime(): number {
        return this._animationTime;
    }

    set animationTime(val: number) {
        this._animationTime = val;
        console.log(`Set the animation time for the period usage chart to ${this.animationTime}.`);
    }

    set usageData(val: any[]) {
        this._usageData = val;
        this.drawPeriodUsageBarChart();
    }

    width: number = 500;
    height: number = 500;

    constructor(public _element: ElementRef, public _renderer: Renderer) {
        console.log('Directive LineChart constructed.');
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

    drawPeriodUsageBarChart() {

        console.log(`Drawing period usage chart with an animation time of ${this.animationTime}`);

        //Usage data needs to be in a specific format.  See the example at
        //https://developers.google.com/chart/interactive/docs/gallery/barchart#stacked-bar-charts

        var data = google.visualization.arrayToDataTable(this.usageData);

        var options: google.visualization.BarChartOptions = {

            title: 'Cumulative Usage for Family',

            enableInteractivity: true,
            width: this.width,
            height: this.height,
            animation: {
                duration: this.animationTime,
                easing: 'out',
                startup: true
            },
            isStacked: true
        };

        var chart = new google.visualization.BarChart(this._element.nativeElement);

        chart.draw(data, options);
    }
}
