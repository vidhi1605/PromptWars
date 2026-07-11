/**
 * Vercel Serverless Function: /api/gemini
 *
 * Acts as a secure proxy between the React frontend and the Google Gemini API.
 * The API key is stored as a Vercel Environment Variable (GEMINI_API_KEY)
 * and never exposed to the browser.
 */

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL = 'gemini-2.0-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  if (!GEMINI_API_KEY) {
    return res.status(503).json({
      error: 'Gemini API key is not configured. Add GEMINI_API_KEY to Vercel environment variables.',
    });
  }

  try {
    const geminiResponse = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    const data = await geminiResponse.json();

    if (!geminiResponse.ok) {
      return res.status(geminiResponse.status).json({
        error: data?.error?.message || `Gemini API error (HTTP ${geminiResponse.status})`,
      });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Failed to reach Gemini API.' });
  }
}
