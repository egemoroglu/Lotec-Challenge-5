"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class User {
    constructor(userId, username, password) {
        this.userId = userId;
        this.username = username;
        this.password = password;
    }
    getUserId() {
        return this.userId;
    }
    setUserId(userId) {
        this.userId = userId;
    }
    getUsername() {
        return this.username;
    }
    getPassword() {
        return this.password;
    }
    setUsername(username) {
        this.username = username;
    }
    setPassword(password) {
        this.password = password;
    }
}
exports.default = User;
