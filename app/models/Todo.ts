export class Todo {
    id: number;
    description: string;
    done: boolean;

    static nextTodoId:number = 1;

    constructor(description:string, done:boolean = true) {
        this.id = Todo.nextTodoId++;
        this.description = description;
        this.done = done;
    }
}