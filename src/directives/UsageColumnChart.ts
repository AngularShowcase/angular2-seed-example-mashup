import {Directive, ElementRef, Renderer} from 'angular2/core';
import {IUsage, IPerson} from '../../common/interfaces/CellDataInterfaces';

@Directive({
    selector: '[usage-column-chart]',		// Not sure why you need to put it in brackets
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
export class UsageColumnChart {

    _usageData: IUsage[];

    constructor(public _element: ElementRef, public _renderer: Renderer) {
        console.log('Directive UsageColumnChart constructed.');
    }

    get usageData(): IUsage[] {
        return this._usageData;
    }

    set usageData(val:IUsage[]) {
        this._usageData = val;
        this.drawPersonUsageColumnChart();
    }
    _person:IPerson = null;

    get person() : IPerson {
        return this._person;
    }

    set person(val:IPerson) {
        this._person = val;
        this.drawPersonUsageColumnChart();
    }

    width:number = 500;
    height:number = 500;
    animationTime:number = 1000;

    onLoad($event) {
        console.log('onLoad for ', $event);
    }

    onUnload($event) {
        console.log('onUnload for ', $event);
    }

    onClick($event) {
        console.log('click for ', $event);
        this.drawPersonUsageColumnChart();
    }

    drawPersonUsageColumnChart() {
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

        var options : google.visualization.ColumnChartOptions = {

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
                title: 'Date'
            },
            vAxis: {
                title: 'Gigabytes'

            },
            legend: {

            }
        };

        var chart = new google.visualization.ColumnChart(this._element.nativeElement);

        chart.draw(data, options);
    }
}
