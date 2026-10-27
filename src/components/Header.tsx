import React, { useState, useEffect } from 'react';
import {
  Save,
  CheckCircle2,
  RefreshCw,
  Plus,
  FileSpreadsheet,
  ShieldCheck,
  TrendingUp,
  Layers,
  Sparkles,
  CloudCheck,
  Clock,
} from 'lucide-react';
import { AppFinanceData } from '../types/finance';
import { calculateNetWorth } from '../services/storage';

interface HeaderProps {
  data: AppFinanceData;
  onRealtimeSave: () => void;
  isSaving: boolean;
  lastSavedAt: string | null;
  onOpenNewTransaction: () => void;
  onOpenGoogleSheetModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  data,
  onRealtimeSave,
  isSaving,
  lastSavedAt,
  onOpenNewTransaction,
  onOpenGoogleSheetModal,
}) => {
  const [timeDisplay, setTimeDisplay] = useState<string>('');
  const netWorth = calculateNetWorth(data);

  useEffect(() => {
    const updateTime = () => {
      if (lastSavedAt) {
        const d = new Date(lastSavedAt);
        const timeStr = d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setTimeDisplay(timeStr);
      } else {
        setTimeDisplay('บันทึกแล้ว');
      }
    };
    updateTime();
  }, [lastSavedAt]);

  const hasSheetWebhook = Boolean(data.googleSheetConfig?.webhookUrl?.trim());

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between py-3.5 gap-3.5">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <TrendingUp className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  ระบบบันทึกการเงินส่วนบุคคล
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  ข้อมูลปัจจุบันสดใหม่
                </span>
              </div>
              <p className="text-xs text-slate-750 flex items-center gap-1.5 mt-0.5">
                <span>แยกเงินเดือน • เงินเก็บ • สหกรณ์ • ทองคำ • ประกัน</span>
                <span className="inline-block w-1 h-1 rounded-full bg-slate-300"></span>
                <span className="text-emerald-700 font-medium">บันทึกทับไม่รีเซ็ต</span>
              </p>
            </div>
          </div>

          {/* Action Toolbar: Real-time Save & Controls */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            {/* Net worth summary pill */}
            <div className="hidden lg:flex flex-col items-end px-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[11px] font-medium text-slate-500">สินทรัพย์สุทธิรวม</span>
              <span className="text-base font-bold text-slate-800">
                ฿{netWorth.toLocaleString()}
              </span>
            </div>

            {/* Google Sheets Status Pill / Trigger */}
            <button
              onClick={onOpenGoogleSheetModal}
              title="ตั้งค่าและสำรองข้อมูล Google Sheets"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all border ${
                hasSheetWebhook
                  ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
                  : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">
                {hasSheetWebhook ? 'Google Sheet: เชื่อมต่อแล้ว' : 'เชื่อมต่อ Google Sheet'}
              </span>
              <span className="sm:hidden">Sheets</span>
              <span
                className={`w-2 h-2 rounded-full ${
                  hasSheetWebhook ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'
                }`}
              />
            </button>

            {/* REAL-TIME SAVE BUTTON (Requested by user) */}
            <button
              type="button"
              onClick={onRealtimeSave}
              disabled={isSaving}
              className="relative group flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-[0.98] shadow-md shadow-emerald-600/25 transition-all cursor-pointer disabled:opacity-75"
            >
              {isSaving ? (
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
              ) : (
                <Save className="w-4 h-4 text-white" />
              )}
              <div className="text-left leading-tight">
                <div className="font-bold flex items-center gap-1">
                  <span>บันทึก Real-time</span>
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-200 animate-ping"></span>
                </div>
                <div className="text-[10px] text-emerald-100 font-normal">
                  {lastSavedAt ? `ล่าสุด ${timeDisplay} น.` : 'พร้อมบันทึก'}
                </div>
              </div>
            </button>

            {/* Quick Add Transaction Button */}
            <button
              type="button"
              onClick={onOpenNewTransaction}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:scale-[0.98] transition-all cursor-pointer border border-slate-200"
            >
              <Plus className="w-4 h-4 text-slate-600" />
              <span>บันทึกรายการ</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
