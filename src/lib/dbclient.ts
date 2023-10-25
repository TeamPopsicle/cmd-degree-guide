export async function sendQuery(queryContent: string) {
    try {
        const response = await fetch('/api/sendquery', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: queryContent }),
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