import {ISectionResult} from '../../common/interfaces/QuizInterfaces';

export class SectionResult implements ISectionResult {
	sectionName: string = '';
	questionCount: number = 0;
	correctCount: number = 0;
	incorrectCount: number = 0;
	score: number = 0;
}
