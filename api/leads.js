// Vercel Serverless Function — Fetch Leads for Admin Panel
// Uses Vercel KV REST API for database

export default async function handler(req, res) {
  // CORS
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const KV_URL = process.env.KV_REST_API_URL;
    const KV_TOKEN = process.env.KV_REST_API_TOKEN;

    // If Vercel KV is not set up yet, return empty array safely
    if (!KV_URL || !KV_TOKEN) {
      console.warn("Vercel KV is not configured. Please add KV database in Vercel Storage.");
      return res.status(200).json([]);
    }

    // Fetch leads from KV (key: 'chatbot_leads')
    const response = await fetch(`${KV_URL}/get/chatbot_leads`, {
      headers: {
        Authorization: `Bearer ${KV_TOKEN}`
      }
    });

    const data = await response.json();
    
    // Vercel KV returns data.result as stringified JSON if stored as string, or object.
    let leads = [];
    if (data.result) {
      leads = typeof data.result === 'string' ? JSON.parse(data.result) : data.result;
    }

    return res.status(200).json(leads);

  } catch (error) {
    console.error('Fetch leads error:', error);
    return res.status(500).json({ error: 'Failed to fetch leads' });
  }
}
