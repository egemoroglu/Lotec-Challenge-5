import { AccessToken } from 'aws-sdk/clients/amplify';
import User from '../entities/User';
import { IdToken, RefreshToken } from 'aws-sdk/clients/ssooidc';

interface CognitoInterface {
    signUp(username: string, password: string): Promise<void>;
    signIn(username: string, password: string): Promise<{AccessToken: string,  username: string | null} >;
}

export default CognitoInterface;