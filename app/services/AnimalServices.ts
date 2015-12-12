import {Injectable, Observable} from 'angular2/angular2';
import {Http, Headers, Response} from 'angular2/http';
import {IQuestion, INewAnimalInfo} from '../common/interfaces/AnimalInterfaces';
import {ITreeNode} from '../directives/TreeDisplay';

export interface IQuestionAndAnswer {
	question:ITreeNode;
	answer:string;
};

@Injectable()
export class AnimalServices {

	constructor(public http:Http) {
	}

	public buildTree(questions:IQuestion[], root?:IQuestion) : ITreeNode {
		let qDict = {};
		questions.forEach(q => qDict[q.questionId] = q);
		if (!root) {
			root = _.find(questions, q => q.isRoot);
		}
		return this.buildNode(root.questionId, qDict);
	}

	public getPathToNode(tree:ITreeNode, node:ITreeNode) : IQuestionAndAnswer[] {
		let result = this.traverseFrom(tree, node);
		return result;
	}

	public findNode(node:ITreeNode, id:number) {
		if (node === null) {
			return null;
		}
		if (node.id === id) {
			return node;
		}

		return this.findNode(node.left, id) || this.findNode(node.right, id);
	}

	public getQuestions() : Observable<IQuestion[]> {
		var httpRet = this.http.get('/api/animals/questions');

		var result = httpRet
			.map<Response, IQuestion[]>(response => {
                return <IQuestion[]>response.json();
            });

		return result;
	}

	public getAnimals() : Observable<IQuestion[]> {
		return this.http.get('/api/animals/questions')
			.map<Response, IQuestion[]>(response => <IQuestion[]>response.json())
			.map((questions:IQuestion[]) => questions.filter(q => q.yes === 0 && q.no === 0))
			.map((questions:IQuestion[]) =>
				questions.sort((q1,q2) => (q1.text === q2.text ? 0 :
										   (q1.text < q2.text ? -1 : 1))));
	}

	public getDuplicateAnimals() : Observable<IQuestion[]> {
		return this.getAnimals()
			.map((animals:IQuestion[]) => {
				let lastAnimal:IQuestion = null;
				let dupAnimals:IQuestion[] = [];

				for (let animal of animals) {
					if (lastAnimal && animal.text === lastAnimal.text) {
						dupAnimals.push(lastAnimal);
						dupAnimals.push(animal);
					}
					lastAnimal = animal;
				}
				return _.uniq(dupAnimals, false, question => question.questionId);
			});
	}


	public getRootQuestion() : Observable<IQuestion> {
		var httpRes = this.http.get('/api/animals/questions/root');

		var result = httpRes
			.map<Response, IQuestion>(response => <IQuestion>response.json());

		return result;
	}

	public getQuestion(questionId:number) : Observable<IQuestion> {
		var result = this.http.get('/api/animals/questions/' + questionId)
			.map<Response, IQuestion>(response => <IQuestion> response.json());

		return result;
	}

	public addNewAnimal(newAnimalInfo:INewAnimalInfo) : Observable<any> {
		var result = this.http.post('/api/animals', JSON.stringify(newAnimalInfo), this.getPostOptions())

			.map<Response,any>(response => response.json());

		return result;
	}

	public deleteAnimal(animalId:number, password:string) : Observable<any> {
		var options = this.getPostOptions();
		options.headers.append('Password', password);

		var result = this.http.delete(`/api/animals/${animalId}`, options)

			.map<Response,any>(response => response.json());

		return result;
	}

	private getPostOptions() : any {
		var headers = new Headers();
		headers.append('Content-Type', 'application/json');

		var options:any = {
			headers: headers
		};

		return options;
	}

	private buildNode(questionId:number, qDict:any) : ITreeNode {
        if (questionId === 0) {
            return null;
        }
        var question:IQuestion = qDict[questionId];
        if (!question) {
            throw Error('No such question ' + questionId);
        }

        var node:ITreeNode = {
            id: question.questionId,
            text: question.text,
            left: this.buildNode(question.yes, qDict),
            right: this.buildNode(question.no, qDict)
        };

        return node;
    }

	private traverseFrom(fromNode:ITreeNode, targetNode:ITreeNode) : IQuestionAndAnswer[] {

		if (!fromNode) {
			return [];
		}

		if (fromNode.id === targetNode.id) {
			return [ { question: targetNode, answer: ''} ];
		}

		if (fromNode.left) {
			var leftPath = this.traverseFrom(fromNode.left, targetNode);
			if (leftPath.length > 0) {
				leftPath.unshift({ question: fromNode, answer: 'yes'});
				return leftPath;
			}
		}

		if (fromNode.right) {
			var rightPath = this.traverseFrom(fromNode.right, targetNode);
			if (rightPath.length > 0) {
				rightPath.unshift({ question: fromNode, answer: 'no'});
				return rightPath;
			}
		}

		return [];
	}
}
