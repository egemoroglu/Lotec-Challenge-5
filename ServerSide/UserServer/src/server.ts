import express, {Express, Request, Response} from 'express';
import path, {dirname} from 'path';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import UserRepository from './adapters/database/UserRepository'

const app: Express = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') })

const port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const userRepo: UserRepository = new UserRepository();


app.post('/signup', async (req: Request, res: Response) => {
    try{
        const {username, password} = req.body;
        const user = await userRepo.createUser(username, password);
        res.status(200).send(user);
    }catch(err){
        res.status(500).json({message: err.message});
    }

})

app.post('/signin', async (req: Request, res: Response) => {
    try{
        const {username, password} = req.body;
        const user = await userRepo.getUserByUsername(username);
        if(user && user.getPassword() === password){
            res.status(200).send(user);
        }else{
            res.status(400).json({message: 'Invalid Credentials'});
        }
    }catch(err){
        res.status(500).json({message: err.message});
    }
})

app.post('/deleteUser', async (req: Request, res: Response) => {
    try{
        const {userId} = req.body;
        await userRepo.deleteUser(userId);
        res.status(200).json({message: 'User deleted successfully'});
    }catch(err){
        res.status(500).json({message: err.message});
    }

})



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});