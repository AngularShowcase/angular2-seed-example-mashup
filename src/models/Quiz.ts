import {IQuiz, IUserQuestion} from '../../common/interfaces/QuizInterfaces';

export class Quiz implements IQuiz {
    quizId: number = 0;
	categories: string[] = [];
	questionCount: number = 0;
	userQuestions:IUserQuestion[] = [];
}
