import { GoogleGenAI } from '@google/genai';

// ---------------------------------------------------------------------------
// Singleton client – initialised lazily so missing key is a runtime error,
// not a startup crash.
// ---------------------------------------------------------------------------
let ai = null;

function getClient() {
  if (!ai) {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === 'your_gemini_api_key_here') {
      throw new Error(
        'GEMINI_API_KEY is not configured. Add a valid key to backend/.env and restart the server.'
      );
    }
    ai = new GoogleGenAI({ apiKey: key });
  }
  return ai;
}

// ---------------------------------------------------------------------------
// System prompt – constrains Gemini to return strict JSON only.
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
// Generate a preparedness plan.
// ---------------------------------------------------------------------------
export async function generatePlan({ location, householdSize, specialRequirements }) {
  const client = getClient();

  const userPrompt = [
    `Location: ${location}`,
    `Household Size: ${householdSize} people`,
    specialRequirements
      ? `Special Requirements: ${specialRequirements}`
      : 'Special Requirements: None',
  ].join('\n');

  const response = await client.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: userPrompt,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      temperature: 0.7,
      maxOutputTokens: 4096,
    },
  });

  const raw = response.text;

  // Strip possible markdown code fences
  const cleaned = raw
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  // Attempt to parse; retry once with a repair prompt if malformed.
  try {
    return JSON.parse(cleaned);
  } catch {
    console.warn('⚠️  First Gemini response was not valid JSON. Attempting repair…');
    return retryParse(client, cleaned);
  }
}

// ---------------------------------------------------------------------------
// Retry – ask Gemini to fix its own broken JSON.
// ---------------------------------------------------------------------------
async function retryParse(client, brokenJson) {
  const repairPrompt = `The following JSON is malformed. Fix it so it is valid JSON and return ONLY the corrected JSON with no extra text:\n\n${brokenJson}`;

  const repairResponse = await client.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: repairPrompt,
    config: { temperature: 0, maxOutputTokens: 4096 },
  });

  const repaired = repairResponse.text
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  return JSON.parse(repaired); // If this still fails, let it throw – the controller catches it.
}
