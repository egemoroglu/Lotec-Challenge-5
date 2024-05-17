"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const serverless_http_1 = __importDefault(require("serverless-http"));
const TodoRepository_1 = __importDefault(require("./src/database/TodoRepository"));
const app = (0, express_1.default)();
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../../.env') });
const port = process.env.TODO_SERVER_PORT || 3001;
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.use(express_1.default.static(__dirname));
app.use((0, cors_1.default)());
const todoRepo = new TodoRepository_1.default();
app.get('/todos', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username } = req.query;
        const todos = yield todoRepo.getTodosByUsername(username);
        res.status(200).send(todos);
    }
    catch (err) {
        res.status(500).json({ error: "Error getting todos" });
    }
}));
app.post('/todos', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, username, done } = req.body;
        yield todoRepo.createTodo(title, username, done);
        res.status(200).json({ message: 'Task added successfully' });
    }
    catch (err) {
        res.status(500).json({ error: "Error adding task" });
    }
}));
app.post('/delete', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { todoId } = req.query;
        yield todoRepo.deleteTodoById(todoId);
        res.status(200).json({ message: 'Task deleted successfully' });
    }
    catch (err) {
        res.status(500).json({ error: "Error deleting task" });
    }
}));
app.post('/update', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { todoId, title } = req.body;
        yield todoRepo.updateTodoById(todoId, title);
        res.status(200).json({ message: 'Task updated successfully' });
    }
    catch (err) {
        res.status(500).json({ error: "Error updating task" });
    }
}));
app.post('/markdone', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { todoId } = req.query;
        yield todoRepo.markDone(todoId);
        res.status(200).json({ message: 'Task marked as done successfully' });
    }
    catch (err) {
        res.status(500).json({ error: "Error marking task as done" });
    }
}));
app.post('/markUndone', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { todoId } = req.query;
        yield todoRepo.markUndone(todoId);
        res.status(200).json({ message: 'Task marked as undone successfully' });
    }
    catch (err) {
        res.status(500).json({ error: "Error marking task as undone" });
    }
}));
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
exports.handler = (0, serverless_http_1.default)(app);
