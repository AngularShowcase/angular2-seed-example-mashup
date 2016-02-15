import {Component, EventEmitter} from 'angular2/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';
import {Router} from 'angular2/router';
import {AnimalServices} from '../../services/AnimalServices';
import {IQuestion} from '../../../common/interfaces/AnimalInterfaces';
import {YesNo} from '../../common/components/YesNo';

enum State {
    None = 0,
    AskQuestion = 1,
    Guess = 2,
    PlayAgain = 3,
    Gloat = 4,
    WrongAnswer = 5,
    GetNewQuestion = 6,
    GetAnswerToQuestionForNewAnimal = 7
};

interface IModel {
    state:State;
    question:IQuestion;
    guess:IQuestion;
    priorQuestion:IQuestion;
    priorDirection:string;
    newAnimal:string;
    newQuestion:string;
    alteredQuestion:string;
};

var noQuestion:IQuestion = {
    questionId: 0,
    text: '',
    yes: 0,
    no: 0,
    isRoot: false
};

@Component({
    selector: 'animal-play',
    providers: [AnimalServices],
    outputs: ['questionchange:questionchange','dbupdated'],
    templateUrl: './animals/components/AnimalPlay.html',
    directives: [FORM_DIRECTIVES, CORE_DIRECTIVES, YesNo],
    styleUrls: ['./animals/components/AnimalPlay.css']
})
export class AnimalPlay {

    questionchange:EventEmitter<IQuestion>;
    dbupdated:EventEmitter<any>;

    model:IModel = {
        state: State.None,
        question:noQuestion,
        guess:noQuestion,
        priorQuestion:noQuestion,
        priorDirection:'',
        newAnimal:'',
        newQuestion:'',
        alteredQuestion:''
    };

    constructor(public animalServices:AnimalServices, public router:Router) {
        console.log('Component AnimalPlay constructed');
        this.questionchange = new EventEmitter();
        this.dbupdated = new EventEmitter();
        this.getFirstQuestion();
    }

    getFirstQuestion() {
        this.model.priorQuestion = noQuestion;
        this.model.priorDirection = '';
        this.model.newQuestion = '';
        this.model.newAnimal = '';

        this.animalServices.getRootQuestion()
            .subscribe(question => {
                this.model.question = question;
                this.askQuestion();
            });
    }

    askQuestion() {
        if (this.isAnimal(this.model.question)) {
            this.makeGuess();
            return;
        }
        this.model.state = State.AskQuestion;
        this.questionchange.next(this.model.question);
    }

    questionAnswer(yn:string) {
        if (yn === 'y') {
            this.setNextQuestion(this.model.question.yes, 'y');
            return;
        }

        if (yn === 'n') {
            this.setNextQuestion(this.model.question.no, 'n');
            return;
        }

        throw Error('Bad input (' + yn + ') to questionAnswer method');
    }

    wrongAnswer() {
        this.model.state = State.WrongAnswer;
    }

    gotIt() {
        this.model.state = State.Gloat;
    }

    makeGuess() {
        this.model.guess = this.model.question;
        this.model.state = State.Guess;
    }

    isAnimal(question:IQuestion) {
        return question.yes === 0 && question.no === 0;
    }

    learn() {
        this.model.newAnimal = this.model.newAnimal.trim().toLocaleLowerCase().replace(/^an{0,1} /, '');
        this.model.state = (this.model.newAnimal.length > 2) ? State.GetNewQuestion : State.WrongAnswer;
    }

    recordNewQuestion() {
        this.model.newQuestion = this.model.newQuestion.trim().toLocaleLowerCase().replace(/\?+/, '');
        if (this.model.newQuestion.length < 5) {
            return; //Don't change state
        }
        var subforit = ' ' + this.prefixedNoun(this.model.newAnimal) + ' ';
        this.model.alteredQuestion =
            this.initialCap(this.model.newQuestion.replace(/( it *)|( they *)/, subforit));
        this.model.state = State.GetAnswerToQuestionForNewAnimal;
    }

    addNewAnimal(yn:string) {
        if (yn !== 'y' && yn !== 'n') {
            throw Error('Bad yn string');
        }

        this.animalServices.addNewAnimal(
            {
                priorQuestionId: this.model.priorQuestion.questionId,
                priorDirection: this.model.priorDirection,
                oldAnimalId: this.model.guess.questionId,
                newAnimal: this.model.newAnimal,
                newQuestion: this.model.newQuestion,
                answerForNewAnimal:yn
            }
        )
        .subscribe(
            res => {
                console.log(res);
                this.dbupdated.next(res);
                this.model.state = State.PlayAgain;
            },
            err => console.log('Error: ', err)
        );
    }

    playAgain() {
        this.getFirstQuestion();
    }

    donePlaying() {
        alert('Thanks for playing!');
        var p = this.router.navigateByUrl('/home');
        p.then((res) => console.log(res))
         .catch(err => alert('Error: ' + err));
    }

    prefixedNoun(noun:string) {
        return this.prefixFor(noun) + ' ' + noun;
    }

    prefixFor(noun:string):string {
        if (noun.length === 0) {
            return '';
        }
        let letter = noun[0];
        return ('aeiou'.indexOf(letter) >= 0 ? 'an' : 'a');
    }

    setNextQuestion(questionId:number, directionFollowed:string) {
        this.animalServices.getQuestion(questionId)
            .subscribe(question => {
                this.model.priorDirection = directionFollowed;
                this.model.priorQuestion = this.model.question;
                this.model.question = question;
                this.askQuestion();
            }, (err) => {
                alert(err);
            });
    }

    initialCap(text:string) : string {
        if (!text) {
            return text;
        }
        return text[0].toUpperCase() + text.slice(1);
    }
}
