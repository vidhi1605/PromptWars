/**
 * gemini.js – Calls the Gemini API through a secure proxy.
 *
 * Dev  (npm run dev): requests go to /gemini-api/... → Vite proxies to googleapis.com
 * Prod (Vercel):      requests go to /api/gemini     → Vercel serverless function proxies to googleapis.com
 *
 * The API key is NEVER embedded in the browser bundle for production.
 * In dev, VITE_GEMINI_API_KEY is appended to the proxied URL (local only).
 */

const IS_DEV = import.meta.env.DEV;

// Dev: use Vite proxy (key in query string, proxied server-side by Vite)
// Prod: use Vercel serverless function (key stays in Vercel env var)
const DEV_BASE = '/gemini-api/v1beta/models/gemini-2.0-flash:generateContent';
const PROD_BASE = '/api/gemini';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY ?? '';

// ---------------------------------------------------------------------------
// System prompt
// ---------------------------------------------------------------------------
const SYSTEM_PROMPT = `You are Monsoon Shield AI – a specialist in Indian monsoon preparedness and disaster readiness.
Given a user's location, household size, and any special requirements, produce a comprehensive preparedness plan.

You MUST respond with ONLY valid JSON (no markdown fences, no extra text). Use this exact schema:

{
  "planTitle": "string – short descriptive title",
  "weatherSummary": "string – 2-3 sentence monsoon weather outlook for the location",
  "riskLevel": "Low | Moderate | High | Critical",
  "checklist": [
    { "item": "string", "category": "string", "priority": "High | Medium | Low" }
  ],
  "evacuationSteps": ["string"],
  "safetyGuidelines": ["string"],
  "emergencyKit": [
    { "item": "string", "quantity": "string" }
  ]
}

Rules:
- The checklist MUST contain at least 8 items personalised to the household.
- emergencyKit MUST have at least 6 items with realistic quantities scaled to the household size.
- evacuationSteps MUST have at least 4 ordered steps.
- safetyGuidelines MUST have at least 5 guidelines.
- All text must be practical, actionable, and specific to the given location.`;

// ---------------------------------------------------------------------------
// Low-level fetch wrapper
// ---------------------------------------------------------------------------
async function callGemini(contents, systemInstruction, temperature = 0.7) {
  const url = IS_DEV
    ? `${DEV_BASE}?key=${GEMINI_API_KEY}` // dev: key passed via Vite proxy
    : PROD_BASE;                            // prod: key in Vercel env var

  const body = {
    contents,
    system_instruction: {
      parts: [{ text: systemInstruction }],
    },
    generationConfig: {
      temperature,
      maxOutputTokens: 4096,
    },
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    const message =
      errData?.error?.message ||
      `Gemini API request failed (HTTP ${response.status})`;
    throw new Error(message);
  }

  const data = await response.json();
  const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

  if (!raw) throw new Error('Gemini returned an empty response.');

  return raw;
}

// ---------------------------------------------------------------------------
// Strip markdown fences Gemini sometimes wraps around JSON
// ---------------------------------------------------------------------------
function stripFences(text) {
  return text
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
}

// ---------------------------------------------------------------------------
// Generate a preparedness plan
// ---------------------------------------------------------------------------
export async function generatePlan({ location, householdSize, specialRequirements }) {
  const userText = [
    `Location: ${location}`,
    `Household Size: ${householdSize} people`,
    specialRequirements
      ? `Special Requirements: ${specialRequirements}`
      : 'Special Requirements: None',
  ].join('\n');

  const contents = [{ role: 'user', parts: [{ text: userText }] }];

  const raw = await callGemini(contents, SYSTEM_PROMPT, 0.7);
  const cleaned = stripFences(raw);

  try {
    return JSON.parse(cleaned);
  } catch {
    console.warn('[Gemini] Response was not valid JSON. Attempting repair…');

    const repairPrompt = `The following JSON is malformed. Fix it so it is valid JSON and return ONLY the corrected JSON with no extra text:\n\n${cleaned}`;
    const repairRaw = await callGemini(
      [{ role: 'user', parts: [{ text: repairPrompt }] }],
      'You are a JSON repair assistant. Return only valid JSON.',
      0
    );
    return JSON.parse(stripFences(repairRaw));
  }
}
