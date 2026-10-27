import React, { useState, useEffect } from 'react';
import {
  Wallet,
  Calendar,
  CreditCard,
  FileText,
  X,
  Tag,
  ArrowRight,
} from 'lucide-react';
import { Transaction, TransactionType, AppFinanceData, CategoryGroup } from '../types/finance';

interface TransactionModalProps {
  isOpen: boolean;
  initialTransaction: Transaction | null;
  categories: AppFinanceData['categories'];
  onClose: () => void;
  onSave: (transactionData: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>, editId?: string) => void;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  initialTransaction,
  categories,
  onClose,
  onSave,
}) => {
  const [type, setType] = useState<TransactionType>('expense');
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [category, setCategory] = useState<string>('');
  const [amount, setAmount] = useState<number | ''>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('โอนเงิน');
  const [note, setNote] = useState<string>('');

  useEffect(() => {
    if (initialTransaction) {
      setType(initialTransaction.type);
      setDate(initialTransaction.date);
      setCategory(initialTransaction.category);
      setAmount(initialTransaction.amount);
      setPaymentMethod(initialTransaction.paymentMethod || 'โอนเงิน');
      setNote(initialTransaction.note || '');
    } else {
      setType('expense');
      setDate(new Date().toISOString().slice(0, 10));
      setAmount('');
      setPaymentMethod('สแกน QR');
      setNote('');
      // Set default category for expense
      const firstExp = categories.find((c) => c.group === 'expense');
      setCategory(firstExp ? firstExp.name : 'อาหาร & เครื่องดื่ม');
    }
  }, [initialTransaction, isOpen, categories]);

  if (!isOpen) return null;

  // Determine CategoryGroup based on TransactionType
  const getGroupFromType = (t: TransactionType): CategoryGroup => {
    if (t === 'salary_income' || t === 'other_income') return 'salary_income';
    if (t === 'expense') return 'expense';
    if (t === 'to_savings') return 'savings';
    return 'investment';
  };

  const currentGroup = getGroupFromType(type);
  const relevantCategories = categories.filter((c) => c.group === currentGroup);

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    const newGroup = getGroupFromType(newType);
    const match = categories.find((c) => c.group === newGroup);
    if (match) {
      setCategory(match.name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      alert('กรุณากรอกจำนวนเงินที่ถูกต้อง');
      return;
    }

    onSave(
      {
        date,
        type,
        group: currentGroup,
        category: category || 'ทั่วไป',
        amount: Number(amount),
        paymentMethod,
        note,
      },
      initialTransaction?.id
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-800">
              {initialTransaction ? 'แก้ไขรายการบันทึก' : 'บันทึกรายการใหม่'}
            </h3>
            <p className="text-xs text-slate-500">บันทึกข้อมูลทับต่อเนื่องเป็นข้อมูลปัจจุบัน</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          {/* Transaction Type Selector */}
          <div>
            <label className="block font-medium text-slate-700 mb-1.5">ประเภทรายการ</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleTypeChange('salary_income')}
                className={`py-2 px-3 rounded-xl font-semibold border text-center transition-all cursor-pointer ${
                  type === 'salary_income'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                + รายรับ / เงินเดือน
              </button>

              <button
                type="button"
                onClick={() => handleTypeChange('expense')}
                className={`py-2 px-3 rounded-xl font-semibold border text-center transition-all cursor-pointer ${
                  type === 'expense'
                    ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                - รายจ่ายประจำ
              </button>

              <button
                type="button"
                onClick={() => handleTypeChange('to_savings')}
                className={`py-2 px-3 rounded-xl font-semibold border text-center transition-all cursor-pointer ${
                  type === 'to_savings'
                    ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                → โอนเข้าเงินเก็บ
              </button>

              <button
                type="button"
                onClick={() => handleTypeChange('to_investment')}
                className={`py-2 px-3 rounded-xl font-semibold border text-center transition-all cursor-pointer ${
                  type === 'to_investment'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                → จัดสรรเข้าเงินลงทุน
              </button>
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block font-medium text-slate-700 mb-1">จำนวนเงิน (บาท)</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base font-bold text-slate-400">
                ฿
              </span>
              <input
                type="number"
                step="any"
                min="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xl font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
                autoFocus
              />
            </div>
          </div>

          {/* Date & Category Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">วันที่ทำรายการ</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">หมวดหมู่</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
                required
              >
                {relevantCategories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block font-medium text-slate-700 mb-1">วิธีการชำระ / โอนเงิน</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
            >
              <option value="สแกน QR">สแกน QR Code / พร้อมเพย์</option>
              <option value="โอนเงิน">โอนเงินผ่านแอปธนาคาร</option>
              <option value="หักเงินเดือน">หักจากบัญชีเงินเดือนอัตโนมัติ</option>
              <option value="เงินสด">เงินสด</option>
              <option value="บัตรเครดิต">บัตรเครดิต</option>
              <option value="ตัดบัญชีอัตโนมัติ">ตัดบัญชีเงินฝากอัตโนมัติ (Direct Debit)</option>
            </select>
          </div>

          {/* Note */}
          <div>
            <label className="block font-medium text-slate-700 mb-1">บันทึกเพิ่มเติม (ถ้ามี)</label>
            <input
              type="text"
              placeholder="เช่น ซื้อของที่ซูเปอร์มาร์เก็ต, ค่าหอพัก"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs cursor-pointer transition-colors"
            >
              {initialTransaction ? 'บันทึกการแก้ไข' : 'บันทึกรายการ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
