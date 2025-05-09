import Todo from "../domain/entities/Todo";
import TodoInterface from "../domain/interfaces/TodoInterface";
// import DynamoDBService from "../config/database"
import DynamoDBService from "@lotec-challenge-5/database-config/databaseAdaptor";
import {v4 as uuidv4} from "uuid";

const tableName = process.env.TODO_DB_NAME || "ege_todo";
class TodoRepository implements TodoInterface{

    private db: DynamoDBService<Todo>;
    constructor(){
        this.db = new DynamoDBService(tableName);
    }

    async createTodo(title: string, username: string, done: boolean): Promise<Todo> {
        const todoId = uuidv4().toString();

        const todo = new Todo(todoId, title, username, done);
        await this.db.add(todo);
        return todo;
    }

    async getTodoById(todoId: string): Promise<Todo | null> {
        const temp = await this.db.getById(todoId);
        if (temp !== undefined) {
            const todo = new Todo(temp.todoId, temp.title, temp.username, temp.done);
            return todo;
        }
        return null;
    }
    async getTodosByUsername(username: string): Promise<Todo[] | null> {
        const items = await this.db.getAll(username);
        const todos = items.map(item => new Todo(item.todoId, item.title, item.username, item.done));
        return todos;
    }

    async deleteTodoById(todoId: string): Promise<void> {
        await this.db.delete(todoId);
    }

    async updateTodoById(todoId: string, todo: Todo): Promise<void> {
        await this.db.update(todoId, todo);
    }

    async markDone(todoId: string): Promise<void> {
        await this.db.markDone(todoId);
    }

    async markUndone(todoId: string): Promise<void> {
        await this.db.markUndone(todoId);
    }

}
export default TodoRepository;
