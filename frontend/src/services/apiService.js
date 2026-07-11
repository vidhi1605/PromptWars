/**
 * apiService.js – Frontend API layer.
 * All Gemini calls now happen directly in the browser (no backend required).
 */
import { generatePlan } from './gemini.js';

const DEFAULT_TIMEOUT = 30000; // 30 s – Gemini can be slow

// ---------------------------------------------------------------------------
// Validate the shape of the plan returned by Gemini
// ---------------------------------------------------------------------------
function validatePlanResponse(plan) {
  if (!plan || typeof plan !== 'object') {
    throw new Error('Invalid plan format received from Gemini.');
  }

  const requiredStrings = ['planTitle', 'weatherSummary', 'riskLevel'];
  for (const field of requiredStrings) {
    if (typeof plan[field] !== 'string') {
      throw new Error(`Missing or invalid field: ${field}`);
    }
  }

  if (!Array.isArray(plan.checklist)) throw new Error('Missing checklist items.');
  if (!Array.isArray(plan.evacuationSteps)) throw new Error('Missing evacuation steps.');
  if (!Array.isArray(plan.safetyGuidelines)) throw new Error('Missing safety guidelines.');
  if (!Array.isArray(plan.emergencyKit)) throw new Error('Missing emergency kit items.');

  return true;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------
/**
 * Generates a preparedness plan by calling Gemini directly from the browser.
 *
 * @param {{ location: string, householdSize: number, specialRequirements: string }} params
 * @param {AbortSignal} [signal] – optional cancellation signal
 * @returns {Promise<Object>} validated preparedness plan
 */
export async function getPreparednessPlan(
  { location, householdSize, specialRequirements },
  signal
) {
  // Manual timeout via AbortController
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);

  // Forward external cancellation signals
  if (signal) {
    signal.addEventListener('abort', () => {
      controller.abort();
      clearTimeout(timeoutId);
    });
  }

  try {
    // Wrap the Gemini call in a race so we can honour the timeout
    const plan = await Promise.race([
      generatePlan({ location, householdSize, specialRequirements }),
      new Promise((_, reject) =>
        controller.signal.addEventListener('abort', () =>
          reject(Object.assign(new Error('AbortError'), { name: 'AbortError' }))
        )
      ),
    ]);

    clearTimeout(timeoutId);
    validatePlanResponse(plan);
    return plan;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError' || error.message === 'AbortError') {
      if (signal?.aborted) throw new Error('Plan generation cancelled.');
      throw new Error('Request timed out. Gemini took too long to respond.');
    }

    // Surface Gemini / network errors cleanly
    throw new Error(error.message || 'Failed to generate preparedness plan.');
  }
}

export default { getPreparednessPlan };
