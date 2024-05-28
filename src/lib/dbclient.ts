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
 * @deprecated Use sendDbCommand instead
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

export async function sendDbCommand(command: string, ...params: any) {
    try {
        let response: Response = new Response();
        switch (command) {
            case 'getuser':
                response = await fetch('/api/getuser', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
                    },
                    body: JSON.stringify({ content: params }),
                });
                break;
            case 'getschedule':
                response = await fetch('/api/getschedule', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
                    },
                    body: JSON.stringify({ content: params }),
                });
                break;
            case 'adduser':
                response = await fetch('/api/adduser', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
                    },
                    body: JSON.stringify({ content: params }),
                });
                break;
            case 'getclasses':
                response = await fetch('/api/getclasses', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
                    },
                    body: JSON.stringify({ content: params }),
                });
                break;
            case 'setschedule':
                response = await fetch('/api/setschedule', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
                    },
                    body: JSON.stringify({ content: params }),
                });
                break;
            case 'deleteschedule':
                response = await fetch('/api/deleteschedule', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
                    },
                    body: JSON.stringify({ content: params }),
                });
                break;
            case 'getprereqs':
                response = await fetch('/api/getprereqs', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
                    },
                    body: JSON.stringify({ content: params }),
                });
                break;
            default:
                console.error('Invalid command');
                break;
        }
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
        return { error }
    }
}