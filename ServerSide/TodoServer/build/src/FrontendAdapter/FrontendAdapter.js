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
const axios_1 = __importDefault(require("axios"));
const baseURL = 'http://localhost:3001';
class FrontendAdapter {
    fetchTodos(username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get(`${baseURL}/todos?username=${username}`);
                return response.data;
            }
            catch (error) {
                throw new Error('Failed to fetch todos');
            }
        });
    }
    addTask(title, username, done) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield axios_1.default.post(`${baseURL}/todos`, {
                    title: title,
                    username: username,
                    done: done,
                });
            }
            catch (error) {
                throw new Error('Failed to add task');
            }
        });
    }
    deleteTask(todoId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield axios_1.default.post(`${baseURL}/delete?todoId=${todoId}`);
            }
            catch (error) {
                throw new Error('Failed to delete task');
            }
        });
    }
    updateTask(todoId, title) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield axios_1.default.post(`${baseURL}/update`, {
                    todoId,
                    title
                });
            }
            catch (error) {
                throw new Error('Failed to update task');
            }
        });
    }
    markDone(todoId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield axios_1.default.post(`${baseURL}/markDone?todoId=${todoId}`);
            }
            catch (error) {
                throw new Error('Failed to mark task as done');
            }
        });
    }
    markUndone(todoId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield axios_1.default.post(`${baseURL}/markUndone?todoId=${todoId}`);
            }
            catch (error) {
                throw new Error('Failed to mark task as undone');
            }
        });
    }
}
exports.default = FrontendAdapter;
