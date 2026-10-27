import React from 'react';
import {
  LayoutDashboard,
  Wallet,
  PiggyBank,
  TrendingUp,
  Sliders,
  FileSpreadsheet,
} from 'lucide-react';

export type TabKey = 'overview' | 'salary' | 'savings' | 'investments' | 'categories' | 'googlesheets';

interface NavigationProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  transactionsCount: number;
  savingsCount: number;
  investmentsCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  transactionsCount,
  savingsCount,
  investmentsCount,
}) => {
  const tabs = [
    {
      id: 'overview' as TabKey,
      label: 'ภาพรวมการเงิน',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'salary' as TabKey,
      label: 'เงินเดือน & รายรับ-รายจ่าย',
      icon: Wallet,
      badge: transactionsCount > 0 ? transactionsCount : null,
    },
    {
      id: 'savings' as TabKey,
      label: 'เงินเก็บสะสม',
      icon: PiggyBank,
      badge: savingsCount > 0 ? savingsCount : null,
    },
    {
      id: 'investments' as TabKey,
      label: 'เงินลงทุน (สหกรณ์/ทอง/ประกัน)',
      icon: TrendingUp,
      badge: investmentsCount > 0 ? investmentsCount : null,
    },
    {
      id: 'categories' as TabKey,
      label: 'แก้ไขทุกเมนู & หมวดหมู่',
      icon: Sliders,
      badge: null,
    },
    {
      id: 'googlesheets' as TabKey,
      label: 'สำรองข้อมูล Google Sheet',
      icon: FileSpreadsheet,
      badge: 'Real-time',
    },
  ];

  return (
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2.5 scrollbar-none" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`ml-1 px-1.5 py-0.5 text-[10px] rounded-full font-bold leading-none ${
                      isActive
                        ? 'bg-emerald-700/80 text-emerald-100'
                        : tab.badge === 'Real-time'
                        ? 'bg-teal-100 text-teal-700'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
