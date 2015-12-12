import Q = require('q');
var mongoskin = require('mongoskin');
import {IPerson, ICycle, IUsage} from '../../common/interfaces/CellDataInterfaces';
import fs = require('fs');

var config = {
	mongo_url: process.env.CELLDATA_URL || 'mongodb://@localhost:27017/celldata'
};

export class CellDataPersistenceService {

	db:any;
	cyclesCollection:any;
	peopleCollection:any;
	usageCollection:any;

	constructor() {
		this.db = mongoskin.db(config.mongo_url, {safe:true});
		this.cyclesCollection = this.db.collection('cycles');
		this.peopleCollection = this.db.collection('people');
		this.usageCollection = this.db.collection('usage');
	}

	public getPeople():Q.Promise<IPerson[]> {
		let defer = Q.defer<IPerson[]>();
		this.peopleCollection.find({}).sort({lastName:1, firstName: 1}).toArray(function(e, people:IPerson[]){
		        if (e) {
		            defer.reject(e);
		        } else {
					defer.resolve(people);
				}
		    });
		return defer.promise;
	}

	public addPerson(person:IPerson):Q.Promise<IPerson> {
		let defer = Q.defer<IPerson>();
		var coll = this.peopleCollection;
		coll.find({}, {_id: 0, personId: 1}).sort({personId: -1}).toArray(function (e, people:IPerson[]) {
			if (e) {
				defer.reject(e);
			} else {
				var lastNumber = (people.length === 0) ? 0 : people[0].personId;
				var nextNumber = lastNumber + 10;
				person.personId = nextNumber;
				coll.insert(person, {}, function(e, results){
					if (e) {
						defer.reject(e);
					} else {
						defer.resolve(person);
					}
				});
			}
		});

		return defer.promise;
	}

	public getCycles() : Q.Promise<ICycle[]> {
		let defer = Q.defer<ICycle[]>();

		this.cyclesCollection.find({}).sort({cycleId:-1}).toArray(function(e,cycles:ICycle[]){
		        if (e) {
		            defer.reject(e);
		        } else {
					defer.resolve(cycles);
				}
		    });

		return defer.promise;
	}

	public addCycle(cycle:ICycle) : Q.Promise<ICycle> {
		let defer = Q.defer<ICycle>();

		var coll = this.cyclesCollection;

		var startDate = cycle.startDate;

		coll.find({}).sort({endDate: -1}).toArray(function (e, cycles:ICycle[]) {
			if (e) {
				defer.reject(e);
				return;
			}

			var lastNumber = (cycles.length === 0) ? 0 : cycles[0].cycleId;
			if (lastNumber !== 0) {
				var endOfLastPeriod:Date = cycles[0].endDate;
				var msDiff = startDate.valueOf() - endOfLastPeriod.valueOf();
				if (msDiff !== 24 * 3600 * 1000) {
					defer.reject(Error('The last period ends on ' + endOfLastPeriod.toUTCString()));
					return;
				}
			}

			cycle.cycleId = lastNumber + 1;
			coll.insert(cycle, {}, function(e, cycles:ICycle[]){
				if (e) {
					defer.reject(e);
				} else {
					defer.resolve(cycles[0]);
				}
			});
		});

		return defer.promise;
	}

	public getUsage() : Q.Promise<IUsage[]> {

		let defer = Q.defer<IUsage[]>();

		this.usageCollection.find({}).sort({date:1}).toArray(function(e,usage:IUsage[]){
		        if (e) {
		            defer.reject(e);
		        } else {
					defer.resolve(usage);
				}
		    });

		return defer.promise;
	}

	public getUsageForPerson(personId:number, startDate:Date, endDate:Date) : Q.Promise<IUsage[]> {
		let defer = Q.defer<IUsage[]>();

		let query = {personId:personId, $and:
				[{date:{$gte:startDate}},
				 {date:{$lte:endDate}}]};

		console.log('query', query);
		this.usageCollection.find(query).sort({date:1}).toArray(function(e,usage:IUsage[]){
		        if (e) {
		            defer.reject(e);
		        } else {
					defer.resolve(usage);
				}
		    });

		return defer.promise;
	}

	public getUsageForPeriod(startDate:Date, endDate:Date) : Q.Promise<IUsage[]> {
		let defer = Q.defer<IUsage[]>();

		let query = {$and:[
							{date:{$gte:startDate}},
				 			{date:{$lte:endDate}}
					]};

		console.log('query', query);
		this.usageCollection.find(query).sort({date:1, personId:1}).toArray(function(e,usage:IUsage[]){
		        if (e) {
		            defer.reject(e);
		        } else {
					defer.resolve(usage);
				}
		    });

		return defer.promise;
	}

	uploadUsageFile(personId:number, origFilename: string, filespec:string) : Q.Promise<number> {
		let defer = Q.defer<number>();
		console.log(`Uploading data for person ${personId} in file ${filespec} from original file ${origFilename}`);

		fs.readFile(filespec, 'utf-8', (err,data:string) => {
			if (err) {
				defer.reject(err);
				return;
			}
			//console.log(data);
			let lines = data.split('\n').slice(1);
			this.processUsageData(personId, lines)
				.then((totalUsage) => defer.resolve(totalUsage))
				.catch(err => defer.reject(err));

		});
		return defer.promise;
	}

	// Store usage data obtained from the Verizon download file
	processUsageData(personId:number, lines:string[]) : Q.Promise<number> {
		let defer = Q.defer<number>();

		let quoteFind = new RegExp('"', 'g');
		var dateMap = {};

		// Sum up the usage for each date.  Their are multiple entries per day
		for (var line of lines) {
			let fields = line.split('\t');
			let dateString = fields[0].replace(quoteFind, '');
			let usage = parseFloat(fields[4].replace(quoteFind,''));

			//console.log(`Usage on ${dateString} is ${usage}`);

			if (!dateMap[dateString]) {
				dateMap[dateString] = 0.0;
			}
			dateMap[dateString] = dateMap[dateString] + usage;
		}

		let documents = [];			//to insert into mongo
		let totalUsage = 0.0;

		for (var key in dateMap) {
			let usage = dateMap[key];
			totalUsage += usage;
			let document = { personId: personId, date: new Date(key), usage: usage};
			documents.push(document);
		}

		// Remove any usage for this person on the same dates we are uploading

		var docDates = documents.map(d => d.date);
		var deleteQuery = {	personId: personId,
							date:{$in:docDates}};

		this.usageCollection.remove(deleteQuery, (e, numDeleted) => {
			if (e) {
				defer.reject(e);
				return;
			}
			console.log(`Deleted ${numDeleted} usage entries for person ${personId}`);
			this.usageCollection.insert(documents, {}, function(e, insertedDocs){
				if (e) {
					defer.reject(e);
				} else {
					console.log(`Inserted ${insertedDocs.length} documents for person ${personId}.`);
					defer.resolve(totalUsage);
				}
			});
		});

		return defer.promise;
	}
}
