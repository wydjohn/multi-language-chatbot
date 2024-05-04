import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';

dotenv.config();

const chatbotApp: express.Application = express();
const appPort: string | number = process.env.PORT || 3000;

const responseCache: { [key: string]: string } = {};

chatbotApp.use(cors());
chatbotApp.use(morgan('dev'));
chatbotApp.use(bodyParser.json());

const generateBotReply = (userMessage: string): string => {
  const processedReply = `Processed reply for: ${userMessage}`;
  return processedReply;
};

const getCachedOrNewReply = (userMessage: string): string => {
  if (responseCache[userMessage]) {
    console.log('Fetching from cache');
    return responseCache[userMessage];
  } else {
    console.log('Generating new reply and caching');
    const reply = generateBotReply(userMessage);
    responseCache[userMessage] = reply;
    return reply;
  }
};

chatbotApp.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the Multi-Language Chatbot Server!');
});

chatbotApp.post('/processMessage', (req: Request, res: Response) => {
  const { message: userMessage } = req.body;

  const botReply = getCachedOrNewReply(userMessage);

  res.json({
    reply: botReply,
  });
});

chatbotApp.listen(appPort, () => {
  console.log(`Chatbot Server is up and running at http://localhost:${appPort}/`);
});