import { spawn } from 'child_process';
import { Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

interface ChatBotResponse {
    message: string;
    error?: string;
}

export class ApiController {
    public static async chatWithBot(req: Request, res: Response): Promise<void> {
        try {
            const { message } = req.body;

            if (!message) {
                res.status(400).json({ message: 'Message field is required.' });
                return;
            }

            const pythonProcess = spawn('python', [`${process.env.PYTHON_SCRIPT_PATH}`, '--message', message]);

            let pythonResponse = '';

            pythonProcess.stdout.on('data', (data) => {
                pythonResponse += data.toString();
            });

            pythonProcess.on('close', (code) => {
                if (code !== 0) {
                    res.status(500).json({ message: 'Failed to get response from chatbot', error: 'Non-zero exit code from Python script' });
                    return;
                }

                try {
                    const response: ChatBotResponse = JSON.parse(pythonResponse);
                    res.status(200).json(response);
                } catch (error) {
                    res.status(500).json({ message: 'Failed to parse response', error: error.message });
                }
            });

            pythonProcess.stderr.on('data', (data) => {
                console.error(`stderr: ${data}`);
                res.status(500).json({ message: 'An error occurred in the Python script', error: data.toString() });
            });

        } catch (error) {
            console.log('Error:', error);
            res.status(500).json({ message: 'An unexpected error occurred', error: error.message });
        }
    }
}