import { Request, Response } from 'express';
import client from '../config/db';
import sentiment from 'sentiment';
import { Feedback, SentimentResult } from '../types';
import { Sentiment } from '../models/sentiment';

export const createFeedback = async (req: Request, res: Response) => {
    const { text } = req.body;

    if (!text || text.length > 1000) {
        res.status(400).json({ error: 'Text must be provided and less than 1000 characters' });
        return
    }
    // Create a new instance of sentiment analyzer
    const Sentiment = new sentiment();

    const result: SentimentResult = Sentiment.analyze(text);
    const sentimentCategory = result.score > 0 ? 'Good' : result.score < 0 ? 'Bad' : 'Neutral';

    try {
        const query = 'INSERT INTO feedback (text, sentiment) VALUES ($1, $2) RETURNING *';
        const dbResponse = await client.query<Feedback>(query, [text, sentimentCategory]);
        res.status(201).json(dbResponse.rows[0]);
        return
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
        return
    }
};

export const getFeedback = async (_: Request, res: Response) => {
    try {
        // Get all feedback
        const feedback = await Sentiment.findAll();
        res.status(200).json(feedback);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
};

export const getFeedbackById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const feedback = await Sentiment.findById(id);
        if (!feedback) {
            res.status(404).json({ error: 'Feedback not found' });
        }
        res.status(200).json(feedback);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
};