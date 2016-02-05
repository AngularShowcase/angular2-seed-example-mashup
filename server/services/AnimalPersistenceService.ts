import {IQuestion, INewAnimalInfo} from '../../common/interfaces/AnimalInterfaces';
import Q = require('q');
var mongoskin = require('mongoskin');		// Need to use require when there is no TSD file
import _ = require('underscore');

var config = {
	port: 3000,
	mongo_url: process.env.ANIMALS_URL || 'mongodb://@localhost:27017/animals'
};

export class AnimalPersistenceService {

	db:any;
	questionsCollection:any;

	constructor() {
		this.db = mongoskin.db(config.mongo_url, {safe:true});
		this.questionsCollection = this.db.collection('questions');
	}

	public getRootQuestion():Q.Promise<IQuestion> {
		let defer = Q.defer<IQuestion>();

		var coll = this.questionsCollection;

		coll.findOne({isRoot: true}, function(e, question:IQuestion){
			if (e) {
				defer.reject(e);
			} else if (!question) {
				defer.reject('No question marked as root!');
			} else {
				defer.resolve(question);
			}
		});

		return defer.promise;
	}

	public getQuestion(questionId:number):Q.Promise<IQuestion> {
		let defer = Q.defer<IQuestion>();

		var coll = this.questionsCollection;

		coll.findOne({questionId: questionId}, function(e, question){
			if (e) {
				defer.reject(e);
			} else if (!question) {
				defer.reject('No question with id ' + questionId);
			} else {
				defer.resolve(question);
			}
		});

		return defer.promise;
	}

	public getAllQuestions():Q.Promise<IQuestion[]> {
		let defer = Q.defer<IQuestion[]>();

		var coll = this.questionsCollection;
		coll.find({}).sort({isRoot:-1}).toArray(function(e, results:IQuestion[]){
		        if (e) {
		            defer.reject(e);
		        } else {
					defer.resolve(results);
				}
		    });

		return defer.promise;
	}

	public deleteAnimal(animalId:number) : Q.Promise<any> {
		let defer = Q.defer();

		this.getAllQuestions()
			.then(questions => {
				let animal = _.find(questions, q => q.questionId === animalId);
				if (!animal) {
					defer.reject(`Cannot find animal ${animalId}`);
					return;
				}

				let parent = _.find(questions, q => q.yes === animalId || q.no === animalId);
				if (!parent) {
					defer.reject(`Cannot find parent of animal ${animalId} (${animal.text})`);
					return;
				}

				let grandParent = _.find(questions, q => q.yes === parent.questionId || q.no === parent.questionId);
				if (!grandParent) {
					defer.reject(`Cannot find parent of question ${parent.questionId} (${parent.text})`);
					return;
				}
				let directionFromGrandParent = (grandParent.yes === parent.questionId) ? 'yes' : 'no';
				let otherAnimalId = (parent.yes === animalId) ? parent.no : parent.yes;
				let otherAnimal = _.find(questions, q => q.questionId === otherAnimalId);
				if (!otherAnimal) {
					defer.reject(`Cannot find OTHER animal ${otherAnimalId}`);
					return;
				}

				// Operations: Delete the animal and the parent.  Set the granparents correct
				// yes/no link to the other animal

				var coll = this.questionsCollection;
				coll.remove({questionId:animalId}, (e, numDeleted) => {
					if (e) {
						defer.reject(e);
						return;
					}
					coll.remove({questionId:parent.questionId}, (e, numDeleted) => {
						if (e) {
							defer.reject(e);
							return;
						}

						let setClause = (directionFromGrandParent === 'yes') ? {yes:otherAnimal.questionId} : {no:otherAnimal.questionId};

						coll.update({questionId:grandParent.questionId}, {$set: setClause}, (e, numUpdated) => {
							if (e) {
								defer.reject(e);
								return;
							}
							defer.resolve({updated:numUpdated});
						});
					});
				});
			})
			.catch(err => defer.reject(err));

		return defer.promise;
	}

	public saveNewAnimal(newInfo:INewAnimalInfo):Q.Promise<any> {

		let defer = Q.defer();

		var newAnimal:IQuestion = {
			questionId: 0,
			text: newInfo.newAnimal,
			yes: 0,
			no: 0,
			isRoot:false
		};

		var newQuestion:IQuestion;

		this.saveQuestion(newAnimal)
			.then(animal => {
						newAnimal = animal;		// Save updated information

						newQuestion = {
							questionId: 0,
							text: newInfo.newQuestion,
							yes: (newInfo.answerForNewAnimal === 'y') ? newAnimal.questionId : newInfo.oldAnimalId,
							no: (newInfo.answerForNewAnimal === 'n') ? newAnimal.questionId: newInfo.oldAnimalId,
							isRoot:false
						};

						return this.saveQuestion(newQuestion);
					}
			)
			.then(question => {
						newQuestion = question;	// save updated information
						return this.getQuestion(newInfo.priorQuestionId);
					}
			)
			.then(priorQuestion => {
					if (newInfo.priorDirection === 'y') {
						priorQuestion.yes = newQuestion.questionId;
					} else {
						priorQuestion.no = newQuestion.questionId;
					}

					return this.updateQuestion(priorQuestion);
				}
			)
			.then(updateResult => {
						defer.resolve([newAnimal, newQuestion, updateResult]);
					}
			)
			.catch(err => defer.reject(err));

		return defer.promise;
	}

	private getHighestQuestionId():Q.Promise<number> {
		let defer = Q.defer<number>();
		var coll = this.questionsCollection;
		coll.find({}, { _id: 0, questionId: 1 }).sort({ questionId: -1 }).toArray(function (e, questions) {
                if (e) {
					defer.reject(e);
				} else {
	                defer.resolve((questions.length === 0) ? 0 : questions[0].questionId);
				}
				});

		return defer.promise;
	}

	private saveQuestion(newQuestion:IQuestion):Q.Promise<IQuestion> {
		let defer = Q.defer<IQuestion>();

		this.getHighestQuestionId()
			.then((lastId:number) => {
				var coll = this.questionsCollection;
				newQuestion.questionId = lastId + 10;
                coll.insert(newQuestion, {}, function (e, result:IQuestion[]) {
					if (e) {
						defer.reject(e);
					} else {
						defer.resolve(result[0]);
					}
				});

			});

		return defer.promise;
	}

	private updateQuestion(question:IQuestion):Q.Promise<any> {
		let defer = Q.defer<number>();
		var coll = this.questionsCollection;
	    coll.update({questionId:question.questionId}, question, function(e, updateResult){
			if (e) {
				defer.reject(e);
			} else {
				defer.resolve(updateResult);
			}
		});

		return defer.promise;
	}
}
