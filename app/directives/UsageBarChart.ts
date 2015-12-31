///<reference path="../../tools/typings/tsd/google.visualization/google.visualization.d.ts" />
import {Directive, ElementRef, Renderer} from 'angular2/core';
import {IUsage, IPerson} from '../../common/interfaces/CellDataInterfaces';

@Directive({
    selector: '[usage-bar-chart]',		// Not sure why you need to put it in brackets
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
export class UsageBarChart {

    _usageData: IUsage[];

    get usageData(): IUsage[] {
        return this._usageData;
    }

    set usageData(val:IUsage[]) {
        this._usageData = val;
        this.drawPersonUsageBarChart();
    }
    _person:IPerson = null;

    get person() : IPerson {
        return this._person;
    }

    set person(val:IPerson) {
        this._person = val;
        this.drawPersonUsageBarChart();
    }

    width:number = 500;
    height:number = 500;
    animationTime:number = 1000;

    constructor(public _element: ElementRef, public _renderer: Renderer) {
        console.log('Directive UsageBarChart constructed.');
    }

    onLoad($event) {
        console.log('onLoad for ', $event);
    }

    onUnload($event) {
        console.log('onUnload for ', $event);
    }

    onClick($event) {
        console.log('click for ', $event);
        this.drawPersonUsageBarChart();
    }

    drawPersonUsageBarChart() {
        if (this.usageData.length === 0 || !this.person) {
            return;
        }

        var data = new google.visualization.DataTable();
        data.addColumn('date', 'date');
        data.addColumn('number', `Usage for ${this.person.firstName} ${this.person.lastName}`);

        let dataRows = [];
        for (let u of this.usageData) {
            dataRows.push([u.date, u.usage]);
        }

        data.addRows(dataRows);

        var options : google.visualization.BarChartOptions = {

            title: 'Daily Cellphone Data Usage for ' +
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
                title: 'Gigabytes'
            },
            vAxis: {
                title: 'Date'

            },
            legend: {

            }
        };

        var chart = new google.visualization.BarChart(this._element.nativeElement);

        chart.draw(data, options);
    }
}
