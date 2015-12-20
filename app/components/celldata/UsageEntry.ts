import {Component} from 'angular2/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES, NgForm} from 'angular2/common';
import {Observable} from 'rxjs/Observable';

import {CellDataServices} from '../../services/CellDataServices';
import {UsageDetails} from './UsageDetails';
import {IUsage, ICycle, IPerson} from '../../common/interfaces/CellDataInterfaces';

//Need to take out NgForm so angular won't prevent form submission
let formDirectives = FORM_DIRECTIVES.filter(f => f !== NgForm);

interface IExtendedCycle extends ICycle {
    description:string;
}

@Component({
    selector: 'usage-entry',
    viewBindings: [CellDataServices],
    templateUrl: './components/celldata/UsageEntry.html',
    directives: [CORE_DIRECTIVES, UsageDetails, formDirectives],
    styleUrls: ['./components/celldata/UsageEntry.css']
})
export class UsageEntry {
    peopleObservable:Observable<IPerson[]>;
    _cycleId:string = '0';
    _personId:string = '0';

    get cycleId() : string {
        return this._cycleId;
    }

    set cycleId(v:string) {
        this._cycleId = v;
        this.getPersonUsage();
    }

    get personId() : string {
        return this._personId;
    }

    set personId(val:string) {
        this._personId = val;
        this.getPersonUsage();
    }

    model = {
        people: [],
        errors: '',
        cycles:[],
        usage:[],
        totalUsage: 0
    };

    constructor(public cellDataServices:CellDataServices) {
        this.peopleObservable = this.cellDataServices.getPeople();

        this.getCyclesForDropdown();
        this.getPeopleForDropdown();
        this.getPersonUsage();
    }

    public getCycleDescription():string {
        let cycle = this.getCurrentCycle();
        if (!cycle) {
            return 'No cycle selected';
        }

        return cycle.description;
    }

    public getCurrentPersonName():string {
        var matches = this.model.people.filter((p:IPerson) => p.personId.toString() === this.personId);
        if (matches.length === 0) {
            return '';
        }
        var person:IPerson = matches[0];
        return person.firstName + ' ' + person.lastName;
    }

    private getPersonUsage() {
        let cycle = this.getCurrentCycle();
        if (!cycle) {
            return;
        }
        let personId:number = parseInt(this.personId);
        let startDate = cycle.startDate;
        let endDate = cycle.endDate;
        this.cellDataServices.getUsageForPerson(personId, startDate, endDate)
            .subscribe((usage:IUsage[]) => {
                this.model.usage = usage;
                this.model.totalUsage = this.model.usage.reduce((acc,v) => { return v.usage + acc;}, 0.0);
        });
    }

    private getCycle(cycleId:string):IExtendedCycle {
        return _.find(this.model.cycles, (c:ICycle) => c.cycleId.toString() === cycleId);
    }

    private getCurrentCycle():IExtendedCycle {
        return this.getCycle(this.cycleId);
    }

    private chopTime(zuluTime:string):string {
        var index = zuluTime.indexOf('T');
        if (index < 0) {
            return zuluTime;
        }
        return zuluTime.slice(0, index);
    }

    private getPeopleForDropdown() {
        this.peopleObservable
            .subscribe(people => {
                //console.log('people', people);
                this.model.people = people;
                if (people.length > 0) {
                    this.personId = people[0].personId.toString();
                }
            });

    }

    private getCyclesForDropdown() {
        this.cellDataServices.getCyles()
            .subscribe((cycles:IExtendedCycle[]) => {
                this.model.cycles = cycles;

                cycles.forEach(cycle => {
                    let minDate = this.chopTime(cycle.startDate.toISOString());
                    let maxDate = this.chopTime(cycle.endDate.toISOString());
                    cycle.description = `From ${minDate} through ${maxDate}`;
                });

                if (cycles.length > 0) {
                    this.cycleId = cycles[0].cycleId.toString();
                }
            });
    }
}
