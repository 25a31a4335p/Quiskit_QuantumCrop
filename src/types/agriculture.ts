export type IndianSeason = 'Kharif' | 'Rabi' | 'Zaid' | 'Whole Year';

export type IndianState =
  | 'Punjab'
  | 'Uttar Pradesh'
  | 'Haryana'
  | 'Madhya Pradesh'
  | 'Maharashtra'
  | 'Andhra Pradesh'
  | 'Tamil Nadu'
  | 'Karnataka'
  | 'West Bengal'
  | 'Rajasthan'
  | 'Gujarat'
  | 'Bihar'
  | 'Odisha'
  | 'Telangana'
  | 'Assam'
  | 'Kerala';

export type IndianCrop =
  | 'Rice (Paddy)'
  | 'Wheat'
  | 'Sugarcane'
  | 'Cotton'
  | 'Maize'
  | 'Chickpea (Gram)'
  | 'Mustard'
  | 'Groundnut'
  | 'Soybean'
  | 'Bajra (Pearl Millet)';

export interface PredictionInput {
  state: IndianState;
  crop: IndianCrop;
  season: IndianSeason;
  rainfallMm: number;
  fertilizerKg: number;
  cultivatedAreaHa: number;
}

export interface ModelPrediction {
  modelName: 'Variational Quantum Regressor (VQR)' | 'Random Forest' | 'XGBoost' | 'Ridge Regression';
  shortName: 'VQR' | 'RF' | 'XGB' | 'Ridge';
  yieldTonnesPerHa: number;
  totalProductionTonnes: number;
  confidenceInterval: [number, number]; // 95% CI
  executionTimeMs: number;
  accuracyR2: number;
  mae: number;
  rmse: number;
}

export interface CalculationStep {
  name: string;
  formula: string;
  inputValue: string;
  computedFactor: number;
  interpretation: string;
}

export interface PredictionResult {
  timestamp: string;
  input: PredictionInput;
  primaryPrediction: ModelPrediction;
  allModels: Record<'VQR' | 'RF' | 'XGB' | 'Ridge', ModelPrediction>;
  isDemoMode: boolean;
  demoNotice: string;
  calculationSteps: CalculationStep[];
  formulaBreakdown: {
    baseYield: number;
    waterFactor: number;
    fertFactor: number;
    stateFactor: number;
    seasonFactor: number;
    quantumCouplingBonus: number;
    finalYieldTonnesPerHa: number;
  };
  quantumCircuitState: {
    qubitCount: number;
    circuitDepth: number;
    variationalParameters: number;
    entanglementType: 'ZZ Feature Map (Full)' | 'Linear Entanglement';
    stateVectorFidelity: number;
    lossConvergenceStep: number;
    lossHistory: number[];
  };
  agronomicInsights: {
    waterStressIndex: 'Optimal' | 'Mild Deficit' | 'Severe Drought' | 'Waterlogged';
    nutrientEfficiency: 'Balanced' | 'Under-fertilized' | 'Luxury Consumption / Saturated';
    yieldGapPotentialTonnesPerHa: number;
    soilTypeBaseline: string;
  };
}

export interface ModelBenchmark {
  modelId: 'VQR' | 'RF' | 'XGB' | 'Ridge';
  modelName: string;
  category:
    | 'Quantum Variational'
    | 'Classical Tree Ensemble'
    | 'Gradient Boosted'
    | 'Classical Linear'
    | 'Gradient Boosted Trees'
    | 'Quantum Variational (PennyLane)';
  r2Score: number;
  maeTonnesPerHa: number;
  rmseTonnesPerHa: number;
  trainingTimeSec: number;
  inferenceTimeMs: number;
  parameterCount: number;
  quantumQubits?: number;
  circuitDepth?: number;
  pros: string[];
  limitations: string[];
}

export interface AgriDatasetRecord {
  id: string;
  state: IndianState;
  crop: IndianCrop;
  season: IndianSeason;
  year: number;
  rainfallMm: number;
  fertilizerKg: number;
  cultivatedAreaHa: number;
  yieldTonnesPerHa: number;
  totalProductionTonnes: number;
  soilZone: string;
}
