import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {Http, Headers, RequestOptions, RequestOptionsArgs} from 'angular2/http';
import {IQuizQuestion, INewQuizRequest, IQuiz, IScoringResult,
        ITest, INewTestRequest, ISectionResult} from '../../common/interfaces/QuizInterfaces';
import {SectionResult} from '../models/SectionResult';

@Injectable()
export class QuizServices {

	constructor(public http:Http) {

	}

	getQuestions() : Observable<IQuizQuestion[]> {
		var result = this.http.get('/api/quiz/questions')
			.map(response => {
                return <IQuizQuestion[]> response.json();
            });

		return result;
	}

	getQuestion(questionId:number) : Observable<IQuizQuestion> {
		var result = this.http.get(`/api/quiz/questions/${questionId}`)
			.map(response => {
                return <IQuizQuestion> response.json();
            });

		return result;
	}

	getQuestionsForCategory(category:string) : Observable<IQuizQuestion[]> {
		var result = this.http.get(`/api/quiz/questions?category=${category}`)
			.map(response => {
                return response.json();
            });

		return result;
	}

	getQuestionsForQAndACategory(category:string, answerCategory:string) : Observable<IQuizQuestion[]> {
		var result = this.http.get(`/api/quiz/questions?category=${category}&answerCategory=${answerCategory}`)
			.map(response => {
                return response.json();
            });

		return result;
	}

	getCategories() : Observable<string[]> {
		return this.http.get('/api/quiz/categories').map(response => response.json());
	}

	getAnswerCategories() : Observable<string[]> {
		return this.http.get('/api/quiz/answercategories').map(response => response.json());
	}

	addQuestion(newQuestion:IQuizQuestion) : Observable<IQuizQuestion> {
		var pub = this.http.post('/api/quiz/questions',
					JSON.stringify(newQuestion),
					this.getPostOptions());

		return pub.map(response => response.json());
	}

	updateQuestion(question:IQuizQuestion) : Observable<IQuizQuestion> {
		var pub = this.http.put(`/api/quiz/questions/${question.questionId}`,
					JSON.stringify(question),
					this.getPostOptions());

		return pub.map(response => response.json());
	}

	getQuiz(quizId:number) : Observable<IQuiz> {
		return this.http.get(`/api/quiz/${quizId}`).map(response => response.json());
	}

	getTest(testId:number) : Observable<ITest> {
		return this.http.get(`/api/quiz/test/${testId}`).map(response => response.json());
	}

    getUserTests(username:string) : Observable<ITest[]> {
        return this.http.get(`/api/quiz/test/user/${username}`)
            .map(response => {
                return this.convertTestDates(response.json());
            });
    }

	createQuiz(categories:string[], questionCount:number) : Observable<IQuiz> {
		console.log(`Creating a quiz with ${questionCount} questions for categories ${categories}`);

		let request:INewQuizRequest = {
			questionCount: questionCount,
			categories: categories
		};

		var pub = this.http.post('/api/quiz', JSON.stringify(request), this.getPostOptions());
		return pub.map(response => response.json());
	}

	createTest(quizId:number, user:string) : Observable<ITest> {
		console.log(`Creating a test for quizId ${quizId} for user ${user}.`);

		let request:INewTestRequest = {
			quizId: quizId,
			user: user
		};

		return this.http.post('/api/quiz/test', JSON.stringify(request), this.getPostOptions())
			.map(response => response.json());
	}

	recordAnswer(testId: number, questionNumber: number, userAnswer:string) : Observable<any> {
		console.log(testId, questionNumber, userAnswer);
		return this.http.post(`/api/quiz/test/${testId}/answer/${questionNumber}`,
				JSON.stringify({userAnswer: userAnswer}), this.getPostOptions())
				.map(response => response.json());
	}

	scoreTest(testId:number) : Observable<IScoringResult> {
		return this.http.post(`/api/quiz/test/${testId}/score`, null, this.getPostOptions())
				.map(response => response.json());
	}

	getPostOptions(): RequestOptions {
		var headers = new Headers();
		headers.append('Content-Type', 'application/json');

		var options: RequestOptionsArgs = {
			headers: headers
		};

		return new RequestOptions(options);
	}

	convertTestDates(tests:any[]) : ITest[] {
		tests.forEach(t => {
			t.dateTaken = new Date(t.dateTaken);
		});

		return tests;
	}

    // Aggregate a list of section results by the section name.  Group by section name
    // and compute the totals for each.
    aggregateSectionResultsBySectionName(allSections:ISectionResult[]) : ISectionResult[] {

        let sectionsByCategory = _.groupBy(allSections, 'sectionName');

        let summary:ISectionResult[] = [];

        for (let categoryName in sectionsByCategory) {
            let categorySections = sectionsByCategory[categoryName];

            let categoryTotals = _.reduce<ISectionResult,ISectionResult>(categorySections, (acc, item) => {
                acc.correctCount += item.correctCount;
                acc.incorrectCount += item.incorrectCount;
                acc.questionCount += item.questionCount;

                return acc;

            }, new SectionResult());

            categoryTotals.sectionName = categoryName;
            categoryTotals.score = categoryTotals.questionCount === 0 ? 0 : categoryTotals.correctCount / categoryTotals.questionCount;
            summary.push(categoryTotals);
        }

        return summary;
    }

    // Add up all sections regardless of section names.  Useful for grand totals
    
    aggregateSectionResults(allSections:ISectionResult[]) : ISectionResult {

        let totals = _.reduce<ISectionResult,ISectionResult>(allSections, (acc, item) => {
            acc.correctCount += item.correctCount;
            acc.incorrectCount += item.incorrectCount;
            acc.questionCount += item.questionCount;

            return acc;

        }, new SectionResult());

        totals.score = totals.questionCount === 0 ? 0 : totals.correctCount / totals.questionCount;
        return totals;
    }
}
