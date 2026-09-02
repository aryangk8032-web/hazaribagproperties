import React, { useState } from 'react';
import { X, ArrowRightLeft, Calculator, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AreaUnit } from '../../types/property';
import { convertArea } from '../../utils/formatters';

export const UnitConverterModal: React.FC = () => {
  const { isUnitConverterOpen, closeUnitConverterModal } = useApp();
  const [value, setValue] = useState<number>(1);
  const [fromUnit, setFromUnit] = useState<AreaUnit>('decimal');

  if (!isUnitConverterOpen) return null;

  const units: { key: AreaUnit; label: string; desc: string }[] = [
    { key: 'decimal', label: 'Decimal / Dismil', desc: 'Standard unit in Jharkhand (1 Decimal = 435.6 sq.ft)' },
    { key: 'sq.ft', label: 'Square Feet (sq.ft)', desc: 'Standard apartment & urban metric' },
    { key: 'katha', label: 'Katha (Hazaribagh standard)', desc: '1 Katha ≈ 1.65 Decimal (approx. 720 sq.ft)' },
    { key: 'acre', label: 'Acre', desc: '1 Acre = 100 Decimal (43,560 sq.ft)' },
    { key: 'sq.m', label: 'Square Meter (sq.m)', desc: '1 sq.m ≈ 10.764 sq.ft' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-xl max-w-md w-full overflow-hidden shadow-xl border border-slate-200 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 relative flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-500/30 flex items-center justify-center">
              <Calculator size={18} className="text-blue-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Land & Area Unit Converter</h3>
              <p className="text-xs text-slate-400">Jharkhand & Hazaribagh standards</p>
            </div>
          </div>
          <button
            onClick={closeUnitConverterModal}
            className="p-1.5 rounded-md bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Converter Form */}
        <div className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
              Enter Value to Convert
            </label>
            <div className="grid grid-cols-5 gap-2">
              <input
                type="number"
                min="0.1"
                step="any"
                value={value || ''}
                onChange={(e) => setValue(parseFloat(e.target.value) || 0)}
                className="col-span-3 px-3.5 py-2.5 border border-slate-200 rounded-md text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                placeholder="1"
              />
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value as AreaUnit)}
                className="col-span-2 px-3 py-2.5 border border-slate-200 rounded-md text-xs font-semibold text-slate-800 bg-slate-50 focus:outline-none focus:border-blue-600 cursor-pointer"
              >
                {units.map(u => (
                  <option key={u.key} value={u.key}>{u.key}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick presets */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-slate-500 font-medium mr-1">Quick:</span>
            {[1, 2.5, 4.5, 5, 10, 20].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setValue(v)}
                className={`text-xs px-2.5 py-1 rounded-md border transition-colors cursor-pointer ${
                  value === v ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {v} {fromUnit}
              </button>
            ))}
          </div>

          {/* Results Table */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
              Equivalent Measurements:
            </span>
            <div className="space-y-2">
              {units.map((u) => {
                const converted = convertArea(value, fromUnit, u.key);
                const isSelected = u.key === fromUnit;
                return (
                  <div
                    key={u.key}
                    className={`flex items-center justify-between p-2.5 rounded-lg border transition-all ${
                      isSelected 
                        ? 'bg-blue-50/70 border-blue-200 text-blue-950 font-semibold' 
                        : 'bg-slate-50/50 border-slate-200/80 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold text-slate-800">{u.label}</span>
                      <p className="text-[11px] text-slate-500">{u.desc}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-sm font-bold ${isSelected ? 'text-blue-600' : 'text-slate-900'}`}>
                        {converted.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-slate-500 ml-1">{u.key}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={closeUnitConverterModal}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md text-xs transition-colors shadow-sm shadow-blue-500/20 cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
