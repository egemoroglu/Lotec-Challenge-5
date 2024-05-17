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
const UserRepository_1 = __importDefault(require("./src/database/UserRepository"));
const serverless_http_1 = __importDefault(require("serverless-http"));
const app = (0, express_1.default)();
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../../.env') });
const port = process.env.USER_SERVER_PORT || 3000;
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
const userRepo = new UserRepository_1.default();
app.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const user = yield userRepo.createUser(username, password);
        res.status(200).send(user);
    }
    catch (error) {
        res.status(500).json({ error: "Error creating user" });
    }
}));
app.post('/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const user = yield userRepo.getUserByUsername(username);
        if (user && user.getPassword() === password) {
            res.status(200).send(user);
        }
        else {
            res.status(400).json({ message: 'Invalid Credentials' });
        }
    }
    catch (error) {
        res.status(500).json({ error: "Invalid credentials" });
    }
}));
app.post('/deleteUser', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.body;
        yield userRepo.deleteUser(userId);
        res.status(200).json({ message: 'User deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to delete user" });
    }
}));
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
exports.handler = (0, serverless_http_1.default)(app);
