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
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ message: 'Message field is required.' });
        }

        const pythonProcess = spawn('python', [`${process.env.PYTHON_SCRIPT_PATH}`, '--message', message]);

        let pythonResponse = '';

        pythonProcess.stdout.on('data', (data) => pythonResponse += data.toString());
        pythonProcess.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
            pythonProcess.kill(); // Ensure to kill the process if there's an error
            return res.status(500).json({ message: 'An error occurred in the Python script', error: data.toString() });
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                console.error('Python script exited with code', code);
                return res.status(500).json({ message: 'Failed to get response from chatbot', error: 'Non-zero exit code from Python script' });
            }

            try {
                const response: ChatBotResponse = JSON.parse(pythonResponse);
                res.status(200).json(response);
            } catch (parseError) {
                console.error('Parse Error:', parseError);
                res.status(500).json({ message: 'Failed to parse response', error: parseError.message });
            }
        });
    }
}