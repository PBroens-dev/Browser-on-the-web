import fetch from 'node-fetch';

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // Vercel securely injects this variable from your dashboard settings
    const HYPERBEAM_API_KEY = process.env.HYPERBEAM_API_KEY;

    if (!HYPERBEAM_API_KEY) {
        return res.status(500).json({ error: 'Hyperbeam API key is missing from the server configuration.' });
    }

    try {
        const response = await fetch('https://hyperbeam.com', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${HYPERBEAM_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                start_url: "https://google.com", 
                region: "eu" 
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            return res.status(response.status).json({ error: errorData });
        }

        const data = await response.json();
        
        return res.status(200).json({
            embed_url: data.embed_url,
            session_id: data.session_id
        });

    } catch (error) {
        console.error("Serverless error:", error);
        return res.status(500).json({ error: "Internal server error starting Hyperbeam" });
    }
}
