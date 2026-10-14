import { PredictionInput, PredictionResult } from '../types/agriculture';

export interface ICropPredictionEngine {
  readonly id: string;
  readonly name: string;
  readonly isRealTrainedModel: boolean;
  readonly description: string;
  predict(input: PredictionInput): Promise<PredictionResult> | PredictionResult;
}

export interface MLTrainingPipelineInfo {
  datasetName: string;
  datasetSource: string;
  targetVariable: string;
  featuresUsed: string[];
  trainTestSplitRatio: string;
  quantumSimulatorBackend: string;
  localRuntimeHasPythonML: boolean;
  pythonEnvironmentNote: string;
}
