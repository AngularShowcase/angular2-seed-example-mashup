import prompt = require("prompt");
import Q = require('q');
import fs = require('fs');

prompt.message = "";
prompt.delimiter = "";

interface INode {
    text: String;
    yes: INode;
    no: INode;    
}

class Animal implements INode {
    text: string;
    yes: INode;
    no: INode
    
    constructor(text:string) {
        this.text = text;
        this.yes = null;
        this.no = null;
    }
}

class Question implements INode {
    text: string;
    yes: INode;
    no: INode
    
    constructor(text:string, yes:INode, no:INode) {
        this.text = text;
        this.yes = yes;
        this.no = no;
    }
}

class Game {
    quit:boolean = false;
    dbName:string = "animal.json";
    
    tree:INode = new Question("Does it have four legs",
                    new Animal("dog"), new Animal("ostrich"));
    
    isAnimal(node) {
        return node.yes === null && node.no === null;
    }
    
    dumpTree() {
        this.dumpNode(this.tree, 0);   
    }
    
    dumpNode(node, indent) {
        if (!node) {
            return;
        }
        var prefix = this.space(indent);
        console.log(prefix + node.text);
        if (this.isAnimal(node)) {
            return;
        }
        console.log(prefix + "Yes");
        this.dumpNode(node.yes, indent + 5);
        console.log(prefix + " No");
        this.dumpNode(node.no, indent + 5);
    }
    
    space(num) {
        var result = "";
        while (num > 0) {
            result += " ";
            --num;
        }
        return result;
    }
    
    promptForInput(statement:string) {
        let defer = Q.defer();
        var schema = {
            properties: {
                answer: {
                    required: true,
                    description: statement.red
                }
            }
        };
        prompt.get(schema, function(err, result){
            if (err) {
                defer.reject(err);
                return err;
            }
            var answer = result.answer;
            defer.resolve(answer.trim().toLowerCase());
        });
        return defer.promise;
    }

    yesOrNo(question) {
        var defer = Q.defer();
        var schema = {
            properties: {
                answer: {
                    pattern: /^[YyNn].*$/,
                    message: 'Please answer yes or no',
                    required: true,
                    description: (question + "? ").green
                }
            }
        };
        prompt.get(schema, function(err, result){
            if (err) {
                defer.reject(err);
            }
            else {
                var yn = result.answer.slice(0,1).toLowerCase();
                defer.resolve(yn);
            }
        });
        return defer.promise;        
    }
    
    getAnimal(statement) {
        var defer = Q.defer();
        var schema = {
            properties: {
                animal: {
                    pattern: /^[A-Za-z]+$/,
                    required: true,
                    description: statement.yellow,
                    message: "Enter just the animal with no (a) or (an) prefix please."
                }
            }
        };
        prompt.get(schema, function(err, result){
            if (err) {
                defer.reject(err);
            }
            else {
                defer.resolve(result.animal.toLowerCase());
            }
        });
        return defer.promise;        
    }
    
    parseNode(node):INode {
        if (node == null) {
            return null;
        }
        if (this.isAnimal(node)) {
            return new Animal(node.text);
        }
        else {
            return new Question(
                node.text, 
                this.parseNode(node.yes),
                this.parseNode(node.no)
            );
        }
    }
    
    readDatabase() {
        var defer = Q.defer();
        
        fs.readFile(this.dbName, (err, data) => {
            if (err) {
                console.log(err);
                defer.reject(err);
                return;
            }
            var json = data.toString();
            var db = JSON.parse(json);
            this.tree = this.parseNode(db);
            defer.resolve(this.dbName);
        })

        return defer.promise;
    }
    
    play() {
        this.setBusy();
        this.readDatabase()
            .then((dbName)=>{
                console.log("Read info from " + dbName);
                this.playInternal();
            });
    }
    
    setBusy() {
        if (this.quit) {
            return;
        }
        setTimeout(() => this.setBusy(), 3000);
    }
    
    playInternal() {
        console.log("Playing guess the animal!");
        
        if (this.quit) {
            return;
        }
        
        this.mainLoop(null, "", this.tree);
    }
    
    mainLoop(parent:INode, direction:string, current:INode) {
        var question = current.text;
        if (this.isAnimal(current)) {
            question = "Is it a(n) " + question;
        }
        this.yesOrNo(question)
            .then((ans) => {
                if (!this.isAnimal(current)) {
                    this.mainLoop(current, ans, (ans == "y") ? current.yes : current.no);
                    return;                    
                }
                // We got an animal
                if (ans == "y") {
                    console.log("I am smart!");
                    this.playAgain();
                }
                else if (ans == "n") {
                    console.log("You fooled me!");
                    this.getNewQuestion(parent, direction, current);
                }
            });
    }
    
    getNewQuestion(priorQuestion:INode, direction:string, wrongAnimal:INode) {
        var newAnimal:INode;
        var newQuestion:INode;
        var savedQuestion:string;
        
        this.getAnimal("What animal were you thinking of?")
        .then((newAnimalText:string) => {
            newAnimal = new Animal(newAnimalText);
            let prompt = "Please enter a question to distinguish between a " + newAnimalText + " and a " + wrongAnimal.text + "?";
            return this.promptForInput(prompt);
        })
        .then((newQuestionText:string) => {
            savedQuestion = newQuestionText.replace("?", "");
            let revisedQuestion:string = savedQuestion.replace(" it ", " a " + newAnimal.text + " ");
            return this.yesOrNo(revisedQuestion);       
        })
        .then(ans => {
            newQuestion = new Question(savedQuestion,
                ans == "y" ? newAnimal : wrongAnimal,
                ans == "n" ? newAnimal : wrongAnimal);
                
            if (direction == "y") {
                priorQuestion.yes = newQuestion;
            }
            else {
                priorQuestion.no = newQuestion;
            }
            
            console.log("Thanks!  I'll remember that for the future!");
            this.playAgain();
        });
    }
    saveDb() {
        var defer = Q.defer();
        console.log("Saving database");
        
        var serialized = JSON.stringify(this.tree);
        fs.writeFile(this.dbName, serialized, function(err) {
            if(err) {
                console.log(err);
                defer.reject(err);
            }
            else {
                defer.resolve(this.dbName);
            }
        });
        
        return defer.promise;        
    }
    
    playAgain() {
        this.yesOrNo("Do you want to play the again")
            .then(ans => {
                if (ans == "y") {
                    this.playInternal();
                }
                else {
                    this.saveDb()
                    .then((dbName)=>{{
                        console.log("Saved to " + dbName);
                        console.log("See you later!");
                        this.quit = true;
                    }});
                }
            });
    }    
}
                
let game = new Game();
game.play();