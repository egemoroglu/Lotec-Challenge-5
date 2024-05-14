import AWS from 'aws-sdk'
import dotenv from 'dotenv'
import path , {dirname}from 'path'
import User from "../UserServer/src/domain/entities/User"
import Todo from "../TodoServer/src/domain/entities/Todo"

dotenv.config({ path: path.join(__dirname, '../../.env') })

const region = process.env.REGION;

export default class DynamoDBService{
    private dynamoDB: AWS.DynamoDB.DocumentClient;
    constructor(){
        this.dynamoDB = new AWS.DynamoDB.DocumentClient({
            region: region,
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        })
    }
    //Function to both get Todo and User objects from DynamoDB
    async getItems(tableName: string){
        const params = {
            TableName: tableName
        }

        const data = await this.dynamoDB.scan(params).promise();
        return data.Items;
    }

    //Get the Todo with the Given id using getItems method from DynamoDB
    async getTodoById(todoId: string){
        const items = await this.getItems('Todo');
        const todo = items?.find((item: any) => item.todoId === todoId);
        return todo;
    }

    async getTodosByUsername(username: string){
        const items = await this.getItems('Todo');
        return items?.filter((item: any) => item.username === username) ?? [];
        
    }
    //Get the User with the given id using getItems method from DynamoDB
    async getUserByUsername(username: string){
        const items = await this.getItems('User');
        const user = items?.find((item: any) => item.username === username);
        return user;
    }


    //add User to the DynamoDB
    async addUser(user: User){
        const params = {
            TableName: 'User',
            Item: {
                userId: user.getUserId(),
                username: user.getUsername(),
                password: user.getPassword()
            }
        }

        await this.dynamoDB.put(params).promise();
    }

    //Delete user from DynamoDB
    async deleteUser(userId: string){
        const params = {
            TableName: 'User',
            Key: {
                userId: userId
            }
        }

        await this.dynamoDB.delete(params).promise();
    }

    //Add Todo to DynamoDB
    async addTodo(todo: Todo){
        const params = {
            TableName: 'Todo',
            Item: {
                todoId: todo.getTodoId(),
                title: todo.getTitle(),
                username: todo.getUsername(),
                done: todo.getDone()
            }
        }

        await this.dynamoDB.put(params).promise();
    }

    //Delete Todo from DynamoDB
    async deleteTodoById(todoId: string){
        const params = {
            TableName: 'Todo',
            Key: {
                todoId: todoId
            }
        }

        await this.dynamoDB.delete(params).promise();
    }

    //Update Todo in DynamoDB
    async updateTodoById(todoId: string, title: string){
        const params = {
            TableName: 'Todo',
            Key: {
                todoId: todoId
            },
            UpdateExpression: 'set title = :t',
            ExpressionAttributeValues: {
                ':t': title
            }
        }

        await this.dynamoDB.update(params).promise();
    }

    //Mark Todo as done in DynamoDB
    async markDone(todoId: string){
        const params = {
            TableName: 'Todo',
            Key: {
                todoId: todoId
            },
            UpdateExpression: 'set done = :d',
            ExpressionAttributeValues: {
                ':d': true
            }
        }

        await this.dynamoDB.update(params).promise();
    }

    //Mark Todo as undone in DynamoDB
    async markUndone(todoId: string){
        const params = {
            TableName: 'Todo',
            Key: {
                todoId: todoId
            },
            UpdateExpression: 'set done = :d',
            ExpressionAttributeValues: {
                ':d': false
            }
        }

        await this.dynamoDB.update(params).promise();
    }
}
