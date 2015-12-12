import Q = require('q');
import _ = require('underscore');

import {IQuizQuestion, IUserQuestion} from '../../common/interfaces/QuizInterfaces';
import {QuizPersistenceService} from './QuizPersistenceService';

export class UserQuestionCreator {

	constructor(public quizPersistenceService:QuizPersistenceService) {
	}

	public createUserQuestions(categories:string[], questionCount:number) : Q.Promise<IUserQuestion[]> {
		let defer = Q.defer<IUserQuestion[]>();

		this.quizPersistenceService.getQuestions()
			.then(questions => {

				// A list of questions for each requested category
				var catQuestions:IQuizQuestion[][] = categories.map(c => questions.filter(q => q.category === c));

				// Shuffle the questions in each category
				for (var i = 0; i < catQuestions.length; ++i) {
					catQuestions[i] = <IQuizQuestion[]> _.shuffle(catQuestions[i]);
				}

				//Note that zip apply will take the array as a list of parameters -- each parameter being an "inner" array

				var questionList:IQuizQuestion[] = <IQuizQuestion[]> _.shuffle(_.filter(_.flatten(_.zip.apply(null, catQuestions)), q => !!q)
													.slice(0, questionCount));
				//console.log(questionList);

				let userQuestions:IUserQuestion[] = questionList.map((q, i) => {
					return {
						questionNumber: i + 1,
						questionId: q.questionId,
						question: q.question,
						category: q.category,
						answerCategory: q.answerCategory,
						correctAnswer: q.answer,
						responsesShown: this.createResponses(questions, q.answerCategory, q.answer)
					};
				});

				defer.resolve(userQuestions);
			});

		return defer.promise;
	}

	private createResponses(questions:IQuizQuestion[], answerCategory:string, correctAnswer:string, answersToGenerate:number = 4) : string[] {
		var possibleAnswers = _.unique(questions.filter(q => q.answerCategory === answerCategory && q.answer !== correctAnswer)
			.map(q => q.answer));

		var answers = <string[]> _.shuffle(possibleAnswers).slice(0, answersToGenerate - 1);
		answers.push(correctAnswer);
		var result = <string[]> _.shuffle(answers);
		return result;
	}
}
