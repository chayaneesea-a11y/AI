import React, { useState } from 'react';
import {
  FileSpreadsheet,
  CloudCheck,
  RefreshCw,
  Copy,
  CheckCircle2,
  Download,
  Upload,
  AlertCircle,
  ExternalLink,
  Code2,
  Clock,
  ShieldCheck,
  Save,
  HelpCircle,
} from 'lucide-react';
import { AppFinanceData, GoogleSheetConfig } from '../types/finance';
import {
  syncToGoogleSheets,
  exportBackupJSON,
  exportTransactionsCSV,
  generateCopyableGoogleSheetsData,
  getGoogleAppsScriptTemplate,
  getSavedSnapshots,
} from '../services/storage';

interface GoogleSheetTabProps {
  data: AppFinanceData;
  onUpdateGoogleSheetConfig: (config: GoogleSheetConfig) => void;
  onRestoreData: (restoredData: AppFinanceData) => void;
  onTriggerRealtimeSave: () => void;
}

export const GoogleSheetTab: React.FC<GoogleSheetTabProps> = ({
  data,
  onUpdateGoogleSheetConfig,
  onRestoreData,
  onTriggerRealtimeSave,
}) => {
  const [webhookUrl, setWebhookUrl] = useState(data.googleSheetConfig?.webhookUrl || '');
  const [sheetUrl, setSheetUrl] = useState(data.googleSheetConfig?.sheetUrl || '');
  const [autoSync, setAutoSync] = useState(data.googleSheetConfig?.autoSyncOnSave ?? true);

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<{ success: boolean; message: string } | null>(null);

  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedTSV, setCopiedTSV] = useState(false);
  const [showScriptModal, setShowScriptModal] = useState(false);

  const snapshots = getSavedSnapshots();

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateGoogleSheetConfig({
      webhookUrl: webhookUrl.trim(),
      sheetUrl: sheetUrl.trim(),
      autoSyncOnSave: autoSync,
      lastSyncTime: data.googleSheetConfig?.lastSyncTime || null,
      syncStatus: data.googleSheetConfig?.syncStatus || 'idle',
      lastSyncMessage: data.googleSheetConfig?.lastSyncMessage || '',
    });
    setSyncResult({ success: true, message: 'บันทึกการตั้งค่า Google Sheets เรียบร้อยแล้ว' });
    setTimeout(() => setSyncResult(null), 3000);
  };

  const handleManualSync = async () => {
    if (!webhookUrl.trim()) {
      setSyncResult({
        success: false,
        message: 'กรุณากรอก Webhook URL ของ Google Sheet ก่อนทำการซิงค์',
      });
      return;
    }

    setIsSyncing(true);
    setSyncResult(null);

    const res = await syncToGoogleSheets({
      ...data,
      googleSheetConfig: {
        ...data.googleSheetConfig,
        webhookUrl: webhookUrl.trim(),
      },
    });

    setIsSyncing(false);
    setSyncResult(res);

    if (res.success) {
      onUpdateGoogleSheetConfig({
        ...data.googleSheetConfig,
        webhookUrl: webhookUrl.trim(),
        sheetUrl: sheetUrl.trim(),
        autoSyncOnSave: autoSync,
        lastSyncTime: new Date().toISOString(),
        syncStatus: 'success',
        lastSyncMessage: res.message,
      });
    }
  };

  const handleCopyTSV = () => {
    const tsv = generateCopyableGoogleSheetsData(data);
    navigator.clipboard.writeText(tsv).then(() => {
      setCopiedTSV(true);
      setTimeout(() => setCopiedTSV(false), 2500);
    });
  };

  const handleCopyScript = () => {
    const code = getGoogleAppsScriptTemplate();
    navigator.clipboard.writeText(code).then(() => {
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2500);
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && parsed.investments && parsed.transactions) {
          if (
            window.confirm(
              'คุณต้องการนำเข้าไฟล์สำรองข้อมูลนี้ทับข้อมูลปัจจุบันหรือไม่? ระบบจะสร้าง Snapshot ข้อมูลเดิมไว้ป้องกันการสูญหาย'
            )
          ) {
            onRestoreData(parsed);
            alert('นำเข้าไฟล์สำรองข้อมูลเรียบร้อยแล้ว!');
          }
        } else {
          alert('รูปแบบไฟล์สำรองข้อมูลไม่ถูกต้อง');
        }
      } catch (err) {
        alert('เกิดข้อผิดพลาดในการอ่านไฟล์ JSON');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold mb-3">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>ศูนย์สำรองข้อมูล & เชื่อมต่อ Google Sheets แบบ Real-time</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            ป้องกันข้อมูลสูญหาย & บันทึกทับเป็นข้อมูลปัจจุบัน
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/80 mt-1 max-w-2xl">
            ข้อมูลของคุณจะถูกจัดเก็บในเครื่องอย่างปลอดภัยเสมอ และสามารถซิงค์สำรองไปยัง Google Sheets
            ของคุณได้ทุกครั้งที่บันทึกข้อมูลแบบเรียลไทม์
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={onTriggerRealtimeSave}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold rounded-xl text-xs sm:text-sm transition-all shadow-md cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>บันทึก Real-time ทันที</span>
          </button>
        </div>
      </div>

      {/* Main Google Sheets Setup Box */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base sm:text-lg">
                ตั้งค่าเชื่อมต่อ Google Sheet (Webhook Sync)
              </h3>
              <p className="text-xs text-slate-500">
                ส่งข้อมูลบัญชี เงินเดือน สหกรณ์ ทองคำ และประกันชีวิต ไปอัปเดตบน Google Sheet อัตโนมัติ
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowScriptModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            <Code2 className="w-3.5 h-3.5 text-slate-600" />
            <span>ดูโค้ด Apps Script สำเร็จรูป</span>
          </button>
        </div>

        {/* Sync Form */}
        <form onSubmit={handleSaveConfig} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Google Apps Script Webhook URL
            </label>
            <input
              type="url"
              placeholder="https://script.google.com/macros/s/AKfycb.../exec"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-mono text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              นำ URL ที่ได้จากการกด Deploy &gt; Web app ใน Google Apps Script มาวางที่นี่
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              ลิงก์เปิด Google Sheet ของคุณ (ทางเลือก)
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="https://docs.google.com/spreadsheets/d/..."
                value={sheetUrl}
                onChange={(e) => setSheetUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              {sheetUrl && (
                <a
                  href={sheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>เปิดสเปรดชีต</span>
                </a>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="autoSyncCheck"
              checked={autoSync}
              onChange={(e) => setAutoSync(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded-sm focus:ring-emerald-500 cursor-pointer"
            />
            <label htmlFor="autoSyncCheck" className="text-xs text-slate-700 font-medium cursor-pointer">
              ส่งข้อมูลสำรองไปยัง Google Sheet อัตโนมัติทุกครั้งที่กดปุ่ม "บันทึก Real-time"
            </label>
          </div>

          {syncResult && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                syncResult.success
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {syncResult.success ? (
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
              )}
              <span>{syncResult.message}</span>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            <button
              type="submit"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
            >
              บันทึกการตั้งค่า
            </button>

            <button
              type="button"
              onClick={handleManualSync}
              disabled={isSyncing}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'กำลังส่งข้อมูล...' : 'ส่งข้อมูลสำรองไปยัง Google Sheet ตอนนี้'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Alternative 1-Click Methods for Google Sheet */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Card A: 1-Click Copy Table to Clipboard */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                <Copy className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-slate-800 text-base">
                คัดลอกตารางไปวางใน Google Sheet ทันที
              </h4>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              ไม่ต้องตั้งค่า Webhook เพียงกดปุ่มด้านล่าง แล้วเปิด Google Sheet เปล่าๆ จากนั้นกดวาง
              (Ctrl+V) ตารางสรุปพอร์ต สหกรณ์ ทองคำ และรายการเดินบัญชีจะถูกจัดคอลัมน์ให้อย่างสวยงาม
            </p>
          </div>

          <div className="mt-5">
            <button
              onClick={handleCopyTSV}
              className="w-full py-2.5 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              {copiedTSV ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  <span>คัดลอกตารางแล้ว! ไปกด Ctrl+V ใน Google Sheet ได้เลย</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-teal-600" />
                  <span>คัดลอกข้อมูลตารางสำหรับ Google Sheet</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Card B: Download CSV / Excel */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                <Download className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-slate-800 text-base">ดาวน์โหลดไฟล์ CSV สำหรับเปิดใน Sheet</h4>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              ดาวน์โหลดไฟล์ CSV พร้อมรหัส UTF-8 BOM รองรับภาษาไทย 100% สามารถดับเบิ้ลคลิกเปิดดูใน Excel
              หรือ Import เข้า Google Sheets ได้ทันที
            </p>
          </div>

          <div className="mt-5">
            <button
              onClick={() => exportTransactionsCSV(data.transactions)}
              className="w-full py-2.5 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-sky-600" />
              <span>ดาวน์โหลดไฟล์ Transactions CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* JSON File Backup & Snapshots History */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-base">
                สำรองและกู้คืนข้อมูลแบบสมบูรณ์ (JSON File & Local Snapshots)
              </h4>
              <p className="text-xs text-slate-500">
                คุณสามารถดาวน์โหลดไฟล์สำรองข้อมูลไว้เก็บในเครื่อง หรือนำไปเปิดใช้บนอุปกรณ์อื่นได้ทุกที่ทุกเวลา
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => exportBackupJSON(data)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>ดาวน์โหลดไฟล์สำรอง (JSON)</span>
            </button>

            <label className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-semibold cursor-pointer transition-colors border border-emerald-200">
              <Upload className="w-3.5 h-3.5" />
              <span>นำเข้าไฟล์สำรอง</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Snapshots History list */}
        <div className="mt-4">
          <h5 className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>ประวัติ Snapshot สำรองอัตโนมัติในเครื่อง (บันทึกทับไม่สูญหาย)</span>
          </h5>

          {snapshots.length === 0 ? (
            <p className="text-xs text-slate-400">ยังไม่มีประวัติ Snapshot</p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {snapshots.slice(0, 6).map((s, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="font-medium text-slate-700">
                      {new Date(s.timestamp).toLocaleString('th-TH')}
                    </span>
                    <span className="text-slate-400">• {s.summary}</span>
                  </div>
                  <button
                    onClick={() => {
                      if (window.confirm('คุณต้องการโหลดข้อมูลจากฉบับนี้กลับมาใช้งานหรือไม่?')) {
                        onRestoreData(s.data);
                      }
                    }}
                    className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold cursor-pointer underline"
                  >
                    กู้คืนฉบับนี้
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal: Google Apps Script Template */}
      {showScriptModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-800">
                  คู่มือและโค้ด Google Apps Script สำรองข้อมูล
                </h3>
              </div>
              <button
                onClick={() => setShowScriptModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs text-slate-600">
              <p className="font-semibold text-slate-800">ขั้นตอนการติดตั้ง (ทำเพียงครั้งเดียว 20 วินาที):</p>
              <ol className="list-decimal list-inside space-y-1.5 pl-1">
                <li>เปิด Google Sheet ใหม่ในเบราว์เซอร์ของคุณ</li>
                <li>ไปที่เมนูด้านบน: <strong>ส่วนขยาย (Extensions) &gt; Apps Script</strong></li>
                <li>ลบโค้ดเดิมทั้งหมดในหน้าต่างสคริปต์ แล้ววางโค้ดด้านล่างนี้ลงไป</li>
                <li>
                  กดปุ่มสีน้ำเงิน <strong>"ทำให้ใช้งานได้" (Deploy) &gt; "การทำให้ใช้งานได้ใหม่" (New deployment)</strong>
                </li>
                <li>เลือกประเภทเป็น <strong>เว็บแอป (Web app)</strong></li>
                <li>ในช่อง <em>"ผู้ที่มีสิทธิ์เข้าถึง" (Who has access)</em> ให้เลือก <strong>"ทุกคน" (Anyone)</strong></li>
                <li>กด Deploy แล้วคัดลอก <strong>Web app URL</strong> นำมาวางในช่อง Webhook URL ในระบบนี้</li>
              </ol>

              <div className="mt-3 relative">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-mono text-[11px] text-slate-500">Google Apps Script Code:</span>
                  <button
                    onClick={handleCopyScript}
                    className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-semibold cursor-pointer"
                  >
                    {copiedScript ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>คัดลอกโค้ดแล้ว!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>คัดลอกโค้ดทั้งหมด</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-3 bg-slate-900 text-slate-200 rounded-xl font-mono text-[11px] max-h-64 overflow-y-auto">
                  {getGoogleAppsScriptTemplate()}
                </pre>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowScriptModal(false)}
                className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
