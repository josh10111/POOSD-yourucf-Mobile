import express, { Request, Response, RequestHandler } from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cors from 'cors';

const app = express();
const port = 5001;
const secretKey = 'your_secret_key'; // Replace with a secure secret key or use an environment variable

app.use(cors());
app.use(express.json());
// app.use(bodyParser.json());

interface User {
  id: number;
  email: string;
  passwordHash: string;
}

const users: User[] = [];
let userIdCounter = 1;

const registerHandler: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  // Check if user exists
  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    res.status(400).json({ error: 'User already exists' });
    return;
  }

  try {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const newUser: User = {
      id: userIdCounter++,
      email,
      passwordHash,
    };
    users.push(newUser);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const loginHandler: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  const user = users.find(u => u.email === email);
  if (!user) {
    res.status(400).json({ error: 'Invalid email or password' });
    return;
  }

  try {
    const passwordValid = await bcrypt.compare(password, user.passwordHash);
    if (!passwordValid) {
      res.status(400).json({ error: 'Invalid email or password' });
      return;
    }

    // Create a token (expires in 1 hour)
    const token = jwt.sign({ id: user.id, email: user.email }, secretKey, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

app.get('/api/test', (_req: Request, res: Response) => {
    res.json({ message: "Server reachable" });
  });


app.post('/api/register', registerHandler);
app.post('/api/login', loginHandler);

app.listen(port, '0.0.0.0', () => {
    console.log(`Server -updated running on port ${port}`);
  });
