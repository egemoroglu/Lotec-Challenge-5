import { DynamoDBClient, QueryCommandInput, QueryCommand, PutItemCommandInput, PutItemCommand, ScanCommand, GetItemCommand, DeleteItemCommand, UpdateItemCommand, ScanCommandInput, GetItemCommandInput, DeleteItemCommandInput, UpdateItemCommandInput } from '@aws-sdk/client-dynamodb';
import { unmarshall, marshall } from '@aws-sdk/util-dynamodb';
import dotenv from 'dotenv';
import path from 'path';
import { DatabaseAdaptor } from './index';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const region = process.env.REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

class DynamoDBService<T> implements DatabaseAdaptor<T> {
    private dynamoDBClient: DynamoDBClient;
    private tableName: string;

    constructor(tableName: string) {
        this.dynamoDBClient = new DynamoDBClient({
            region: region,
            credentials: {
                accessKeyId: accessKeyId as string,
                secretAccessKey: secretAccessKey as string
            }
        });
        this.tableName = tableName;
    }

    async getAll(username?: string): Promise<T[]> {
        if (username) {
            const params: QueryCommandInput = {
                TableName: this.tableName,
                KeyConditionExpression: '#username = :username',
                ExpressionAttributeNames: {
                    '#username': 'username'
                }
            };

            const data = await this.dynamoDBClient.send(new QueryCommand(params));
            return data.Items ? data.Items.map(item => unmarshall(item) as T) : [];
        } else {
            const params: ScanCommandInput = {
                TableName: this.tableName
            };

            const data = await this.dynamoDBClient.send(new ScanCommand(params));
            return data.Items?.map(item => item as T) || [];
        }
    }

    async getById(id: string): Promise<T | undefined> {
        const params: GetItemCommandInput = {
            TableName: this.tableName,
            Key: id as any 
        };

        const data = await this.dynamoDBClient.send(new GetItemCommand(params));
        return data.Item as T;
    }

    async add(item: T): Promise<void> {
        const input: PutItemCommandInput = {
            TableName: this.tableName,
            Item: item as any
        };

        await this.dynamoDBClient.send(new PutItemCommand(input));
    }

    async delete(id: string): Promise<void> {
        const params: DeleteItemCommandInput = {
            TableName: this.tableName,
            Key: marshall({ id })
        };

        await this.dynamoDBClient.send(new DeleteItemCommand(params));
    }
    async update(id: string, updates: Partial<T>): Promise<void> {
        // Build the update expression and attribute values
        let updateExpression = 'set';
        const expressionAttributeValues: { [key: string]: any } = {};

        Object.keys(updates).forEach((key, index) => {
            const placeholder = `:val${index}`;
            updateExpression += ` ${key} = ${placeholder},`;
            expressionAttributeValues[placeholder] = (updates as any)[key];
        });

        // Remove the trailing comma from the update expression
        updateExpression = updateExpression.slice(0, -1);

        const params: UpdateItemCommandInput = {
            TableName: this.tableName,
            Key: id as any, 
            UpdateExpression: updateExpression,
        };

        await this.dynamoDBClient.send(new UpdateItemCommand(params));
    }

    async markDone(todoId: string): Promise<void> {
        const params: UpdateItemCommandInput = {
            TableName: this.tableName,
            Key: todoId as any,
            UpdateExpression: 'set done = :d',
        };

        await this.dynamoDBClient.send(new UpdateItemCommand(params));
    }

    async markUndone(todoId: string): Promise<void> {
        const params: UpdateItemCommandInput = {
            TableName: this.tableName,
            Key:  todoId as any,
            UpdateExpression: 'set done = :d',
        };

        await this.dynamoDBClient.send(new UpdateItemCommand(params));
    }
}

export default DynamoDBService;