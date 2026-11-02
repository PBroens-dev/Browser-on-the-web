import fetch from 'node-fetch';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const HYPERBEAM_API_KEY = process.env.HYPERBEAM_API_KEY;

    if (!HYPERBEAM_API_KEY) {
        return res.status(500).json({ error: 'HYPERBEAM_API_KEY environment variable is missing on Vercel.' });
    }

    try {
        // Updated to the stable Hyperbeam API endpoint
        const response = await fetch('https://hyperbeam.com', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${HYPERBEAM_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                start_url: "https://google.com",
                profile: {
                    load_default: true
                }
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Hyperbeam API Error Details:", data);
            return res.status(response.status).json({ 
                error: data.message || "The Hyperbeam API rejected the request. Check your API key or billing status." 
            });
        }
        
        return res.status(200).json({
            embed_url: data.embed_url,
            session_id: data.session_id
        });

    } catch (error) {
        console.error("Vercel Serverless Function Crash:", error);
        return res.status(500).json({ error: "Failed to connect to Hyperbeam servers: " + error.message });
    }
}
