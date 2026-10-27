import React, { useState } from 'react';
import {
  TrendingUp,
  Building2,
  Award,
  Shield,
  Layers,
  Plus,
  Edit2,
  Trash2,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Coins,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import {
  AppFinanceData,
  CooperativeDeposit,
  CooperativeShare,
  PhysicalGold,
  GoldStock,
  LifeInsurancePolicy,
  OtherInvestment,
} from '../types/finance';

interface InvestmentsTabProps {
  data: AppFinanceData;
  onUpdateCooperativeDeposit: (item: CooperativeDeposit) => void;
  onAddCooperativeDeposit: (item: Omit<CooperativeDeposit, 'id' | 'updatedAt'>) => void;
  onDeleteCooperativeDeposit: (id: string) => void;

  onUpdateCooperativeShare: (item: CooperativeShare) => void;
  onAddCooperativeShare: (item: Omit<CooperativeShare, 'id' | 'updatedAt'>) => void;
  onDeleteCooperativeShare: (id: string) => void;

  onUpdatePhysicalGold: (item: PhysicalGold) => void;
  onAddPhysicalGold: (item: Omit<PhysicalGold, 'id' | 'updatedAt'>) => void;
  onDeletePhysicalGold: (id: string) => void;
  onBulkUpdateGoldPrice: (newPricePerBaht: number) => void;

  onUpdateGoldStock: (item: GoldStock) => void;
  onAddGoldStock: (item: Omit<GoldStock, 'id' | 'updatedAt'>) => void;
  onDeleteGoldStock: (id: string) => void;

  onUpdateInsurance: (item: LifeInsurancePolicy) => void;
  onAddInsurance: (item: Omit<LifeInsurancePolicy, 'id' | 'updatedAt'>) => void;
  onDeleteInsurance: (id: string) => void;

  onUpdateOtherInvestment: (item: OtherInvestment) => void;
  onAddOtherInvestment: (item: Omit<OtherInvestment, 'id' | 'updatedAt'>) => void;
  onDeleteOtherInvestment: (id: string) => void;
}

type SubTab = 'cooperative' | 'gold' | 'insurance' | 'other';

export const InvestmentsTab: React.FC<InvestmentsTabProps> = ({
  data,
  onUpdateCooperativeDeposit,
  onAddCooperativeDeposit,
  onDeleteCooperativeDeposit,
  onUpdateCooperativeShare,
  onAddCooperativeShare,
  onDeleteCooperativeShare,
  onUpdatePhysicalGold,
  onAddPhysicalGold,
  onDeletePhysicalGold,
  onBulkUpdateGoldPrice,
  onUpdateGoldStock,
  onAddGoldStock,
  onDeleteGoldStock,
  onUpdateInsurance,
  onAddInsurance,
  onDeleteInsurance,
  onUpdateOtherInvestment,
  onAddOtherInvestment,
  onDeleteOtherInvestment,
}) => {
  const [subTab, setSubTab] = useState<SubTab>('cooperative');

  // Modal states
  const [modalType, setModalType] = useState<string | null>(null);
  const [editItem, setEditItem] = useState<any>(null);

  // Quick gold price bulk updater state
  const [quickGoldPrice, setQuickGoldPrice] = useState<number>(44000);
  const [isUpdatingGoldPrice, setIsUpdatingGoldPrice] = useState(false);

  // Totals
  const coopDepTotal = data.investments.cooperativeDeposits.reduce((s, c) => s + (c.balance || 0), 0);
  const coopShareTotal = data.investments.cooperativeShares.reduce(
    (s, c) => s + (c.totalValue || c.shareCount * c.parValue || 0),
    0
  );
  const totalCoop = coopDepTotal + coopShareTotal;

  const physicalGoldCost = data.investments.physicalGold.reduce((s, g) => s + (g.totalCost || 0), 0);
  const physicalGoldValue = data.investments.physicalGold.reduce((s, g) => s + (g.currentValue || 0), 0);
  const physicalGoldProfit = physicalGoldValue - physicalGoldCost;

  const goldStockCost = data.investments.goldStocks.reduce((s, g) => s + (g.totalCost || 0), 0);
  const goldStockValue = data.investments.goldStocks.reduce((s, g) => s + (g.currentValue || 0), 0);
  const goldStockProfit = goldStockValue - goldStockCost;

  const totalGoldValue = physicalGoldValue + goldStockValue;
  const totalGoldProfit = physicalGoldProfit + goldStockProfit;

  const insuranceTotalCashValue = data.investments.insurance.reduce((s, i) => s + (i.surrenderValue || 0), 0);
  const insuranceTotalCoverage = data.investments.insurance.reduce((s, i) => s + (i.sumAssured || 0), 0);

  const otherTotalValue = data.investments.otherInvestments.reduce((s, o) => s + (o.currentValue || 0), 0);

  const grandTotalInvestments = totalCoop + totalGoldValue + insuranceTotalCashValue + otherTotalValue;

  return (
    <div className="space-y-6">
      {/* Top Banner: Investments Portfolio Overview */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-3">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>พอร์ตเงินลงทุนสะสมระยะยาว</span>
          </div>
          <h2 className="text-sm sm:text-base text-slate-300 font-medium">มูลค่าเงินลงทุนรวมทั้งหมด</h2>
          <div className="text-3xl sm:text-5xl font-extrabold text-white mt-1">
            ฿{grandTotalInvestments.toLocaleString()}
          </div>
          <p className="text-xs text-slate-300 mt-2">
            สหกรณ์ออมทรัพย์ • ทองคำสะสม & หุ้นทองคำ • ประกันชีวิต • กองทุนอื่นๆ (แก้ไขได้ทุกเมนู)
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 bg-white/10 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
          <div>
            <div className="text-xs text-slate-400">สหกรณ์ออมทรัพย์</div>
            <div className="text-base sm:text-lg font-bold text-indigo-300">
              ฿{totalCoop.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-400">ทองคำ & หุ้นทอง</div>
            <div className="text-base sm:text-lg font-bold text-amber-300">
              ฿{totalGoldValue.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-400">ประกันชีวิต (เวนคืน)</div>
            <div className="text-base sm:text-lg font-bold text-purple-300">
              ฿{insuranceTotalCashValue.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-400">การลงทุนอื่นๆ</div>
            <div className="text-base sm:text-lg font-bold text-emerald-300">
              ฿{otherTotalValue.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Sub Tabs Selector */}
      <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs flex overflow-x-auto space-x-1">
        <button
          onClick={() => setSubTab('cooperative')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
            subTab === 'cooperative'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>สหกรณ์ออมทรัพย์ (เงินฝาก & หุ้น)</span>
          <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full">
            ฿{totalCoop.toLocaleString()}
          </span>
        </button>

        <button
          onClick={() => setSubTab('gold')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
            subTab === 'gold'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>ทองคำ (ทองคำสะสม & หุ้นทองคำ)</span>
          <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full">
            ฿{totalGoldValue.toLocaleString()}
          </span>
        </button>

        <button
          onClick={() => setSubTab('insurance')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
            subTab === 'insurance'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>ประกันชีวิต</span>
          <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full">
            ฿{insuranceTotalCashValue.toLocaleString()}
          </span>
        </button>

        <button
          onClick={() => setSubTab('other')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
            subTab === 'other'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>สินทรัพย์ลงทุนอื่นๆ</span>
          <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full">
            ฿{otherTotalValue.toLocaleString()}
          </span>
        </button>
      </div>

      {/* SUBTAB 1: สหกรณ์ออมทรัพย์ (Cooperative) */}
      {subTab === 'cooperative' && (
        <div className="space-y-6">
          {/* Section A: หุ้นสหกรณ์ (Cooperative Shares) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-800 text-base sm:text-lg">
                    1. หุ้นสหกรณ์ออมทรัพย์ (Cooperative Shares)
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
                    รวม ฿{coopShareTotal.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  หุ้นละ 10 บาท • หักสะสมรายเดือนจากเงินเดือน • ได้รับเงินปันผลประจำปี
                </p>
              </div>
              <button
                onClick={() => {
                  setModalType('coop_share');
                  setEditItem(null);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>เพิ่มหุ้นสหกรณ์</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {data.investments.cooperativeShares.map((share) => (
                <div
                  key={share.id}
                  className="bg-indigo-50/40 border border-indigo-100 rounded-2xl p-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900 text-base">{share.coopName}</h4>
                        <span className="text-xs text-indigo-700 font-medium">
                          หุ้นละ ฿{share.parValue || 10} • ทั้งหมด {share.shareCount.toLocaleString()} หุ้น
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setModalType('coop_share');
                            setEditItem(share);
                          }}
                          title="แก้ไขข้อมูลหุ้น"
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteCooperativeShare(share.id)}
                          title="ลบ"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="text-xs text-slate-500">มูลค่าหุ้นสะสมรวม</div>
                      <div className="text-2xl font-bold text-indigo-700 mt-0.5">
                        ฿{share.totalValue.toLocaleString()}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-indigo-100/60 text-xs">
                      <div>
                        <span className="text-slate-400">หักเงินเดือนสะสม:</span>
                        <div className="font-semibold text-slate-700">
                          ฿{share.monthlyDeduction.toLocaleString()}/เดือน
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-400">เงินปันผลล่าสุด:</span>
                        <div className="font-semibold text-emerald-600">
                          {share.lastDividendRate}% (฿{share.lastDividendAmount.toLocaleString()})
                        </div>
                      </div>
                    </div>

                    {share.note && (
                      <p className="text-xs text-slate-500 mt-2.5 bg-white p-2 rounded-lg border border-indigo-100">
                        📌 {share.note}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section B: เงินฝากสหกรณ์ (Cooperative Deposits) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-800 text-base sm:text-lg">
                    2. เงินฝากสหกรณ์ออมทรัพย์ (Cooperative Deposits)
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
                    รวม ฿{coopDepTotal.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  บัญชีเงินฝากสหกรณ์ดอกเบี้ยสูงพิเศษ ดอกเบี้ยได้รับการยกเว้นภาษี
                </p>
              </div>
              <button
                onClick={() => {
                  setModalType('coop_dep');
                  setEditItem(null);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>เพิ่มบัญชีเงินฝากสหกรณ์</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {data.investments.cooperativeDeposits.map((dep) => (
                <div
                  key={dep.id}
                  className="bg-indigo-50/40 border border-indigo-100 rounded-2xl p-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900 text-base">{dep.coopName}</h4>
                        <span className="text-xs text-indigo-700 font-medium">
                          {dep.accountType} {dep.accountNumber ? `(${dep.accountNumber})` : ''}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setModalType('coop_dep');
                            setEditItem(dep);
                          }}
                          title="แก้ไขเงินฝากสหกรณ์"
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteCooperativeDeposit(dep.id)}
                          title="ลบ"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="text-xs text-slate-500">ยอดเงินฝากสะสม</div>
                      <div className="text-2xl font-bold text-slate-900 mt-0.5">
                        ฿{dep.balance.toLocaleString()}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-indigo-100/60 text-xs">
                      <div>
                        <span className="text-slate-400">อัตราดอกเบี้ย:</span>
                        <div className="font-semibold text-indigo-700">{dep.interestRate}% ต่อปี</div>
                      </div>
                      <div>
                        <span className="text-slate-400">ฝากเพิ่มต่อเดือน:</span>
                        <div className="font-semibold text-slate-700">
                          {dep.monthlyDeposit ? `฿${dep.monthlyDeposit.toLocaleString()}` : '-'}
                        </div>
                      </div>
                    </div>

                    {dep.note && (
                      <p className="text-xs text-slate-500 mt-2.5 bg-white p-2 rounded-lg border border-indigo-100">
                        📌 {dep.note}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: ทองคำ (Gold - Physical & Gold Stocks) */}
      {subTab === 'gold' && (
        <div className="space-y-6">
          {/* Quick Gold Price Bulk Updater Bar */}
          <div className="bg-amber-500/10 border border-amber-300 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
                Au
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">
                  อัปเดตราคาทองคำตลาดปัจจุบัน (บาทละ)
                </h4>
                <p className="text-xs text-slate-500">
                  ปรับราคาตลาดต่อบาททองคำเพื่อคำนวณกำไร/ขาดทุนของทองคำสะสมทั้งหมดทันที
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <input
                type="number"
                value={quickGoldPrice}
                onChange={(e) => setQuickGoldPrice(Number(e.target.value))}
                className="px-3 py-1.5 bg-white border border-amber-300 rounded-xl text-sm font-bold text-amber-900 w-36 text-center focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                onClick={() => {
                  if (quickGoldPrice > 0) {
                    onBulkUpdateGoldPrice(quickGoldPrice);
                    setIsUpdatingGoldPrice(true);
                    setTimeout(() => setIsUpdatingGoldPrice(false), 1500);
                  }
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer shadow-xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isUpdatingGoldPrice ? 'animate-spin' : ''}`} />
                <span>{isUpdatingGoldPrice ? 'อัปเดตแล้ว!' : 'คำนวณมูลค่าทองใหม่'}</span>
              </button>
            </div>
          </div>

          {/* Section A: ทองคำสะสม (Physical Gold) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-800 text-base sm:text-lg">
                    1. ทองคำสะสม (ทองคำแท่ง & ทองรูปพรรณ)
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700">
                    รวม ฿{physicalGoldValue.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  รวมกำไร/ขาดทุนสะสม: {' '}
                  <span
                    className={`font-bold ${
                      physicalGoldProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {physicalGoldProfit >= 0 ? '+' : ''}฿{physicalGoldProfit.toLocaleString()} (
                    {physicalGoldCost > 0
                      ? `${((physicalGoldProfit / physicalGoldCost) * 100).toFixed(1)}%`
                      : '0%'}
                    )
                  </span>
                </p>
              </div>
              <button
                onClick={() => {
                  setModalType('gold_physical');
                  setEditItem(null);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>เพิ่มทองคำสะสม</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {data.investments.physicalGold.map((gold) => {
                const profit = gold.currentValue - gold.totalCost;
                const profitPct = gold.totalCost > 0 ? (profit / gold.totalCost) * 100 : 0;

                return (
                  <div
                    key={gold.id}
                    className="bg-amber-50/40 border border-amber-200/80 rounded-2xl p-4 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                gold.type === 'bar'
                                  ? 'bg-amber-200 text-amber-900'
                                  : 'bg-orange-100 text-orange-900'
                              }`}
                            >
                              {gold.type === 'bar' ? 'ทองคำแท่ง' : 'ทองรูปพรรณ'}
                            </span>
                            <span className="text-xs text-slate-500 font-medium">{gold.purity}</span>
                          </div>
                          <h4 className="font-bold text-slate-900 text-base mt-1">{gold.name}</h4>
                          <span className="text-xs text-slate-500">
                            น้ำหนัก: <strong>{gold.weightBaht} บาททอง</strong>{' '}
                            {gold.weightGrams ? `(~${gold.weightGrams} กรัม)` : ''}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setModalType('gold_physical');
                              setEditItem(gold);
                            }}
                            title="แก้ไขข้อมูลทองคำ"
                            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeletePhysicalGold(gold.id)}
                            title="ลบ"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-4 flex items-end justify-between">
                        <div>
                          <div className="text-xs text-slate-400">มูลค่าปัจจุบัน</div>
                          <div className="text-2xl font-bold text-amber-800 mt-0.5">
                            ฿{gold.currentValue.toLocaleString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <span
                            className={`inline-flex items-center text-xs font-bold px-2 py-0.5 rounded-lg ${
                              profit >= 0
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {profit >= 0 ? '+' : ''}฿{profit.toLocaleString()} ({profitPct.toFixed(1)}%)
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-amber-200/60 text-xs">
                        <div>
                          <span className="text-slate-400">ต้นทุนซื้อ:</span>
                          <div className="font-semibold text-slate-700">
                            ฿{gold.costPricePerBaht.toLocaleString()}/บาท (รวม ฿{gold.totalCost.toLocaleString()})
                          </div>
                        </div>
                        <div>
                          <span className="text-slate-400">ราคาตลาดปัจจุบัน:</span>
                          <div className="font-semibold text-amber-900">
                            ฿{gold.currentPricePerBaht.toLocaleString()}/บาท
                          </div>
                        </div>
                      </div>

                      {gold.storageLocation && (
                        <div className="text-[11px] text-slate-500 mt-2">
                          📍 สถานที่เก็บ: {gold.storageLocation}
                        </div>
                      )}

                      {gold.note && (
                        <p className="text-xs text-slate-500 mt-2 bg-white p-2 rounded-lg border border-amber-200">
                          📌 {gold.note}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section B: หุ้นทองคำ / กองทุนทองคำ (Gold Stocks & Funds) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-800 text-base sm:text-lg">
                    2. หุ้นทองคำ & กองทุนรวมทองคำ (Gold Stocks & Funds)
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700">
                    รวม ฿{goldStockValue.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  กองทุนทองคำในแอป Dime!, InnovestX, Finnomena หรือ หุ้นเหมืองทองคำ
                </p>
              </div>
              <button
                onClick={() => {
                  setModalType('gold_stock');
                  setEditItem(null);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>เพิ่มหุ้น/กองทุนทองคำ</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {data.investments.goldStocks.map((stock) => {
                const profit = stock.currentValue - stock.totalCost;
                const profitPct = stock.totalCost > 0 ? (profit / stock.totalCost) * 100 : 0;

                return (
                  <div
                    key={stock.id}
                    className="bg-amber-50/40 border border-amber-200/80 rounded-2xl p-4 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-amber-200 text-amber-900">
                              {stock.symbol}
                            </span>
                            <span className="text-xs text-slate-500">{stock.brokerOrApp}</span>
                          </div>
                          <h4 className="font-bold text-slate-900 text-base mt-1">{stock.fundName}</h4>
                          <span className="text-xs text-slate-500">
                            จำนวน: <strong>{stock.units.toLocaleString()} หน่วย</strong>
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setModalType('gold_stock');
                              setEditItem(stock);
                            }}
                            title="แก้ไขหุ้นทองคำ"
                            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteGoldStock(stock.id)}
                            title="ลบ"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-4 flex items-end justify-between">
                        <div>
                          <div className="text-xs text-slate-400">มูลค่าตลาดปัจจุบัน</div>
                          <div className="text-2xl font-bold text-amber-800 mt-0.5">
                            ฿{stock.currentValue.toLocaleString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <span
                            className={`inline-flex items-center text-xs font-bold px-2 py-0.5 rounded-lg ${
                              profit >= 0
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {profit >= 0 ? '+' : ''}฿{profit.toLocaleString()} ({profitPct.toFixed(1)}%)
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-amber-200/60 text-xs">
                        <div>
                          <span className="text-slate-400">ต้นทุนเฉลี่ย:</span>
                          <div className="font-semibold text-slate-700">
                            ฿{stock.avgCostPerUnit.toLocaleString()}/หน่วย
                          </div>
                        </div>
                        <div>
                          <span className="text-slate-400">ราคาตลาดปัจจุบัน:</span>
                          <div className="font-semibold text-amber-900">
                            ฿{stock.currentPricePerUnit.toLocaleString()}/หน่วย
                          </div>
                        </div>
                      </div>

                      {stock.note && (
                        <p className="text-xs text-slate-500 mt-2 bg-white p-2 rounded-lg border border-amber-200">
                          📌 {stock.note}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: ประกันชีวิต (Life Insurance) */}
      {subTab === 'insurance' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-800 text-base sm:text-lg">
                    ประกันชีวิต & ประกันสะสมทรัพย์ (Life Insurance)
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700">
                    มูลค่าสะสม ฿{insuranceTotalCashValue.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  ทุนประกันชีวิตคุ้มครองรวม ฿{insuranceTotalCoverage.toLocaleString()} •
                  สามารถใช้ลดหย่อนภาษีได้
                </p>
              </div>
              <button
                onClick={() => {
                  setModalType('insurance');
                  setEditItem(null);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>เพิ่มกรมธรรม์ประกัน</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {data.investments.insurance.map((ins) => (
                <div
                  key={ins.id}
                  className="bg-purple-50/40 border border-purple-100 rounded-2xl p-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-purple-100 text-purple-800">
                            {ins.company}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {ins.policyNumber || 'ไม่มีเลขกรมธรรม์'}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-base mt-1">{ins.policyName}</h4>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setModalType('insurance');
                            setEditItem(ins);
                          }}
                          title="แก้ไขกรมธรรม์"
                          className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteInsurance(ins.id)}
                          title="ลบ"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-4 bg-white p-3 rounded-xl border border-purple-100">
                      <div>
                        <span className="text-[11px] text-slate-400">มูลค่าเวนคืนสะสมปัจจุบัน:</span>
                        <div className="text-xl font-bold text-purple-700">
                          ฿{ins.surrenderValue.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <span className="text-[11px] text-slate-400">ทุนประกันคุ้มครองชีวิต:</span>
                        <div className="text-xl font-bold text-slate-800">
                          ฿{ins.sumAssured.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                      <div>
                        <span className="text-slate-400">เบี้ยประกันต่อปี:</span>
                        <div className="font-semibold text-slate-700">
                          ฿{ins.annualPremium.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-400">สิทธิ์ลดหย่อนภาษี:</span>
                        <div className="font-semibold text-emerald-600">
                          ฿{ins.taxDeductibleAmount.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {(ins.startDate || ins.maturityDate) && (
                      <div className="text-[11px] text-slate-500 mt-2 flex items-center justify-between">
                        <span>เริ่ม: {ins.startDate || '-'}</span>
                        <span>ครบกำหนด: {ins.maturityDate || '-'}</span>
                      </div>
                    )}

                    {ins.note && (
                      <p className="text-xs text-slate-500 mt-2.5 bg-white p-2 rounded-lg border border-purple-100">
                        📌 {ins.note}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: สินทรัพย์ลงทุนอื่นๆ (Other Investments) */}
      {subTab === 'other' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-800 text-base sm:text-lg">
                    สินทรัพย์ลงทุนอื่นๆ (กองทุนรวม, หุ้น, คริปโต, อสังหาฯ)
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                    รวม ฿{otherTotalValue.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  กองทุนเพื่อการเกษียณ RMF / SSF / ThaiESG, หุ้นไทย, หุ้นต่างประเทศ
                </p>
              </div>
              <button
                onClick={() => {
                  setModalType('other_inv');
                  setEditItem(null);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>เพิ่มสินทรัพย์ลงทุน</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {data.investments.otherInvestments.map((inv) => (
                <div
                  key={inv.id}
                  className="bg-emerald-50/40 border border-emerald-100 rounded-2xl p-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800">
                          {inv.institution}
                        </span>
                        <h4 className="font-bold text-slate-900 text-base mt-1">{inv.name}</h4>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setModalType('other_inv');
                            setEditItem(inv);
                          }}
                          title="แก้ไขสินทรัพย์"
                          className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteOtherInvestment(inv.id)}
                          title="ลบ"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 flex items-end justify-between">
                      <div>
                        <div className="text-xs text-slate-400">มูลค่าปัจจุบัน</div>
                        <div className="text-2xl font-bold text-emerald-700 mt-0.5">
                          ฿{inv.currentValue.toLocaleString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-slate-400">ต้นทุน: ฿{inv.costValue.toLocaleString()}</div>
                        <div className="text-xs font-semibold text-emerald-600">
                          {inv.currentValue >= inv.costValue ? '+' : ''}฿
                          {(inv.currentValue - inv.costValue).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {inv.note && (
                      <p className="text-xs text-slate-500 mt-2.5 bg-white p-2 rounded-lg border border-emerald-100">
                        📌 {inv.note}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Universal Dynamic Edit Modals for Investment Sub-items */}
      {modalType && (
        <DynamicInvestmentModal
          modalType={modalType}
          initialData={editItem}
          onClose={() => {
            setModalType(null);
            setEditItem(null);
          }}
          onSave={(item) => {
            if (modalType === 'coop_share') {
              if (editItem) onUpdateCooperativeShare(item);
              else onAddCooperativeShare(item);
            } else if (modalType === 'coop_dep') {
              if (editItem) onUpdateCooperativeDeposit(item);
              else onAddCooperativeDeposit(item);
            } else if (modalType === 'gold_physical') {
              if (editItem) onUpdatePhysicalGold(item);
              else onAddPhysicalGold(item);
            } else if (modalType === 'gold_stock') {
              if (editItem) onUpdateGoldStock(item);
              else onAddGoldStock(item);
            } else if (modalType === 'insurance') {
              if (editItem) onUpdateInsurance(item);
              else onAddInsurance(item);
            } else if (modalType === 'other_inv') {
              if (editItem) onUpdateOtherInvestment(item);
              else onAddOtherInvestment(item);
            }
            setModalType(null);
            setEditItem(null);
          }}
        />
      )}
    </div>
  );
};

// Sub-component: Dynamic modal for editing investments
interface DynamicModalProps {
  modalType: string;
  initialData: any;
  onClose: () => void;
  onSave: (data: any) => void;
}

const DynamicInvestmentModal: React.FC<DynamicModalProps> = ({
  modalType,
  initialData,
  onClose,
  onSave,
}) => {
  // Cooperative Share Form
  const [coopName, setCoopName] = useState(initialData?.coopName || 'สหกรณ์ออมทรัพย์');
  const [shareCount, setShareCount] = useState(initialData?.shareCount || 1000);
  const [parValue, setParValue] = useState(initialData?.parValue || 10);
  const [monthlyDeduction, setMonthlyDeduction] = useState(initialData?.monthlyDeduction || 2000);
  const [lastDividendRate, setLastDividendRate] = useState(initialData?.lastDividendRate || 5.0);

  // Cooperative Deposit Form
  const [accountType, setAccountType] = useState(initialData?.accountType || 'เงินฝากออมทรัพย์พิเศษ');
  const [accountNumber, setAccountNumber] = useState(initialData?.accountNumber || '');
  const [balance, setBalance] = useState(initialData?.balance || 50000);
  const [interestRate, setInterestRate] = useState(initialData?.interestRate || 3.0);
  const [monthlyDeposit, setMonthlyDeposit] = useState(initialData?.monthlyDeposit || 1000);

  // Physical Gold Form
  const [goldName, setGoldName] = useState(initialData?.name || 'ทองคำแท่ง 96.5%');
  const [goldType, setGoldType] = useState<'bar' | 'ornament'>(initialData?.type || 'bar');
  const [purity, setPurity] = useState(initialData?.purity || '96.5%');
  const [weightBaht, setWeightBaht] = useState(initialData?.weightBaht || 1.0);
  const [weightGrams, setWeightGrams] = useState(initialData?.weightGrams || 15.244);
  const [costPricePerBaht, setCostPricePerBaht] = useState(initialData?.costPricePerBaht || 40000);
  const [currentPricePerBaht, setCurrentPricePerBaht] = useState(initialData?.currentPricePerBaht || 44000);
  const [storageLocation, setStorageLocation] = useState(initialData?.storageLocation || 'ตู้เซฟ');

  // Gold Stock Form
  const [symbol, setSymbol] = useState(initialData?.symbol || 'KT-GOLD');
  const [fundName, setFundName] = useState(initialData?.fundName || 'กองทุนเปิดเค โกลด์');
  const [brokerOrApp, setBrokerOrApp] = useState(initialData?.brokerOrApp || 'Dime!');
  const [units, setUnits] = useState(initialData?.units || 1000);
  const [avgCostPerUnit, setAvgCostPerUnit] = useState(initialData?.avgCostPerUnit || 15.0);
  const [currentPricePerUnit, setCurrentPricePerUnit] = useState(initialData?.currentPricePerUnit || 17.5);

  // Life Insurance Form
  const [company, setCompany] = useState(initialData?.company || 'AIA');
  const [policyName, setPolicyName] = useState(initialData?.policyName || 'ประกันชีวิตแบบสะสมทรัพย์');
  const [policyNumber, setPolicyNumber] = useState(initialData?.policyNumber || '');
  const [annualPremium, setAnnualPremium] = useState(initialData?.annualPremium || 30000);
  const [sumAssured, setSumAssured] = useState(initialData?.sumAssured || 300000);
  const [surrenderValue, setSurrenderValue] = useState(initialData?.surrenderValue || 50000);
  const [taxDeductibleAmount, setTaxDeductibleAmount] = useState(initialData?.taxDeductibleAmount || 30000);
  const [startDate, setStartDate] = useState(initialData?.startDate || '2023-01-01');
  const [maturityDate, setMaturityDate] = useState(initialData?.maturityDate || '2033-01-01');

  // Other Investment Form
  const [otherName, setOtherName] = useState(initialData?.name || 'กองทุนรวมเพื่อการเกษียณ');
  const [otherInstitution, setOtherInstitution] = useState(initialData?.institution || 'SCBAM / InnovestX');
  const [costValue, setCostValue] = useState(initialData?.costValue || 50000);
  const [currentValue, setCurrentValue] = useState(initialData?.currentValue || 55000);

  const [note, setNote] = useState(initialData?.note || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (modalType === 'coop_share') {
      const totalVal = Number(shareCount) * Number(parValue);
      const divAmt = Math.round((totalVal * Number(lastDividendRate)) / 100);
      onSave({
        ...(initialData || {}),
        coopName,
        shareCount: Number(shareCount),
        parValue: Number(parValue),
        totalValue: totalVal,
        monthlyDeduction: Number(monthlyDeduction),
        lastDividendRate: Number(lastDividendRate),
        lastDividendAmount: divAmt,
        note,
        updatedAt: new Date().toISOString(),
      });
    } else if (modalType === 'coop_dep') {
      onSave({
        ...(initialData || {}),
        coopName,
        accountType,
        accountNumber,
        balance: Number(balance),
        interestRate: Number(interestRate),
        monthlyDeposit: Number(monthlyDeposit),
        note,
        updatedAt: new Date().toISOString(),
      });
    } else if (modalType === 'gold_physical') {
      const cost = Number(weightBaht) * Number(costPricePerBaht);
      const curr = Number(weightBaht) * Number(currentPricePerBaht);
      onSave({
        ...(initialData || {}),
        name: goldName,
        type: goldType,
        purity,
        weightBaht: Number(weightBaht),
        weightGrams: Number(weightGrams) || Number(weightBaht) * 15.244,
        costPricePerBaht: Number(costPricePerBaht),
        currentPricePerBaht: Number(currentPricePerBaht),
        totalCost: cost,
        currentValue: curr,
        storageLocation,
        note,
        updatedAt: new Date().toISOString(),
      });
    } else if (modalType === 'gold_stock') {
      const cost = Number(units) * Number(avgCostPerUnit);
      const curr = Number(units) * Number(currentPricePerUnit);
      onSave({
        ...(initialData || {}),
        symbol,
        fundName,
        brokerOrApp,
        units: Number(units),
        avgCostPerUnit: Number(avgCostPerUnit),
        currentPricePerUnit: Number(currentPricePerUnit),
        totalCost: cost,
        currentValue: curr,
        note,
        updatedAt: new Date().toISOString(),
      });
    } else if (modalType === 'insurance') {
      onSave({
        ...(initialData || {}),
        company,
        policyName,
        policyNumber,
        annualPremium: Number(annualPremium),
        paymentFrequency: 'yearly',
        sumAssured: Number(sumAssured),
        surrenderValue: Number(surrenderValue),
        taxDeductibleAmount: Number(taxDeductibleAmount),
        startDate,
        maturityDate,
        status: 'active',
        note,
        updatedAt: new Date().toISOString(),
      });
    } else if (modalType === 'other_inv') {
      onSave({
        ...(initialData || {}),
        name: otherName,
        category: 'mutual_fund',
        institution: otherInstitution,
        costValue: Number(costValue),
        currentValue: Number(currentValue),
        note,
        updatedAt: new Date().toISOString(),
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-bold text-slate-800 mb-1">
          {initialData ? 'แก้ไขข้อมูล' : 'เพิ่มรายการใหม่'}
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          บันทึกทับเป็นข้อมูลปัจจุบัน สามารถแก้ไขตัวเลขและรายละเอียดได้ทุกเมื่อ
        </p>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {/* COOPERATIVE SHARE FORM */}
          {modalType === 'coop_share' && (
            <>
              <div>
                <label className="block font-medium text-slate-700 mb-1">ชื่อสหกรณ์ออมทรัพย์</label>
                <input
                  type="text"
                  value={coopName}
                  onChange={(e) => setCoopName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">จำนวนหุ้นสะสม (หุ้น)</label>
                  <input
                    type="number"
                    min="1"
                    value={shareCount}
                    onChange={(e) => setShareCount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">มูลค่าต่อหุ้น (บาท, ปกติ 10 บ.)</label>
                  <input
                    type="number"
                    min="1"
                    value={parValue}
                    onChange={(e) => setParValue(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                    required
                  />
                </div>
              </div>
              <div className="p-3 bg-indigo-50 rounded-xl text-indigo-900 text-xs">
                <span>มูลค่าหุ้นรวมคำนวณอัตโนมัติ: </span>
                <strong className="text-sm font-bold">
                  ฿{(Number(shareCount) * Number(parValue)).toLocaleString()}
                </strong>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">หักเงินเดือนสะสม (บาท/เดือน)</label>
                  <input
                    type="number"
                    value={monthlyDeduction}
                    onChange={(e) => setMonthlyDeduction(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">เงินปันผลปีล่าสุด (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={lastDividendRate}
                    onChange={(e) => setLastDividendRate(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                  />
                </div>
              </div>
            </>
          )}

          {/* COOPERATIVE DEPOSIT FORM */}
          {modalType === 'coop_dep' && (
            <>
              <div>
                <label className="block font-medium text-slate-700 mb-1">ชื่อสหกรณ์ออมทรัพย์</label>
                <input
                  type="text"
                  value={coopName}
                  onChange={(e) => setCoopName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">ประเภทบัญชีเงินฝาก</label>
                  <input
                    type="text"
                    value={accountType}
                    onChange={(e) => setAccountType(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">เลขที่บัญชี (ถ้ามี)</label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">ยอดเงินฝากสะสม (บาท)</label>
                  <input
                    type="number"
                    value={balance}
                    onChange={(e) => setBalance(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">อัตราดอกเบี้ย (% ต่อปี)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">ยอดหักฝากเพิ่มต่อเดือน (บาท)</label>
                <input
                  type="number"
                  value={monthlyDeposit}
                  onChange={(e) => setMonthlyDeposit(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                />
              </div>
            </>
          )}

          {/* PHYSICAL GOLD FORM */}
          {modalType === 'gold_physical' && (
            <>
              <div>
                <label className="block font-medium text-slate-700 mb-1">ชื่อรายการทองคำ</label>
                <input
                  type="text"
                  placeholder="เช่น ทองคำแท่ง 96.5% ฮั่วเซ่งเฮง, สร้อยคอ 1 บาท"
                  value={goldName}
                  onChange={(e) => setGoldName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">ประเภท</label>
                  <select
                    value={goldType}
                    onChange={(e) => setGoldType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                  >
                    <option value="bar">ทองคำแท่ง</option>
                    <option value="ornament">ทองรูปพรรณ</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">ความบริสุทธิ์</label>
                  <select
                    value={purity}
                    onChange={(e) => setPurity(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                  >
                    <option value="96.5%">96.5% (มาตรฐานไทย)</option>
                    <option value="99.99%">99.99% (มาตรฐานสากล)</option>
                    <option value="other">อื่นๆ</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">น้ำหนัก (หน่วย: บาททอง)</label>
                  <input
                    type="number"
                    step="0.05"
                    min="0.01"
                    value={weightBaht}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setWeightBaht(val);
                      setWeightGrams(Number((val * 15.244).toFixed(3)));
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">น้ำหนัก (กรัม)</label>
                  <input
                    type="number"
                    step="0.001"
                    value={weightGrams}
                    onChange={(e) => setWeightGrams(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">ราคาต้นทุนที่ซื้อ (บาท/บาททอง)</label>
                  <input
                    type="number"
                    value={costPricePerBaht}
                    onChange={(e) => setCostPricePerBaht(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">ราคาตลาดปัจจุบัน (บาท/บาททอง)</label>
                  <input
                    type="number"
                    value={currentPricePerBaht}
                    onChange={(e) => setCurrentPricePerBaht(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-semibold text-amber-700"
                    required
                  />
                </div>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl text-amber-900 text-xs flex justify-between">
                <span>มูลค่าปัจจุบัน: ฿{(Number(weightBaht) * Number(currentPricePerBaht)).toLocaleString()}</span>
                <span>
                  กำไร/ขาดทุน:{' '}
                  <strong>
                    ฿{(Number(weightBaht) * (Number(currentPricePerBaht) - Number(costPricePerBaht))).toLocaleString()}
                  </strong>
                </span>
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">สถานที่จัดเก็บ</label>
                <input
                  type="text"
                  placeholder="เช่น ตู้นิรภัยธนาคาร, ตู้เซฟที่บ้าน"
                  value={storageLocation}
                  onChange={(e) => setStorageLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                />
              </div>
            </>
          )}

          {/* GOLD STOCK FORM */}
          {modalType === 'gold_stock' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">สัญลักษณ์ย่อ (Symbol)</label>
                  <input
                    type="text"
                    placeholder="เช่น KT-GOLD, GLD"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-bold uppercase"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">แอป / สถาบันการเงิน</label>
                  <input
                    type="text"
                    placeholder="เช่น Dime!, InnovestX"
                    value={brokerOrApp}
                    onChange={(e) => setBrokerOrApp(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">ชื่อกองทุน / รายการ</label>
                <input
                  type="text"
                  placeholder="เช่น กองทุนเปิดเค โกลด์"
                  value={fundName}
                  onChange={(e) => setFundName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                  required
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">จำนวนหน่วย</label>
                  <input
                    type="number"
                    step="any"
                    value={units}
                    onChange={(e) => setUnits(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">ต้นทุนเฉลี่ย/หน่วย</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={avgCostPerUnit}
                    onChange={(e) => setAvgCostPerUnit(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">ราคาปัจจุบัน/หน่วย</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={currentPricePerUnit}
                    onChange={(e) => setCurrentPricePerUnit(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm text-amber-700 font-bold"
                    required
                  />
                </div>
              </div>
            </>
          )}

          {/* LIFE INSURANCE FORM */}
          {modalType === 'insurance' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">บริษัทประกัน</label>
                  <input
                    type="text"
                    placeholder="เช่น AIA, เมืองไทยประกันชีวิต"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">เลขที่กรมธรรม์ (ถ้ามี)</label>
                  <input
                    type="text"
                    value={policyNumber}
                    onChange={(e) => setPolicyNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">ชื่อแบบประกัน</label>
                <input
                  type="text"
                  placeholder="เช่น ประกันชีวิตสะสมทรัพย์ 10/5"
                  value={policyName}
                  onChange={(e) => setPolicyName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-semibold"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    มูลค่าเวนคืนสะสมปัจจุบัน (บาท)
                  </label>
                  <input
                    type="number"
                    value={surrenderValue}
                    onChange={(e) => setSurrenderValue(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-bold text-purple-700"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">ทุนประกันคุ้มครอง (บาท)</label>
                  <input
                    type="number"
                    value={sumAssured}
                    onChange={(e) => setSumAssured(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-bold text-slate-800"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">เบี้ยประกันต่อปี (บาท)</label>
                  <input
                    type="number"
                    value={annualPremium}
                    onChange={(e) => setAnnualPremium(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">สิทธิ์ลดหย่อนภาษี (บาท)</label>
                  <input
                    type="number"
                    value={taxDeductibleAmount}
                    onChange={(e) => setTaxDeductibleAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">วันเริ่มสัญญา</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">วันครบสัญญา</label>
                  <input
                    type="date"
                    value={maturityDate}
                    onChange={(e) => setMaturityDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                  />
                </div>
              </div>
            </>
          )}

          {/* OTHER INVESTMENT FORM */}
          {modalType === 'other_inv' && (
            <>
              <div>
                <label className="block font-medium text-slate-700 mb-1">ชื่อสินทรัพย์</label>
                <input
                  type="text"
                  placeholder="เช่น กองทุนตราสารทุนโลก, หุ้นไทย SET50"
                  value={otherName}
                  onChange={(e) => setOtherName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-semibold"
                  required
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">สถาบัน / โบรกเกอร์ / แอป</label>
                <input
                  type="text"
                  placeholder="เช่น InnovestX, SCBAM, Bitkub"
                  value={otherInstitution}
                  onChange={(e) => setOtherInstitution(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">มูลค่าต้นทุนที่ซื้อ (บาท)</label>
                  <input
                    type="number"
                    value={costValue}
                    onChange={(e) => setCostValue(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">มูลค่าตลาดปัจจุบัน (บาท)</label>
                  <input
                    type="number"
                    value={currentValue}
                    onChange={(e) => setCurrentValue(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-bold text-emerald-700"
                    required
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block font-medium text-slate-700 mb-1">หมายเหตุเพิ่มเติม</label>
            <textarea
              rows={2}
              placeholder="บันทึกรายละเอียดเพิ่มเติม..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
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
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
            >
              {initialData ? 'บันทึกการแก้ไข' : 'บันทึกรายการ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
