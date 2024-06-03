import UserInterface from "../domain/interfaces/UserInterface";
import User from "../domain/entities/User";
import DynamoDBService from "@lotec-challenge-5/database-config/databaseAdaptor";
import {v4 as uuidv4} from "uuid";

const tableName = process.env.USER_DB_NAME || "ege_user";
class UserRepository implements UserInterface {
    private db: DynamoDBService<User>;
    constructor(){
        this.db = new DynamoDBService(tableName);
    }
    async createUser(username: string, password: string): Promise<User> {
        // implementation
        const userId = uuidv4().toString();
        const user = new User(userId,username, password);
        await this.db.add(user);

        return user;
    }

    async getUserByUsername(username: string): Promise<User | null> {
        // implementation
        const temp = await this.db.getAll(username);
        if (temp !== undefined) {
            const user = new User(temp[0].userId, temp[0].username, temp[0].password);
            return user;
        }
        return null;
    }

    async deleteUser(userId: string): Promise<void> {
        // implementation
        await this.db.delete(userId);
    }
}
export default UserRepository;