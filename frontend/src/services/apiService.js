/**
 * API Service for Monsoon Shield application.
 * Manages communication with the Node.js + Express backend.
 */

const API_BASE_URL = 'http://localhost:5000/api';
const DEFAULT_TIMEOUT = 15000; // 15 seconds network timeout as per plan

/**
 * Validates the structure of the preparedness plan response.
 * Throws an error if key elements are missing or malformed.
 */
function validatePlanResponse(plan) {
  if (!plan || typeof plan !== 'object') {
    throw new Error('Invalid plan format received from AI service.');
  }

  const requiredFields = ['planTitle', 'weatherSummary', 'riskLevel'];
  for (const field of requiredFields) {
    if (typeof plan[field] !== 'string') {
      throw new Error(`Missing or invalid field: ${field}`);
    }
  }

  if (!Array.isArray(plan.checklist)) {
    throw new Error('Missing checklist items.');
  }

  if (!Array.isArray(plan.evacuationSteps)) {
    throw new Error('Missing evacuation steps.');
  }

  if (!Array.isArray(plan.safetyGuidelines)) {
    throw new Error('Missing safety guidelines.');
  }

  if (!Array.isArray(plan.emergencyKit)) {
    throw new Error('Missing emergency kit items.');
  }

  return true;
}

/**
 * Generates an AI preparedness plan by sending a POST request to the backend.
 * Includes timeout handling and input/output validation.
 * 
 * @param {Object} params
 * @param {string} params.location
 * @param {number} params.householdSize
 * @param {string} params.specialRequirements
 * @param {AbortSignal} [signal] Optional signal to cancel request
 * @returns {Promise<Object>} The validated preparedness plan
 */
export async function getPreparednessPlan({ location, householdSize, specialRequirements }, signal) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, DEFAULT_TIMEOUT);

  // Link signal if provided
  if (signal) {
    signal.addEventListener('abort', () => {
      controller.abort();
      clearTimeout(timeoutId);
    });
  }

  try {
    const response = await fetch(`${API_BASE_URL}/preparedness-plan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        location,
        householdSize,
        specialRequirements,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await response.json().catch(() => {
      throw new Error('Failed to parse backend response.');
    });

    if (!response.ok) {
      if (data && data.errors) {
        throw new Error(data.errors.join(' '));
      }
      throw new Error(data?.error || `Request failed with status ${response.status}`);
    }

    if (!data.success || !data.plan) {
      throw new Error(data.error || 'Server indicated failure without specific error message.');
    }

    validatePlanResponse(data.plan);

    return data.plan;
  } catch (error) {
    clearTimeout(timeoutId);

    // If abort was triggered by the timeout or cancellation
    if (error.name === 'AbortError') {
      if (signal?.aborted) {
        throw new Error('Plan generation cancelled.');
      }
      throw new Error('Request timed out. The AI service took too long to respond.');
    }

    // Network connection errors
    if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
      throw new Error(
        'The backend server is currently unavailable. Please ensure the Express server is running on http://localhost:5000 and try again.'
      );
    }

    throw error;
  }
}

export default {
  getPreparednessPlan,
};
