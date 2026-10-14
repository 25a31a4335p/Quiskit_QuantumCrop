import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Database,
  Search,
  Filter,
  Download,
  Upload,
  ArrowUpDown,
  RefreshCw,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { HISTORICAL_RECORDS, INDIAN_STATES, CROPS_CONFIG, SEASONS } from '../data/agriData';
import { AgriDatasetRecord, IndianCrop, IndianSeason, IndianState } from '../types/agriculture';
import { MetricCard } from '../components/MetricCard';

export const DatasetView: React.FC = () => {
  const [records, setRecords] = useState<AgriDatasetRecord[]>(HISTORICAL_RECORDS);
  const [isLoadingCsv, setIsLoadingCsv] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [selectedCrop, setSelectedCrop] = useState<string>('all');
  const [selectedSeason, setSelectedSeason] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof AgriDatasetRecord>('yieldTonnesPerHa');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [exportedStatus, setExportedStatus] = useState<boolean>(false);

  // Load real 1,500-sample dataset on mount
  useEffect(() => {
    let isMounted = true;
    fetch('/data/indian_crop_yield_dataset.csv')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load dataset CSV');
        return res.text();
      })
      .then((csvText) => {
        if (!isMounted) return;
        const lines = csvText.trim().split('\n');
        if (lines.length > 1) {
          const parsed: AgriDatasetRecord[] = [];
          for (let i = 1; i < lines.length; i++) {
            const cols = lines[i].split(',');
            if (cols.length >= 8) {
              parsed.push({
                id: cols[0],
                state: cols[1] as IndianState,
                crop: cols[2] as IndianCrop,
                season: cols[3] as IndianSeason,
                year: 2023,
                rainfallMm: parseFloat(cols[4]),
                fertilizerKg: parseFloat(cols[5]),
                cultivatedAreaHa: parseFloat(cols[6]),
                yieldTonnesPerHa: parseFloat(cols[7]),
                totalProductionTonnes: cols[8] ? parseFloat(cols[8]) : parseFloat((parseFloat(cols[7]) * parseFloat(cols[6])).toFixed(1)),
                soilZone: 'Alluvial / Agro-Zone'
              });
            }
          }
          if (parsed.length > 0) {
            setRecords(parsed);
          }
        }
        setIsLoadingCsv(false);
      })
      .catch(() => {
        if (isMounted) setIsLoadingCsv(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter & Search Logic
  const filteredRecords = useMemo(() => {
    return records.filter((rec) => {
      const matchesSearch =
        rec.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.season.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesState = selectedState === 'all' || rec.state === selectedState;
      const matchesCrop = selectedCrop === 'all' || rec.crop === selectedCrop;
      const matchesSeason = selectedSeason === 'all' || rec.season === selectedSeason;

      return matchesSearch && matchesState && matchesCrop && matchesSeason;
    }).sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return sortOrder === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [records, searchQuery, selectedState, selectedCrop, selectedSeason, sortField, sortOrder]);

  // Aggregate Metrics for the active filter set
  const stats = useMemo(() => {
    if (filteredRecords.length === 0) {
      return { avgYield: 0, avgRain: 0, avgFert: 0, totalProduction: 0 };
    }
    const totalYield = filteredRecords.reduce((acc, r) => acc + r.yieldTonnesPerHa, 0);
    const totalRain = filteredRecords.reduce((acc, r) => acc + r.rainfallMm, 0);
    const totalFert = filteredRecords.reduce((acc, r) => acc + r.fertilizerKg, 0);
    const totalProd = filteredRecords.reduce((acc, r) => acc + r.totalProductionTonnes, 0);

    return {
      avgYield: (totalYield / filteredRecords.length).toFixed(2),
      avgRain: Math.round(totalRain / filteredRecords.length),
      avgFert: Math.round(totalFert / filteredRecords.length),
      totalProduction: Math.round(totalProd).toLocaleString()
    };
  }, [filteredRecords]);

  const handleSort = (field: keyof AgriDatasetRecord) => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const handleExportCSV = () => {
    const headers = [
      'Record ID',
      'State',
      'Crop',
      'Season',
      'Year',
      'Rainfall (mm)',
      'Fertilizer NPK (kg/ha)',
      'Cultivated Area (ha)',
      'Yield (Tonnes/ha)',
      'Total Production (Tonnes)',
      'Agro-Soil Zone'
    ];

    const rows = filteredRecords.map((r) => [
      r.id,
      r.state,
      `"${r.crop}"`,
      r.season,
      r.year,
      r.rainfallMm,
      r.fertilizerKg,
      r.cultivatedAreaHa,
      r.yieldTonnesPerHa,
      r.totalProductionTonnes,
      `"${r.soilZone}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `QuantumCrop_AI_Dataset_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportedStatus(true);
    setTimeout(() => setExportedStatus(false), 3000);
  };

  const [uploadInfo, setUploadInfo] = useState<{ fileName: string; count: number } | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (!text) {
          setUploadError('The uploaded CSV file is empty.');
          return;
        }

        const lines = text.trim().split('\n');
        if (lines.length < 2) {
          setUploadError('CSV must contain a header row and at least one data row.');
          return;
        }

        // Header detection
        const headers = lines[0].split(',').map((h) => h.trim().replace(/^["']|["']$/g, '').toLowerCase());
        const stateIdx = headers.findIndex((h) => h.includes('state'));
        const cropIdx = headers.findIndex((h) => h.includes('crop'));
        const seasonIdx = headers.findIndex((h) => h.includes('season'));
        const rainIdx = headers.findIndex((h) => h.includes('rain'));
        const fertIdx = headers.findIndex((h) => h.includes('fert'));
        const areaIdx = headers.findIndex((h) => h.includes('area'));
        const yieldIdx = headers.findIndex((h) => h.includes('yield'));

        if (stateIdx === -1 || cropIdx === -1 || rainIdx === -1 || yieldIdx === -1) {
          setUploadError(
            'Missing essential headers in CSV. Expected columns: State, Crop, Season, Rainfall, Fertilizer, Area, Yield.'
          );
          return;
        }

        const parsed: AgriDatasetRecord[] = [];
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;
          const cols = line.split(',').map((c) => c.trim().replace(/^["']|["']$/g, ''));
          const rain = parseFloat(cols[rainIdx]);
          const fert = fertIdx !== -1 ? parseFloat(cols[fertIdx]) : 100;
          const area = areaIdx !== -1 ? parseFloat(cols[areaIdx]) : 10;
          const yld = parseFloat(cols[yieldIdx]);

          if (!isNaN(rain) && !isNaN(yld)) {
            parsed.push({
              id: `UP-${String(i).padStart(4, '0')}`,
              state: cols[stateIdx] as IndianState,
              crop: cols[cropIdx] as IndianCrop,
              season: (seasonIdx !== -1 ? cols[seasonIdx] : 'Kharif') as IndianSeason,
              year: 2024,
              rainfallMm: rain,
              fertilizerKg: isNaN(fert) ? 100 : fert,
              cultivatedAreaHa: isNaN(area) ? 10 : area,
              yieldTonnesPerHa: yld,
              totalProductionTonnes: parseFloat((yld * (isNaN(area) ? 10 : area)).toFixed(1)),
              soilZone: 'Custom User Upload'
            });
          }
        }

        if (parsed.length === 0) {
          setUploadError('No valid data rows could be parsed from the CSV.');
          return;
        }

        setRecords(parsed);
        setUploadInfo({ fileName: file.name, count: parsed.length });
      } catch (err) {
        setUploadError(`Failed to parse CSV: ${err instanceof Error ? err.message : 'Unknown format error'}`);
      }
    };
    reader.readAsText(file);
    // Reset file input so re-uploading same file triggers event
    e.target.value = '';
  };

  const handleRestoreDefaultDataset = () => {
    setUploadInfo(null);
    setUploadError(null);
    setIsLoadingCsv(true);
    fetch('/data/indian_crop_yield_dataset.csv')
      .then((res) => res.text())
      .then((csvText) => {
        const lines = csvText.trim().split('\n');
        const parsed: AgriDatasetRecord[] = [];
        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(',');
          if (cols.length >= 8) {
            parsed.push({
              id: cols[0],
              state: cols[1] as IndianState,
              crop: cols[2] as IndianCrop,
              season: cols[3] as IndianSeason,
              year: 2023,
              rainfallMm: parseFloat(cols[4]),
              fertilizerKg: parseFloat(cols[5]),
              cultivatedAreaHa: parseFloat(cols[6]),
              yieldTonnesPerHa: parseFloat(cols[7]),
              totalProductionTonnes: cols[8] ? parseFloat(cols[8]) : parseFloat((parseFloat(cols[7]) * parseFloat(cols[6])).toFixed(1)),
              soilZone: 'Alluvial / Agro-Zone'
            });
          }
        }
        setRecords(parsed);
        setIsLoadingCsv(false);
      });
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedState('all');
    setSelectedCrop('all');
    setSelectedSeason('all');
    setSortField('yieldTonnesPerHa');
    setSortOrder('desc');
  };

  return (
    <div className="space-y-6">
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Records Filtered"
          value={filteredRecords.length}
          unit={`of ${HISTORICAL_RECORDS.length} total`}
          subtext="ICAR / DES Open Dataset"
          icon={<Database className="w-4 h-4 text-emerald-800" />}
        />
        <MetricCard
          label="Filtered Mean Yield"
          value={stats.avgYield}
          unit="Tonnes / Ha"
          subtext="State-weighted average"
          icon={<FileSpreadsheet className="w-4 h-4 text-emerald-800" />}
        />
        <MetricCard
          label="Average Seasonal Rainfall"
          value={stats.avgRain}
          unit="Millimeters (mm)"
          subtext="Filtered sub-regions"
          badge="Agro-Climatic"
        />
        <MetricCard
          label="Total Cohort Production"
          value={stats.totalProduction}
          unit="Tonnes"
          subtext="Cumulative field output"
          trend={{ value: 'Multi-State', isPositive: true }}
        />
      </div>

      {/* Search & Filter Toolbar */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by state, crop, season, or soil zone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={resetFilters}
              className="px-3 py-2 text-xs font-medium rounded-lg text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-emerald-950 hover:bg-emerald-900 text-white transition-colors flex items-center gap-1.5 shadow-xs"
            >
              {exportedStatus ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />
                  <span>Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-lime-400" />
                  <span>Download CSV</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Dropdown Filters Row */}
        <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {/* State Filter */}
          <div>
            <label className="text-[11px] font-semibold text-slate-500 mb-1 block">
              Filter by State
            </label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-slate-700 focus:outline-none focus:border-emerald-600"
            >
              <option value="all">All Indian States (16)</option>
              {INDIAN_STATES.map((s) => (
                <option key={s.name} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Crop Filter */}
          <div>
            <label className="text-[11px] font-semibold text-slate-500 mb-1 block">
              Filter by Crop
            </label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-slate-700 focus:outline-none focus:border-emerald-600"
            >
              <option value="all">All Crops (10)</option>
              {Object.keys(CROPS_CONFIG).map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Season Filter */}
          <div>
            <label className="text-[11px] font-semibold text-slate-500 mb-1 block">
              Filter by Season
            </label>
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-slate-700 focus:outline-none focus:border-emerald-600"
            >
              <option value="all">All Seasons (Kharif/Rabi/Zaid)</option>
              {SEASONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Dataset Records Table */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-emerald-950 font-sans">
              Indian Agricultural Training Records (ICAR Benchmark)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing {filteredRecords.length} records · Click any column header to sort
            </p>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            Open AgTech Format
          </span>
        </div>

        <div className="mt-4 overflow-x-auto">
          {filteredRecords.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">
              <Database className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="font-semibold text-slate-700">No matching agricultural records found</p>
              <p className="mt-1">Try clearing some filter criteria to expand results.</p>
              <button
                onClick={resetFilters}
                className="mt-3 px-3 py-1.5 text-xs font-semibold bg-emerald-950 text-white rounded-lg hover:bg-emerald-900"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold select-none">
                  <th
                    onClick={() => handleSort('id')}
                    className="pb-3 pl-2 cursor-pointer hover:text-emerald-900"
                  >
                    <div className="flex items-center gap-1">
                      <span>ID</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('state')}
                    className="pb-3 cursor-pointer hover:text-emerald-900"
                  >
                    <div className="flex items-center gap-1">
                      <span>State</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('crop')}
                    className="pb-3 cursor-pointer hover:text-emerald-900"
                  >
                    <div className="flex items-center gap-1">
                      <span>Crop</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('season')}
                    className="pb-3 cursor-pointer hover:text-emerald-900"
                  >
                    <div className="flex items-center gap-1">
                      <span>Season</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('rainfallMm')}
                    className="pb-3 text-right cursor-pointer hover:text-emerald-900"
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Rainfall</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('fertilizerKg')}
                    className="pb-3 text-right cursor-pointer hover:text-emerald-900"
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Fertilizer</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('cultivatedAreaHa')}
                    className="pb-3 text-right cursor-pointer hover:text-emerald-900"
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Area</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('yieldTonnesPerHa')}
                    className="pb-3 text-right cursor-pointer hover:text-emerald-900 font-bold text-emerald-950"
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Yield (t/ha)</span>
                      <ArrowUpDown className="w-3 h-3 text-emerald-700" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('totalProductionTonnes')}
                    className="pb-3 text-right pr-2 cursor-pointer hover:text-emerald-900"
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Total (t)</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 pl-2 font-mono text-slate-400 text-[11px]">
                      {r.id}
                    </td>
                    <td className="py-2.5 font-medium text-slate-900">
                      {r.state}
                    </td>
                    <td className="py-2.5 text-slate-800 font-semibold">
                      {r.crop}
                    </td>
                    <td className="py-2.5 text-slate-600">
                      {r.season}
                    </td>
                    <td className="py-2.5 text-right font-mono tabular-nums text-slate-700">
                      {r.rainfallMm} mm
                    </td>
                    <td className="py-2.5 text-right font-mono tabular-nums text-slate-700">
                      {r.fertilizerKg} kg
                    </td>
                    <td className="py-2.5 text-right font-mono tabular-nums text-slate-600">
                      {r.cultivatedAreaHa} ha
                    </td>
                    <td className="py-2.5 text-right font-mono tabular-nums font-bold text-emerald-950">
                      {r.yieldTonnesPerHa.toFixed(2)}
                    </td>
                    <td className="py-2.5 text-right pr-2 font-mono tabular-nums text-slate-600">
                      {r.totalProductionTonnes.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
