import express, {Express, Request, Response} from 'express';
import path from 'path';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import serverless from 'serverless-http'
import TodoRepository from './src/database/TodoRepository'


const app: Express = express();
dotenv.config({ path: path.join(__dirname, '../.env') })

const port = process.env.TODO_SERVER_PORT || 3001;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(__dirname));
app.use(cors());

const todoRepo: TodoRepository = new TodoRepository();

app.get('/todos', async (req: Request, res: Response) => {
    try{
        const {username} = req.query;
        const todos = await todoRepo.getTodosByUsername(username as string);
        res.status(200).send(todos);
    }catch(err){
        res.status(500).json({error: "Error getting todos"});
    }
})

app.post('/todos', async (req: Request, res: Response) => {
    try{
        const {title, username, done} = req.body;
        await todoRepo.createTodo(title, username, done);
        res.status(200).json({message: 'Task added successfully'});
    }catch(err){
        res.status(500).json({error: "Error adding task"});
    }
})

app.post('/delete', async (req: Request, res: Response) => {
    try{
        const {todoId} = req.query;
        await todoRepo.deleteTodoById(todoId as string);
        res.status(200).json({message: 'Task deleted successfully'});
    }catch(err){
        res.status(500).json({error: "Error deleting task"});
    }
})

app.post('/update', async (req: Request, res: Response) => {
    try{
        const {todoId, title} = req.body;
        await todoRepo.updateTodoById(todoId, title);
        res.status(200).json({message: 'Task updated successfully'});
    }catch(err){
        res.status(500).json({error: "Error updating task"});
    }
})

app.post('/markdone', async (req: Request, res: Response) => {
    try{
        const {todoId} = req.query;
        await todoRepo.markDone(todoId as string);
        res.status(200).json({message: 'Task marked as done successfully'});
    }catch(err){
        res.status(500).json({error: "Error marking task as done"});
    }
})

app.post('/markUndone', async (req: Request, res: Response) => {
    try{
        const {todoId} = req.query;
        await todoRepo.markUndone(todoId as string);
        res.status(200).json({message: 'Task marked as undone successfully'});
    }catch(err){
        res.status(500).json({error: "Error marking task as undone"});
    }
})


export function StartTodoServer(){
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });

}



module.exports.handler = serverless(app);