import User from '../entities/User';

export interface FrontendInterface{
    signupUser(username: string, password: string): Promise<void>;
    deleteUser(userId: string): Promise<void>;
    signinUser(username: string, password: string): Promise<User | null>;

}