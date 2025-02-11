export interface Feedback {
    id: number;
    text: string;
    sentiment: string;
    created_at: Date;
}

export interface SentimentResult {
    score: number;
    comparative: number;
    tokens: string[];
    words: string[];
    positive: string[];
    negative: string[];
}