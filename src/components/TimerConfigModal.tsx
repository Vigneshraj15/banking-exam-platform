import React, { useState } from 'react';
import { Clock, Play, X, Zap, Check, AlertCircle } from 'lucide-react';
import { Exam } from '../types';

interface TimerConfigModalProps {
  isOpen: boolean;
  exam: Exam | null;
  onClose: () => void;
  onConfirmStart: (exam: Exam, chosenDurationMinutes: number) => void;
}

export const TimerConfigModal: React.FC<TimerConfigModalProps> = ({
  isOpen,
  exam,
  onClose,
  onConfirmStart
}) => {
  if (!isOpen || !exam) return null;

  const presets = [5, 10, 15, 20, 25, 30, 35];
  
  // Default to 25 if ~25 questions, or closest preset
  const defaultPreset = exam.totalQuestions >= 20 ? 25 : (presets.find(p => p >= exam.totalQuestions) || 20);
  const [selectedDuration, setSelectedDuration] = useState<number>(defaultPreset);
  const [customInput, setCustomInput] = useState<string>('');

  const handleSelectPreset = (m: number) => {
    setSelectedDuration(m);
    setCustomInput('');
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setCustomInput(val);
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed) && parsed > 0 && parsed <= 240) {
      setSelectedDuration(parsed);
    }
  };

  const handleStart = () => {
    const finalMinutes = selectedDuration > 0 ? selectedDuration : 20;
    try {
      if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } catch (e) {}
    onConfirmStart(exam, finalMinutes);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-[#1f3f6c] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-amber-400 text-slate-900 rounded-lg font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">
                Select Exam Duration Timer
              </h3>
              <p className="text-xs text-blue-200">
                Choose a time limit for your test session
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-white hover:text-slate-200 p-1 rounded-full hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Exam info summary */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
            <h4 className="font-bold text-slate-800 text-sm">{exam.title}</h4>
            <div className="flex items-center space-x-3 text-xs text-slate-500 mt-1">
              <span>Total Questions: <strong className="text-slate-700">{exam.totalQuestions} Qs</strong></span>
              <span>•</span>
              <span>Total Marks: <strong className="text-slate-700">{exam.totalMarks}</strong></span>
            </div>
          </div>

          {/* Presets Grid: 5, 10, 15, 20, 25, 30, 35 */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-2 uppercase tracking-wider">
              Quick Timer Presets (Minutes):
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {presets.map(mins => {
                const isSelected = selectedDuration === mins && !customInput;
                return (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => handleSelectPreset(mins)}
                    className={`py-2.5 px-2 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center border-2 ${
                      isSelected
                        ? 'bg-[#1f3f6c] text-white border-[#1f3f6c] shadow-md scale-105'
                        : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <span className="text-sm">{mins}</span>
                    <span className="text-[10px] font-normal opacity-80">min</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Duration Input */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Or Enter Custom Time (Minutes):
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="e.g. 45"
                value={customInput}
                onChange={handleCustomChange}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-600 focus:outline-none"
              />
              <span className="text-xs text-slate-500 font-semibold whitespace-nowrap">Minutes</span>
            </div>
          </div>

          {/* Selected Duration Banner */}
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-center justify-between text-xs text-amber-900">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>Selected Timer Duration:</span>
            </div>
            <span className="font-extrabold text-sm text-[#1f3f6c]">
              {selectedDuration} Minutes ({selectedDuration * 60} Seconds)
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-xs text-slate-600 hover:text-slate-800 font-semibold px-3 py-1.5"
          >
            Cancel
          </button>

          <button
            onClick={handleStart}
            className="bg-[#2e7d32] hover:bg-[#256628] text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow transition flex items-center space-x-1.5"
          >
            <Play className="w-4 h-4" />
            <span>Start Exam ({selectedDuration}:00)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
