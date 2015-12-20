import {Directive, ElementRef, Renderer} from 'angular2/core';
import {IUsage, IPerson} from '../common/interfaces/CellDataInterfaces';

@Directive({
    selector: '[usage-line-chart]',		// Not sure why you need to put it in brackets
    properties: [
        'usageData:usage-data',
        'person:person',
        'width',
        'height',
        'animationTime:animation-time'

    ],
    events: [],
    host: {
        '(click)': 'onClick($event)',
        '(load)': 'onLoad($event)',
        '(unload)': 'onUnload($event)'
    }
})
export class UsageLineChart {

    _usageData: IUsage[];

    get usageData(): IUsage[] {
        return this._usageData;
    }

    set usageData(val:IUsage[]) {
        this._usageData = val;
        this.drawPersonUsageLineChart();
    }
    person:IPerson = null;
    width:number = 500;
    height:number = 500;
    animationTime:number = 1000;

    constructor(public _element: ElementRef, public _renderer: Renderer) {
        console.log('Directive UsageLineChart constructed.');
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

    drawPersonUsageLineChart() {
        var data = new google.visualization.DataTable();
        data.addColumn('date', 'date');
        data.addColumn('number', 'Usage');

        let dataRows = [];
        for (let u of this.usageData) {
            dataRows.push([u.date, u.usage]);
        }

        data.addRows(dataRows);

        var options : google.visualization.LineChartOptions = {

            title: 'Cumulative Cellphone Usage for ' +
                (this.person === null ? '(unknown)' : this.person.firstName + ' ' + this.person.lastName),

            enableInteractivity: true,
            width: this.width,
            height: this.height,
            animation: {
                duration: this.animationTime,
                easing: 'out',
                startup: true
            },
            hAxis: {
                title: 'Date'
            },
            vAxis: {
                title: 'Usage in Gigabytes'

            },
            legend: {position: 'none'}
        };

        var chart = new google.visualization.LineChart(this._element.nativeElement);

        chart.draw(data, options);
    }
}
