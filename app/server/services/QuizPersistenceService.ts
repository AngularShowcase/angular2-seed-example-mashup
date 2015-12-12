import Q = require('q');
import _ = require('underscore');

var mongoskin = require('mongoskin');
import {IQuizQuestion, INewQuizRequest, IQuiz, ITest, IScoringResult, ISectionResult} from '../../common/interfaces/QuizInterfaces';
import {UserQuestionCreator} from './UserQuestionCreator';

var config = {
	mongo_url: process.env.QUIZDATA_URL || 'mongodb://@localhost:27017/quiz'
};

export class QuizPersistenceService {

	db: any;
	questionsCollection: any;
	quizCollection: any;
	testCollection: any;

	constructor() {
		this.db = mongoskin.db(config.mongo_url, { safe: true });
		this.questionsCollection = this.db.collection('questions');
		this.quizCollection = this.db.collection('quizes');
		this.testCollection = this.db.collection('tests');
	}

	public getQuestions(): Q.Promise<IQuizQuestion[]> {
		let defer = Q.defer<IQuizQuestion[]>();
		this.questionsCollection.find({}).sort({ category: 1, question: 1 }).toArray(function(e, questions: IQuizQuestion[]) {
			if (e) {
				defer.reject(e);
			} else {
				defer.resolve(questions);
			}
		});
		return defer.promise;
	}

	public getQuestionsForCategory(category: string): Q.Promise<IQuizQuestion[]> {

		category = category.trim().toLowerCase();

		let defer = Q.defer<IQuizQuestion[]>();
		this.questionsCollection.find({ category: category }).sort({ questionId: -1 }).toArray(function(e, questions: IQuizQuestion[]) {
			if (e) {
				defer.reject(e);
			} else {
				defer.resolve(questions);
			}
		});
		return defer.promise;
	}

	public getQuestionsForQandACategory(category: string, answerCategory: string): Q.Promise<IQuizQuestion[]> {

		category = category.trim().toLowerCase();
		answerCategory = answerCategory.trim().toLowerCase();

		let defer = Q.defer<IQuizQuestion[]>();
		this.questionsCollection.find({ category: category, answerCategory: answerCategory })
			.sort({ questionId: -1 }).toArray(function(e, questions: IQuizQuestion[]) {
				if (e) {
					defer.reject(e);
				} else {
					defer.resolve(questions);
				}
			});
		return defer.promise;
	}

	public addQuestion(question: IQuizQuestion): Q.Promise<IQuizQuestion> {

		this.cleanQuestion(question);

		let defer = Q.defer<IQuizQuestion>();
		var coll = this.questionsCollection;
		coll.find({}, { _id: 0, questionId: 1 }).sort({ questionId: -1 }).toArray(function(e, questions: IQuizQuestion[]) {
			if (e) {
				defer.reject(e);
			} else {
				var lastNumber = (questions.length === 0) ? 0 : questions[0].questionId;
				var nextNumber = lastNumber + 10;
				question.questionId = nextNumber;
				coll.insert(question, {}, function(e, results) {
					if (e) {
						defer.reject(e);
					} else {
						defer.resolve(question);
					}
				});
			}
		});

		return defer.promise;
	}

	public getCategories(): Q.Promise<string[]> {
		let defer = Q.defer<string[]>();
		var coll = this.questionsCollection;
		coll.find({}, { _id: 0, category: 1 }).sort({ category: 1 }).toArray((e, results) => {
			if (e) {
				defer.reject(e);
			} else {
				var allCategories = _.map(results, (o: { category: string }) => o.category);
				var distinctCategories = _.unique(allCategories, true);
				defer.resolve(distinctCategories);
			}
		});

		return defer.promise;
	}

	public getAnswerCategories(): Q.Promise<string[]> {
		let defer = Q.defer<string[]>();
		var coll = this.questionsCollection;
		coll.find({}, { _id: 0, answerCategory: 1 }).sort({ answerCategory: 1 }).toArray((e, results) => {
			if (e) {
				defer.reject(e);
			} else {
				var allCategories = _.map(results, (o: { answerCategory: string }) => o.answerCategory);
				var distinctCategories = _.unique(allCategories, true);
				defer.resolve(distinctCategories);
			}
		});

		return defer.promise;
	}

	public getQuiz(quizId: number): Q.Promise<IQuiz> {
		let defer = Q.defer<IQuiz>();

		var coll = this.quizCollection;

		coll.findOne({ quizId: quizId }, function(e, quiz: IQuiz) {
			if (e) {
				defer.reject(e);
			} else {
				defer.resolve(quiz);
			}
		});

		return defer.promise;
	}

	public getTest(testId:number) : Q.Promise<ITest> {
		let defer = Q.defer<ITest>();

		var coll = this.testCollection;

		coll.findOne({ testId: testId }, function(e, test: ITest) {
			if (e) {
				defer.reject(e);
			} else {
				defer.resolve(test);
			}
		});

		return defer.promise;
	}

	public createTest(quizId: number, user: string): Q.Promise<ITest> {
		let defer = Q.defer<ITest>();
		var coll = this.testCollection;

		if (!user || !(user = user.trim().toLowerCase())) {
			defer.reject({ msg: 'Invalid username' });
			return;
		}

		this.getQuiz(quizId)
			.then(quiz => {
				coll.find({}, { _id: 0, testId: 1 }).sort({ testId: -1 }).toArray(function(e, tests: any[]) {
					if (e) {
						defer.reject(e);
					} else {
						var lastNumber = (tests.length === 0) ? 0 : tests[0].testId;
						var nextNumber = lastNumber + 10;

						var newTest:ITest = {
							testId: nextNumber,
							quizId: quizId,
							user: user,
							questionCount: quiz.questionCount,
							dateTaken: new Date(),
							completed: false,
							answers: [],
							sectionResults: [],
							testResult: {
								sectionName: 'total',
								questionCount: quiz.questionCount,
								correctCount: 0,
								incorrectCount: 0,
								score: 0
							}
						};

						coll.insert(newTest, {}, function(e, results: ITest) {
							if (e) {
								defer.reject(e);
							} else {
								defer.resolve(newTest);
							}
						});
					}
				});
			})
			.catch(err => {
				defer.resolve(err);
			});

		return defer.promise;

	}

	public createQuiz(request: INewQuizRequest): Q.Promise<IQuiz> {

		var self: QuizPersistenceService = this;

		let defer = Q.defer<IQuiz>();
		var coll = this.quizCollection;

		if (request.categories.length < 1) {
			defer.reject({ msg: 'No categories specified' });
			return defer.promise;
		}

		if (request.questionCount < request.categories.length) {
			defer.reject({ msg: `Only ${request.questionCount} questions requested for ${request.categories.length} categories.` });
			return defer.promise;
		}

		coll.find({}, { _id: 0, quizId: 1 }).sort({ quizId: -1 }).toArray(function(e, quizes: any[]) {

			if (e) {
				defer.reject(e);
			} else {
				var lastNumber = (quizes.length === 0) ? 0 : quizes[0].quizId;
				var nextNumber = lastNumber + 10;

				var userQuestionCreator = new UserQuestionCreator(self);

				var newQuiz: IQuiz = {
					quizId: nextNumber,
					categories: request.categories,
					questionCount: request.questionCount,
					userQuestions: []
				};

				userQuestionCreator.createUserQuestions(request.categories, request.questionCount)
					.then(userQuestions => {
						newQuiz.userQuestions = userQuestions;
						newQuiz.questionCount = userQuestions.length;

						coll.insert(newQuiz, {}, function(e, results: IQuiz) {
							if (e) {
								defer.reject(e);
							} else {
								defer.resolve(newQuiz);
							}
						});
					});
			}
		});

		return defer.promise;
	}

	scoreTest(testId:number) : Q.Promise<IScoringResult> {
		let defer = Q.defer<IScoringResult>();

		let test:ITest;
		let quiz:IQuiz;

		this.getTest(testId)
			.then(t => {
				test = t;
				return this.getQuiz(t.quizId);
			})
			.then(q => {
				quiz = q;
				console.log(`Scoring test ${test.testId} for quiz ${quiz.quizId}.`);

				let scoringResult:IScoringResult = {
					testComplete: false,
					missingAnswers: []
				};

				// See if the test is complete.  Find any questions that are unanswered
				var missingAnswers = quiz.userQuestions.filter(q => !_.any(test.answers, a => a.questionNumber === q.questionNumber))
										.map(q => q.questionNumber);

				if (missingAnswers.length !== 0) {
					scoringResult.missingAnswers = missingAnswers;
					defer.resolve(scoringResult);
					return;
				}

				let answers = _.zip(quiz.userQuestions, test.answers)
						.map(tuple => {
							return {	category: tuple[0].category,
										isCorrect: tuple[1].isCorrect};
						});

				let categoryResults = _.chain(answers)
					.groupBy('category')
					.map((values, key) => {
						let questionCount = values.length;
						let correctCount = values.filter(v => v.isCorrect).length;
						let incorrectCount = questionCount - correctCount;
						let score = correctCount / questionCount;
						let sectionResult:ISectionResult = {
							sectionName: key.toString(),
							questionCount: questionCount,
							correctCount: correctCount,
							incorrectCount: incorrectCount,
							score: score
						};

						return sectionResult;
					})
					.value();

				test.sectionResults = categoryResults;
				test.testResult.correctCount = 0;
				test.testResult.incorrectCount = 0;

				for (var catResult of categoryResults) {
					console.log(`Category ${catResult.sectionName}: ${catResult.correctCount} out of ${catResult.questionCount} = ${catResult.score}.`);
					test.testResult.correctCount += catResult.correctCount;
					test.testResult.incorrectCount += catResult.incorrectCount;
				}

				test.testResult.score = test.testResult.correctCount / test.testResult.questionCount;
				test.completed = true;

				// Save results
				this.testCollection.update({testId: test.testId}, test, {upsert: true}, (err, updateCount:number) => {
					if (err) {
						defer.reject(err);
						return;
					}
					scoringResult.testComplete = true;
					scoringResult.testResults = test;

					defer.resolve(scoringResult);
				});
			});

		return defer.promise;
	}

	recordTestAnswer(testId:number, questionNumber:number, userAnswer:string) : Q.Promise<number> {
		console.log(`Recording answer for test ${testId}, question number ${questionNumber}, user answer: ${userAnswer}.`);
		let defer = Q.defer<number>();
		let test:ITest;
		let quiz:IQuiz;

		this.getTest(testId)
			.then(t => {
				test = t;
				return this.getQuiz(t.quizId);
			})
			.then(q => {
				quiz = q;
				console.log(`Got test ${test} for quiz ${quiz}.`);
				return this.saveAnswer(test, quiz, questionNumber, userAnswer);
			})
			.then((updateCount:number) => {
				defer.resolve(updateCount);
			})
			.catch(err => {
				defer.reject(err);
			});

		return defer.promise;
	}

	private saveAnswer(test:ITest, quiz:IQuiz, questionNumber: number, userAnswer:string) : Q.Promise<number> {
		console.log(`Recording user answer ${userAnswer} on test
					${test.testId} on quiz ${quiz.quizId} for question number ${questionNumber} of ${quiz.questionCount}.`);

		let defer = Q.defer<number>();

		let question = quiz.userQuestions[questionNumber - 1];
		let correctAnswer = question.correctAnswer;

		// Remove any existing answers
		test.answers = test.answers.filter(a => a.questionNumber !== questionNumber);
		test.answers.push({
			questionNumber: questionNumber,
			userAnswer: userAnswer,
			isCorrect: (userAnswer === correctAnswer)
		});

		test.answers = test.answers.sort((a1,a2) => Math.sign(a1.questionNumber - a2.questionNumber));

		this.testCollection.update({testId: test.testId}, test, {upsert: true}, (err, updateCount:number) => {
			if (err) {
				defer.reject(err);
				return;
			}

			defer.resolve(updateCount);
		});

		return defer.promise;
	}

	private cleanQuestion(q: IQuizQuestion) {
		q.question = this.cleanString(q.question);
		q.answer = this.cleanString(q.answer);
		q.category = this.cleanString(q.category);
		q.answerCategory = this.cleanString(q.answerCategory);
	}

	private cleanString(str: string): string {
		let result = str.trim().toLowerCase().replace('?', '');
		return result;
	}
}
