import {Component} from 'angular2/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';
import {CellDataServices} from '../../services/CellDataServices';
import {IUsage, ICycle, IPerson} from '../../../common/interfaces/CellDataInterfaces';
import {UsageDetails} from './UsageDetails';
import {Parser} from '../../services/Parser';
import {Cycle} from './Cycle';
import {UsageLineChart} from '../../directives/UsageLineChart';
import {UsageBarChart} from '../../directives/UsageBarChart';
import {PeriodUsageChart} from '../../directives/PeriodUsageChart';
import {UsageGauge} from '../../directives/UsageGauge';

interface IExtendedCycle extends ICycle {
    description:string;
}

interface IModel {
    personId: string;
    cycleId: string;
    personUsage: IUsage[];
    periodUsage: any[];
    personCumUsage: IUsage[];
    people: IPerson[];
    cycles: Cycle[];
    totalPeriodUsage:number;
    daysIntoPeriod:number;
}

@Component({
    selector: 'usage',
    providers: [CellDataServices, Parser],
    templateUrl: './components/celldata/Usage.html',
    directives: [CORE_DIRECTIVES, FORM_DIRECTIVES, UsageBarChart,
                 UsageLineChart, PeriodUsageChart, UsageDetails, UsageGauge],
    styleUrls: ['./components/celldata/Usage.css']
})
export class Usage implements IModel {

    _personId:string = '';
    _cycleId:string = '';
    people = [];
    cycles = [];
    _personUsage = [];
    periodUsage = [];
    personCumUsage = [];
    totalPeriodUsage = 10.0;
    daysIntoPeriod = 10.0;
    daysInCurrentPeriod = 100.0;
    animationTime:number = 5000;

    get personUsage() : IUsage[] {
        return this._personUsage;
    }

    set personUsage(val:IUsage[]) {
        this._personUsage = val;
        this.computeCumUsage();
    }

    get personId():string {
        return this._personId;
    };

    set personId(val:string) {
        this._personId = val;
        this.updateUsage();
    };

    get cycleId():string {
        return this._cycleId;
    };

    set cycleId(val:string) {
        this._cycleId = val;
        this.updateUsage();
    }

    constructor(public cellDataServices:CellDataServices, public parser:Parser) {
        this.getCycles();
        this.getPeople();
    }

    computeCumUsage() {
        var cumUsage:IUsage[] = [];
        let acc = 0.0;

        for (let u of this.personUsage) {
            acc += u.usage;
            cumUsage.push({personId: u.personId, date: u.date, usage: acc});
        }
        this.personCumUsage = cumUsage;
    }

    getCycles() {
        this.cellDataServices.getCyles()
            .subscribe((cycles:ICycle[]) => {
                this.cycles = cycles.map(c => new Cycle(c));
                let today = new Date();
                let currentCycle = _.find(this.cycles, c => (today >= c.startDate && today <= c.endDate));
                if (currentCycle !== null) {
                    this.cycleId = currentCycle.cycleId.toString();
                }
            });
    }

    getPeople() {
        this.cellDataServices.getPeople()
            .subscribe(people => {
                    this.people = people;
                    if (this.people.length > 0) {
                        this.personId = this.people[0].personId.toString();
                    }
                });
    }

    updateUsage() {
        this.personUsage = [];
        this.periodUsage = [];
        let personId = this.personId;
        let cycleId = this.cycleId;
        if (personId === '' || cycleId === '') {
            return;
        }

        // Get the current cycle
        let cycle = this.getCycle(parseInt(cycleId));
        if (!cycle) {
            return;
        }

        this.cellDataServices.getUsageForPerson(parseInt(personId),
                                                cycle.startDate,
                                                cycle.endDate)
            .subscribe(usage => {
                this.personUsage = usage;
                this.daysInCurrentPeriod = this.getDaysBetweenDates(cycle.startDate, cycle.endDate);
                let now = new Date();

                if (now > cycle.endDate) {
                    this.daysIntoPeriod = this.daysInCurrentPeriod;     //Past cycle.  Show we are at the end
                } else if (now < cycle.startDate) {
                    this.daysIntoPeriod = 0.0;                     //Future cycle
                } else {
                    this.daysIntoPeriod = this.getDaysBetweenDates(cycle.startDate, now);
                }
             });

        this.cellDataServices.getPeriodUsage(cycle.startDate, cycle.endDate)
            .subscribe(usage => this.parsePeriodUsage(usage));
    }

    getDaysBetweenDates(startDate:any, endDate:any) : any {
        return 1 + (endDate - startDate) / (24 * 3600 * 1000);
    }

    getStackedBarUsageHeaderRow():any[] {
        let row:any[] = ['Person'];

        for (let p of this.people) {
            row.push(this.getPersonName(p));
        }

        return row;
    }

    // This returns an array suitable for Google charts.

    parsePeriodUsage(usage:IUsage[]) {

        this.totalPeriodUsage = usage.reduce((acc:number, u:IUsage) => acc + u.usage, 0.0);

        let pUsage = _.groupBy(usage, u => u.date);
        let keys:string[] = Object.keys(pUsage);        // Get the unique dates
        let dates:Date[] = keys.map(k => new Date(k)).sort((d1,d2) => <any>d1 - <any>d2); //sort the dates

        let grouped:any[] = [];
        var topRow = this.getStackedBarUsageHeaderRow();
        grouped.push(topRow);

        for (let d of dates) {
            //console.log(`Getting info for ${d}`);
            var dateData:any[] = [d];               //First item of the array is the date
            let dayUsage:IUsage[] = pUsage[<any>d];               //Lookup the array of usage for the day
            let personUsageOnDate = this.getPersonUsageForDate(dayUsage);   // Translate it into an array of numbers in person order
            personUsageOnDate.forEach(u => dateData.push(u));   // Add the values in person order in slots 1..n
            grouped.push(dateData);
        }

        this.periodUsage = this.convertToCumulative(grouped);
    }

    convertToCumulative(daily:any[]) {
        let peopleCount = this.people.length;
        let personCumTotal = [];
        this.people.forEach(p => personCumTotal.push(0.0));

        let result = [];
        result.push(daily[0]);      //Push the first row untouched; it is for the bar headers

        for (let i = 1; i < daily.length; ++i) {
            let row = daily[i];

            for (let j = 0; j < peopleCount; ++j) {
                personCumTotal[j] += row[j + 1];        //The first column of the row is the date; skip it
                row[j + 1] = personCumTotal[j];
            }
            result.push(row);
        }

        return result;
    }

    getPersonUsageForDate(usage:IUsage[]) : number[] {
        let map = {};
        usage.forEach(u => map[u.personId] = u);

        let usageArray:number[] = [];

        for (let p of this.people) {
            let personUsage = map[p.personId];
            usageArray.push((personUsage) ? personUsage.usage : 0.0);
        }

        return usageArray;
    }

    getPersonNameFromId(personId:number) : string {
        let person = this.getPerson(personId);
        return this.getPersonName(person);
    }

    getPersonName(person:IPerson):string {
        if (!person) {
            return 'Unknown';
        }
        return person.firstName + ' ' + person.lastName;
    }

    getCycle(cycleId:number) : Cycle {
        return _.find(this.cycles, c => c.cycleId === cycleId);
    }

    getPerson(personId:number) : IPerson {
        return _.find(this.people, p => p.personId === personId);
    }

    getCurrentPerson() : IPerson {
        if (!this.personId) {
            return null;
        }

        return this.getPerson(parseInt(this.personId));
    }
}
