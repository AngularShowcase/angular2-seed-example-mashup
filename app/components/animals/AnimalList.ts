import {Component, EventEmitter} from 'angular2/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';

//import {Component, EventEmitter, NgFor} from 'angular2/angular2';
import {AnimalServices} from '../../services/AnimalServices';
import {IQuestion} from '../../common/interfaces/AnimalInterfaces';
import {TreeDisplay, ITreeNode} from '../../directives/TreeDisplay';
import {TreeDisplayControl} from '../../directives/TreeDisplayControl';

interface IModel {
    questions:IQuestion[];
    questionCount:number;
    animalCount:number;
    currentQuestion:IQuestion;
    questionTree:ITreeNode;
    treeDisplay: {
        maxTreeLevels:number;
        canvasBackgroundColor:string;
        nodeColor:string;
        nodeLabelColor:string;
	    connectorColor:string;
		connectorLabelColor:string;
    };
};

var noQuestion:IQuestion = {
    questionId: 0,
    text: '',
    yes: 0,
    no: 0,
    isRoot: false
};


@Component({
    selector: 'animal-list',
    bindings: [AnimalServices],
    inputs: ['currentQuestion:current-question','reloadFlag:reload-flag'],
    outputs: ['dbreloaded'],
    templateUrl: './components/animals/AnimalList.html',
    directives: [FORM_DIRECTIVES, CORE_DIRECTIVES, TreeDisplay, TreeDisplayControl],
    styleUrls: ['./components/animals/AnimalList.css']
})
export class AnimalList {

    qDict:{};       //Maps question number to question.  Typescript doesn't yet support ES6 maps
    rootQuestion:IQuestion;
    mapLoaded:boolean = false;
    _reloadFlag:boolean = false;
    dbreloaded:EventEmitter<boolean>;

    model:IModel = {
        questions:[],
        questionCount: 0,
        animalCount: 0,
        currentQuestion: noQuestion,
        questionTree: { id:-1, text: 'notext', left:null, right:null},
        treeDisplay: {
            maxTreeLevels: 4,
            canvasBackgroundColor:'gray',
            nodeColor:'black',
            nodeLabelColor: 'white',
            connectorColor: 'red',
            connectorLabelColor: 'black'
        }
    };

    constructor(public animalServices:AnimalServices) {
        console.log('Component AnimalList constructed');
        this.dbreloaded = new EventEmitter();
        this.getQuestions();
    }

    get reloadFlag() {
        return this._reloadFlag;
    }

    set reloadFlag(val:boolean) {
        if (this._reloadFlag !== val) {
            this._reloadFlag = val;
            this.getQuestions();
        }
    }
    get currentQuestion():IQuestion {
        return this.model.currentQuestion;
    }

    set currentQuestion(question:IQuestion) {
        this.model.currentQuestion = question;
        if (this.mapLoaded) {
            this.model.questionTree = this.buildTree(this.model.currentQuestion.questionId, 0);
        }
    }


    getQuestions() {
        this.mapLoaded = false;

        this.animalServices.getQuestions()
            .subscribe((questions) => {
                this.model.questions = questions;
                this.model.questionCount = this.getQuestionCount(questions);
                this.model.animalCount = this.getAnimalCount(questions);

                this.loadMap(questions);
            });
    }

    logError(err) {
        console.log('Error: ', err);
    }

    loadMap(questions:IQuestion[]) {
        this.qDict = {};
        this.model.questions.forEach(q => this.qDict[q.questionId] = q);
        this.animalServices.getRootQuestion()
            .subscribe(
                (root:IQuestion) => {
                    this.rootQuestion = root;
                    this.model.questionTree = this.buildTree(this.rootQuestion.questionId, 0);
                    this.dbreloaded.next(true);
                    this.mapLoaded = true;
                }
                , this.logError);
    }

    buildTree(questionId:number, level:number) : ITreeNode {
        if (questionId === 0) {
            return null;
        }
        var question:IQuestion = this.qDict[questionId];
        if (!question) {
            throw Error('No such question ' + questionId);
        }

        var node:ITreeNode = {
            id: question.questionId,
            text: question.text,
            left: this.buildTree(question.yes, level + 1),
            right: this.buildTree(question.no, level + 1)
        };

        return node;
    }

    getAnimalCount(questions:IQuestion[]): number {
        return this.getCountOfTrue(questions, this.isAnimal.bind(this));
    }

    getQuestionCount(questions:IQuestion[]): number {
        return this.getCountOfTrue(questions, this.isQuestion.bind(this));
    }

    getCountOfTrue(varray:any[], predicate): number {
        return varray.reduce((acc,v) => {
            if (predicate(v)) {
                return acc + 1;
            } else {
                return acc;
            }
        }, 0);
    }

    isAnimal(question:IQuestion) {
        return question.yes === 0 && question.no === 0;
    }

    isQuestion(question:IQuestion) {
        return !this.isAnimal(question);
    }

    getQuestionClass(question:IQuestion) {
        return this.isAnimal(question) ? 'animal' : 'question';
    }

    onValueChanged($event:{property:string, value:string}) {
        switch($event.property) {
            case 'maxtreelevels':
                this.model.treeDisplay.maxTreeLevels = parseInt($event.value);
                break;
            case 'canvasbackgroundcolor':
                this.model.treeDisplay.canvasBackgroundColor = $event.value;
                break;
            case 'nodecolor':
                this.model.treeDisplay.nodeColor = $event.value;
                break;
            case 'nodelabelcolor':
                this.model.treeDisplay.nodeLabelColor = $event.value;
                break;
            case 'connectorcolor':
                this.model.treeDisplay.connectorColor = $event.value;
                break;
            case 'connectorlabelcolor':
                this.model.treeDisplay.connectorLabelColor = $event.value;
                break;
        }
    }
}
