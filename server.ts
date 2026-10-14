import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '25mb' }));

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'QuantumCrop AI Backend',
    pennylaneEnabled: true,
    timestamp: new Date().toISOString()
  });
});

// Quantum Architecture Configuration & Capabilities
app.get('/api/quantum/config', (req: Request, res: Response) => {
  res.json({
    qubitsRange: { min: 2, max: 12, default: 4 },
    layersRange: { min: 1, max: 8, default: 2 },
    entanglementStrategies: ['linear', 'circular', 'nearest-neighbor'],
    optimizers: ['Adam', 'GradientDescent', 'COBYLA'],
    encoding: 'AngleEmbedding (Sigmoid scaled into [0, π])',
    measurement: 'Pauli-Z Expectation Value ⟨Z⟩ across all qubit wires',
    readout: 'Trainable classical linear layer: Ŷ_norm = ∑ w_i ⟨Z_i⟩ + b'
  });
});

// Train PennyLane VQR Model Endpoint
app.post('/api/quantum/train', (req: Request, res: Response) => {
  const {
    qubits = 4,
    layers = 2,
    entanglement = 'linear',
    optimizer = 'Adam',
    epochs = 8,
    learningRate = 0.08,
    csvPath,
    csvContent
  } = req.body;

  // Validation
  const q = Math.max(2, Math.min(12, parseInt(qubits, 10) || 4));
  const l = Math.max(1, Math.min(8, parseInt(layers, 10) || 2));
  const ep = Math.max(1, Math.min(50, parseInt(epochs, 10) || 8));
  const lr = Math.max(0.001, Math.min(0.5, parseFloat(learningRate) || 0.08));

  let resolvedCsvPath = csvPath || '/src/data/indian_crop_yield_dataset.csv';
  if (!fs.existsSync(resolvedCsvPath)) {
    resolvedCsvPath = '/public/data/indian_crop_yield_dataset.csv';
  }

  // Handle temporary CSV upload if provided
  let tempCsvCreated = false;
  let customCsvPath = resolvedCsvPath;
  if (csvContent && typeof csvContent === 'string' && csvContent.trim().length > 0) {
    customCsvPath = `/tmp/user_agri_upload_${Date.now()}.csv`;
    try {
      fs.writeFileSync(customCsvPath, csvContent, 'utf-8');
      tempCsvCreated = true;
    } catch (err) {
      console.warn('Failed to write temporary upload CSV, falling back to default:', err);
      customCsvPath = resolvedCsvPath;
    }
  }

  const scriptPath = path.resolve('python_pipeline', 'dynamic_vqr.py');
  const pythonArgs = [
    scriptPath,
    '--qubits', q.toString(),
    '--layers', l.toString(),
    '--entanglement', entanglement,
    '--optimizer', optimizer,
    '--epochs', ep.toString(),
    '--learning-rate', lr.toString(),
    '--csv-path', customCsvPath
  ];

  console.log(`[Python PennyLane API] Spawning: python3 ${pythonArgs.join(' ')}`);

  const pyProcess = spawn('python3', pythonArgs);

  let stdoutData = '';
  let stderrData = '';

  pyProcess.stdout.on('data', (chunk) => {
    stdoutData += chunk.toString();
  });

  pyProcess.stderr.on('data', (chunk) => {
    stderrData += chunk.toString();
  });

  pyProcess.on('close', (code) => {
    if (tempCsvCreated) {
      try {
        fs.unlinkSync(customCsvPath);
      } catch (e) {
        // ignore
      }
    }

    if (code !== 0) {
      console.error(`[Python PennyLane API] Error (exit code ${code}):`, stderrData);
      return res.status(500).json({
        success: false,
        error: `Python PennyLane training exited with code ${code}`,
        details: stderrData || stdoutData
      });
    }

    try {
      // Find JSON block between __JSON_START__ and __JSON_END__
      const startTag = '__JSON_START__';
      const endTag = '__JSON_END__';
      const startIndex = stdoutData.indexOf(startTag);
      const endIndex = stdoutData.indexOf(endTag);

      let jsonStr = stdoutData;
      if (startIndex !== -1 && endIndex !== -1) {
        jsonStr = stdoutData.substring(startIndex + startTag.length, endIndex).trim();
      }

      const parsed = JSON.parse(jsonStr);
      return res.json(parsed);
    } catch (parseErr: any) {
      console.error('[Python PennyLane API] JSON Parse Error:', parseErr, stdoutData);
      return res.status(500).json({
        success: false,
        error: 'Failed to parse PennyLane training output',
        rawOutput: stdoutData
      });
    }
  });

  pyProcess.on('error', (err) => {
    console.error('[Python PennyLane API] Process Error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to spawn Python process',
      details: err.message
    });
  });
});

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve('dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[QuantumCrop AI] Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[Server Startup Failure]:', err);
});
