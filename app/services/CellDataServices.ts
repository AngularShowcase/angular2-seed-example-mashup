import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {Http, Headers, RequestOptions, RequestOptionsArgs} from 'angular2/http';
import {ICycle, IPerson, IUsage} from '../common/interfaces/CellDataInterfaces';

@Injectable()
export class CellDataServices {

	constructor(public http:Http) {

	}

	getPeople() : Observable<IPerson[]> {
		var result = this.http.get('/api/celldata/people')
			.map(response => {
                return <IPerson[]>response.json();
            });

		return result;
	}

	savePerson(person:IPerson) : Observable<IPerson> {
		var result = this.http.post('/api/celldata/people',
					JSON.stringify(person),
					this.getPostOptions())
			.map(response => <IPerson> response.json());

		return result;
	}

	getUsageForPerson(personId:number, startDate:Date, endDate:Date) : Observable<IUsage[]> {
		let startDateString = startDate.toISOString();
		let endDateString = endDate.toISOString();
		var url = `/api/celldata/usage/${personId}?startDate=${startDateString}&endDate=${endDateString}`;
		//console.log('Querying usage with: ' + url);

		var result = this.http.get(url)
			.map(response => {
                return this.convertUsageDates(<any[]>response.json());
            });

		return result;
	}

	getPeriodUsage(startDate:Date, endDate:Date) : Observable<IUsage[]> {
		let startDateString = startDate.toISOString();
		let endDateString = endDate.toISOString();
		var url = `/api/celldata/periodusage?startDate=${startDateString}&endDate=${endDateString}`;
		//console.log('Querying usage with: ' + url);

		var result = this.http.get(url)
			.map(response => {
                return this.convertUsageDates(<any[]>response.json());
            });

		return result;
	}

	getCyles() : Observable<ICycle[]> {
		var result = this.http.get('/api/celldata/cycles')
			.map(response => {
                //console.log('cycles response', response);
                var list = <any[]>response.json();
				list.forEach(c => {
				  c.startDate = new Date(c.startDate);
				  c.endDate = new Date(c.endDate);
				});
				return list;
            });

		return result;
	}

	saveCycle(newCycle:any) : Observable<ICycle> {
		var result = this.http.post('/api/celldata/cycles',
					JSON.stringify(newCycle),
					this.getPostOptions())
			.map(request => <ICycle> request.json());

		return result;
	}

	getPostOptions(): RequestOptions {
		var headers = new Headers();
		headers.append('Content-Type', 'application/json');

		var options: RequestOptionsArgs = {
			headers: headers
		};

		return new RequestOptions(options);
	}

	convertUsageDates(usage:any[]) : any[] {
		usage.forEach(u => {
			u.date = new Date(u.date);
		});

		return usage;
	}
}
