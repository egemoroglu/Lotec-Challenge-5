import Todo from '../entities/Todo';

export interface FrontendInterface {
    fetchTodos(username: string): Promise<Todo[]>;
    addTask(title: string, username: string, done: boolean): Promise<void>;
    deleteTask(todoId: string): Promise<void>;
    updateTask(todoId: string, title: string): Promise<void>;
    markDone(todoId: string): Promise<void>;
    markUndone(todoId: string): Promise<void>;
}