import React, { useState } from 'react';
import {
  Wallet,
  Plus,
  Search,
  Filter,
  Download,
  Calendar,
  Edit2,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Settings,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { AppFinanceData, Transaction } from '../types/finance';
import { exportTransactionsCSV } from '../services/storage';

interface SalaryAndExpensesTabProps {
  data: AppFinanceData;
  onUpdateSalarySettings: (settings: AppFinanceData['salarySettings']) => void;
  onOpenNewTransaction: () => void;
  onEditTransaction: (tx: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
  onQuickAddSalary: () => void;
}

export const SalaryAndExpensesTab: React.FC<SalaryAndExpensesTabProps> = ({
  data,
  onUpdateSalarySettings,
  onOpenNewTransaction,
  onEditTransaction,
  onDeleteTransaction,
  onQuickAddSalary,
}) => {
  const currentMonthStr = new Date().toISOString().slice(0, 7);
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonthStr);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [isEditingSalary, setIsEditingSalary] = useState(false);

  // Form states for salary settings
  const [baseSalary, setBaseSalary] = useState<number>(data.salarySettings.monthlySalary);
  const [otherIncome, setOtherIncome] = useState<number>(data.salarySettings.otherFixedIncome);
  const [payday, setPayday] = useState<number>(data.salarySettings.payday);

  const handleSaveSalarySettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSalarySettings({
      monthlySalary: Number(baseSalary) || 0,
      otherFixedIncome: Number(otherIncome) || 0,
      payday: Number(payday) || 25,
    });
    setIsEditingSalary(false);
  };

  // กรองรายการ
  const filteredTransactions = data.transactions.filter((tx) => {
    const matchesMonth = selectedMonth === 'all' || tx.date.startsWith(selectedMonth);
    const matchesGroup = selectedGroup === 'all' || tx.group === selectedGroup;
    const matchesSearch =
      !searchQuery.trim() ||
      tx.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.note && tx.note.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (tx.paymentMethod && tx.paymentMethod.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesMonth && matchesGroup && matchesSearch;
  });

  // ยอดรวมตามเดือนที่เลือก
  const monthTransactions = data.transactions.filter(
    (tx) => selectedMonth === 'all' || tx.date.startsWith(selectedMonth)
  );

  const totalIncome = monthTransactions
    .filter((t) => t.type === 'salary_income' || t.type === 'other_income')
    .reduce((s, t) => s + t.amount, 0);

  const totalExpense = monthTransactions
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0);

  const totalToSavings = monthTransactions
    .filter((t) => t.type === 'to_savings')
    .reduce((s, t) => s + t.amount, 0);

  const totalToInvestment = monthTransactions
    .filter((t) => t.type === 'to_investment')
    .reduce((s, t) => s + t.amount, 0);

  const netBalance = totalIncome - totalExpense - totalToSavings - totalToInvestment;

  return (
    <div className="space-y-6">
      {/* Top Banner: Salary Settings Card (Editable) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-800 text-lg">ฐานเงินเดือน & ข้อมูลรายได้ประจำ</h3>
                <button
                  onClick={() => setIsEditingSalary(!isEditingSalary)}
                  className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold underline cursor-pointer"
                >
                  {isEditingSalary ? 'ปิดฟอร์ม' : 'แก้ไขฐานเงินเดือน'}
                </button>
              </div>
              <p className="text-xs text-slate-500">
                ฐานเงินเดือน ฿{data.salarySettings.monthlySalary.toLocaleString()} • รายได้อื่น ฿
                {data.salarySettings.otherFixedIncome.toLocaleString()} • เงินเดือนออกทุกวันที่{' '}
                {data.salarySettings.payday}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onQuickAddSalary}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-xs cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>บันทึกเงินเดือนเข้าบัญชีเดือนนี้</span>
            </button>
          </div>
        </div>

        {/* Edit Salary Settings Form */}
        {isEditingSalary && (
          <form
            onSubmit={handleSaveSalarySettings}
            className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl"
          >
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                ฐานเงินเดือนหลัก (บาท)
              </label>
              <input
                type="number"
                min="0"
                value={baseSalary}
                onChange={(e) => setBaseSalary(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                รายได้ประจำอื่นๆ (บาท)
              </label>
              <input
                type="number"
                min="0"
                value={otherIncome}
                onChange={(e) => setOtherIncome(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                วันที่เงินเดือนออก (เช่น 25)
              </label>
              <input
                type="number"
                min="1"
                max="31"
                value={payday}
                onChange={(e) => setPayday(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="w-full py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors cursor-pointer"
              >
                บันทึกการแก้ไข
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Monthly Summary Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200">
          <span className="text-xs text-slate-500">รายรับทั้งหมด</span>
          <div className="text-lg sm:text-xl font-bold text-emerald-600 mt-1">
            ฿{totalIncome.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400">เงินเดือน & รายได้พิเศษ</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200">
          <span className="text-xs text-slate-500">รายจ่ายทั้งหมด</span>
          <div className="text-lg sm:text-xl font-bold text-rose-500 mt-1">
            ฿{totalExpense.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400">ค่าครองชีพ & ภาระรายเดือน</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200">
          <span className="text-xs text-slate-500">จัดสรรเข้าเงินเก็บ</span>
          <div className="text-lg sm:text-xl font-bold text-sky-600 mt-1">
            ฿{totalToSavings.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400">เงินสำรอง & บัญชีเงินเก็บ</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200">
          <span className="text-xs text-slate-500">จัดสรรเข้าลงทุน</span>
          <div className="text-lg sm:text-xl font-bold text-indigo-600 mt-1">
            ฿{totalToInvestment.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400">สหกรณ์ • ทองคำ • ประกัน</span>
        </div>

        <div className="col-span-2 lg:col-span-1 bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4 rounded-2xl">
          <span className="text-xs text-slate-300">กระแสเงินสดคงเหลือ</span>
          <div className={`text-lg sm:text-xl font-bold mt-1 ${netBalance >= 0 ? 'text-teal-300' : 'text-rose-400'}`}>
            {netBalance >= 0 ? '+' : ''}฿{netBalance.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400">คงเหลือสุทธิเดือนนี้</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Month Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent font-medium text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="all">ทุกช่วงเวลา (ทั้งหมด)</option>
              <option value={currentMonthStr}>เดือนนี้ ({currentMonthStr})</option>
              <option value="2026-09">กันยายน 2026</option>
              <option value="2026-08">สิงหาคม 2026</option>
              <option value="2026-07">กรกฎาคม 2026</option>
            </select>
          </div>

          {/* Group Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-medium">
            <button
              onClick={() => setSelectedGroup('all')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                selectedGroup === 'all' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600'
              }`}
            >
              ทั้งหมด
            </button>
            <button
              onClick={() => setSelectedGroup('salary_income')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                selectedGroup === 'salary_income'
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              รายรับ
            </button>
            <button
              onClick={() => setSelectedGroup('expense')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                selectedGroup === 'expense'
                  ? 'bg-rose-600 text-white font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              รายจ่าย
            </button>
            <button
              onClick={() => setSelectedGroup('savings')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                selectedGroup === 'savings'
                  ? 'bg-sky-600 text-white font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              เงินเก็บ
            </button>
            <button
              onClick={() => setSelectedGroup('investment')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                selectedGroup === 'investment'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              เงินลงทุน
            </button>
          </div>
        </div>

        {/* Search & Export Action */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ค้นหารายการ / หมวดหมู่..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <button
            onClick={() => exportTransactionsCSV(filteredTransactions)}
            title="ดาวน์โหลดรายการเป็น CSV"
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">CSV</span>
          </button>

          <button
            onClick={onOpenNewTransaction}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>เพิ่มรายการ</span>
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">วันที่</th>
                <th className="py-3 px-4">ประเภท</th>
                <th className="py-3 px-4">หมวดหมู่</th>
                <th className="py-3 px-4 text-right">จำนวนเงิน (บาท)</th>
                <th className="py-3 px-4">วิธีชำระ / โอน</th>
                <th className="py-3 px-4">บันทึกเพิ่มเติม</th>
                <th className="py-3 px-4 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    ไม่พบรายการในช่วงที่เลือก สามารถกดปุ่ม "เพิ่มรายการ" เพื่อบันทึกรายการใหม่
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => {
                  const isIncome = tx.type === 'salary_income' || tx.type === 'other_income';
                  const isExpense = tx.type === 'expense';
                  const isSavings = tx.type === 'to_savings';
                  const isInvestment = tx.type === 'to_investment';

                  return (
                    <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-medium text-slate-700 whitespace-nowrap">
                        {tx.date}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                            isIncome
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : isExpense
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : isSavings
                              ? 'bg-sky-50 text-sky-700 border border-sky-200'
                              : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          }`}
                        >
                          {isIncome
                            ? 'รายรับเงินเดือน'
                            : isExpense
                            ? 'รายจ่าย'
                            : isSavings
                            ? 'จัดสรรเข้าเงินเก็บ'
                            : 'จัดสรรเข้าเงินลงทุน'}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800">
                        {tx.category}
                      </td>
                      <td
                        className={`py-3 px-4 text-right font-bold whitespace-nowrap ${
                          isIncome
                            ? 'text-emerald-600'
                            : isExpense
                            ? 'text-rose-600'
                            : isSavings
                            ? 'text-sky-600'
                            : 'text-indigo-600'
                        }`}
                      >
                        {isIncome ? '+' : isExpense ? '-' : '→ '}฿{tx.amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-slate-500 text-xs">
                        {tx.paymentMethod || '-'}
                      </td>
                      <td className="py-3 px-4 text-slate-600 text-xs max-w-xs truncate">
                        {tx.note || '-'}
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => onEditTransaction(tx)}
                            title="แก้ไขรายการ"
                            className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteTransaction(tx.id)}
                            title="ลบรายการ"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
