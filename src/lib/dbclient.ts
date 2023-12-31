/*
    i. Client side function that sends an API call to the server it's hosted on that runs an SQL query (see docstring)
    ii. Popsicle
    iii. Ethan Cha, Peyton Elebash, Haley Figone, Yaya Yao
*/

/**
 * Asynchronously sends a query to the database by sending an API call to itself
 * @param queryContent The SQL query to send it
 * @param params Placeholder parameters for the SQL query
 * @returns A JSON object containing the API response, which contains another object of the SQL response
 */
export async function sendQuery(queryContent: string, ...params: any) {
    try {
        const response = await fetch('/api/sendquery', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
            },
            body: JSON.stringify({ content: queryContent, params }),
        });

        if (response.ok) {
            console.log("Query sent successfully");
            const data = await response.json(); // Parse response as JSON
            return data; // Return the parsed JSON response
        } else {
            // Handle error response
            console.error('Error:', response.status);
            return { error: 'Request failed' };
        }
    } catch (error) {
        console.error('Error:', error);
        return { error };
    }
}