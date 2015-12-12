///<reference path='../../tools/typings/tsd/rx/rx.all.d.ts' />
import {Injectable, Observable} from 'angular2/angular2';
import {Http, Headers, RequestOptions, Response, RequestOptionsArgs} from 'angular2/http';
import {IQuizQuestion, INewQuizRequest, IQuiz, IScoringResult, ITest, INewTestRequest} from '../common/interfaces/QuizInterfaces';

@Injectable()
export class QuizServices {

	constructor(public http:Http) {

	}

	getQuestions() : Observable<IQuizQuestion[]> {
		var result = this.http.get('/api/quiz/questions')
			.map((response:Response) => {
                return <IQuizQuestion[]> response.json();
            });

		return result;
	}

	getQuestionsForCategory(category:string) : Observable<IQuizQuestion[]> {
		var result = this.http.get(`/api/quiz/questions?category=${category}`)
			.map((response:Response) => {
                return response.json();
            });

		return result;
	}

	getQuestionsForQAndACategory(category:string, answerCategory:string) : Observable<IQuizQuestion[]> {
		var result = this.http.get(`/api/quiz/questions?category=${category}&answerCategory=${answerCategory}`)
			.map((response:Response) => {
                return response.json();
            });

		return result;
	}

	getCategories() : Observable<string[]> {
		return this.http.get('/api/quiz/categories').map((response:Response) => response.json());
	}

	getAnswerCategories() : Observable<string[]> {
		return this.http.get('/api/quiz/answercategories').map((response:Response) => response.json());
	}

	addQuestion(newQuestion:IQuizQuestion) : Observable<IQuizQuestion> {
		var pub = this.http.post('/api/quiz/questions',
					JSON.stringify(newQuestion),
					this.getPostOptions());

		return pub.map((response:Response) => response.json());
	}

	getQuiz(quizId:number) : Observable<IQuiz> {
		return this.http.get(`/api/quiz/${quizId}`).map((response:Response) => response.json());
	}

	getTest(testId:number) : Observable<ITest> {
		return this.http.get(`/api/quiz/test/${testId}`).map((response:Response) => response.json());
	}

	createQuiz(categories:string[], questionCount:number) : Observable<IQuiz> {
		console.log(`Creating a quiz with ${questionCount} questions for categories ${categories}`);

		let request:INewQuizRequest = {
			questionCount: questionCount,
			categories: categories
		};

		var pub = this.http.post('/api/quiz', JSON.stringify(request), this.getPostOptions());
		return pub.map((response:Response) => response.json());
	}

	createTest(quizId:number, user:string) : Observable<ITest> {
		console.log(`Creating a test for quizId ${quizId} for user ${user}.`);

		let request:INewTestRequest = {
			quizId: quizId,
			user: user
		};

		return this.http.post('/api/quiz/test', JSON.stringify(request), this.getPostOptions())
			.map((response:Response) => response.json());
	}

	recordAnswer(testId: number, questionNumber: number, userAnswer:string) : Observable<any> {
		console.log(testId, questionNumber, userAnswer);
		return this.http.post(`/api/quiz/test/${testId}/answer/${questionNumber}`,
				JSON.stringify({userAnswer: userAnswer}), this.getPostOptions())
				.map((response:Response) => response.json());
	}

	scoreTest(testId:number) : Observable<IScoringResult> {
		return this.http.post(`/api/quiz/test/${testId}/score`, null, this.getPostOptions())
				.map((response:Response) => response.json());
	}

	getPostOptions(): RequestOptions {
		var headers = new Headers();
		headers.append('Content-Type', 'application/json');

		var options: RequestOptionsArgs = {
			headers: headers
		};

		return new RequestOptions(options);
	}
}
