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

chatbotApp.use((err: Error, req: Request, res: Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

const generateBotReply = (userMessage: string): string => {
  try {
    const processedReply = generateReplyBasedOnKeywords(userMessage) || `Processed reply for: ${userMessage}`;
    return processedReply;
  } catch (error) {
    console.error('Error generating bot reply:', error);
    return 'Sorry, there was an error processing your message.';
  }
};

const generateReplyBasedOnKeywords = (message: string): string | null => {
  const keywordsMap: { [key: string]: string } = {
    'hello': 'Hello there!',
    'hola': '¡Hola!',
    'help': 'How can I assist you?',
    'ayuda': '¿Cómo puedo ayudarte?',
  };

  const words = message.toLowerCase().split(' ');
  for (const word of words) {
    if (keywordsMap[word]) {
      return keywordsMap[word];
    }
  }

  return null;
};

const getCachedOrNewReply = (userMessage: string): string => {
  try {
    if (responseCache[userMessage]) {
      console.log('Fetching from cache');
      return responseCache[userMessage];
    } else {
      console.log('Generating new reply and caching');
      const reply = generateBotReply(userMessage);
      responseCache[userMessage] = reply;
      return reply;
    }
  } catch (error) {
    console.error('Error in getCachedOrNewReply:', error);
    return 'Error fetching or generating a new reply.';
  }
};

chatbotApp.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the Multi-Language Chatbot Server!');
});

chatbotApp.post('/processMessage', (req: Request, res: Response) => {
  try {
    const { message: userMessage } = req.body;
    if (!userMessage) {
      return res.status(400).json({ error: 'Message content missing.' });
    }

    const botReply = getCachedOrNewReply(userMessage);

    res.json({
      reply: botReply,
    });
  } catch (error) {
    console.error('Error in /processMessage endpoint:', error);
    return res.status(500).send('Error processing your message.');
  }
});

chatbotApp.listen(appPort, () => {
  console.log(`Chatbot Server is up and running at http://localhost:${appPort}/`);
});