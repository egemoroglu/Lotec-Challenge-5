import User from "../entities/User";

interface UserInterface {
    createUser(username: string, password: string): Promise<User>;
    getUserByUsername(username: string): Promise<User | null>;
    deleteUser(UserId: string): Promise<void>;

}
export default UserInterface;