// Vercel Serverless Function — Lead Capture API
// Receives lead data + full conversation and sends email notification

export default async function handler(req, res) {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, whatsapp, project, conversation } = req.body;

    // Build conversation text for email
    let convText = '';
    if (conversation && Array.isArray(conversation)) {
      conversation.forEach(msg => {
        const role = msg.role === 'user' ? 'Client' : 'Shah (AI)';
        convText += `${role}: ${msg.content}\n\n`;
      });
    }

    const emailBody = `NEW LEAD FROM WEBSITE CHATBOT

Name: ${name || 'Unknown'}
WhatsApp: ${whatsapp || 'Not provided'}
Project: ${project || 'Not specified'}
Time: ${new Date().toISOString()}

--- FULL CONVERSATION ---

${convText}
--- END ---

Reply to this lead ASAP on WhatsApp!`;

    // Send via FormSubmit
    const formData = new URLSearchParams({
      name: `CHATBOT LEAD: ${name || 'Unknown'}`,
      email: 'chatbot@automatewithshahrukh.com',
      message: emailBody,
      _subject: `New Lead: ${name || 'Unknown'} - ${(project || 'Not specified').substring(0, 50)}`,
      _captcha: 'false'
    });

    const emailResponse = await fetch('https://formsubmit.co/ajax/shahrukharain0313@gmail.com', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded', 
        'Accept': 'application/json',
        'Origin': 'https://automatewithshahrukh.vercel.app',
        'Referer': 'https://automatewithshahrukh.vercel.app/'
      },
      body: formData.toString()
    });

    // ----- VERCEL KV / UPSTASH DATABASE SAVING -----
    const KV_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
    const KV_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

    let dbSaved = false;
    if (KV_URL && KV_TOKEN) {
      try {
        // 1. Get existing leads
        const getRes = await fetch(`${KV_URL}/get/chatbot_leads`, {
          headers: { Authorization: `Bearer ${KV_TOKEN}` }
        });
        const getData = await getRes.json();
        let leads = [];
        if (getData.result) {
          leads = typeof getData.result === 'string' ? JSON.parse(getData.result) : getData.result;
        }

        // 2. Add new lead
        const newLead = {
          timestamp: new Date().toISOString(),
          name: name || 'Unknown Visitor',
          whatsapp: whatsapp || 'Not collected',
          project: project || 'Not specified',
          conversation: conversation || []
        };
        leads.push(newLead);

        // 3. Save back to KV
        const setRes = await fetch(`${KV_URL}/set/chatbot_leads`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${KV_TOKEN}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(leads)
        });
        
        if (setRes.ok) dbSaved = true;
      } catch (kvErr) {
        console.error('KV Save Error:', kvErr);
      }
    } else {
      console.warn("KV database not configured. Lead only sent via email.");
    }

    return res.status(200).json({ 
      success: true, 
      emailSent,
      dbSaved,
      message: 'Lead processed successfully' 
    });

  } catch (error) {
    console.error('Lead API error:', error);
    return res.status(500).json({ error: 'Failed to save lead' });
  }
}
