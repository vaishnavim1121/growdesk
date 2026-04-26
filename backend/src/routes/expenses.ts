import express, { Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import Expense from '../models/Expense';
import { OpenAI } from 'openai';

const router = express.Router();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Parse natural language expense
router.post('/parse', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { naturalText } = req.body;

    const prompt = `Parse this natural language expense entry and extract structured data.
Input: "${naturalText}"

Respond ONLY with valid JSON (no markdown, no extra text):
{
  "amount": <number>,
  "type": "in" or "out",
  "category": <string from ["Food & Beverage", "Marketing", "Networking", "Software", "Office", "Transportation", "Other"]>,
  "description": <string>,
  "tags": [<array of 2-3 relevant tags>]
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3
    });

    const parsed = JSON.parse(completion.choices[0].message.content || '{}');

    // Save to database
    const expense = new Expense({
      userId: req.userId,
      amount: parsed.amount,
      type: parsed.type,
      category: parsed.category,
      description: parsed.description,
      tags: parsed.tags,
      naturalInput: naturalText
    });

    await expense.save();

    res.status(201).json(parsed);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Get all expenses
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const expenses = await Expense.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
