import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';

dotenv.config();

const chatbotServer: express.Application = express();
const serverPort: string | number = process.env.PORT || 3000;

chatbotServer.use(cors());
chatbotServer.use(morgan('dev'));
chatbotServer.use(bodyParser.json());

chatbotServer.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the Multi-Language Chatbot Server!');
});

chatbotServer.post('/processMessage', (req: Request, res: Response) => {
  const { message } = req.body;
  res.json({
    reply: `You said: ${message}`,
  });
});

chatbotServer.listen(serverPort, () => {
  console.log(`Chatbot Server is up and running at http://localhost:${serverPort}/`);
});