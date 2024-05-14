import express, {Express, Request, Response} from 'express';
import path, {dirname} from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const app: Express = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') })

const port = process.env.PORT || 3001;





app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});