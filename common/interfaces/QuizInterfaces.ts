export interface IQuizQuestion {
	questionId: number;
	category:string;
	question: string;
	answerCategory:string;
	answer:string;
}

export interface INewQuizRequest {
	questionCount: number;
	categories: string[];
}

export interface IUserQuestion {
	questionNumber: number;
	question:string;
	category: string;
	questionId: number;
	answerCategory: string;
	responsesShown: string[];
	correctAnswer: string;
}

export interface IQuiz {
	quizId: number;
	categories: string[];
	questionCount: number;
	userQuestions:IUserQuestion[];
}

export interface INewTestRequest {
	quizId: number;
	user: string;
}

export interface IAnswer {
	questionNumber: number;
	userAnswer: string;
	isCorrect: boolean;
}

export interface ISectionResult {
	sectionName: string;
	questionCount: number;
	correctCount: number;
	incorrectCount: number;
	score: number;
}

export interface ITest {
	testId: number;
	quizId: number;
	user: string;
	dateTaken: Date;
	completed: boolean;
	questionCount: number;
	answers: IAnswer[];
	sectionResults: ISectionResult[];
	testResult:ISectionResult;
}

export interface IScoringResult {
	testComplete: boolean;
	missingAnswers: number[];
	testResults?: ITest;
}
