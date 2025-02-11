import express, { Request, Response } from 'express';
import helmet from 'helmet';
import sentiment from 'sentiment';
import cors from 'cors';

import { createFeedback, getFeedback, getFeedbackById } from '../controllers/sentiment';
import bodyParser from 'body-parser';

const router = express.Router();

// Create a new instance of sentiment analyzer
const Sentiment = new sentiment();

// helmet middleware
router.use(helmet());

// Middleware
router.use(bodyParser.json());

router.use(cors({ origin: '*', credentials: true }));

// GET / - Welcome message
router.get('/', async (req: Request, res: Response) => {
    res.send('Hello, sentiment-analysis-backend!');
});

// POST /api/feedback - Create a new feedback item
router.post('/feedback', createFeedback);

// GET /api/feedback - Retrieve all feedback
router.get('/feedback', getFeedback);

// GET /api/feedback/:id - Retrieve a single feedback item by ID
router.get('/feedback/:id', getFeedbackById);
export default router;