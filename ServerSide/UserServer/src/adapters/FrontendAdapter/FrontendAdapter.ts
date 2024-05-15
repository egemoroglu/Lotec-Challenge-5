import User from '../../domain/entities/User';
import axios from 'axios';
import { FrontendInterface } from '../../domain/interfaces/FrontendInterface';

const baseURL = 'http://localhost:3000';

export default class FrontendAdapter implements FrontendInterface {
    async signupUser(username: string, password: string): Promise<void> {
        try {
            await axios.post(`${baseURL}/signup`, {
                username: username,
                password: password
            });
        } catch (error) {
            throw new Error('Failed to signup user');
        }
    }

    async deleteUser(userId: string): Promise<void> {
        try {
            await axios.delete(`${baseURL}/delete?userId=${userId}`);
        } catch (error) {
            throw new Error('Failed to delete user');
        }
    }

    async signinUser(username: string, password: string): Promise<User | null> {
        try {
            const response = await axios.post(`${baseURL}/signin`, {
                username: username,
                password: password
            });
            return response.data;
        } catch (error) {
            throw new Error('Failed to signin user');
        }
    }
}