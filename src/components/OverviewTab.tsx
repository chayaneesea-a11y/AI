import React from 'react';
import {
  Wallet,
  PiggyBank,
  TrendingUp,
  Award,
  Building2,
  Shield,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  ChevronRight,
  Sparkles,
  Edit2,
  Trash2,
  FileSpreadsheet,
} from 'lucide-react';
import { AppFinanceData, Transaction } from '../types/finance';
import { calculateNetWorth } from '../services/storage';

interface OverviewTabProps {
  data: AppFinanceData;
  onNavigateTab: (tab: any) => void;
  onOpenNewTransaction: () => void;
  onEditTransaction: (tx: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  data,
  onNavigateTab,
  onOpenNewTransaction,
  onEditTransaction,
  onDeleteTransaction,
}) => {
  const netWorth = calculateNetWorth(data);

  // 1. เงินเก็บรวม
  const totalSavings = data.savingsAccounts.reduce((sum, a) => sum + (a.balance || 0), 0);

  // 2. สหกรณ์ออมทรัพย์ (เงินฝาก + หุ้น)
  const totalCoopDeposits = data.investments.cooperativeDeposits.reduce((sum, d) => sum + (d.balance || 0), 0);
  const totalCoopShares = data.investments.cooperativeShares.reduce(
    (sum, s) => sum + (s.totalValue || s.shareCount * s.parValue || 0),
    0
  );
  const totalCoop = totalCoopDeposits + totalCoopShares;

  // 3. ทองคำ (ทองสะสม + หุ้นทองคำ)
  const totalPhysicalGold = data.investments.physicalGold.reduce(
    (sum, g) => sum + (g.currentValue || g.weightBaht * g.currentPricePerBaht || 0),
    0
  );
  const totalGoldStocks = data.investments.goldStocks.reduce(
    (sum, s) => sum + (s.currentValue || s.units * s.currentPricePerUnit || 0),
    0
  );
  const totalGold = totalPhysicalGold + totalGoldStocks;

  // 4. ประกันชีวิต
  const totalInsuranceCashValue = data.investments.insurance.reduce(
    (sum, i) => sum + (i.surrenderValue || 0),
    0
  );
  const totalInsuranceCoverage = data.investments.insurance.reduce(
    (sum, i) => sum + (i.sumAssured || 0),
    0
  );

  // 5. สินทรัพย์อื่นๆ
  const totalOther = data.investments.otherInvestments.reduce((sum, o) => sum + (o.currentValue || 0), 0);

  // รวมเงินลงทุน
  const totalInvestments = totalCoop + totalGold + totalInsuranceCashValue + totalOther;

  // คำนวณรายรับ-รายจ่ายเดือนปัจจุบัน
  const currentMonthPrefix = new Date().toISOString().slice(0, 7); // YYYY-MM
  const currentMonthTx = data.transactions.filter((t) => t.date.startsWith(currentMonthPrefix));

  const monthlyIncome = currentMonthTx
    .filter((t) => t.type === 'salary_income' || t.type === 'other_income')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpense = currentMonthTx
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlySavingsFlow = currentMonthTx
    .filter((t) => t.type === 'to_savings')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyInvestFlow = currentMonthTx
    .filter((t) => t.type === 'to_investment')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyNetCashflow = monthlyIncome - monthlyExpense - monthlySavingsFlow - monthlyInvestFlow;

  // คำนวณสัดส่วน %
  const savingsPercent = netWorth > 0 ? ((totalSavings / netWorth) * 100).toFixed(1) : '0';
  const coopPercent = netWorth > 0 ? ((totalCoop / netWorth) * 100).toFixed(1) : '0';
  const goldPercent = netWorth > 0 ? ((totalGold / netWorth) * 100).toFixed(1) : '0';
  const insurancePercent = netWorth > 0 ? ((totalInsuranceCashValue / netWorth) * 100).toFixed(1) : '0';
  const otherPercent = netWorth > 0 ? ((totalOther / netWorth) * 100).toFixed(1) : '0';

  // 5 รายการล่าสุด
  const recentTransactions = [...data.transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Hero Net Worth & High-Level Breakdown Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-60 h-60 rounded-full bg-teal-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ภาพรวมพอร์ตการเงินปัจจุบัน (อัปเดตแบบ Real-time)</span>
            </div>
            <h2 className="text-sm sm:text-base font-medium text-slate-300">
              มูลค่าความมั่งคั่งสุทธิทั้งหมด (Net Worth)
            </h2>
            <div className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mt-1">
              ฿{netWorth.toLocaleString()}
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              รวมทุกบัญชีเงินเก็บ • สหกรณ์ • ทองคำสะสม • กรมธรรม์ประกันชีวิต
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
            <div>
              <div className="text-xs text-slate-400">เงินเก็บสะสม</div>
              <div className="text-base sm:text-lg font-bold text-sky-400">
                ฿{totalSavings.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-400">{savingsPercent}% ของพอร์ต</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">เงินลงทุนรวม</div>
              <div className="text-base sm:text-lg font-bold text-emerald-400">
                ฿{totalInvestments.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-400">
                {netWorth > 0 ? (((totalInvestments) / netWorth) * 100).toFixed(1) : 0}% ของพอร์ต
              </div>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <div className="text-xs text-slate-400">กระแสเงินสดเดือนนี้</div>
              <div className={`text-base sm:text-lg font-bold ${monthlyNetCashflow >= 0 ? 'text-teal-300' : 'text-rose-400'}`}>
                {monthlyNetCashflow >= 0 ? '+' : ''}฿{monthlyNetCashflow.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-400">คงเหลือหลังหักออม</div>
            </div>
          </div>
        </div>

        {/* Portfolio Visual Proportion Bar */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="flex justify-between items-center text-xs text-slate-300 mb-2">
            <span>สัดส่วนการกระจายสินทรัพย์:</span>
            <span className="text-[11px] text-slate-400">คลิกที่การ์ดด้านล่างเพื่อดูรายละเอียด</span>
          </div>
          <div className="h-3.5 w-full bg-slate-700/60 rounded-full overflow-hidden flex shadow-inner">
            {Number(savingsPercent) > 0 && (
              <div
                style={{ width: `${savingsPercent}%` }}
                className="bg-sky-500 h-full transition-all"
                title={`เงินเก็บ: ${savingsPercent}%`}
              />
            )}
            {Number(coopPercent) > 0 && (
              <div
                style={{ width: `${coopPercent}%` }}
                className="bg-indigo-500 h-full transition-all"
                title={`สหกรณ์ออมทรัพย์: ${coopPercent}%`}
              />
            )}
            {Number(goldPercent) > 0 && (
              <div
                style={{ width: `${goldPercent}%` }}
                className="bg-amber-400 h-full transition-all"
                title={`ทองคำ: ${goldPercent}%`}
              />
            )}
            {Number(insurancePercent) > 0 && (
              <div
                style={{ width: `${insurancePercent}%` }}
                className="bg-purple-500 h-full transition-all"
                title={`ประกันชีวิต: ${insurancePercent}%`}
              />
            )}
            {Number(otherPercent) > 0 && (
              <div
                style={{ width: `${otherPercent}%` }}
                className="bg-emerald-500 h-full transition-all"
                title={`อื่นๆ: ${otherPercent}%`}
              />
            )}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2.5 text-[11px] text-slate-300">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span> เงินเก็บ ({savingsPercent}%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span> สหกรณ์ ({coopPercent}%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> ทองคำ ({goldPercent}%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> ประกันชีวิต ({insurancePercent}%)
            </span>
            {Number(otherPercent) > 0 && (
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> อื่นๆ ({otherPercent}%)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 4 Core Fund Segregation Cards (As requested by user) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. เงินเดือน & รายรับรายจ่าย */}
        <div
          onClick={() => onNavigateTab('salary')}
          className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-105 transition-transform">
                <Wallet className="w-5 h-5" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
            </div>
            <h3 className="font-bold text-slate-800 text-base mt-3">เงินเดือน & รายรับ-จ่าย</h3>
            <p className="text-xs text-slate-500 mt-0.5">กระแสเงินสดประจำเดือน</p>
            <div className="mt-4 space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">รายรับเดือนนี้</span>
                <span className="font-semibold text-emerald-600">฿{monthlyIncome.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">รายจ่ายเดือนนี้</span>
                <span className="font-semibold text-rose-500">฿{monthlyExpense.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs pt-1 border-t border-slate-100">
                <span className="text-slate-600 font-medium">คงเหลือสุทธิ</span>
                <span className="font-bold text-slate-800">฿{monthlyNetCashflow.toLocaleString()}</span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-emerald-600 font-medium flex items-center gap-1">
            <span>ดูบันทึกและจัดการเงินเดือน</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* 2. เงินเก็บ */}
        <div
          onClick={() => onNavigateTab('savings')}
          className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-sky-300 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600 group-hover:scale-105 transition-transform">
                <PiggyBank className="w-5 h-5" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 transition-colors" />
            </div>
            <h3 className="font-bold text-slate-800 text-base mt-3">เงินเก็บสะสม</h3>
            <p className="text-xs text-slate-500 mt-0.5">{data.savingsAccounts.length} บัญชีเงินเก็บ</p>
            <div className="mt-4">
              <div className="text-xs text-slate-500">ยอดเงินเก็บทั้งหมด</div>
              <div className="text-xl font-bold text-sky-600 mt-0.5">
                ฿{totalSavings.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                เงินสำรองฉุกเฉิน & บัญชีเป้าหมาย
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-sky-600 font-medium flex items-center gap-1">
            <span>จัดการบัญชีเงินเก็บ</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* 3. สหกรณ์ออมทรัพย์ (เงินฝาก + หุ้นสหกรณ์) */}
        <div
          onClick={() => onNavigateTab('investments')}
          className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-105 transition-transform">
                <Building2 className="w-5 h-5" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
            </div>
            <h3 className="font-bold text-slate-800 text-base mt-3">สหกรณ์ออมทรัพย์</h3>
            <p className="text-xs text-slate-500 mt-0.5">เงินฝากสหกรณ์ & หุ้นสหกรณ์</p>
            <div className="mt-4 space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">เงินฝากสหกรณ์</span>
                <span className="font-semibold text-slate-700">฿{totalCoopDeposits.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">หุ้นสหกรณ์สะสม</span>
                <span className="font-semibold text-slate-700">฿{totalCoopShares.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs pt-1 border-t border-slate-100 font-bold">
                <span className="text-indigo-700">รวมสหกรณ์</span>
                <span className="text-indigo-700">฿{totalCoop.toLocaleString()}</span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-indigo-600 font-medium flex items-center gap-1">
            <span>แก้ไขหุ้นและเงินฝากสหกรณ์</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* 4. ทองคำ (ทองคำสะสม + หุ้นทองคำ) */}
        <div
          onClick={() => onNavigateTab('investments')}
          className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-amber-300 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 group-hover:scale-105 transition-transform">
                <Award className="w-5 h-5" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition-colors" />
            </div>
            <h3 className="font-bold text-slate-800 text-base mt-3">ทองคำ & หุ้นทองคำ</h3>
            <p className="text-xs text-slate-500 mt-0.5">ทองแท่ง/รูปพรรณ & กองทุน</p>
            <div className="mt-4 space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">ทองคำสะสม</span>
                <span className="font-semibold text-slate-700">฿{totalPhysicalGold.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">หุ้นทองคำ / กองทุน</span>
                <span className="font-semibold text-slate-700">฿{totalGoldStocks.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs pt-1 border-t border-slate-100 font-bold">
                <span className="text-amber-700">รวมทองคำ</span>
                <span className="text-amber-700">฿{totalGold.toLocaleString()}</span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-amber-600 font-medium flex items-center gap-1">
            <span>คำนวณกำไรและอัปเดตราคา</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Insurance & Other Investments Quick Highlight */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ประกันชีวิต */}
        <div
          onClick={() => onNavigateTab('investments')}
          className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-base">ประกันชีวิต & กรมธรรม์คุ้มครอง</h4>
              <p className="text-xs text-slate-500">
                มูลค่าเวนคืนเงินสดสะสม: <strong className="text-purple-600">฿{totalInsuranceCashValue.toLocaleString()}</strong>
              </p>
              <p className="text-xs text-slate-500">
                ทุนประกันคุ้มครองชีวิตรวม: <strong className="text-slate-700">฿{totalInsuranceCoverage.toLocaleString()}</strong>
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </div>

        {/* สินทรัพย์อื่นๆ */}
        <div
          onClick={() => onNavigateTab('investments')}
          className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-base">การลงทุนอื่นๆ (กองทุน, หุ้น, สินทรัพย์)</h4>
              <p className="text-xs text-slate-500">
                มูลค่าตลาดรวม: <strong className="text-teal-600">฿{totalOther.toLocaleString()}</strong>
              </p>
              <p className="text-xs text-slate-500">
                {data.investments.otherInvestments.length} รายการสินทรัพย์ที่บันทึกไว้
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </div>
      </div>

      {/* Recent Transactions List with Edit / Delete */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-800 text-base">รายการบันทึกล่าสุด</h3>
            <p className="text-xs text-slate-500">สามารถคลิกแก้ไขหรือลบรายการได้ตลอดเวลา</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenNewTransaction}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-xs font-semibold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>เพิ่มรายการ</span>
            </button>
            <button
              onClick={() => onNavigateTab('salary')}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-medium transition-colors"
            >
              <span>ดูทั้งหมด ({data.transactions.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            ยังไม่มีรายการบันทึก เริ่มต้นด้วยการกดปุ่ม "เพิ่มรายการ" ด้านบน
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentTransactions.map((tx) => {
              const isIncome = tx.type === 'salary_income' || tx.type === 'other_income';
              const isExpense = tx.type === 'expense';
              const isSavings = tx.type === 'to_savings';
              const isInvestment = tx.type === 'to_investment';

              let badgeColor = 'bg-slate-100 text-slate-700';
              let amountPrefix = '';
              let amountColor = 'text-slate-800';

              if (isIncome) {
                badgeColor = 'bg-emerald-50 text-emerald-700 border border-emerald-200';
                amountPrefix = '+';
                amountColor = 'text-emerald-600 font-bold';
              } else if (isExpense) {
                badgeColor = 'bg-rose-50 text-rose-700 border border-rose-200';
                amountPrefix = '-';
                amountColor = 'text-rose-600 font-bold';
              } else if (isSavings) {
                badgeColor = 'bg-sky-50 text-sky-700 border border-sky-200';
                amountPrefix = '→ ';
                amountColor = 'text-sky-600 font-bold';
              } else if (isInvestment) {
                badgeColor = 'bg-indigo-50 text-indigo-700 border border-indigo-200';
                amountPrefix = '→ ';
                amountColor = 'text-indigo-600 font-bold';
              }

              return (
                <div
                  key={tx.id}
                  className="p-4 hover:bg-slate-50/80 transition-colors flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="text-center w-12 flex-shrink-0">
                      <div className="text-xs font-semibold text-slate-700">
                        {tx.date.slice(8, 10)}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {new Date(tx.date).toLocaleDateString('th-TH', { month: 'short' })}
                      </div>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-slate-800 text-sm truncate">
                          {tx.category}
                        </span>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium ${badgeColor}`}>
                          {tx.group === 'salary_income'
                            ? 'รายรับเงินเดือน'
                            : tx.group === 'expense'
                            ? 'รายจ่าย'
                            : tx.group === 'savings'
                            ? 'เก็บออม'
                            : 'ลงทุน'}
                        </span>
                      </div>
                      {tx.note && <p className="text-xs text-slate-500 truncate mt-0.5">{tx.note}</p>}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className={`text-sm ${amountColor}`}>
                        {amountPrefix}฿{tx.amount.toLocaleString()}
                      </div>
                      {tx.paymentMethod && (
                        <div className="text-[10px] text-slate-400">{tx.paymentMethod}</div>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEditTransaction(tx)}
                        title="แก้ไขรายการนี้"
                        className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteTransaction(tx.id)}
                        title="ลบรายการนี้"
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
