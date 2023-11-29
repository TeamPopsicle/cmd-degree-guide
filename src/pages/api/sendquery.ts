import { NextApiRequest, NextApiResponse } from "next";
import mysql from 'serverless-mysql';

const db = mysql({
    config: {
        host: process.env.MYSQL_HOST,
        port: parseInt(process.env.MYSQL_PORT as string),
        database: process.env.MYSQL_DATABASE,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD
    }
});

const API_KEY = process.env.PRIVATE_API_KEY || 'defaultApiKey';

/**
 * Sends a query to the database. This will run server-side, 
 * such as APIs and getServerSideProps; this should not be used in client-side code
 * @param query A string that will send the SQL string to the connected database
 */
export async function executeQuery(query: string, params: any[] = []) {
    try {
        db.connect()
            .then(() => {
                console.log('Connected to the database.');
            })
            .catch((err) => {
                console.error('Error connecting to the database:', err);
            });
        const results = await db.query(query, params);
        await db.end();
        return results;
    } catch (error) {
        return { error };
    }
}

// TODO: Add API password security check to prevent rogue api calls
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const apiKey = req.headers.authorization;
        // If given public api key does not match private api key do not process
        if (!apiKey || apiKey !== `Bearer ${API_KEY}`) {
            return res.status(401).json({ response: "Unauthorized" });
        }
        
        try {
            const { content, params } = req.body;
            const result = await executeQuery(content, params);
            res.status(200).json({ response: result });
            console.log("success.", result)
        } catch (error) {
            res.status(500).json({ response: "Error", error });
        }
    } else {
        res.status(405).json({ response: "Method not allowed" });
    }
}