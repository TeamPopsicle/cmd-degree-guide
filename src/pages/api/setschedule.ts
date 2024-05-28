/*
    i. Server side API endpoint that communicates with the database, see https://nextjs.org/docs/api-routes/introduction
    ii. Popsicle
    iii. Ethan Cha, Peyton Elebash, Haley Figone, Yaya Yao
*/

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

/**
 * Processes the API request, see https://nextjs.org/docs/api-routes/introduction for details
 * @param req API request instance
 * @param res API response instance
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', 'https://cmd-degree-guide.vercel.app http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === "OPTIONS") {
        // Pre-flight request. Reply successfully:
        return res.status(200).end();
    }
    
    if (req.method === "POST") {
        const apiKey = req.headers.authorization;
        // If given public api key does not match private api key do not process
        if (!apiKey || apiKey !== `Bearer ${API_KEY}`) {
            return res.status(401).json({ response: "Unauthorized" });
        }

        try {
            const { content } = req.body;
            const result = await executeQuery("UPDATE `Users` SET `schedule` = ? WHERE (`username` = ?);", content);
            res.status(200).json({ response: result });
            console.log("success.", result)
        } catch (error) {
            res.status(500).json({ response: "Error", error });
        }
    } else {
        res.status(405).json({ response: "Method not allowed" });
    }
}