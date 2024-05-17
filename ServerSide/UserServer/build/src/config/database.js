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
console.log("Region: ", region);
const userTable = process.env.USER_DB_NAME || "ege_user";
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
    //Get the User with the given username using getItems method from DynamoDB
    getUserByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const items = yield this.getItems('ege_user');
            const user = items === null || items === void 0 ? void 0 : items.find((item) => item.username === username);
            console.log("UserRepo Signin Called");
            return user;
        });
    }
    //add User to the DynamoDB
    addUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: userTable,
                Item: {
                    userId: user.getUserId(),
                    username: user.getUsername(),
                    password: user.getPassword()
                }
            };
            yield this.dynamoDB.put(params).promise();
        });
    }
    //Delete user from DynamoDB
    deleteUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: userTable,
                Key: {
                    userId: userId
                }
            };
            yield this.dynamoDB.delete(params).promise();
        });
    }
}
exports.default = DynamoDBService;
