import { IndianCrop, IndianSeason, IndianState, PredictionInput } from '../types/agriculture';
import { CROPS_CONFIG, INDIAN_STATES, SEASONS } from '../data/agriData';

export interface ValidationResult {
  isValid: boolean;
  errors: Partial<Record<keyof PredictionInput, string>>;
  warnings: Partial<Record<keyof PredictionInput, string>>;
}

export function validatePredictionInput(input: PredictionInput): ValidationResult {
  const errors: Partial<Record<keyof PredictionInput, string>> = {};
  const warnings: Partial<Record<keyof PredictionInput, string>> = {};

  // 1. State validation
  const validStateNames = INDIAN_STATES.map((s) => s.name);
  if (!validStateNames.includes(input.state)) {
    errors.state = `Invalid state. Must be one of the 16 recognized Indian states.`;
  }

  // 2. Crop validation
  const cropConfig = CROPS_CONFIG[input.crop];
  if (!cropConfig) {
    errors.crop = `Unsupported crop selection.`;
  }

  // 3. Season validation
  if (!SEASONS.includes(input.season)) {
    errors.season = `Invalid season. Allowed: Kharif, Rabi, Zaid, Whole Year.`;
  } else if (cropConfig && !cropConfig.standardSeasons.includes(input.season)) {
    warnings.season = `${input.crop} is uncommonly cultivated in ${input.season} season. Standard seasons: ${cropConfig.standardSeasons.join(', ')}.`;
  }

  // 4. Rainfall validation (in mm)
  if (typeof input.rainfallMm !== 'number' || isNaN(input.rainfallMm)) {
    errors.rainfallMm = `Rainfall must be a valid number in millimeters.`;
  } else if (input.rainfallMm <= 0) {
    errors.rainfallMm = `Rainfall must be greater than 0 mm.`;
  } else if (input.rainfallMm > 4000) {
    errors.rainfallMm = `Rainfall of ${input.rainfallMm} mm exceeds plausible Indian monsoon maximums (max: 4000 mm).`;
  } else if (input.rainfallMm < 150) {
    warnings.rainfallMm = `Severe drought conditions (<150 mm). Crop yield will face critical vegetative moisture stress.`;
  } else if (input.rainfallMm > 2500) {
    warnings.rainfallMm = `Deluge conditions (>2500 mm). High risk of waterlogging, root hypoxia, and nutrient leaching.`;
  }

  // 5. Fertilizer validation (in kg NPK)
  if (typeof input.fertilizerKg !== 'number' || isNaN(input.fertilizerKg)) {
    errors.fertilizerKg = `Fertilizer must be a valid number in kg.`;
  } else if (input.fertilizerKg < 0) {
    errors.fertilizerKg = `Fertilizer dosage cannot be negative.`;
  } else if (input.fertilizerKg > 600) {
    errors.fertilizerKg = `Fertilizer dosage exceeds physiological safety limit (max: 600 kg/ha).`;
  } else if (input.fertilizerKg < 20) {
    warnings.fertilizerKg = `Sub-optimal nutrient dosage (<20 kg NPK). Yield may be constrained by soil depletion.`;
  } else if (input.fertilizerKg > 350 && input.crop !== 'Sugarcane') {
    warnings.fertilizerKg = `Excessive fertilizer (>350 kg/ha). Diminishing returns and soil salinity toxicity risk.`;
  }

  // 6. Cultivated Area validation (in Hectares)
  if (typeof input.cultivatedAreaHa !== 'number' || isNaN(input.cultivatedAreaHa)) {
    errors.cultivatedAreaHa = `Cultivated area must be a valid number in hectares.`;
  } else if (input.cultivatedAreaHa <= 0) {
    errors.cultivatedAreaHa = `Cultivated land area must be greater than 0 hectares.`;
  } else if (input.cultivatedAreaHa > 5000) {
    warnings.cultivatedAreaHa = `Large operational holding (>5000 ha). Operational efficiency discounts may apply.`;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    warnings
  };
}
