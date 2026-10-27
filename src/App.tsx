/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  AppFinanceData,
  Transaction,
  SavingsAccount,
  CooperativeDeposit,
  CooperativeShare,
  PhysicalGold,
  GoldStock,
  LifeInsurancePolicy,
  OtherInvestment,
  FinanceCategory,
  GoogleSheetConfig,
} from './types/finance';
import {
  loadFinanceData,
  saveFinanceData,
  getLastSavedTime,
  calculateNetWorth,
} from './services/storage';

import { Header } from './components/Header';
import { Navigation, TabKey } from './components/Navigation';
import { OverviewTab } from './components/OverviewTab';
import { SalaryAndExpensesTab } from './components/SalaryAndExpensesTab';
import { SavingsTab } from './components/SavingsTab';
import { InvestmentsTab } from './components/InvestmentsTab';
import { CategoriesAndMenuTab } from './components/CategoriesAndMenuTab';
import { GoogleSheetTab } from './components/GoogleSheetTab';
import { TransactionModal } from './components/TransactionModal';
import { CheckCircle2, Save, Sparkles, X } from 'lucide-react';

export default function App() {
  const [data, setData] = useState<AppFinanceData>(() => loadFinanceData());
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(() => getLastSavedTime());

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Transaction Modal state
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 3500);
  };

  // Real-time Save handler (Requested prominently by user)
  const handleRealtimeSave = useCallback(
    (explicitData?: AppFinanceData) => {
      setIsSaving(true);
      const targetData = explicitData || data;
      const result = saveFinanceData(targetData, true);

      setTimeout(() => {
        setIsSaving(false);
        if (result.success) {
          setLastSavedAt(result.timestamp);
          showToast('บันทึกข้อมูลแบบ Real-time สำเร็จ (อัปเดตเป็นข้อมูลปัจจุบันแล้ว)');
        }
      }, 300);
    },
    [data]
  );

  // Auto-save on state change with persistent update
  const updateDataAndSave = useCallback(
    (updater: (prev: AppFinanceData) => AppFinanceData, triggerCloudSync = false) => {
      setData((prev) => {
        const next = updater(prev);
        // Persist immediately to LocalStorage so no refresh wipes data
        const res = saveFinanceData(next, triggerCloudSync);
        setLastSavedAt(res.timestamp);
        return next;
      });
    },
    []
  );

  // Keyboard shortcut: Ctrl+S / Cmd+S for Real-time Save
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleRealtimeSave();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleRealtimeSave]);

  // 1. Transactions Actions
  const handleSaveTransaction = (
    txData: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>,
    editId?: string
  ) => {
    updateDataAndSave((prev) => {
      let updatedTransactions: Transaction[];
      if (editId) {
        updatedTransactions = prev.transactions.map((t) =>
          t.id === editId
            ? { ...t, ...txData, updatedAt: new Date().toISOString() }
            : t
        );
      } else {
        const newTx: Transaction = {
          ...txData,
          id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        updatedTransactions = [newTx, ...prev.transactions];
      }

      return {
        ...prev,
        transactions: updatedTransactions,
      };
    });
    showToast(editId ? 'แก้ไขรายการบันทึกเรียบร้อย' : 'เพิ่มรายการบันทึกใหม่แล้ว');
  };

  const handleDeleteTransaction = (id: string) => {
    if (window.confirm('คุณต้องการลบรายการนี้ใช่หรือไม่?')) {
      updateDataAndSave((prev) => ({
        ...prev,
        transactions: prev.transactions.filter((t) => t.id !== id),
      }));
      showToast('ลบรายการเรียบร้อยแล้ว');
    }
  };

  // Quick Add Salary transaction
  const handleQuickAddSalary = () => {
    const today = new Date().toISOString().slice(0, 10);
    const salaryAmt = data.salarySettings.monthlySalary;

    handleSaveTransaction({
      date: today,
      type: 'salary_income',
      group: 'salary_income',
      category: 'เงินเดือนหลัก',
      amount: salaryAmt,
      paymentMethod: 'โอนเข้าบัญชี',
      note: `เงินเดือนประจำเดือน ${new Date().toLocaleDateString('th-TH', { month: 'long', year: 'numeric' })}`,
    });
  };

  // 2. Salary Settings Actions
  const handleUpdateSalarySettings = (settings: AppFinanceData['salarySettings']) => {
    updateDataAndSave((prev) => ({
      ...prev,
      salarySettings: settings,
    }));
    showToast('บันทึกการตั้งค่าเงินเดือนเรียบร้อยแล้ว');
  };

  // 3. Savings Actions
  const handleAddSavingsAccount = (accountData: Omit<SavingsAccount, 'id' | 'updatedAt'>) => {
    const newAcc: SavingsAccount = {
      ...accountData,
      id: `sav-${Date.now()}`,
      updatedAt: new Date().toISOString(),
    };
    updateDataAndSave((prev) => ({
      ...prev,
      savingsAccounts: [...prev.savingsAccounts, newAcc],
    }));
    showToast(`เพิ่มบัญชี "${newAcc.name}" แล้ว`);
  };

  const handleUpdateSavingsAccount = (account: SavingsAccount) => {
    updateDataAndSave((prev) => ({
      ...prev,
      savingsAccounts: prev.savingsAccounts.map((a) => (a.id === account.id ? account : a)),
    }));
    showToast(`บันทึกการแก้ไข "${account.name}" แล้ว`);
  };

  const handleDeleteSavingsAccount = (id: string) => {
    if (window.confirm('คุณต้องการลบบัญชีเงินเก็บนี้ใช่หรือไม่?')) {
      updateDataAndSave((prev) => ({
        ...prev,
        savingsAccounts: prev.savingsAccounts.filter((a) => a.id !== id),
      }));
      showToast('ลบบัญชีเงินเก็บเรียบร้อยแล้ว');
    }
  };

  const handleQuickDeposit = (accountId: string, amount: number, accountName: string) => {
    const today = new Date().toISOString().slice(0, 10);
    // 1. Update savings balance
    updateDataAndSave((prev) => ({
      ...prev,
      savingsAccounts: prev.savingsAccounts.map((a) =>
        a.id === accountId ? { ...a, balance: a.balance + amount } : a
      ),
      transactions: [
        {
          id: `tx-dep-${Date.now()}`,
          date: today,
          type: 'to_savings',
          group: 'savings',
          category: 'เงินสำรองฉุกเฉิน',
          amount,
          paymentMethod: 'โอนเงิน',
          note: `ฝากเข้าบัญชี ${accountName}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        ...prev.transactions,
      ],
    }));
    showToast(`ฝากเงิน ฿${amount.toLocaleString()} เข้า ${accountName} เรียบร้อยแล้ว`);
  };

  // 4. Investment Actions
  // Cooperative Deposit
  const handleAddCooperativeDeposit = (item: Omit<CooperativeDeposit, 'id' | 'updatedAt'>) => {
    const newItem: CooperativeDeposit = {
      ...item,
      id: `coop-dep-${Date.now()}`,
      updatedAt: new Date().toISOString(),
    };
    updateDataAndSave((prev) => ({
      ...prev,
      investments: {
        ...prev.investments,
        cooperativeDeposits: [...prev.investments.cooperativeDeposits, newItem],
      },
    }));
    showToast('เพิ่มบัญชีเงินฝากสหกรณ์เรียบร้อยแล้ว');
  };

  const handleUpdateCooperativeDeposit = (item: CooperativeDeposit) => {
    updateDataAndSave((prev) => ({
      ...prev,
      investments: {
        ...prev.investments,
        cooperativeDeposits: prev.investments.cooperativeDeposits.map((d) =>
          d.id === item.id ? item : d
        ),
      },
    }));
    showToast('แก้ไขข้อมูลเงินฝากสหกรณ์เรียบร้อย');
  };

  const handleDeleteCooperativeDeposit = (id: string) => {
    if (window.confirm('คุณต้องการลบบัญชีเงินฝากสหกรณ์นี้ใช่หรือไม่?')) {
      updateDataAndSave((prev) => ({
        ...prev,
        investments: {
          ...prev.investments,
          cooperativeDeposits: prev.investments.cooperativeDeposits.filter((d) => d.id !== id),
        },
      }));
      showToast('ลบรายการเงินฝากสหกรณ์เรียบร้อย');
    }
  };

  // Cooperative Share
  const handleAddCooperativeShare = (item: Omit<CooperativeShare, 'id' | 'updatedAt'>) => {
    const newItem: CooperativeShare = {
      ...item,
      id: `coop-sh-${Date.now()}`,
      updatedAt: new Date().toISOString(),
    };
    updateDataAndSave((prev) => ({
      ...prev,
      investments: {
        ...prev.investments,
        cooperativeShares: [...prev.investments.cooperativeShares, newItem],
      },
    }));
    showToast('เพิ่มหุ้นสหกรณ์เรียบร้อยแล้ว');
  };

  const handleUpdateCooperativeShare = (item: CooperativeShare) => {
    updateDataAndSave((prev) => ({
      ...prev,
      investments: {
        ...prev.investments,
        cooperativeShares: prev.investments.cooperativeShares.map((s) =>
          s.id === item.id ? item : s
        ),
      },
    }));
    showToast('แก้ไขข้อมูลหุ้นสหกรณ์เรียบร้อย');
  };

  const handleDeleteCooperativeShare = (id: string) => {
    if (window.confirm('คุณต้องการลบรายการหุ้นสหกรณ์นี้ใช่หรือไม่?')) {
      updateDataAndSave((prev) => ({
        ...prev,
        investments: {
          ...prev.investments,
          cooperativeShares: prev.investments.cooperativeShares.filter((s) => s.id !== id),
        },
      }));
      showToast('ลบหุ้นสหกรณ์เรียบร้อย');
    }
  };

  // Physical Gold
  const handleAddPhysicalGold = (item: Omit<PhysicalGold, 'id' | 'updatedAt'>) => {
    const newItem: PhysicalGold = {
      ...item,
      id: `gold-phys-${Date.now()}`,
      updatedAt: new Date().toISOString(),
    };
    updateDataAndSave((prev) => ({
      ...prev,
      investments: {
        ...prev.investments,
        physicalGold: [...prev.investments.physicalGold, newItem],
      },
    }));
    showToast('เพิ่มทองคำสะสมเรียบร้อยแล้ว');
  };

  const handleUpdatePhysicalGold = (item: PhysicalGold) => {
    updateDataAndSave((prev) => ({
      ...prev,
      investments: {
        ...prev.investments,
        physicalGold: prev.investments.physicalGold.map((g) => (g.id === item.id ? item : g)),
      },
    }));
    showToast('แก้ไขข้อมูลทองคำสะสมเรียบร้อย');
  };

  const handleDeletePhysicalGold = (id: string) => {
    if (window.confirm('คุณต้องการลบรายการทองคำสะสมนี้ใช่หรือไม่?')) {
      updateDataAndSave((prev) => ({
        ...prev,
        investments: {
          ...prev.investments,
          physicalGold: prev.investments.physicalGold.filter((g) => g.id !== id),
        },
      }));
      showToast('ลบรายการทองคำสะสมเรียบร้อย');
    }
  };

  const handleBulkUpdateGoldPrice = (newPricePerBaht: number) => {
    updateDataAndSave((prev) => ({
      ...prev,
      investments: {
        ...prev.investments,
        physicalGold: prev.investments.physicalGold.map((g) => ({
          ...g,
          currentPricePerBaht: newPricePerBaht,
          currentValue: g.weightBaht * newPricePerBaht,
          updatedAt: new Date().toISOString(),
        })),
      },
    }));
    showToast(`อัปเดตราคาทองคำเป็น ฿${newPricePerBaht.toLocaleString()}/บาท เรียบร้อยแล้ว`);
  };

  // Gold Stock
  const handleAddGoldStock = (item: Omit<GoldStock, 'id' | 'updatedAt'>) => {
    const newItem: GoldStock = {
      ...item,
      id: `gold-stk-${Date.now()}`,
      updatedAt: new Date().toISOString(),
    };
    updateDataAndSave((prev) => ({
      ...prev,
      investments: {
        ...prev.investments,
        goldStocks: [...prev.investments.goldStocks, newItem],
      },
    }));
    showToast('เพิ่มหุ้น/กองทุนทองคำเรียบร้อยแล้ว');
  };

  const handleUpdateGoldStock = (item: GoldStock) => {
    updateDataAndSave((prev) => ({
      ...prev,
      investments: {
        ...prev.investments,
        goldStocks: prev.investments.goldStocks.map((s) => (s.id === item.id ? item : s)),
      },
    }));
    showToast('แก้ไขหุ้นทองคำเรียบร้อย');
  };

  const handleDeleteGoldStock = (id: string) => {
    if (window.confirm('คุณต้องการลบรายการหุ้นทองคำนี้ใช่หรือไม่?')) {
      updateDataAndSave((prev) => ({
        ...prev,
        investments: {
          ...prev.investments,
          goldStocks: prev.investments.goldStocks.filter((s) => s.id !== id),
        },
      }));
      showToast('ลบรายการหุ้นทองคำเรียบร้อย');
    }
  };

  // Insurance
  const handleAddInsurance = (item: Omit<LifeInsurancePolicy, 'id' | 'updatedAt'>) => {
    const newItem: LifeInsurancePolicy = {
      ...item,
      id: `ins-${Date.now()}`,
      updatedAt: new Date().toISOString(),
    };
    updateDataAndSave((prev) => ({
      ...prev,
      investments: {
        ...prev.investments,
        insurance: [...prev.investments.insurance, newItem],
      },
    }));
    showToast('เพิ่มกรมธรรม์ประกันชีวิตเรียบร้อยแล้ว');
  };

  const handleUpdateInsurance = (item: LifeInsurancePolicy) => {
    updateDataAndSave((prev) => ({
      ...prev,
      investments: {
        ...prev.investments,
        insurance: prev.investments.insurance.map((i) => (i.id === item.id ? item : i)),
      },
    }));
    showToast('แก้ไขข้อมูลประกันชีวิตเรียบร้อย');
  };

  const handleDeleteInsurance = (id: string) => {
    if (window.confirm('คุณต้องการลบกรมธรรม์นี้ใช่หรือไม่?')) {
      updateDataAndSave((prev) => ({
        ...prev,
        investments: {
          ...prev.investments,
          insurance: prev.investments.insurance.filter((i) => i.id !== id),
        },
      }));
      showToast('ลบกรมธรรม์เรียบร้อย');
    }
  };

  // Other Investment
  const handleAddOtherInvestment = (item: Omit<OtherInvestment, 'id' | 'updatedAt'>) => {
    const newItem: OtherInvestment = {
      ...item,
      id: `oth-inv-${Date.now()}`,
      updatedAt: new Date().toISOString(),
    };
    updateDataAndSave((prev) => ({
      ...prev,
      investments: {
        ...prev.investments,
        otherInvestments: [...prev.investments.otherInvestments, newItem],
      },
    }));
    showToast('เพิ่มสินทรัพย์การลงทุนใหม่เรียบร้อยแล้ว');
  };

  const handleUpdateOtherInvestment = (item: OtherInvestment) => {
    updateDataAndSave((prev) => ({
      ...prev,
      investments: {
        ...prev.investments,
        otherInvestments: prev.investments.otherInvestments.map((o) =>
          o.id === item.id ? item : o
        ),
      },
    }));
    showToast('แก้ไขข้อมูลสินทรัพย์เรียบร้อย');
  };

  const handleDeleteOtherInvestment = (id: string) => {
    if (window.confirm('คุณต้องการลบสินทรัพย์นี้ใช่หรือไม่?')) {
      updateDataAndSave((prev) => ({
        ...prev,
        investments: {
          ...prev.investments,
          otherInvestments: prev.investments.otherInvestments.filter((o) => o.id !== id),
        },
      }));
      showToast('ลบสินทรัพย์เรียบร้อย');
    }
  };

  // 5. Category Actions
  const handleAddCategory = (categoryData: Omit<FinanceCategory, 'id'>) => {
    const newCat: FinanceCategory = {
      ...categoryData,
      id: `cat-custom-${Date.now()}`,
    };
    updateDataAndSave((prev) => ({
      ...prev,
      categories: [...prev.categories, newCat],
    }));
    showToast(`เพิ่มหมวดหมู่ "${newCat.name}" เรียบร้อย`);
  };

  const handleUpdateCategory = (category: FinanceCategory) => {
    updateDataAndSave((prev) => ({
      ...prev,
      categories: prev.categories.map((c) => (c.id === category.id ? category : c)),
    }));
    showToast(`แก้ไขหมวดหมู่ "${category.name}" เรียบร้อย`);
  };

  const handleDeleteCategory = (id: string) => {
    if (window.confirm('คุณต้องการลบหมวดหมู่นี้ใช่หรือไม่?')) {
      updateDataAndSave((prev) => ({
        ...prev,
        categories: prev.categories.filter((c) => c.id !== id),
      }));
      showToast('ลบหมวดหมู่เรียบร้อย');
    }
  };

  // 6. Google Sheet Config & Restore
  const handleUpdateGoogleSheetConfig = (config: GoogleSheetConfig) => {
    updateDataAndSave((prev) => ({
      ...prev,
      googleSheetConfig: config,
    }));
  };

  const handleRestoreData = (restoredData: AppFinanceData) => {
    updateDataAndSave(() => restoredData, false);
    showToast('กู้คืนข้อมูลสำเร็จเรียบร้อย');
  };

  const totalInvestmentsCount =
    data.investments.cooperativeDeposits.length +
    data.investments.cooperativeShares.length +
    data.investments.physicalGold.length +
    data.investments.goldStocks.length +
    data.investments.insurance.length +
    data.investments.otherInvestments.length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased selection:bg-emerald-500 selection:text-white">
      {/* Top Header with Real-Time Save button */}
      <Header
        data={data}
        onRealtimeSave={() => handleRealtimeSave()}
        isSaving={isSaving}
        lastSavedAt={lastSavedAt}
        onOpenNewTransaction={() => {
          setEditingTx(null);
          setIsTxModalOpen(true);
        }}
        onOpenGoogleSheetModal={() => setActiveTab('googlesheets')}
      />

      {/* Main Tab Navigation */}
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        transactionsCount={data.transactions.length}
        savingsCount={data.savingsAccounts.length}
        investmentsCount={totalInvestmentsCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'overview' && (
          <OverviewTab
            data={data}
            onNavigateTab={setActiveTab}
            onOpenNewTransaction={() => {
              setEditingTx(null);
              setIsTxModalOpen(true);
            }}
            onEditTransaction={(tx) => {
              setEditingTx(tx);
              setIsTxModalOpen(true);
            }}
            onDeleteTransaction={handleDeleteTransaction}
          />
        )}

        {activeTab === 'salary' && (
          <SalaryAndExpensesTab
            data={data}
            onUpdateSalarySettings={handleUpdateSalarySettings}
            onOpenNewTransaction={() => {
              setEditingTx(null);
              setIsTxModalOpen(true);
            }}
            onEditTransaction={(tx) => {
              setEditingTx(tx);
              setIsTxModalOpen(true);
            }}
            onDeleteTransaction={handleDeleteTransaction}
            onQuickAddSalary={handleQuickAddSalary}
          />
        )}

        {activeTab === 'savings' && (
          <SavingsTab
            data={data}
            onAddSavingsAccount={handleAddSavingsAccount}
            onUpdateSavingsAccount={handleUpdateSavingsAccount}
            onDeleteSavingsAccount={handleDeleteSavingsAccount}
            onQuickDeposit={handleQuickDeposit}
          />
        )}

        {activeTab === 'investments' && (
          <InvestmentsTab
            data={data}
            onUpdateCooperativeDeposit={handleUpdateCooperativeDeposit}
            onAddCooperativeDeposit={handleAddCooperativeDeposit}
            onDeleteCooperativeDeposit={handleDeleteCooperativeDeposit}
            onUpdateCooperativeShare={handleUpdateCooperativeShare}
            onAddCooperativeShare={handleAddCooperativeShare}
            onDeleteCooperativeShare={handleDeleteCooperativeShare}
            onUpdatePhysicalGold={handleUpdatePhysicalGold}
            onAddPhysicalGold={handleAddPhysicalGold}
            onDeletePhysicalGold={handleDeletePhysicalGold}
            onBulkUpdateGoldPrice={handleBulkUpdateGoldPrice}
            onUpdateGoldStock={handleUpdateGoldStock}
            onAddGoldStock={handleAddGoldStock}
            onDeleteGoldStock={handleDeleteGoldStock}
            onUpdateInsurance={handleUpdateInsurance}
            onAddInsurance={handleAddInsurance}
            onDeleteInsurance={handleDeleteInsurance}
            onUpdateOtherInvestment={handleUpdateOtherInvestment}
            onAddOtherInvestment={handleAddOtherInvestment}
            onDeleteOtherInvestment={handleDeleteOtherInvestment}
          />
        )}

        {activeTab === 'categories' && (
          <CategoriesAndMenuTab
            data={data}
            onAddCategory={handleAddCategory}
            onUpdateCategory={handleUpdateCategory}
            onDeleteCategory={handleDeleteCategory}
          />
        )}

        {activeTab === 'googlesheets' && (
          <GoogleSheetTab
            data={data}
            onUpdateGoogleSheetConfig={handleUpdateGoogleSheetConfig}
            onRestoreData={handleRestoreData}
            onTriggerRealtimeSave={() => handleRealtimeSave()}
          />
        )}
      </main>

      {/* Floating Real-Time Save Bar for Mobile */}
      <div className="sm:hidden fixed bottom-4 right-4 z-40 flex items-center gap-2">
        <button
          onClick={() => handleRealtimeSave()}
          disabled={isSaving}
          className="flex items-center gap-2 px-4 py-3 bg-emerald-600 active:bg-emerald-700 text-white font-bold rounded-2xl shadow-xl shadow-emerald-900/30 text-xs cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'กำลังบันทึก...' : 'บันทึก Real-time'}</span>
        </button>
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs sm:text-sm font-medium border border-slate-700 backdrop-blur-md animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white p-1 ml-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Transaction Modal (Add/Edit) */}
      <TransactionModal
        isOpen={isTxModalOpen}
        initialTransaction={editingTx}
        categories={data.categories}
        onClose={() => {
          setIsTxModalOpen(false);
          setEditingTx(null);
        }}
        onSave={handleSaveTransaction}
      />
    </div>
  );
}
