import client from "../config/db";

export class Sentiment {
    id: number;
    text: string;
    sentiment: string;
    createdAt: Date;

    constructor(id: number, text: string, sentiment: string, createdAt: Date) {
        this.id = id;
        this.text = text;
        this.sentiment = sentiment;
        this.createdAt = createdAt;
    }

    static async findAll() {
        const query = 'SELECT * FROM feedback ORDER BY created_at DESC';
        const dbResponse = await client.query<Sentiment>(query);
        return dbResponse.rows.map(row => new Sentiment(row.id, row.text, row.sentiment, row.createdAt));
    }

    static async findById(id: string) {
        const query = 'SELECT * FROM feedback WHERE id = $1';
        const dbResponse = await client.query<Sentiment>(query, [id]);
        if (!dbResponse.rows.length) {
            throw new Error('Feedback not found');
        }
        return new Sentiment(dbResponse.rows[0].id, dbResponse.rows[0].text, dbResponse.rows[0].sentiment, dbResponse.rows[0].createdAt);
    }

    static async create(text: string, sentiment: string) {
        const query = 'INSERT INTO feedback (text, sentiment) VALUES ($1, $2) RETURNING *';
        const dbResponse = await client.query<Sentiment>(query, [text, sentiment]);
        return new Sentiment(dbResponse.rows[0].id, dbResponse.rows[0].text, dbResponse.rows[0].sentiment, dbResponse.rows[0].createdAt);
    }
}
