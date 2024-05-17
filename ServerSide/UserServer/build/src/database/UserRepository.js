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
const User_1 = __importDefault(require("../domain/entities/User"));
const database_1 = __importDefault(require("../config/database"));
const uuid_1 = require("uuid");
class UserRepository {
    constructor() {
        this.db = new database_1.default();
    }
    createUser(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            // implementation
            const userId = (0, uuid_1.v4)().toString();
            const user = new User_1.default(userId, username, password);
            yield this.db.addUser(user);
            return user;
        });
    }
    getUserByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            // implementation
            const temp = yield this.db.getUserByUsername(username);
            if (temp !== undefined) {
                const user = new User_1.default(temp.userId, temp.username, temp.password);
                return user;
            }
            return null;
        });
    }
    deleteUser(UserId) {
        return __awaiter(this, void 0, void 0, function* () {
            // implementation
            yield this.db.deleteUser(UserId);
        });
    }
}
exports.default = UserRepository;
