import Todo from "../entities/Todo";

interface TodoInteface{
    createTodo(title: string, username: string, done: boolean): Promise<Todo>;
    getTodoById(todoId: string): Promise<Todo | null>;
    getTodosByUsername(username: string): Promise<Todo[] | null>;
    deleteTodoById(todoId: string): Promise<void>;
    updateTodoById(todoId: string, todo: Todo): Promise<void>;
    markDone(todoId: string): Promise<void>;
    markUndone(todoId: string): Promise<void>;
}

export default TodoInteface;