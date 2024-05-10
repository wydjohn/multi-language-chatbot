import { spawn } from 'child_process';
import { Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

interface ChatBotReply {
    message: string;
    error?: string;
}

export class ChatController {
    public static async interactWithChatBot(req: Request, res: Response): Promise<void> {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ message: 'Message field is required.' });
        }

        const chatBotProcess = spawn('python', [`${process.env.CHAT_BOT_SCRIPT_PATH}`, '--message', message]);

        let chatBotOutput = '';

        chatBotProcess.stdout.on('data', (data) => chatBotOutput += data.toString());
        chatBotProcess.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
            chatBotProcess.kill(); // Ensure to kill the process if there's an error
            return res.status(500).json({ message: 'An error occurred in the Chat Bot script', error: data.toString() });
        });

        chatBotProcess.on('close', (code) => {
            if (code !== 0) {
                console.error('Chat Bot script exited with code', code);
                return res.status(500).json({ message: 'Failed to get response from chatbot', error: 'Non-zero exit code from Chat Bot script' });
            }

            try {
                const botResponse: ChatBotReply = JSON.parse(chatBotOutput);
                res.status(200).json(botResponse);
            } catch (error) {
                console.error('Parsing Error:', error);
                res.status(500).json({ message: 'Failed to parse Chat Bot response', error: error.message });
            }
        });
    }
}