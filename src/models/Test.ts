import {ITest, IAnswer, ISectionResult} from '../../common/interfaces/QuizInterfaces';
import {SectionResult} from './SectionResult';

export class Test implements ITest {
    testId:number =  0;
    quizId:number = 0;
    user:string = '';
    questionCount: number = 0;
    dateTaken: Date = new Date();
    completed: boolean = false;
    answers: IAnswer[] = [];
    sectionResults: ISectionResult[] = [];
    testResult:ISectionResult = new SectionResult();
}
