import AWS from 'aws-sdk'
import dotenv from 'dotenv'
import path from 'path'
import User from "../domain/entities/User"

dotenv.config({ path: path.join(__dirname, '../../../.env') })

const region = process.env.REGION;
console.log("Region: ", region);
const userTable = process.env.USER_DB_NAME || "ege_user";

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
    
    //Get the User with the given username using getItems method from DynamoDB
    async getUserByUsername(username: string){
        const items = await this.getItems('ege_user');
        const user = items?.find((item: any) => item.username === username);
        console.log("UserRepo Signin Called")
        return user;
    }


    //add User to the DynamoDB
    async addUser(user: User){
        const params = {
            TableName: userTable,
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
            TableName: userTable,
            Key: {
                userId: userId
            }
        }

        await this.dynamoDB.delete(params).promise();
    }

    

    

    
    
}
