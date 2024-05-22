import express, { Express, Request, Response } from "express";
import path, { dirname } from "path";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import UserRepository from "./src/database/UserRepository";
import CognitoRepository from "./src/database/CognitoRepository";
import serverless from "serverless-http";

const app: Express = express();
dotenv.config({ path: path.join(__dirname, "../.env") });

const port = process.env.USER_SERVER_PORT || 3000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const cognitoRepo: CognitoRepository = new CognitoRepository();
const userRepo: UserRepository = new UserRepository();

app.post("/signup", async (req: Request, res: Response) => {
  try {
    console.log("Signup Called");
    const { username, password } = req.body;
    const user = await cognitoRepo.signUp(username, password);
    res.status(200).send(user);
  } catch (error) {
    res.status(500).json({ error: "Error creating user" });
  }
});

app.post("/signin", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const signInResult = await cognitoRepo.signIn(username, password);

    if (signInResult.username) {
      res.status(200).send({
        accessToken: signInResult.AccessToken,
        username: signInResult.username,
      });
    } else {
      res.status(400).json({ message: "Invalid Credentials" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error Signin in" });
  }
});

app.post("/deleteUser", async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    await userRepo.deleteUser(userId);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports.handler = serverless(app);
