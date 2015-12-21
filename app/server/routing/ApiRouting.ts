/// <reference path='../../../tools/typings/tsd/node/node.d.ts'/>
/// <reference path='../../../tools/typings/tsd/express/express.d.ts'/>
/// <reference path='../../../tools/typings/tsd/moment/moment.d.ts'/>
/// <reference path='../../../tools/typings/tsd/multer/multer.d.ts'/>
/// <reference path='../../../tools/typings/tsd/q/q.d.ts'/>

import * as express from 'express';
import * as multer from 'multer';

import {INewAnimalInfo} from '../../common/interfaces/AnimalInterfaces';
import {IPerson, ICycle} from '../../common/interfaces/CellDataInterfaces';
import {IQuizQuestion, INewQuizRequest, INewTestRequest, IScoringResult} from '../../common/interfaces/QuizInterfaces';
import {IRegistration, ILoginRequest} from '../../common/interfaces/RegistrationInterfaces';

import {AnimalPersistenceService} from '../services/AnimalPersistenceService';
import {CellDataPersistenceService} from '../services/CellDataPersistenceService';
import {QuizPersistenceService} from '../services/QuizPersistenceService';
import {SecurityService} from '../services/SecurityService';

import os = require('os');
import fs = require('fs');

export class ApiRouting {

	uploadFolder:string = '';
	router:express.Router;
	animalPersistenceService:AnimalPersistenceService;
	cellDataPersistenceService:CellDataPersistenceService;
	quizPersistenceService:QuizPersistenceService;
	securityService:SecurityService;

	constructor(public app) {
		this.animalPersistenceService = new AnimalPersistenceService();
		this.cellDataPersistenceService = new CellDataPersistenceService();
		this.quizPersistenceService = new QuizPersistenceService();
		this.securityService = new SecurityService();

		this.uploadFolder = os.tmpdir();
		console.log('Uploads will be placed in ' + this.uploadFolder);
	}

	getApiRoutingConfig() : any {
		this.router = express.Router();
		this.configBasicRoutes();

		return this.router;
	}

	configBasicRoutes() {

		this.router.post('/users/register', this.registerUser.bind(this));
		this.router.post('/login', this.login.bind(this));
		this.router.get('/animals/questions/root', this.getRootQuestion.bind(this));
		this.router.get('/animals/questions/:questionId', this.getQuestion.bind(this));
		this.router.get('/animals/questions', this.getAllQuestions.bind(this));
		this.router.post('/animals', this.saveNewAnimal.bind(this));
		this.router.delete('/animals/:animalId', this.deleteAnimal.bind(this));
		this.router.get('/celldata/people', this.getPeople.bind(this));
		this.router.post('/celldata/people', this.addPerson.bind(this));
		this.router.get('/celldata/cycles', this.getCycles.bind(this));
		this.router.post('/celldata/cycles', this.addCycle.bind(this));
		this.router.get('/celldata/usage/:personId', this.getUsageForPerson.bind(this));
		this.router.get('/celldata/usage', this.getUsage.bind(this));
		this.router.get('/celldata/periodusage', this.getPeriodUsage.bind(this));

		this.router.get('/quiz/questions', this.getQuizQuestions.bind(this));
		this.router.post('/quiz/questions', this.saveNewQuizQuestion.bind(this));
		this.router.get('/quiz/categories', this.getQuizCategories.bind(this));
		this.router.get('/quiz/answercategories', this.getQuizAnswerCategories.bind(this));

		this.router.post('/quiz/test/:testId/score', this.scoreTest.bind(this));
		this.router.post('/quiz/test/:testId/answer/:questionNumber', this.recordTestAnswer.bind(this));
		this.router.get('/quiz/test/:testId', this.getTest.bind(this));
		this.router.post('/quiz/test', this.createTest.bind(this));
		this.router.post('/quiz', this.createQuiz.bind(this));
		this.router.get('/quiz/:quizId', this.getQuiz.bind(this));

		var uploads = multer({ dest: this.uploadFolder});

		//Special case to use the multer middleware piece to handle file uploads
		this.app.post('/api/celldata/uploadUsage/:personId',
			[uploads['single']('datafile'),
			this.uploadUsage.bind(this)]);
	}

	// Login a user
	login(req, res, next) {
		var loginRequest:ILoginRequest = req.body;
		this.securityService.login(loginRequest.username, loginRequest.password)
			.then(resp => res.send(resp))
			.catch(err => next(err));
	}

	// Register a new users
	registerUser(req, res, next) {
		var registration:IRegistration = req.body;
		this.securityService.registerUser(registration)
			.then(resp => res.send(resp))
			.catch(err => next(err));
	}

	getRootQuestion(req, res, next) {
		this.animalPersistenceService.getRootQuestion()
			.then(question => res.send(question))
			.catch(err => next(err));
	}

	getQuestion(req, res, next) {
		var questionId = parseInt(req.params.questionId);
		this.animalPersistenceService.getQuestion(questionId)
			.then(question => res.send(question))
			.catch(err => next(err));
	}

	getAllQuestions(req, res, next) {
		this.animalPersistenceService.getAllQuestions()
			.then(questions => res.send(questions))
			.catch(err => next(err));
	}

	saveNewAnimal(req, res, next) {
		var newInfo:INewAnimalInfo = req.body;
		this.animalPersistenceService.saveNewAnimal(newInfo)
			.then(response => res.send(response))
			.catch(err => next(err));
	}

	deleteAnimal(req, res, next) {
		var animalId = parseInt(req.params.animalId);
		let password:string = req.headers.password;

		if (password !== process.env.ADMIN_PASSWORD) {
			next({status:401, msg:'Incorrect admin password'});
			return;
		}

		console.log(`ApiRouting got a request to delete animal ${animalId} with password ${password}`);
		this.animalPersistenceService.deleteAnimal(animalId)
			.then(deleteResponse => res.send(deleteResponse))
			.catch(err => next({status:401, msg: err}));
	}


	getPeople(req, res, next) {
		this.cellDataPersistenceService.getPeople()
			.then(people => res.send(people))
			.catch(err => next(err));
	}

	addPerson(req, res, next) {
		var person:IPerson = req.body;
		this.cellDataPersistenceService.addPerson(person)
			.then(p => res.send(p))
			.catch(err => next(err));
	}

	getCycles(req, res, next) {
		this.cellDataPersistenceService.getCycles()
			.then(cycles => res.send(cycles))
			.catch(err => next(err));
	}

	addCycle(req, res, next) {
		var cycle:ICycle = {
			cycleId: 0,
			startDate: new Date(req.body.startDate),
			endDate: new Date(req.body.endDate)
		};

		this.cellDataPersistenceService.addCycle(cycle)
			.then(cycle => res.send(cycle))
			.catch(err => next(err));
	}

	getUsage(req, res, next) {
		this.cellDataPersistenceService.getUsage()
			.then(usage => res.send(usage))
			.catch(err => next(err));
	}

	getUsageForPerson(req, res, next) {
		try {
			var personId = parseInt(req.params.personId);
			var startDate = new Date(req.query.startDate);
			var endDate = new Date(req.query.endDate);

			this.cellDataPersistenceService.getUsageForPerson(personId, startDate, endDate)
				.then(usage => res.send(usage))
				.catch(err => res.send(err));
		} catch (err) {
			next(err);
		}
		console.log(personId, startDate, endDate);
	}

	getPeriodUsage(req, res, next) {
		try {
			var startDate = new Date(req.query.startDate);
			var endDate = new Date(req.query.endDate);

			this.cellDataPersistenceService.getUsageForPeriod(startDate, endDate)
				.then(usage => res.send(usage))
				.catch(err => res.send(err));
		} catch (err) {
			next(err);
		}
	}

	uploadUsage(req, res:express.Response, next) {
		if (!req.file) {
			next(Error('No file specified'));
			return;
		}

		this.cellDataPersistenceService.uploadUsageFile(
			parseInt(req.params.personId),
			req.file.originalname,
			req.file.path
		)
		.then(totalUsage => {
			console.log(`Total usage for ${req.params.personId} is ${totalUsage}`);
			console.log(`Removing file ${req.file.path}`);
			fs.unlink(req.file.path, err => {
				if (err) {
					res.send(err);
				} else {
					res.redirect('/#/usage');
				}
			});
		})
		.catch(err => next(err));
	}

	getQuizQuestions(req, res, next) {
		let category = req.query.category;
		let answerCategory = req.query.answerCategory;
		var promise:Q.Promise<IQuizQuestion[]>;

		if (category && answerCategory) {
			promise = this.quizPersistenceService.getQuestionsForQandACategory(category, answerCategory);
		} else if (category) {
			promise = this.quizPersistenceService.getQuestionsForCategory(category);
		} else {
			promise = this.quizPersistenceService.getQuestions();
		}

		promise.then(questions => res.send(questions))
			.catch(err => next(err));
	}

	getQuizCategories(req, res, next) {
		this.quizPersistenceService.getCategories()
			.then(categories => res.send(categories))
			.catch(err => next(err));
	}

	getQuizAnswerCategories(req, res, next) {
		this.quizPersistenceService.getAnswerCategories()
			.then(categories => res.send(categories))
			.catch(err => next(err));
	}

	saveNewQuizQuestion(req, res, next) {
		var newQuestion:IQuizQuestion = req.body;
		this.quizPersistenceService.addQuestion(newQuestion)
			.then(response => res.send(response))
			.catch(err => next(err));
	}

	createQuiz(req, res, next) {
		var request:INewQuizRequest = req.body;

		console.log(`Server got request to create a quiz with ${request.questionCount} questions for categories ${request.categories}.`);
		this.quizPersistenceService.createQuiz(request)
			.then(response => res.send(response))
			.catch(err => next(err));
	}

	createTest(req, res, next) {
		var request:INewTestRequest = req.body;
		this.quizPersistenceService.createTest(request.quizId, request.user)
			.then(response => res.send(response))
			.catch(err => next(err));
	}

	recordTestAnswer(req, res, next) {
		var testId = parseInt(req.params.testId);
		var questionNumber = parseInt(req.params.questionNumber);
		var userAnswer = req.body.userAnswer;

		this.quizPersistenceService.recordTestAnswer(testId, questionNumber, userAnswer)
			.then(updateCount => {
					res.send({updateCount: updateCount});
				})
			.catch(err =>next(err));
 	}

	getQuiz(req, res, next) {
		var quizId = parseInt(req.params.quizId);
		this.quizPersistenceService.getQuiz(quizId)
			.then(response => res.send(response))
			.catch(err => next(err));
	}

	getTest(req, res, next) {
		var testId = parseInt(req.params.testId);
		this.quizPersistenceService.getTest(testId)
			.then(response => res.send(response))
			.catch(err => next(err));
	}

	scoreTest(req, res, next) {
		let testId = parseInt(req.params.testId);
		this.quizPersistenceService.scoreTest(testId)
			.then((response:IScoringResult) => res.send(response))
			.catch(err => next(err));
	}
}
