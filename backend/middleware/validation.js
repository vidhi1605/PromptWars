/**
 * Validates the POST body for /api/preparedness-plan.
 * Ensures required fields are present and correctly typed.
 */
export function validatePreparednessBody(req, res, next) {
  const { location, householdSize, specialRequirements } = req.body;

  const errors = [];

  if (!location || typeof location !== 'string' || location.trim().length === 0) {
    errors.push('`location` is required and must be a non-empty string.');
  }

  if (householdSize === undefined || householdSize === null) {
    errors.push('`householdSize` is required.');
  } else {
    const parsed = Number(householdSize);
    if (!Number.isFinite(parsed) || parsed < 1 || parsed > 50) {
      errors.push('`householdSize` must be a number between 1 and 50.');
    }
  }

  if (
    specialRequirements !== undefined &&
    specialRequirements !== null &&
    typeof specialRequirements !== 'string'
  ) {
    errors.push('`specialRequirements` must be a string when provided.');
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  // Normalize values for downstream use
  req.body.location = location.trim();
  req.body.householdSize = Number(householdSize);
  req.body.specialRequirements =
    typeof specialRequirements === 'string' ? specialRequirements.trim() : '';

  next();
}
