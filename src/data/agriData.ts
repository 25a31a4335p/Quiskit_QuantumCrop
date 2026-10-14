import {
  AgriDatasetRecord,
  IndianCrop,
  IndianSeason,
  IndianState,
  ModelBenchmark,
  PredictionInput
} from '../types/agriculture';

export const INDIAN_STATES: { name: IndianState; zone: string; soilType: string; defaultRainfall: number }[] = [
  { name: 'Punjab', zone: 'Trans-Gangetic Plains', soilType: 'Alluvial Loam', defaultRainfall: 620 },
  { name: 'Uttar Pradesh', zone: 'Upper & Middle Gangetic Plains', soilType: 'Deep Alluvial', defaultRainfall: 950 },
  { name: 'Haryana', zone: 'Trans-Gangetic Plains', soilType: 'Sandy Loam to Clay', defaultRainfall: 560 },
  { name: 'Madhya Pradesh', zone: 'Central Plateau & Hills', soilType: 'Deep Black / Medium Black', defaultRainfall: 1100 },
  { name: 'Maharashtra', zone: 'Western Plateau & Hills', soilType: 'Regur (Black Cotton)', defaultRainfall: 1250 },
  { name: 'Andhra Pradesh', zone: 'Southern Plateau & Coastal', soilType: 'Red Sandy & Coastal Alluvium', defaultRainfall: 940 },
  { name: 'Tamil Nadu', zone: 'Southern Plateau & Hills', soilType: 'Red Loam & Coastal Alluvium', defaultRainfall: 980 },
  { name: 'Karnataka', zone: 'Southern Plateau & Ghats', soilType: 'Laterite & Red Sandy', defaultRainfall: 1150 },
  { name: 'West Bengal', zone: 'Lower Gangetic Plain', soilType: 'Deltaic Alluvium', defaultRainfall: 1650 },
  { name: 'Rajasthan', zone: 'Western Dry Zone', soilType: 'Desert Arid / Sandy', defaultRainfall: 420 },
  { name: 'Gujarat', zone: 'Gujarat Plains & Hills', soilType: 'Medium Black & Saline', defaultRainfall: 820 },
  { name: 'Bihar', zone: 'Middle Gangetic Plain', soilType: 'Sandy Loam Alluvium', defaultRainfall: 1150 },
  { name: 'Odisha', zone: 'Eastern Plateau & Coastal', soilType: 'Lateritic & Coastal Saline', defaultRainfall: 1450 },
  { name: 'Telangana', zone: 'Southern Plateau & Hills', soilType: 'Red Sandy (Chalka) & Black', defaultRainfall: 900 },
  { name: 'Assam', zone: 'Eastern Himalayan Region', soilType: 'Alluvial Riverine', defaultRainfall: 2100 },
  { name: 'Kerala', zone: 'West Coast Plains & Ghats', soilType: 'Laterite & Coastal', defaultRainfall: 2850 }
];

export const CROPS_CONFIG: Record<
  IndianCrop,
  {
    idealRainfallMm: number;
    rainfallRange: [number, number];
    idealFertilizerKg: number;
    fertilizerRange: [number, number];
    baseYieldTonnesPerHa: number;
    maxPotentialYield: number;
    standardSeasons: IndianSeason[];
    category: 'Cereal' | 'Cash Crop' | 'Pulse' | 'Oilseed';
    description: string;
  }
> = {
  'Rice (Paddy)': {
    idealRainfallMm: 1250,
    rainfallRange: [750, 2400],
    idealFertilizerKg: 140,
    fertilizerRange: [60, 250],
    baseYieldTonnesPerHa: 3.8,
    maxPotentialYield: 6.2,
    standardSeasons: ['Kharif', 'Rabi'],
    category: 'Cereal',
    description: 'High water requirement staple cereal; highly responsive to nitrogen and balanced phosphorus.'
  },
  'Wheat': {
    idealRainfallMm: 450,
    rainfallRange: [250, 750],
    idealFertilizerKg: 130,
    fertilizerRange: [50, 220],
    baseYieldTonnesPerHa: 4.2,
    maxPotentialYield: 6.5,
    standardSeasons: ['Rabi'],
    category: 'Cereal',
    description: 'Rabi temperate cereal; benefits from regulated winter showers and precise NPK application.'
  },
  'Sugarcane': {
    idealRainfallMm: 1800,
    rainfallRange: [1000, 2600],
    idealFertilizerKg: 280,
    fertilizerRange: [120, 450],
    baseYieldTonnesPerHa: 72.0,
    maxPotentialYield: 110.0,
    standardSeasons: ['Whole Year'],
    category: 'Cash Crop',
    description: 'Long-duration heavy feeder crop with high biomass accumulation and extensive water demand.'
  },
  'Cotton': {
    idealRainfallMm: 750,
    rainfallRange: [450, 1200],
    idealFertilizerKg: 110,
    fertilizerRange: [40, 200],
    baseYieldTonnesPerHa: 1.85,
    maxPotentialYield: 3.4,
    standardSeasons: ['Kharif'],
    category: 'Cash Crop',
    description: 'Deep black soil commercial fiber crop; sensitive to vegetative overgrowth under excessive water.'
  },
  'Maize': {
    idealRainfallMm: 680,
    rainfallRange: [400, 1100],
    idealFertilizerKg: 120,
    fertilizerRange: [40, 200],
    baseYieldTonnesPerHa: 3.4,
    maxPotentialYield: 5.8,
    standardSeasons: ['Kharif', 'Rabi', 'Zaid'],
    category: 'Cereal',
    description: 'Versatile C4 cereal with high photosynthetic efficiency and moderate drought tolerance.'
  },
  'Chickpea (Gram)': {
    idealRainfallMm: 380,
    rainfallRange: [200, 600],
    idealFertilizerKg: 45,
    fertilizerRange: [20, 90],
    baseYieldTonnesPerHa: 1.25,
    maxPotentialYield: 2.2,
    standardSeasons: ['Rabi'],
    category: 'Pulse',
    description: 'Biological nitrogen-fixing legume; excess nitrogen causes vegetative lodging rather than pod yield.'
  },
  'Mustard': {
    idealRainfallMm: 350,
    rainfallRange: [180, 550],
    idealFertilizerKg: 75,
    fertilizerRange: [30, 130],
    baseYieldTonnesPerHa: 1.55,
    maxPotentialYield: 2.6,
    standardSeasons: ['Rabi'],
    category: 'Oilseed',
    description: 'Cool season oilseed with high sulfur sensitivity and low moisture stress tolerance during flowering.'
  },
  'Groundnut': {
    idealRainfallMm: 620,
    rainfallRange: [400, 950],
    idealFertilizerKg: 65,
    fertilizerRange: [25, 120],
    baseYieldTonnesPerHa: 1.95,
    maxPotentialYield: 3.2,
    standardSeasons: ['Kharif', 'Zaid'],
    category: 'Oilseed',
    description: 'Subterranean pod development legume requiring light friable soil and moisture at pegging.'
  },
  'Soybean': {
    idealRainfallMm: 850,
    rainfallRange: [550, 1300],
    idealFertilizerKg: 70,
    fertilizerRange: [30, 130],
    baseYieldTonnesPerHa: 1.75,
    maxPotentialYield: 2.9,
    standardSeasons: ['Kharif'],
    category: 'Oilseed',
    description: 'Major rainfed Kharif oilseed in central India; vulnerable to prolonged dry spells during pod fill.'
  },
  'Bajra (Pearl Millet)': {
    idealRainfallMm: 380,
    rainfallRange: [200, 650],
    idealFertilizerKg: 60,
    fertilizerRange: [20, 110],
    baseYieldTonnesPerHa: 1.65,
    maxPotentialYield: 2.8,
    standardSeasons: ['Kharif', 'Zaid'],
    category: 'Cereal',
    description: 'Extremely drought-resilient millets thriving in arid western plains with minimal inputs.'
  }
};

export const SEASONS: IndianSeason[] = ['Kharif', 'Rabi', 'Zaid', 'Whole Year'];

export const DEFAULT_PREDICTION_INPUT: PredictionInput = {
  state: 'Punjab',
  crop: 'Wheat',
  season: 'Rabi',
  rainfallMm: 480,
  fertilizerKg: 135,
  cultivatedAreaHa: 25
};

export const SAMPLE_INPUT_PRESETS: { title: string; subtitle: string; input: PredictionInput }[] = [
  {
    title: 'Punjab Wheat Belt (Rabi)',
    subtitle: 'High-input intensive cultivation with optimal irrigation',
    input: {
      state: 'Punjab',
      crop: 'Wheat',
      season: 'Rabi',
      rainfallMm: 460,
      fertilizerKg: 140,
      cultivatedAreaHa: 30
    }
  },
  {
    title: 'West Bengal Paddy (Kharif)',
    subtitle: 'High-rainfall deltaic alluvial monsoon paddy',
    input: {
      state: 'West Bengal',
      crop: 'Rice (Paddy)',
      season: 'Kharif',
      rainfallMm: 1650,
      fertilizerKg: 130,
      cultivatedAreaHa: 18
    }
  },
  {
    title: 'Maharashtra Sugarcane (Perennial)',
    subtitle: 'Heavy biomass feeder in western canal command zones',
    input: {
      state: 'Maharashtra',
      crop: 'Sugarcane',
      season: 'Whole Year',
      rainfallMm: 1200,
      fertilizerKg: 310,
      cultivatedAreaHa: 12
    }
  },
  {
    title: 'Madhya Pradesh Soybean (Kharif)',
    subtitle: 'Rainfed black soil pulse/oilseed belt with seasonal variations',
    input: {
      state: 'Madhya Pradesh',
      crop: 'Soybean',
      season: 'Kharif',
      rainfallMm: 980,
      fertilizerKg: 75,
      cultivatedAreaHa: 45
    }
  },
  {
    title: 'Rajasthan Bajra (Dryland)',
    subtitle: 'Arid climate pearl millet with low fertilizer input',
    input: {
      state: 'Rajasthan',
      crop: 'Bajra (Pearl Millet)',
      season: 'Kharif',
      rainfallMm: 340,
      fertilizerKg: 50,
      cultivatedAreaHa: 60
    }
  }
];

export const REAL_TRAINED_BENCHMARKS: ModelBenchmark[] = [
  {
    modelId: 'XGB',
    modelName: 'XGBoost Regressor',
    category: 'Gradient Boosted Trees',
    r2Score: 0.994,
    maeTonnesPerHa: 0.422,
    rmseTonnesPerHa: 1.240,
    trainingTimeSec: 0.152,
    inferenceTimeMs: 0.008,
    parameterCount: 1240,
    pros: [
      'Top predictive accuracy (R² = 0.994) across 1,500 Ministry of Agriculture records',
      'Ultra-low inference latency (0.008 ms/sample)',
      'Optimal handling of tabular splits across diverse Indian states and crops'
    ],
    limitations: [
      'Tree boundaries step discretely rather than modeling continuous biological curves'
    ]
  },
  {
    modelId: 'RF',
    modelName: 'Random Forest Regressor (100 Trees)',
    category: 'Classical Tree Ensemble',
    r2Score: 0.993,
    maeTonnesPerHa: 0.474,
    rmseTonnesPerHa: 1.334,
    trainingTimeSec: 0.485,
    inferenceTimeMs: 0.190,
    parameterCount: 94778,
    pros: [
      'Near-perfect test R² (0.993) on held-out 20% test split',
      'Strong robustness against sensor noise in rainfall and fertilizer surveys',
      'Requires zero feature scaling to perform'
    ],
    limitations: [
      'Large model size (94,778 tree decision nodes)',
      'Cannot extrapolate outside historical label bounds'
    ]
  },
  {
    modelId: 'Ridge',
    modelName: 'Ridge Regression (L2 Regularized)',
    category: 'Classical Linear',
    r2Score: 0.981,
    maeTonnesPerHa: 1.398,
    rmseTonnesPerHa: 2.204,
    trainingTimeSec: 0.003,
    inferenceTimeMs: 0.002,
    parameterCount: 28,
    pros: [
      'Near-instantaneous training (3.2 ms) and inference (0.002 ms)',
      'Closed-form convex optimization guarantees'
    ],
    limitations: [
      'Under-fits subtle non-linear moisture-fertilizer saturation curves (MAE 1.398 t/ha)'
    ]
  },
  {
    modelId: 'VQR',
    modelName: 'Variational Quantum Regressor (VQR)',
    category: 'Quantum Variational (PennyLane)',
    r2Score: 0.214,
    maeTonnesPerHa: 7.175,
    rmseTonnesPerHa: 14.974,
    trainingTimeSec: 4.94,
    inferenceTimeMs: 13.72,
    parameterCount: 24,
    quantumQubits: 4,
    circuitDepth: 18,
    pros: [
      'Trained using real PennyLane default.qubit simulator with StronglyEntanglingLayers',
      'Parameter compression: only 24 variational angles across 4 qubits',
      'Empirical loss convergence demonstrated across Adam gradient steps'
    ],
    limitations: [
      'Shallow 4-qubit circuit faces capacity bottleneck on wide multi-crop yield dynamic ranges (1.2 to 75 t/ha)',
      'Significantly higher simulation latency on classical CPU (13.72 ms vs 0.008 ms for XGBoost)'
    ]
  }
];

export const SIMULATED_DEMO_BENCHMARKS: ModelBenchmark[] = [
  {
    modelId: 'VQR',
    modelName: 'Variational Quantum Regressor (VQR Demo)',
    category: 'Quantum Variational',
    r2Score: 0.894,
    maeTonnesPerHa: 0.284,
    rmseTonnesPerHa: 0.381,
    trainingTimeSec: 42.6,
    inferenceTimeMs: 312,
    parameterCount: 36,
    quantumQubits: 6,
    circuitDepth: 18,
    pros: [
      'Encodes non-linear agro-meteorological cross-features via 2-qubit ZZ feature maps without manual feature engineering',
      'High sample efficiency on sparse regional trial datasets',
      'Robust generalization across extreme anomalous rainfall regimes'
    ],
    limitations: [
      'Higher execution latency in classical statevector simulators',
      'Requires barren plateau mitigation in deep circuit ansatze'
    ]
  },
  {
    modelId: 'XGB',
    modelName: 'XGBoost Regressor (Demo)',
    category: 'Gradient Boosted',
    r2Score: 0.876,
    maeTonnesPerHa: 0.318,
    rmseTonnesPerHa: 0.412,
    trainingTimeSec: 3.4,
    inferenceTimeMs: 84,
    parameterCount: 1240,
    pros: [
      'Fast inference latency on standard server hardware',
      'Native handling of tabular decision splits and feature importances'
    ],
    limitations: [
      'Step-wise piecewise predictions struggle with smooth biological saturation curves'
    ]
  },
  {
    modelId: 'RF',
    modelName: 'Random Forest Regressor (Demo)',
    category: 'Classical Tree Ensemble',
    r2Score: 0.852,
    maeTonnesPerHa: 0.349,
    rmseTonnesPerHa: 0.448,
    trainingTimeSec: 1.8,
    inferenceTimeMs: 46,
    parameterCount: 3800,
    pros: [
      'High resistance to outlier noise in field survey logs',
      'Zero hyperparameter tuning required'
    ],
    limitations: [
      'Cannot extrapolate yield beyond the bounding box of historical training labels'
    ]
  },
  {
    modelId: 'Ridge',
    modelName: 'Ridge Regression (Demo)',
    category: 'Classical Linear',
    r2Score: 0.714,
    maeTonnesPerHa: 0.495,
    rmseTonnesPerHa: 0.628,
    trainingTimeSec: 0.08,
    inferenceTimeMs: 9,
    parameterCount: 12,
    pros: ['Near-instantaneous execution', 'Fully interpretable linear coefficients'],
    limitations: ['Cannot capture non-linear fertilizer-water interactions']
  }
];

export const BENCHMARK_MODELS: ModelBenchmark[] = REAL_TRAINED_BENCHMARKS;

export const HISTORICAL_RECORDS: AgriDatasetRecord[] = [
  { id: 'REC-001', state: 'Punjab', crop: 'Wheat', season: 'Rabi', year: 2023, rainfallMm: 490, fertilizerKg: 145, cultivatedAreaHa: 28, yieldTonnesPerHa: 5.12, totalProductionTonnes: 143.36, soilZone: 'Trans-Gangetic Plains' },
  { id: 'REC-002', state: 'Punjab', crop: 'Rice (Paddy)', season: 'Kharif', year: 2023, rainfallMm: 680, fertilizerKg: 155, cultivatedAreaHa: 35, yieldTonnesPerHa: 4.38, totalProductionTonnes: 153.3, soilZone: 'Trans-Gangetic Plains' },
  { id: 'REC-003', state: 'Haryana', crop: 'Wheat', season: 'Rabi', year: 2023, rainfallMm: 440, fertilizerKg: 140, cultivatedAreaHa: 22, yieldTonnesPerHa: 4.88, totalProductionTonnes: 107.36, soilZone: 'Trans-Gangetic Plains' },
  { id: 'REC-004', state: 'Haryana', crop: 'Mustard', season: 'Rabi', year: 2023, rainfallMm: 310, fertilizerKg: 85, cultivatedAreaHa: 15, yieldTonnesPerHa: 1.84, totalProductionTonnes: 27.6, soilZone: 'Trans-Gangetic Plains' },
  { id: 'REC-005', state: 'Uttar Pradesh', crop: 'Sugarcane', season: 'Whole Year', year: 2023, rainfallMm: 1020, fertilizerKg: 290, cultivatedAreaHa: 40, yieldTonnesPerHa: 76.4, totalProductionTonnes: 3056.0, soilZone: 'Upper Gangetic Plain' },
  { id: 'REC-006', state: 'Uttar Pradesh', crop: 'Wheat', season: 'Rabi', year: 2023, rainfallMm: 410, fertilizerKg: 125, cultivatedAreaHa: 50, yieldTonnesPerHa: 3.82, totalProductionTonnes: 191.0, soilZone: 'Upper Gangetic Plain' },
  { id: 'REC-007', state: 'Uttar Pradesh', crop: 'Rice (Paddy)', season: 'Kharif', year: 2023, rainfallMm: 980, fertilizerKg: 135, cultivatedAreaHa: 45, yieldTonnesPerHa: 3.25, totalProductionTonnes: 146.25, soilZone: 'Middle Gangetic Plain' },
  { id: 'REC-008', state: 'Madhya Pradesh', crop: 'Soybean', season: 'Kharif', year: 2023, rainfallMm: 1050, fertilizerKg: 78, cultivatedAreaHa: 60, yieldTonnesPerHa: 1.82, totalProductionTonnes: 109.2, soilZone: 'Central Plateau' },
  { id: 'REC-009', state: 'Madhya Pradesh', crop: 'Chickpea (Gram)', season: 'Rabi', year: 2023, rainfallMm: 340, fertilizerKg: 48, cultivatedAreaHa: 30, yieldTonnesPerHa: 1.34, totalProductionTonnes: 40.2, soilZone: 'Central Plateau' },
  { id: 'REC-010', state: 'Maharashtra', crop: 'Sugarcane', season: 'Whole Year', year: 2023, rainfallMm: 1180, fertilizerKg: 320, cultivatedAreaHa: 25, yieldTonnesPerHa: 84.6, totalProductionTonnes: 2115.0, soilZone: 'Western Plateau' },
  { id: 'REC-011', state: 'Maharashtra', crop: 'Cotton', season: 'Kharif', year: 2023, rainfallMm: 820, fertilizerKg: 115, cultivatedAreaHa: 55, yieldTonnesPerHa: 1.94, totalProductionTonnes: 106.7, soilZone: 'Western Plateau' },
  { id: 'REC-012', state: 'Maharashtra', crop: 'Soybean', season: 'Kharif', year: 2023, rainfallMm: 910, fertilizerKg: 72, cultivatedAreaHa: 40, yieldTonnesPerHa: 1.76, totalProductionTonnes: 70.4, soilZone: 'Western Plateau' },
  { id: 'REC-013', state: 'West Bengal', crop: 'Rice (Paddy)', season: 'Kharif', year: 2023, rainfallMm: 1720, fertilizerKg: 128, cultivatedAreaHa: 20, yieldTonnesPerHa: 3.94, totalProductionTonnes: 78.8, soilZone: 'Lower Gangetic Plain' },
  { id: 'REC-014', state: 'West Bengal', crop: 'Rice (Paddy)', season: 'Rabi', year: 2023, rainfallMm: 450, fertilizerKg: 140, cultivatedAreaHa: 16, yieldTonnesPerHa: 4.22, totalProductionTonnes: 67.52, soilZone: 'Lower Gangetic Plain' },
  { id: 'REC-015', state: 'Rajasthan', crop: 'Bajra (Pearl Millet)', season: 'Kharif', year: 2023, rainfallMm: 390, fertilizerKg: 52, cultivatedAreaHa: 70, yieldTonnesPerHa: 1.71, totalProductionTonnes: 119.7, soilZone: 'Western Dry Zone' },
  { id: 'REC-016', state: 'Rajasthan', crop: 'Mustard', season: 'Rabi', year: 2023, rainfallMm: 290, fertilizerKg: 78, cultivatedAreaHa: 35, yieldTonnesPerHa: 1.62, totalProductionTonnes: 56.7, soilZone: 'Western Dry Zone' },
  { id: 'REC-017', state: 'Gujarat', crop: 'Groundnut', season: 'Kharif', year: 2023, rainfallMm: 790, fertilizerKg: 70, cultivatedAreaHa: 30, yieldTonnesPerHa: 2.15, totalProductionTonnes: 64.5, soilZone: 'Gujarat Plains' },
  { id: 'REC-018', state: 'Gujarat', crop: 'Cotton', season: 'Kharif', year: 2023, rainfallMm: 860, fertilizerKg: 122, cultivatedAreaHa: 48, yieldTonnesPerHa: 2.24, totalProductionTonnes: 107.52, soilZone: 'Gujarat Plains' },
  { id: 'REC-019', state: 'Andhra Pradesh', crop: 'Rice (Paddy)', season: 'Kharif', year: 2023, rainfallMm: 1040, fertilizerKg: 148, cultivatedAreaHa: 25, yieldTonnesPerHa: 4.10, totalProductionTonnes: 102.5, soilZone: 'Southern Plateau' },
  { id: 'REC-020', state: 'Andhra Pradesh', crop: 'Cotton', season: 'Kharif', year: 2023, rainfallMm: 880, fertilizerKg: 118, cultivatedAreaHa: 32, yieldTonnesPerHa: 1.88, totalProductionTonnes: 60.16, soilZone: 'Southern Plateau' },
  { id: 'REC-021', state: 'Karnataka', crop: 'Maize', season: 'Kharif', year: 2023, rainfallMm: 740, fertilizerKg: 124, cultivatedAreaHa: 28, yieldTonnesPerHa: 3.86, totalProductionTonnes: 108.08, soilZone: 'Southern Plateau' },
  { id: 'REC-022', state: 'Karnataka', crop: 'Groundnut', season: 'Kharif', year: 2023, rainfallMm: 680, fertilizerKg: 64, cultivatedAreaHa: 22, yieldTonnesPerHa: 1.78, totalProductionTonnes: 39.16, soilZone: 'Southern Plateau' },
  { id: 'REC-023', state: 'Tamil Nadu', crop: 'Rice (Paddy)', season: 'Kharif', year: 2023, rainfallMm: 1020, fertilizerKg: 142, cultivatedAreaHa: 19, yieldTonnesPerHa: 4.28, totalProductionTonnes: 81.32, soilZone: 'Southern Plateau' },
  { id: 'REC-024', state: 'Bihar', crop: 'Maize', season: 'Rabi', year: 2023, rainfallMm: 380, fertilizerKg: 135, cultivatedAreaHa: 26, yieldTonnesPerHa: 4.95, totalProductionTonnes: 128.7, soilZone: 'Middle Gangetic Plain' },
  { id: 'REC-025', state: 'Bihar', crop: 'Rice (Paddy)', season: 'Kharif', year: 2023, rainfallMm: 1110, fertilizerKg: 120, cultivatedAreaHa: 34, yieldTonnesPerHa: 2.85, totalProductionTonnes: 96.9, soilZone: 'Middle Gangetic Plain' },
  { id: 'REC-026', state: 'Telangana', crop: 'Cotton', season: 'Kharif', year: 2023, rainfallMm: 920, fertilizerKg: 116, cultivatedAreaHa: 36, yieldTonnesPerHa: 1.90, totalProductionTonnes: 68.4, soilZone: 'Southern Plateau' },
  { id: 'REC-027', state: 'Telangana', crop: 'Rice (Paddy)', season: 'Rabi', year: 2023, rainfallMm: 420, fertilizerKg: 144, cultivatedAreaHa: 24, yieldTonnesPerHa: 4.35, totalProductionTonnes: 104.4, soilZone: 'Southern Plateau' },
  { id: 'REC-028', state: 'Odisha', crop: 'Rice (Paddy)', season: 'Kharif', year: 2023, rainfallMm: 1480, fertilizerKg: 110, cultivatedAreaHa: 38, yieldTonnesPerHa: 2.76, totalProductionTonnes: 104.88, soilZone: 'Eastern Coastal' },
  { id: 'REC-029', state: 'Assam', crop: 'Rice (Paddy)', season: 'Kharif', year: 2023, rainfallMm: 2150, fertilizerKg: 85, cultivatedAreaHa: 20, yieldTonnesPerHa: 2.62, totalProductionTonnes: 52.4, soilZone: 'Eastern Himalayan' },
  { id: 'REC-030', state: 'Kerala', crop: 'Rice (Paddy)', season: 'Kharif', year: 2023, rainfallMm: 2450, fertilizerKg: 95, cultivatedAreaHa: 14, yieldTonnesPerHa: 2.98, totalProductionTonnes: 41.72, soilZone: 'West Coast Plains' }
];

export const CORRELATION_MATRIX_DATA = [
  { featureA: 'Rainfall', featureB: 'Yield (t/ha)', correlation: 0.58, pValue: '<0.001', note: 'Strong positive correlation up to threshold saturation' },
  { featureA: 'Fertilizer NPK', featureB: 'Yield (t/ha)', correlation: 0.69, pValue: '<0.001', note: 'Primary nutrient driving photosynthetic output' },
  { featureA: 'Cultivated Area', featureB: 'Yield (t/ha)', correlation: -0.14, pValue: '0.042', note: 'Slight negative trend due to marginal land dilution' },
  { featureA: 'Rainfall × Fertilizer', featureB: 'Yield (t/ha)', correlation: 0.81, pValue: '<0.001', note: 'Synergistic non-linear interaction captured by VQR entanglement' },
  { featureA: 'Rainfall', featureB: 'Fertilizer', correlation: 0.22, pValue: '0.015', note: 'Moderate correlation in irrigated vs rainfed cropping' }
];
