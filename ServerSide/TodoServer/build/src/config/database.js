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
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../../../.env') });
const region = process.env.REGION;
const todoTable = process.env.TODO_DB_NAME || "ege_todo";
class DynamoDBService {
    constructor() {
        this.dynamoDB = new aws_sdk_1.default.DynamoDB.DocumentClient({
            region: region,
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        });
    }
    //Function to both get Todo and User objects from DynamoDB
    getItems(tableName) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: tableName
            };
            const data = yield this.dynamoDB.scan(params).promise();
            return data.Items;
        });
    }
    //Get the Todo with the Given id using getItems method from DynamoDB
    getTodoById(todoId) {
        return __awaiter(this, void 0, void 0, function* () {
            const items = yield this.getItems(todoTable);
            const todo = items === null || items === void 0 ? void 0 : items.find((item) => item.todoId === todoId);
            return todo;
        });
    }
    getTodosByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const items = yield this.getItems(todoTable);
            return (_a = items === null || items === void 0 ? void 0 : items.filter((item) => item.username === username)) !== null && _a !== void 0 ? _a : [];
        });
    }
    //Add Todo to DynamoDB
    addTodo(todo) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: todoTable,
                Item: {
                    todoId: todo.getTodoId(),
                    title: todo.getTitle(),
                    username: todo.getUsername(),
                    done: todo.getDone()
                }
            };
            yield this.dynamoDB.put(params).promise();
        });
    }
    //Delete Todo from DynamoDB
    deleteTodoById(todoId) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: todoTable,
                Key: {
                    todoId: todoId
                }
            };
            yield this.dynamoDB.delete(params).promise();
        });
    }
    //Update Todo in DynamoDB
    updateTodoById(todoId, title) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: todoTable,
                Key: {
                    todoId: todoId
                },
                UpdateExpression: 'set title = :t',
                ExpressionAttributeValues: {
                    ':t': title
                }
            };
            yield this.dynamoDB.update(params).promise();
        });
    }
    //Mark Todo as done in DynamoDB
    markDone(todoId) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: todoTable,
                Key: {
                    todoId: todoId
                },
                UpdateExpression: 'set done = :d',
                ExpressionAttributeValues: {
                    ':d': true
                }
            };
            yield this.dynamoDB.update(params).promise();
        });
    }
    //Mark Todo as undone in DynamoDB
    markUndone(todoId) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: todoTable,
                Key: {
                    todoId: todoId
                },
                UpdateExpression: 'set done = :d',
                ExpressionAttributeValues: {
                    ':d': false
                }
            };
            yield this.dynamoDB.update(params).promise();
        });
    }
}
exports.default = DynamoDBService;
