import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';

dotenv.config();

const chatbotServer: express.Application = express();
const serverPort: string | number = process.env.PORT || 3000;

// Simple in-memory cache object
const cache: { [key: string]: string } = {};

chatbotServer.use(cors());
chatbotServer.use(morgan('dev'));
chatbotServer.use(bodyParser.json());

// Hypothetical function to generate a reply (could involve complex logic or external API calls)
const generateReply = (message: string): string => {
  // Simulating a computationally expensive operation
  const processedMessage = `Processed reply for: ${message}`;
  return processedMessage;
};

// Caching wrapper for the generateReply function
const getCachedReply = (message: string): string => {
  if (cache[message]) {
    console.log('Fetching from cache');
    return cache[message];
  } else {
    console.log('Generating new reply and caching');
    const reply = generateReply(message);
    cache[message] = reply;
    return reply;
  }
};

chatbotServer.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the Multi-Language Chatbot Server!');
});

chatbotServer.post('/processMessage', (req: Request, res: Response) => {
  const { message } = req.body;

  // Use the caching mechanism
  const reply = getCachedReply(message);

  res.json({
    reply: reply,
  });
});

chatbotServer.listen(serverPort, () => {
  console.log(`Chatbot Server is up and running at http://localhost:${serverPort}/`);
});