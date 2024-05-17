"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Todo {
    constructor(todoId, title, username, done) {
        this.todoId = todoId;
        this.title = title;
        this.username = username;
        this.done = done;
    }
    getTodoId() {
        return this.todoId;
    }
    setTodoId(todoId) {
        this.todoId = todoId;
    }
    getTitle() {
        return this.title;
    }
    setTitle(title) {
        this.title = title;
    }
    getUsername() {
        return this.username;
    }
    setUsername(username) {
        this.username = username;
    }
    getDone() {
        return this.done;
    }
    setDone(done) {
        this.done = done;
    }
}
exports.default = Todo;
