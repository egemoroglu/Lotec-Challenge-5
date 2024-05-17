import AWS from 'aws-sdk'
import dotenv from 'dotenv'
import path from 'path'
import Todo from "../domain/entities/Todo"

dotenv.config({ path: path.join(__dirname, '../../../.env') })

const region = process.env.REGION;
const todoTable = process.env.TODO_DB_NAME || "ege_todo";

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
        const items = await this.getItems(todoTable);
        const todo = items?.find((item: any) => item.todoId === todoId);
        return todo;
    }

    async getTodosByUsername(username: string){
        const items = await this.getItems(todoTable);
        return items?.filter((item: any) => item.username === username) ?? [];
        
    }

    //Add Todo to DynamoDB
    async addTodo(todo: Todo){
        const params = {
            TableName: todoTable,
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
            TableName: todoTable,
            Key: {
                todoId: todoId
            }
        }

        await this.dynamoDB.delete(params).promise();
    }

    //Update Todo in DynamoDB
    async updateTodoById(todoId: string, title: string){
        const params = {
            TableName: todoTable,
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
            TableName: todoTable,
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
            TableName: todoTable,
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
