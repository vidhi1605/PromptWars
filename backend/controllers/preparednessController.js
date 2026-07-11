import { generatePlan } from '../services/geminiService.js';

/**
 * POST /api/preparedness-plan
 * Generates an AI-powered monsoon preparedness plan.
 */
export async function createPreparedness(req, res) {
  const { location, householdSize, specialRequirements } = req.body;

  try {
    const plan = await generatePlan({ location, householdSize, specialRequirements });
    return res.json({ success: true, plan });
  } catch (error) {
    console.error('Preparedness generation error:', error);

    // Differentiate configuration errors from transient API errors
    if (error.message?.includes('GEMINI_API_KEY')) {
      return res.status(503).json({
        success: false,
        error:
          'AI service is not configured. Set GEMINI_API_KEY in backend/.env and restart the server.',
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Failed to generate preparedness plan. Please try again.',
    });
  }
}
