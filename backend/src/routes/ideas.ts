import express, { Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import Idea from '../models/Idea';
import { OpenAI } from 'openai';

const router = express.Router();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Validate idea (original)
router.post('/validate', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { title, description } = req.body;
    
    const prompt = `Analyze this business idea for viability:
Title: ${title}
Description: ${description}

Provide a JSON response with:
- viabilityScore (0-100)
- marketFit (brief analysis)
- competition (what competitors exist)
- revenuePotential (estimated revenue model)
- risks (list of 3 main risks)
- opportunities (list of 3 main opportunities)

Respond ONLY with valid JSON.`;
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7
    });
    
    const analysis = JSON.parse(completion.choices[0].message.content || '{}');
    
    const idea = new Idea({
      userId: req.userId,
      title,
      description,
      viabilityScore: analysis.viabilityScore,
      analysis
    });
    
    await idea.save();
    
    res.status(201).json(idea);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Advanced validation with magic paste (text, URL, or image)
router.post('/validate-advanced', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { input, inputType } = req.body;

    let prompt = '';

    if (inputType === 'url') {
      prompt = `Analyze this competitor URL and suggest how to beat them:
URL: ${input}

Provide JSON with:
- competitorStrengths (list)
- competitorWeaknesses (list)
- yourDifferentiator (string)
- viabilityScore (0-100)
- marketGap (opportunity)
- marketFit
- revenuePotential
- risks
- opportunities

Respond ONLY with valid JSON.`;
    } else if (inputType === 'image') {
      prompt = `This is a napkin sketch of a business idea. Based on the visual description, analyze the viability:

Provide JSON with:
- conceptDescription
- viabilityScore (0-100)
- marketFit
- revenuePotential
- challenges
- nextSteps
- risks
- opportunities

Respond ONLY with valid JSON.`;
    } else {
      prompt = `Analyze this business idea for viability:
${input}

Provide a JSON response with:
- viabilityScore (0-100)
- marketFit (brief analysis)
- competition (what competitors exist)
- revenuePotential (estimated revenue model)
- risks (list of 3 main risks)
- opportunities (list of 3 main opportunities)

Respond ONLY with valid JSON.`;
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7
    });

    const analysis = JSON.parse(completion.choices[0].message.content || '{}');

    const idea = new Idea({
      userId: req.userId,
      title: `Idea from ${inputType}`,
      description: input.substring(0, 200),
      viabilityScore: analysis.viabilityScore,
      analysis
    });

    await idea.save();

    res.status(201).json(idea);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Get all ideas
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const ideas = await Idea.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(ideas);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
