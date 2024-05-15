import express, {Express, Request, Response} from 'express';
import path, {dirname} from 'path';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import TodoRepository from './src/adapters/database/TodoRepository'


const app: Express = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') })

const port = process.env.TODO_SERVER_PORT || 3001;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(__dirname));

const todoRepo: TodoRepository = new TodoRepository();

app.get('todos', async (req: Request, res: Response) => {
    try{
        const {username} = req.query;
        const todos = await todoRepo.getTodosByUsername(username);
        res.status(200).send(todos);
    }catch(err){
        res.status(500).json({message: err.message});
    }
})




app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});