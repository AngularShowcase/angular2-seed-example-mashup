export interface IQuestion {
	questionId: number;
	text: string;
	isRoot: boolean;
	yes: number;
	no: number;
}

export interface INewAnimalInfo {
	priorQuestionId:number;
	priorDirection:string;
	oldAnimalId:number;
	newAnimal:string;
	newQuestion:string;
	answerForNewAnimal:string;
}
