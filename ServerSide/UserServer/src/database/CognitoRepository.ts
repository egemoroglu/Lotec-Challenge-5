import AWS from 'aws-sdk';
import dotenv from 'dotenv';
import UserRepository from './UserRepository';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') })

const userRepo: UserRepository = new UserRepository();

const cognito = new AWS.CognitoIdentityServiceProvider({
    region: process.env.REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

class CognitoRepository {

    private clientId: string;
    private userPoolId: string;

    constructor() {
        this.clientId = process.env.COGNITO_CLIENT_ID ?? '';
        this.userPoolId = process.env.COGNITO_USER_POOL_ID ?? '';
    }

    async signUp(username: string, password: string): Promise<void> {
            const params = {
                    ClientId: this.clientId,
                    Password: password,
                    Username: username,
                    UserAttributes: [
                        {
                            Name: 'nickname',
                            Value: username
                        }
                    ]

            };

            try {
                    const result = cognito.signUp({...params}).send((err, result)=>{
                       
                        console.log(err, result)
                    });
                    console.log("After Cognito Call");

                    await userRepo.createUser(username, password);
                    console.log("User signed up successfully");

                    const confirmParams = {
                        UserPoolId: this.userPoolId,
                        Username: username
                    }
                    await cognito.adminConfirmSignUp(confirmParams).promise();
                    console.log("User confirmed successfully");

                    
                } catch (error) {
                    throw error;
                }

    }

    async signIn(username: string, password: string): Promise<{ AccessToken: string, username: string | null }> {
        const params = {
            AuthFlow: 'USER_PASSWORD_AUTH',
            ClientId: this.clientId,
            AuthParameters: {
                'USERNAME': username,
                'PASSWORD': password
            }
        };

        try {
            const result = await cognito.initiateAuth(params).promise();
            const user = await userRepo.getUserByUsername(username);
            if (user && user.password === password) {
                return {
                    AccessToken: result.AuthenticationResult?.AccessToken ?? '',
                    username: username
                };
            }
            return { AccessToken: '', username: null };

        } catch (error) {
            throw error;
        }
    }
}

export default CognitoRepository;