import Todo from "../domain/entities/Todo";
import TodoInterface from "../domain/interfaces/TodoInterface";
import DynamoDBService from "../config/database"
import {v4 as uuidv4} from "uuid";


class TodoRepository implements TodoInterface{

    private db: DynamoDBService;
    constructor(){
        this.db = new DynamoDBService();
    }

    async createTodo(title: string, username: string, done: boolean): Promise<Todo> {
        // implementation
        const todoId = uuidv4().toString();

        const todo = new Todo(todoId, title, username, done);
        await this.db.addTodo(todo);
        return todo;
    }

    async getTodoById(todoId: string): Promise<Todo | null> {
        // implementation
        const temp = await this.db.getTodoById(todoId);
        if (temp !== undefined) {
            const todo = new Todo(temp.id, temp.title, temp.username, temp.done);
            return todo;
        }
        return null;
    }
    async getTodosByUsername(username: string): Promise<Todo[] | null> {
        // implementation
        const items = await this.db.getTodosByUsername(username);
        
        const todos = items.map(item => new Todo(item.todoId, item.title, item.username, item.done));
        return todos;
    }

    async deleteTodoById(todoId: string): Promise<void> {
        // implementation
        await this.db.deleteTodoById(todoId);
    }

    async updateTodoById(todoId: string, title: string): Promise<void> {
        // implementation
        await this.db.updateTodoById(todoId, title);
    }

    async markDone(todoId: string): Promise<void> {
        // implementation
        await this.db.markDone(todoId);
    }

    async markUndone(todoId: string): Promise<void> {
        // implementation
        await this.db.markUndone(todoId);
    }

}
export default TodoRepository;
