/*
    i. Server side API endpoint that communicates with the database, see https://nextjs.org/docs/api-routes/introduction
    ii. Popsicle
    iii. Ethan Cha, Peyton Elebash, Haley Figone, Yaya Yao
*/

import { NextApiRequest, NextApiResponse } from "next";

/**
 * Processes the API request, see https://nextjs.org/docs/api-routes/introduction for details
 * @param req API request instance
 * @param res API response instance
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    res.status(400).json({ error: 'This API endpoint is deprecated: https://youtu.be/dQw4w9WgXcQ' });
}