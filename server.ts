import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';

dotenv.config();

const app: express.Application = express();

const port: string | number = process.env.PORT || 3000;

app.use(cors());

app.use(morgan('dev'));

app.use(bodyParser.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the chatbot server!');
});

app.post('/chat', (req: Request, res: Response) => {
  const { message } = req.body;
  res.json({
    response: `You said: ${message}`,
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});