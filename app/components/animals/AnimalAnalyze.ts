import {Component, NgFor, NgIf} from 'angular2/angular2';
import {FORM_DIRECTIVES, NgClass} from 'angular2/angular2';
import {AnimalServices, IQuestionAndAnswer} from '../../services/AnimalServices';
import {IQuestion} from '../../common/interfaces/AnimalInterfaces';
import {ITreeNode} from '../../directives/TreeDisplay';

interface INodeAndPath {
    startNode:ITreeNode;
    path:IQuestionAndAnswer[];
}

@Component({
    selector: 'animal-analyze',
    bindings: [AnimalServices],
    templateUrl: './components/animals/AnimalAnalyze.html',
    directives: [FORM_DIRECTIVES, NgClass, NgFor, NgIf],
    styleUrls: ['./components/animals/AnimalAnalyze.css']
})
export class AnimalAnalyze {

    questions:IQuestion[] = [];
    animals:IQuestion[] = [];
    duplicateAnimals:IQuestion[] = [];
    questionTree:ITreeNode;
    dupPaths:INodeAndPath[] = [];
    commonDupAncestor:ITreeNode = null;

    constructor(public animalServices:AnimalServices) {
        console.log('Component AnimalAnalyze constructed.');
        this.readAnimals();
    }

    readAnimals() {
        this.dupPaths = [];
        this.animalServices.getQuestions()
            .subscribe(questions => {
                this.questions = questions;
                this.questionTree = this.animalServices.buildTree(this.questions);
            });

        this.animalServices.getDuplicateAnimals()
            .subscribe((animals:IQuestion[]) => this.duplicateAnimals = animals);

        this.animalServices.getAnimals()
            .subscribe((animals:IQuestion[]) => this.animals = animals);
    }

    dupCheck(animal:IQuestion) {

        console.log(`Duplication check for animal id ${animal.text} (${animal.questionId}).`);
        let dups = this.duplicateAnimals.filter(a => a.text === animal.text);

        this.dupPaths = dups.map(animal => {
            let animalNode = this.animalServices.findNode(this.questionTree, animal.questionId);
            let path = this.animalServices.getPathToNode(this.questionTree, animalNode);

            return {
                startNode: animalNode,
                path: path
            };
        });

        // Find the lowest level dup node
        this.commonDupAncestor = null;
        let dupNodes:ITreeNode[] = [];

        if (this.dupPaths.length > 1) {
            let primaryPath = this.dupPaths[0].path;
            let dupsNeeded = this.dupPaths.length - 1;

            for (let node of primaryPath) {
                let id:number = node.question.id;
                let dupCount = 0;

                for (let j = 1; j < this.dupPaths.length; ++j) {
                    let otherPath = this.dupPaths[j].path;
                    for (let otherNode of otherPath) {
                        if (otherNode.question.id === id) {
                            ++dupCount;
                            break;
                        }
                    }
                }
                if (dupCount === dupsNeeded) {
                    dupNodes.push(node.question);
                }
            }
        }
        if (dupNodes.length > 0) {
            this.commonDupAncestor = dupNodes[dupNodes.length-1];
        }
    }

    getDupIndicatorClass(id:number) : string {
        let nonDupClass = 'nonDupQuestion';
        let dupClass ='dupQuestion';

        if (!this.commonDupAncestor) {
            return nonDupClass;
        }
        return (id === this.commonDupAncestor.id) ? dupClass : nonDupClass;
    }

    deleteAnimal(animal:ITreeNode) {
        var msg = `Do you really want to delete animal ${animal.id} (${animal.text})`;
        if (confirm(msg)) {
            var password:string = prompt('Enter the admin password.');
            if (!password) {
                return;
            }
            console.log(`Deleting id ${animal.id}`);
            this.animalServices.deleteAnimal(animal.id, password)
                .subscribe(
                    res => {
                        alert(JSON.stringify(res));
                        this.readAnimals();
                  }
                  , err => {
                        alert({Error: JSON.stringify(err)});
                  });
        }
    }
}
