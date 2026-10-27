import React, { useState } from 'react';
import {
  PiggyBank,
  Plus,
  Edit2,
  Trash2,
  TrendingUp,
  Target,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { AppFinanceData, SavingsAccount } from '../types/finance';

interface SavingsTabProps {
  data: AppFinanceData;
  onAddSavingsAccount: (account: Omit<SavingsAccount, 'id' | 'updatedAt'>) => void;
  onUpdateSavingsAccount: (account: SavingsAccount) => void;
  onDeleteSavingsAccount: (id: string) => void;
  onQuickDeposit: (accountId: string, amount: number, accountName: string) => void;
}

export const SavingsTab: React.FC<SavingsTabProps> = ({
  data,
  onAddSavingsAccount,
  onUpdateSavingsAccount,
  onDeleteSavingsAccount,
  onQuickDeposit,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<SavingsAccount | null>(null);

  // Quick deposit modal state
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [selectedAccountForDeposit, setSelectedAccountForDeposit] = useState<SavingsAccount | null>(null);
  const [depositAmount, setDepositAmount] = useState<number>(1000);

  // Form states for Add/Edit
  const [name, setName] = useState('');
  const [bank, setBank] = useState('กสิกรไทย');
  const [accountNumber, setAccountNumber] = useState('');
  const [balance, setBalance] = useState<number>(0);
  const [interestRate, setInterestRate] = useState<number>(1.5);
  const [targetAmount, setTargetAmount] = useState<number>(0);
  const [note, setNote] = useState('');

  const openAddModal = () => {
    setEditingAccount(null);
    setName('');
    setBank('กสิกรไทย');
    setAccountNumber('');
    setBalance(10000);
    setInterestRate(1.5);
    setTargetAmount(50000);
    setNote('');
    setIsModalOpen(true);
  };

  const openEditModal = (account: SavingsAccount) => {
    setEditingAccount(account);
    setName(account.name);
    setBank(account.bank);
    setAccountNumber(account.accountNumber || '');
    setBalance(account.balance);
    setInterestRate(account.interestRate || 0);
    setTargetAmount(account.targetAmount || 0);
    setNote(account.note || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAccount) {
      onUpdateSavingsAccount({
        ...editingAccount,
        name,
        bank,
        accountNumber,
        balance: Number(balance) || 0,
        interestRate: Number(interestRate) || 0,
        targetAmount: Number(targetAmount) || 0,
        note,
        updatedAt: new Date().toISOString(),
      });
    } else {
      onAddSavingsAccount({
        name,
        bank,
        accountNumber,
        balance: Number(balance) || 0,
        interestRate: Number(interestRate) || 0,
        targetAmount: Number(targetAmount) || 0,
        note,
      });
    }
    setIsModalOpen(false);
  };

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAccountForDeposit && depositAmount > 0) {
      onQuickDeposit(selectedAccountForDeposit.id, depositAmount, selectedAccountForDeposit.name);
      setDepositModalOpen(false);
    }
  };

  const totalSavings = data.savingsAccounts.reduce((sum, a) => sum + (a.balance || 0), 0);
  const totalTarget = data.savingsAccounts.reduce((sum, a) => sum + (a.targetAmount || 0), 0);
  const overallTargetPercent = totalTarget > 0 ? Math.min(100, Math.round((totalSavings / totalTarget) * 100)) : 0;

  return (
    <div className="space-y-6">
      {/* Top Banner: Savings Overview */}
      <div className="bg-gradient-to-r from-sky-900 via-sky-800 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-semibold mb-3">
            <PiggyBank className="w-3.5 h-3.5" />
            <span>หมวดเงินเก็บสะสม & เงินสำรองฉุกเฉิน</span>
          </div>
          <h2 className="text-sm sm:text-base text-slate-300 font-medium">ยอดเงินเก็บสะสมทั้งหมด</h2>
          <div className="text-3xl sm:text-5xl font-extrabold text-white mt-1">
            ฿{totalSavings.toLocaleString()}
          </div>
          <p className="text-xs text-sky-200 mt-2">
            บันทึกทับต่อเนื่องเป็นข้อมูลปัจจุบัน • คำนวณดอกเบี้ยและเป้าหมายอัตโนมัติ
          </p>
        </div>

        <div className="bg-white/10 border border-white/10 rounded-2xl p-4 backdrop-blur-md min-w-[240px]">
          <div className="flex justify-between items-center text-xs text-slate-300">
            <span>เป้าหมายเงินเก็บรวม</span>
            <span className="font-bold text-sky-300">{overallTargetPercent}%</span>
          </div>
          <div className="text-xl font-bold text-white mt-1">฿{totalTarget.toLocaleString()}</div>
          <div className="w-full bg-slate-700 h-2 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-sky-400 h-full rounded-full transition-all"
              style={{ width: `${overallTargetPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-300 mt-2">
            <span>ขาดอีก ฿{Math.max(0, totalTarget - totalSavings).toLocaleString()}</span>
            <span>{data.savingsAccounts.length} บัญชี</span>
          </div>
        </div>
      </div>

      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
        <div>
          <h3 className="font-bold text-slate-800 text-base">บัญชีเงินเก็บทั้งหมด ({data.savingsAccounts.length})</h3>
          <p className="text-xs text-slate-500">สามารถแก้ไขชื่อบัญชี ยอดเงิน ดอกเบี้ย และเป้าหมายได้ตลอดเวลา</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>เพิ่มบัญชีเงินเก็บใหม่</span>
        </button>
      </div>

      {/* Savings Account Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {data.savingsAccounts.map((account) => {
          const target = account.targetAmount || 0;
          const pct = target > 0 ? Math.min(100, Math.round((account.balance / target) * 100)) : null;

          return (
            <div
              key={account.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-xs">
                      {account.bank.slice(0, 3)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-base leading-snug">{account.name}</h4>
                      <p className="text-xs text-slate-400">
                        {account.bank} {account.accountNumber ? `• ${account.accountNumber}` : ''}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(account)}
                      title="แก้ไขบัญชีนี้"
                      className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteSavingsAccount(account.id)}
                      title="ลบบัญชีนี้"
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="mt-5">
                  <div className="text-xs text-slate-400">ยอดเงินปัจจุบัน</div>
                  <div className="text-2xl font-bold text-slate-900 mt-0.5">
                    ฿{account.balance.toLocaleString()}
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-3 text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl">
                  <div>
                    <span className="text-slate-400">ดอกเบี้ย:</span>{' '}
                    <strong className="text-sky-600">{account.interestRate}% ต่อปี</strong>
                  </div>
                  {account.interestRate > 0 && (
                    <div className="text-[11px] text-slate-400">
                      (~฿{Math.round((account.balance * account.interestRate) / 100).toLocaleString()}/ปี)
                    </div>
                  )}
                </div>

                {target > 0 && (
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-slate-600 mb-1">
                      <span>เป้าหมาย ฿{target.toLocaleString()}</span>
                      <span className="font-semibold text-sky-600">{pct}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-sky-500 h-full rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )}

                {account.note && (
                  <p className="text-xs text-slate-500 mt-3 bg-amber-50/60 p-2 rounded-lg border border-amber-100">
                    💡 {account.note}
                  </p>
                )}
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedAccountForDeposit(account);
                    setDepositAmount(1000);
                    setDepositModalOpen(true);
                  }}
                  className="w-full py-2 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>ฝากเงินเพิ่มในบัญชีนี้</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Account Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-150">
            <h3 className="text-lg font-bold text-slate-800 mb-1">
              {editingAccount ? 'แก้ไขบัญชีเงินเก็บ' : 'เพิ่มบัญชีเงินเก็บใหม่'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              บันทึกข้อมูลทับต่อเนื่องเป็นข้อมูลปัจจุบัน สามารถแก้ไขตัวเลขได้ตลอดเวลา
            </p>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">ชื่อบัญชีเงินเก็บ</label>
                <input
                  type="text"
                  placeholder="เช่น เงินสำรองฉุกเฉิน, ออมทรัพย์ดอกเบี้ยสูง"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">ธนาคาร / สถาบัน</label>
                  <input
                    type="text"
                    placeholder="เช่น กสิกรไทย, กรุงไทย"
                    value={bank}
                    onChange={(e) => setBank(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">เลขที่บัญชี (ถ้ามี)</label>
                  <input
                    type="text"
                    placeholder="xxx-x-xxxxx-x"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">ยอดเงินคงเหลือปัจจุบัน (บาท)</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={balance}
                    onChange={(e) => setBalance(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">อัตราดอกเบี้ย (% ต่อปี)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">เป้าหมายเงินเก็บ (บาท)</label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">หมายเหตุเพิ่มเติม</label>
                <textarea
                  rows={2}
                  placeholder="เช่น เก็บไว้สำหรับค่าใช้จ่ายฉุกเฉิน 6 เดือน"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
                >
                  {editingAccount ? 'บันทึกการแก้ไข' : 'เพิ่มบัญชี'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Deposit Modal */}
      {depositModalOpen && selectedAccountForDeposit && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-800 mb-1">ฝากเงินเพิ่มในบัญชี</h3>
            <p className="text-xs text-slate-500 mb-4">{selectedAccountForDeposit.name}</p>

            <form onSubmit={handleDepositSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">จำนวนเงินที่ต้องการฝากเพิ่ม (บาท)</label>
                <input
                  type="number"
                  min="1"
                  step="any"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-base font-bold text-sky-600 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  required
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDepositModalOpen(false)}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
                >
                  ยืนยันการฝากเงิน
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
