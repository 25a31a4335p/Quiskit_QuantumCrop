import { PredictionInput, PredictionResult } from '../types/agriculture';
import { modelRegistry } from '../models/modelRegistry';

export function calculatePredictions(input: PredictionInput): PredictionResult {
  return modelRegistry.getActiveEngine().predict(input) as PredictionResult;
}

