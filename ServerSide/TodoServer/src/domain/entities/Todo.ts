class Todo{
    todoId: string;
    title: string;
    username: string;
    done: boolean;
    

    constructor(todoId: string, title: string, username: string, done: boolean){
        this.todoId = todoId;
        this.title = title;
        this.username = username;
        this.done = done;
    }
    getTodoId(){
        return this.todoId;
    }

    setTodoId(todoId:string){
        this.todoId = todoId;
    }

    getTitle(){
        return this.title;
    }

    setTitle(title: string){
        this.title = title;
    }

    getUsername(){
        return this.username;
    }

    setUsername(username: string){
        this.username = username;
    }

    getDone(){
        return this.done;
    }

    setDone(done: boolean){
        this.done = done;
    }
}

export default Todo;