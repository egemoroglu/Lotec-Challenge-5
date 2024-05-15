import axios from 'axios';
import { FrontendInterface } from '../../domain/interfaces/FrontendInterface';
import Todo from '../../domain/entities/Todo';

const baseURL = 'http://localhost:3001';
export default class FrontendAdapter implements FrontendInterface {

    async fetchTodos(username: string): Promise<Todo[]> {
        try {
            const response = await axios.get(`${baseURL}/todos?username=${username}`);
            return response.data;
            
          } catch (error) {
            throw new Error('Failed to fetch todos');
          }
    }

    async addTask(title: string, username: string, done: boolean): Promise<void> {
        try {
            await axios.post(`${baseURL}/todos`, {
              title: title,
              username: username,
              done: done,
            });
          } catch (error) {
            throw new Error('Failed to add task');
          }
    }

    async deleteTask(todoId: string): Promise<void> {
        try{
            await axios.post(`${baseURL}/delete?todoId=${todoId}`);
        }catch (error) {
            throw new Error('Failed to delete task');
        }
    }

    async updateTask(todoId: string, title: string): Promise<void> {
        try{
            await axios.post(`${baseURL}/update`, {
                todoId,
                title
            });
        }catch(error){
            throw new Error('Failed to update task');
        }
    }

    async markDone(todoId: string): Promise<void> {
        try{
            await axios.post(`${baseURL}/markDone?todoId=${todoId}`);
        }catch(error){
            throw new Error('Failed to mark task as done');
        }
    }

    async markUndone(todoId: string): Promise<void> {
        try{
            await axios.post(`${baseURL}/markUndone?todoId=${todoId}`);
        }catch(error){
            throw new Error('Failed to mark task as undone');
        }
    }


}
