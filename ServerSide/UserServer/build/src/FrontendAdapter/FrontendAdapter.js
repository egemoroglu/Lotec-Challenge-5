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
const baseURL = 'http://localhost:3000';
class FrontendAdapter {
    signupUser(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield axios_1.default.post(`${baseURL}/signup`, {
                    username: username,
                    password: password
                });
            }
            catch (error) {
                throw new Error('Failed to signup user');
            }
        });
    }
    deleteUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield axios_1.default.delete(`${baseURL}/delete?userId=${userId}`);
            }
            catch (error) {
                throw new Error('Failed to delete user');
            }
        });
    }
    signinUser(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.post(`${baseURL}/signin`, {
                    username: username,
                    password: password
                });
                return response.data;
            }
            catch (error) {
                throw new Error('Failed to signin user');
            }
        });
    }
}
exports.default = FrontendAdapter;
