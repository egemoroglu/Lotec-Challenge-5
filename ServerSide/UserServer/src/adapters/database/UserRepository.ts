import UserInterface from "../../domain/interfaces/UserInterface";
import User from "../../domain/entities/User";
import DynamoDBService from "../../../../config/database"
import {v4 as uuidv4} from "uuid";

class UserRepository implements UserInterface {
    private db: DynamoDBService;
    constructor(){
        this.db = new DynamoDBService();
    }
    async createUser(username: string, password: string): Promise<User> {
        // implementation
        const userId = uuidv4().toString();
        const user = new User(userId,username, password);
        await this.db.addUser(user);

        return user;
    }

    async getUserByUsername(username: string): Promise<User | null> {
        // implementation
        const temp = await this.db.getUserByUsername(username);
        if (temp !== undefined) {
            const user = new User(temp.userId, temp.username, temp.password);
            return user;
        }
        return null;
    }

    async deleteUser(UserId: string): Promise<void> {
        // implementation
        await this.db.deleteUser(UserId);
    }
}
export default UserRepository;