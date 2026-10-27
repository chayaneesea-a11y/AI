import { AppFinanceData, FinanceCategory } from '../types/finance';

const STORAGE_KEY = 'thai_finance_tracker_current_v1';
const SNAPSHOTS_KEY = 'thai_finance_history_snapshots_v1';
const LAST_SAVED_KEY = 'thai_finance_last_saved_time_v1';

export const DEFAULT_CATEGORIES: FinanceCategory[] = [
  // รายรับ (Income)
  { id: 'cat-sal-1', name: 'เงินเดือนหลัก', group: 'salary_income', color: '#10b981', icon: 'Briefcase' },
  { id: 'cat-sal-2', name: 'โบนัส / เงินพิเศษ', group: 'salary_income', color: '#059669', icon: 'Gift' },
  { id: 'cat-sal-3', name: 'เงินปันผลสหกรณ์ / ดอกเบี้ย', group: 'salary_income', color: '#34d399', icon: 'TrendingUp' },
  { id: 'cat-sal-4', name: 'รายได้เสริม / งานพิเศษ', group: 'salary_income', color: '#047857', icon: 'Coins' },

  // รายจ่ายประจำวัน/รายเดือน (Expenses)
  { id: 'cat-exp-1', name: 'อาหาร & เครื่องดื่ม', group: 'expense', color: '#f97316', icon: 'Utensils' },
  { id: 'cat-exp-2', name: 'ค่าที่พัก / ผ่อนคอนโด / เช่าบ้าน', group: 'expense', color: '#ef4444', icon: 'Home' },
  { id: 'cat-exp-3', name: 'ค่าเดินทาง / ค่าน้ำมัน / รถไฟฟ้า', group: 'expense', color: '#f59e0b', icon: 'Car' },
  { id: 'cat-exp-4', name: 'ค่าน้ำ-ไฟ-โทรศัพท์-เน็ต', group: 'expense', color: '#3b82f6', icon: 'Zap' },
  { id: 'cat-exp-5', name: 'ช้อปปิ้ง & ของใช้ส่วนตัว', group: 'expense', color: '#ec4899', icon: 'ShoppingBag' },
  { id: 'cat-exp-6', name: 'รักษาพยาบาล & สุขภาพ', group: 'expense', color: '#8b5cf6', icon: 'HeartPulse' },
  { id: 'cat-exp-7', name: 'ให้คนในครอบครัว', group: 'expense', color: '#6366f1', icon: 'Users' },
  { id: 'cat-exp-8', name: 'ท่องเที่ยว & สันทนาการ', group: 'expense', color: '#14b8a6', icon: 'Compass' },

  // เงินเก็บ (Savings)
  { id: 'cat-sav-1', name: 'เงินสำรองฉุกเฉิน', group: 'savings', color: '#0284c7', icon: 'ShieldCheck' },
  { id: 'cat-sav-2', name: 'ออมทรัพย์ดอกเบี้ยสูง', group: 'savings', color: '#0ea5e9', icon: 'PiggyBank' },
  { id: 'cat-sav-3', name: 'ฝากประจำ / บัญชีเป้าหมาย', group: 'savings', color: '#38bdf8', icon: 'Target' },

  // เงินลงทุน (Investment)
  { id: 'cat-inv-1', name: 'ประกันชีวิต / สะสมทรัพย์', group: 'investment', color: '#9333ea', icon: 'Shield' },
  { id: 'cat-inv-2', name: 'สหกรณ์ออมทรัพย์ (เงินฝาก)', group: 'investment', color: '#4f46e5', icon: 'Building2' },
  { id: 'cat-inv-3', name: 'สหกรณ์ออมทรัพย์ (หุ้น)', group: 'investment', color: '#4338ca', icon: 'PieChart' },
  { id: 'cat-inv-4', name: 'ทองคำสะสม (ทองคำแท่ง/รูปพรรณ)', group: 'investment', color: '#eab308', icon: 'Award' },
  { id: 'cat-inv-5', name: 'หุ้นทองคำ / กองทุนทองคำ', group: 'investment', color: '#ca8a04', icon: 'LineChart' },
  { id: 'cat-inv-6', name: 'กองทุนรวม / หุ้น / สินทรัพย์อื่นๆ', group: 'investment', color: '#16a34a', icon: 'BarChart3' },
];

export const INITIAL_FINANCE_DATA: AppFinanceData = {
  version: 1,
  lastUpdated: new Date().toISOString(),
  salarySettings: {
    monthlySalary: 45000,
    otherFixedIncome: 5000,
    payday: 25,
  },
  transactions: [
    {
      id: 'tx-1',
      date: new Date().toISOString().split('T')[0],
      type: 'salary_income',
      group: 'salary_income',
      category: 'เงินเดือนหลัก',
      amount: 45000,
      note: 'เงินเดือนประจำเดือน',
      paymentMethod: 'โอนเข้าบัญชี',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'tx-2',
      date: new Date().toISOString().split('T')[0],
      type: 'to_savings',
      group: 'savings',
      category: 'เงินสำรองฉุกเฉิน',
      amount: 5000,
      note: 'หักออมเข้าบัญชีเงินเก็บฉุกเฉิน',
      paymentMethod: 'โอนเงิน',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'tx-3',
      date: new Date().toISOString().split('T')[0],
      type: 'to_investment',
      group: 'investment',
      category: 'สหกรณ์ออมทรัพย์ (หุ้น)',
      amount: 3000,
      note: 'หักค่าหุ้นสหกรณ์จากเงินเดือนอัตโนมัติ',
      paymentMethod: 'หักเงินเดือน',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'tx-4',
      date: new Date().toISOString().split('T')[0],
      type: 'to_investment',
      group: 'investment',
      category: 'สหกรณ์ออมทรัพย์ (เงินฝาก)',
      amount: 2000,
      note: 'ฝากเข้าบัญชีเงินฝากสหกรณ์ดอกเบี้ยพิเศษ',
      paymentMethod: 'โอนเงิน',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'tx-5',
      date: new Date().toISOString().split('T')[0],
      type: 'expense',
      group: 'expense',
      category: 'ค่าที่พัก / ผ่อนคอนโด / เช่าบ้าน',
      amount: 8500,
      note: 'ค่าที่พักประจำเดือน',
      paymentMethod: 'โอนเงิน',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'tx-6',
      date: new Date().toISOString().split('T')[0],
      type: 'expense',
      group: 'expense',
      category: 'อาหาร & เครื่องดื่ม',
      amount: 450,
      note: 'ซื้อของสดและอาหารมื้อเย็น',
      paymentMethod: 'สแกน QR',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  savingsAccounts: [
    {
      id: 'sav-1',
      name: 'เงินสำรองฉุกเฉิน (K-eSavings)',
      bank: 'กสิกรไทย',
      accountNumber: 'xxx-x-12345-x',
      balance: 150000,
      interestRate: 1.5,
      targetAmount: 200000,
      note: 'เป้าหมาย 6 เท่าของค่าใช้จ่ายรายเดือน',
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'sav-2',
      name: 'บัญชีออมเพื่อเป้าหมายท่องเที่ยว',
      bank: 'กรุงไทย',
      accountNumber: 'xxx-x-67890-x',
      balance: 35000,
      interestRate: 0.5,
      targetAmount: 50000,
      note: 'ทริปพักผ่อนสิ้นปี',
      updatedAt: new Date().toISOString(),
    },
  ],
  investments: {
    insurance: [
      {
        id: 'ins-1',
        company: 'AIA ประเทศไทย',
        policyName: 'ประกันชีวิตแบบสะสมทรัพย์ สมาร์ท โพรเทคชั่น',
        policyNumber: 'AIA-98765432',
        annualPremium: 36000,
        paymentFrequency: 'yearly',
        sumAssured: 300000,
        surrenderValue: 95000,
        taxDeductibleAmount: 36000,
        startDate: '2023-01-15',
        maturityDate: '2033-01-15',
        status: 'active',
        note: 'ชำระเบี้ยครบ 5 ปี คุ้มครอง 10 ปี ลดหย่อนภาษีได้เต็มจำนวน',
        updatedAt: new Date().toISOString(),
      },
    ],
    cooperativeDeposits: [
      {
        id: 'coop-dep-1',
        coopName: 'สหกรณ์ออมทรัพย์หน่วยงาน',
        accountType: 'เงินฝากออมทรัพย์พิเศษสหกรณ์',
        accountNumber: 'COOP-DEP-00219',
        balance: 120000,
        interestRate: 3.25,
        monthlyDeposit: 2000,
        note: 'ดอกเบี้ยเงินฝากสหกรณ์ปลอดภาษี ได้รับดอกเบี้ยทุกสิ้นเดือน มิ.ย. และ ธ.ค.',
        updatedAt: new Date().toISOString(),
      },
    ],
    cooperativeShares: [
      {
        id: 'coop-sh-1',
        coopName: 'สหกรณ์ออมทรัพย์หน่วยงาน',
        shareCount: 18000,
        parValue: 10,
        totalValue: 180000,
        monthlyDeduction: 3000,
        lastDividendRate: 5.5,
        lastDividendAmount: 9900,
        note: 'หักสะสมอัตโนมัติจากเงินเดือน หุ้นละ 10 บาท ปันผลเฉลี่ย 5.5% ต่อปี',
        updatedAt: new Date().toISOString(),
      },
    ],
    physicalGold: [
      {
        id: 'gold-1',
        name: 'ทองคำแท่ง 96.5% (ฮั่วเซ่งเฮง)',
        type: 'bar',
        purity: '96.5%',
        weightBaht: 2.0,
        weightGrams: 30.488,
        costPricePerBaht: 38500,
        currentPricePerBaht: 44000,
        totalCost: 77000,
        currentValue: 88000,
        storageLocation: 'ตู้นิรภัยธนาคาร',
        note: 'ซื้อเก็บสะสมระยะยาวเพื่อป้องกันเงินเฟ้อ',
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'gold-2',
        name: 'สร้อยคอทองคำ 1 บาท',
        type: 'ornament',
        purity: '96.5%',
        weightBaht: 1.0,
        weightGrams: 15.244,
        costPricePerBaht: 34000,
        currentPricePerBaht: 43200,
        totalCost: 34000,
        currentValue: 43200,
        storageLocation: 'ตู้เซฟที่บ้าน',
        note: 'ทองคำรูปพรรณ (ราคารับซื้อคืนตามสมาคมค้าทองคำ)',
        updatedAt: new Date().toISOString(),
      },
    ],
    goldStocks: [
      {
        id: 'gold-stk-1',
        symbol: 'KT-GOLD',
        fundName: 'กองทุนเปิดเค โกลด์ (KTAM Gold)',
        brokerOrApp: 'Dime! / K-My Funds',
        units: 2500,
        avgCostPerUnit: 14.8,
        currentPricePerUnit: 17.65,
        totalCost: 37000,
        currentValue: 44125,
        note: 'กองทุนทองคำป้องกันความเสี่ยงอัตราแลกเปลี่ยน (Hedged)',
        updatedAt: new Date().toISOString(),
      },
    ],
    otherInvestments: [
      {
        id: 'oth-1',
        name: 'กองทุนรวมตราสารทุนต่างประเทศ (S&P500)',
        category: 'mutual_fund',
        institution: 'InnovestX / SCBAM',
        costValue: 60000,
        currentValue: 72500,
        note: 'DCA เดือนละ 5,000 บาทเพื่อการเกษียณ',
        updatedAt: new Date().toISOString(),
      },
    ],
  },
  categories: DEFAULT_CATEGORIES,
  googleSheetConfig: {
    webhookUrl: '',
    sheetUrl: '',
    autoSyncOnSave: true,
    lastSyncTime: null,
    syncStatus: 'idle',
    lastSyncMessage: '',
  },
};

/**
 * โหลดข้อมูลปัจจุบันจาก LocalStorage
 * ป้องกันการรีเซ็ตข้อมูลเริ่มต้น: หากมีข้อมูลเดิมที่ผู้ใช้บันทึกไว้ จะโหลดข้อมูลนั้นมาใช้เสมอ
 */
export function loadFinanceData(): AppFinanceData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AppFinanceData;
      // ตรวจสอบความถูกต้องและผสาน categories ให้ครบถ้วน
      if (parsed && parsed.investments) {
        // หากผู้ใช้ยังไม่มีบาง category ให้ผสาน default เข้าไปด้วย
        if (!parsed.categories || parsed.categories.length === 0) {
          parsed.categories = DEFAULT_CATEGORIES;
        }
        if (!parsed.googleSheetConfig) {
          parsed.googleSheetConfig = INITIAL_FINANCE_DATA.googleSheetConfig;
        }
        return parsed;
      }
    }
  } catch (error) {
    console.error('Failed to load saved finance data from localStorage:', error);
  }

  // หากเปิดใช้งานครั้งแรกสุด ให้บันทึกข้อมูลเริ่มต้นลง LocalStorage ทันที
  // เพื่อให้กลายเป็น "ข้อมูลปัจจุบัน" ตั้งแต่วินาทีแรก ไม่มีการรีเซ็ตกลับ
  saveFinanceData(INITIAL_FINANCE_DATA, false);
  return INITIAL_FINANCE_DATA;
}

/**
 * บันทึกข้อมูลปัจจุบันทับลง LocalStorage แบบ Real-time ทันที
 * พร้อมจัดเก็บประวัติ Snapshot สำรองไว้ในเครื่อง
 */
export function saveFinanceData(data: AppFinanceData, triggerWebhook = true): { success: boolean; timestamp: string } {
  try {
    const nowIso = new Date().toISOString();
    const updatedData: AppFinanceData = {
      ...data,
      lastUpdated: nowIso,
    };

    // 1. บันทึกทับเป็นข้อมูลปัจจุบัน
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
    localStorage.setItem(LAST_SAVED_KEY, nowIso);

    // 2. บันทึก Snapshot สำรอง (เก็บสูงสุด 15 ฉบับย้อนหลัง ป้องกันข้อมูลสูญหาย)
    saveSnapshot(updatedData);

    // 3. ซิงค์กับ Google Sheet Webhook หากเปิด AutoSync
    if (triggerWebhook && updatedData.googleSheetConfig.webhookUrl && updatedData.googleSheetConfig.autoSyncOnSave) {
      syncToGoogleSheets(updatedData).catch((err) => {
        console.warn('Background Google Sheets sync warning:', err);
      });
    }

    return { success: true, timestamp: nowIso };
  } catch (error) {
    console.error('Save to localStorage failed:', error);
    return { success: false, timestamp: new Date().toISOString() };
  }
}

/**
 * บันทึก Snapshot สำรองประวัติ
 */
function saveSnapshot(data: AppFinanceData) {
  try {
    const rawSnapshots = localStorage.getItem(SNAPSHOTS_KEY);
    let list: { timestamp: string; summary: string; data: AppFinanceData }[] = [];
    if (rawSnapshots) {
      list = JSON.parse(rawSnapshots);
    }
    // สรุปสั้นๆ
    const totalTransactions = data.transactions.length;
    const totalAssets = calculateNetWorth(data);
    list.unshift({
      timestamp: data.lastUpdated,
      summary: `รายการ ${totalTransactions} รายการ | รวมทรัพย์สิน ฿${totalAssets.toLocaleString()}`,
      data,
    });
    // เก็บสูงสุด 15 ประวัติ
    if (list.length > 15) {
      list = list.slice(0, 15);
    }
    localStorage.setItem(SNAPSHOTS_KEY, JSON.stringify(list));
  } catch (err) {
    console.warn('Failed to save snapshot:', err);
  }
}

/**
 * ดึงรายการ Snapshot สำรองย้อนหลัง
 */
export function getSavedSnapshots(): { timestamp: string; summary: string; data: AppFinanceData }[] {
  try {
    const raw = localStorage.getItem(SNAPSHOTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * ดึงเวลาที่บันทึกล่าสุด
 */
export function getLastSavedTime(): string | null {
  return localStorage.getItem(LAST_SAVED_KEY);
}

/**
 * คำนวณมูลค่าสินทรัพย์สุทธิทั้งหมด (Net Worth)
 */
export function calculateNetWorth(data: AppFinanceData): number {
  const savingsTotal = data.savingsAccounts.reduce((sum, item) => sum + (item.balance || 0), 0);
  const insuranceTotal = data.investments.insurance.reduce((sum, item) => sum + (item.surrenderValue || 0), 0);
  const coopDepTotal = data.investments.cooperativeDeposits.reduce((sum, item) => sum + (item.balance || 0), 0);
  const coopShareTotal = data.investments.cooperativeShares.reduce((sum, item) => sum + (item.totalValue || (item.shareCount * item.parValue) || 0), 0);
  const physicalGoldTotal = data.investments.physicalGold.reduce((sum, item) => sum + (item.currentValue || (item.weightBaht * item.currentPricePerBaht) || 0), 0);
  const goldStockTotal = data.investments.goldStocks.reduce((sum, item) => sum + (item.currentValue || (item.units * item.currentPricePerUnit) || 0), 0);
  const otherTotal = data.investments.otherInvestments.reduce((sum, item) => sum + (item.currentValue || 0), 0);

  return savingsTotal + insuranceTotal + coopDepTotal + coopShareTotal + physicalGoldTotal + goldStockTotal + otherTotal;
}

/**
 * ซิงค์ข้อมูลไปยัง Google Apps Script Webhook
 */
export async function syncToGoogleSheets(data: AppFinanceData): Promise<{ success: boolean; message: string }> {
  const url = data.googleSheetConfig.webhookUrl?.trim();
  if (!url) {
    return { success: false, message: 'ยังไม่ได้ระบุ Webhook URL ของ Google Sheets' };
  }

  try {
    const payload = {
      action: 'sync_all_data',
      timestamp: new Date().toISOString(),
      summary: {
        totalNetWorth: calculateNetWorth(data),
        salarySettings: data.salarySettings,
        totalSavings: data.savingsAccounts.reduce((s, a) => s + a.balance, 0),
        totalCooperativeDeposit: data.investments.cooperativeDeposits.reduce((s, c) => s + c.balance, 0),
        totalCooperativeShares: data.investments.cooperativeShares.reduce((s, c) => s + c.totalValue, 0),
        totalPhysicalGoldValue: data.investments.physicalGold.reduce((s, g) => s + g.currentValue, 0),
        totalGoldStocksValue: data.investments.goldStocks.reduce((s, g) => s + g.currentValue, 0),
        totalInsuranceSurrenderValue: data.investments.insurance.reduce((s, i) => s + i.surrenderValue, 0),
        totalOtherInvestments: data.investments.otherInvestments.reduce((s, o) => s + o.currentValue, 0),
      },
      transactions: data.transactions,
      savingsAccounts: data.savingsAccounts,
      investments: data.investments,
      categories: data.categories,
    };

    const res = await fetch(url, {
      method: 'POST',
      mode: 'no-cors', // Google Apps Script Web Apps require no-cors or redirect handling
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return {
      success: true,
      message: 'ส่งข้อมูลสำรองไปยัง Google Sheet สำเร็จเรียบร้อยแล้ว',
    };
  } catch (error: any) {
    console.error('Error syncing to Google Sheet:', error);
    return {
      success: false,
      message: `ไม่สามารถส่งข้อมูลไปยัง Google Sheet ได้: ${error.message || 'โปรดตรวจสอบ Webhook URL'}`,
    };
  }
}

/**
 * ดาวน์โหลด JSON Backup File
 */
export function exportBackupJSON(data: AppFinanceData) {
  const dateStr = new Date().toISOString().slice(0, 10);
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `thai_finance_backup_${dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * ดาวน์โหลด CSV รวมรายการเงินเดือนและรายรับรายจ่าย
 */
export function exportTransactionsCSV(transactions: AppFinanceData['transactions']) {
  const headers = ['วันที่', 'ประเภท', 'หมวดหมู่', 'จำนวนเงิน (บาท)', 'วิธีการชำระ', 'บันทึกเพิ่มเติม'];
  const typeMap: Record<string, string> = {
    salary_income: 'รายรับเงินเดือน',
    other_income: 'รายได้อื่น',
    expense: 'รายจ่าย',
    to_savings: 'โอนเข้าเงินเก็บ',
    to_investment: 'โอนเข้าเงินลงทุน',
  };

  const rows = transactions.map((t) => [
    t.date,
    typeMap[t.type] || t.type,
    `"${(t.category || '').replace(/"/g, '""')}"`,
    t.amount,
    `"${(t.paymentMethod || '').replace(/"/g, '""')}"`,
    `"${(t.note || '').replace(/"/g, '""')}"`,
  ]);

  // UTF-8 BOM so Excel & Google Sheets displays Thai language properly
  const bom = '\uFEFF';
  const csvContent = bom + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `financial_transactions_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * คัดลอกตารางข้อมูลที่จัดรูปแบบแล้วสำหรับกดวาง (Ctrl+V) ลง Google Sheets ทันที
 */
export function generateCopyableGoogleSheetsData(data: AppFinanceData): string {
  const netWorth = calculateNetWorth(data);
  const totalSavings = data.savingsAccounts.reduce((s, a) => s + a.balance, 0);
  const totalInsurance = data.investments.insurance.reduce((s, i) => s + i.surrenderValue, 0);
  const totalCoopDep = data.investments.cooperativeDeposits.reduce((s, c) => s + c.balance, 0);
  const totalCoopShare = data.investments.cooperativeShares.reduce((s, c) => s + c.totalValue, 0);
  const totalPhysicalGold = data.investments.physicalGold.reduce((s, g) => s + g.currentValue, 0);
  const totalGoldStock = data.investments.goldStocks.reduce((s, g) => s + g.currentValue, 0);
  const totalOther = data.investments.otherInvestments.reduce((s, o) => s + o.currentValue, 0);
  const totalInvestment = totalInsurance + totalCoopDep + totalCoopShare + totalPhysicalGold + totalGoldStock + totalOther;

  let tsv = '';
  tsv += `=== สรุปภาพรวมทางการเงินล่าสุด (อัปเดต ณ ${new Date(data.lastUpdated).toLocaleString('th-TH')}) ===\n`;
  tsv += `หมวดหมู่สินทรัพย์\tมูลค่าปัจจุบัน (บาท)\tสัดส่วน (%)\n`;
  tsv += `1. เงินเก็บสะสม\t${totalSavings}\t${netWorth > 0 ? ((totalSavings / netWorth) * 100).toFixed(1) : 0}%\n`;
  tsv += `2. สหกรณ์ออมทรัพย์ (เงินฝาก)\t${totalCoopDep}\t${netWorth > 0 ? ((totalCoopDep / netWorth) * 100).toFixed(1) : 0}%\n`;
  tsv += `3. สหกรณ์ออมทรัพย์ (หุ้น)\t${totalCoopShare}\t${netWorth > 0 ? ((totalCoopShare / netWorth) * 100).toFixed(1) : 0}%\n`;
  tsv += `4. ทองคำสะสม (ทองแท่ง/รูปพรรณ)\t${totalPhysicalGold}\t${netWorth > 0 ? ((totalPhysicalGold / netWorth) * 100).toFixed(1) : 0}%\n`;
  tsv += `5. หุ้นทองคำ / กองทุนทองคำ\t${totalGoldStock}\t${netWorth > 0 ? ((totalGoldStock / netWorth) * 100).toFixed(1) : 0}%\n`;
  tsv += `6. ประกันชีวิต (มูลค่าสะสม/เวนคืน)\t${totalInsurance}\t${netWorth > 0 ? ((totalInsurance / netWorth) * 100).toFixed(1) : 0}%\n`;
  tsv += `7. สินทรัพย์ลงทุนอื่นๆ\t${totalOther}\t${netWorth > 0 ? ((totalOther / netWorth) * 100).toFixed(1) : 0}%\n`;
  tsv += `รวมสินทรัพย์ทั้งหมด\t${netWorth}\t100%\n\n`;

  tsv += `=== รายการทองคำสะสม ===\n`;
  tsv += `ชื่อรายการ\tประเภท\tน้ำหนัก (บาททอง)\tต้นทุนต่อบาท\tราคาตลาดต่อบาท\tรวมต้นทุน\tมูลค่าปัจจุบัน\tกำไร/ขาดทุน\n`;
  data.investments.physicalGold.forEach((g) => {
    tsv += `${g.name}\t${g.type === 'bar' ? 'ทองแท่ง' : 'ทองรูปพรรณ'}\t${g.weightBaht}\t${g.costPricePerBaht}\t${g.currentPricePerBaht}\t${g.totalCost}\t${g.currentValue}\t${g.currentValue - g.totalCost}\n`;
  });

  tsv += `\n=== หุ้นสหกรณ์ & เงินฝากสหกรณ์ ===\n`;
  tsv += `รายการ\tรายละเอียด\tยอดเงิน / หุ้น\tมูลค่าปัจจุบัน\tผลตอบแทน\n`;
  data.investments.cooperativeShares.forEach((s) => {
    tsv += `${s.coopName}\tหุ้นสหกรณ์ (${s.shareCount.toLocaleString()} หุ้น)\tหักเดือนละ ฿${s.monthlyDeduction.toLocaleString()}\t${s.totalValue}\tปันผล ${s.lastDividendRate}%\n`;
  });
  data.investments.cooperativeDeposits.forEach((d) => {
    tsv += `${d.coopName}\t${d.accountType}\tฝากเพิ่มเดือนละ ฿${(d.monthlyDeposit || 0).toLocaleString()}\t${d.balance}\tดอกเบี้ย ${d.interestRate}%\n`;
  });

  tsv += `\n=== ประกันชีวิต ===\n`;
  tsv += `บริษัท\tแบบประกัน\tเบี้ย/ปี\tทุนประกัน\tมูลค่าเวนคืนสะสม\tสถานะ\n`;
  data.investments.insurance.forEach((i) => {
    tsv += `${i.company}\t${i.policyName}\t${i.annualPremium}\t${i.sumAssured}\t${i.surrenderValue}\t${i.status}\n`;
  });

  tsv += `\n=== รายการบันทึกรายรับ-รายจ่ายล่าสุด ===\n`;
  tsv += `วันที่\tหมวดหมู่\tประเภท\tจำนวนเงิน (บาท)\tวิธีชำระ\tหมายเหตุ\n`;
  data.transactions.forEach((t) => {
    tsv += `${t.date}\t${t.category}\t${t.group}\t${t.amount}\t${t.paymentMethod || '-'}\t${t.note || '-'}\n`;
  });

  return tsv;
}

/**
 * รหัสสคริปต์ Google Apps Script สำเร็จรูปที่ผู้ใช้นำไปวางใน Google Sheet ได้ทันที
 */
export function getGoogleAppsScriptTemplate(): string {
  return `/**
 * สคริปต์สำรองข้อมูลการเงินลง Google Sheet อัตโนมัติแบบ Real-time
 * ขั้นตอนการติดตั้ง:
 * 1. เปิด Google Sheet ใหม่
 * 2. ไปที่เมนู ส่วนขยาย (Extensions) > Apps Script
 * 3. ลบโค้ดเดิมทั้งหมด แล้ววางโค้ดด้านล่างนี้ลงไป
 * 4. กดปุ่ม 'ทำให้ใช้งานได้' (Deploy) > 'การทำให้ใช้งานได้ใหม่' (New deployment)
 * 5. เลือกประเภท 'เว็บแอป' (Web app)
 * 6. ในช่อง 'ผู้ที่มีสิทธิ์เข้าถึง' (Who has access) ให้เลือก 'ทุกคน' (Anyone)
 * 7. คัดลอก Web App URL ที่ได้ นำมาวางในระบบบันทึกการเงินในช่อง Webhook URL
 */

function doPost(e) {
  try {
    var rawData = e.postData.contents;
    var payload = JSON.parse(rawData);
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    // 1. บันทึกข้อมูลสรุปภาพรวม (Summary Sheet)
    var summarySheet = ss.getSheetByName("ภาพรวมการเงิน") || ss.insertSheet("ภาพรวมการเงิน");
    summarySheet.clear();
    summarySheet.appendRow(["รายงานสำรองข้อมูลการเงินอัตโนมัติ", "อัปเดตเมื่อ: " + new Date().toLocaleString("th-TH")]);
    summarySheet.appendRow([""]);
    summarySheet.appendRow(["หมวดหมู่", "มูลค่าสะสม (บาท)"]);
    summarySheet.appendRow(["1. เงินเก็บสะสม (เงินฝาก)", payload.summary.totalSavings]);
    summarySheet.appendRow(["2. สหกรณ์ออมทรัพย์ (เงินฝาก)", payload.summary.totalCooperativeDeposit]);
    summarySheet.appendRow(["3. สหกรณ์ออมทรัพย์ (หุ้น)", payload.summary.totalCooperativeShares]);
    summarySheet.appendRow(["4. ทองคำสะสม (ทองแท่ง/รูปพรรณ)", payload.summary.totalPhysicalGoldValue]);
    summarySheet.appendRow(["5. หุ้นทองคำ / กองทุนทองคำ", payload.summary.totalGoldStocksValue]);
    summarySheet.appendRow(["6. ประกันชีวิต (มูลค่าเวนคืน)", payload.summary.totalInsuranceSurrenderValue]);
    summarySheet.appendRow(["7. การลงทุนอื่นๆ", payload.summary.totalOtherInvestments]);
    summarySheet.appendRow(["รวมมูลค่าทรัพย์สินสุทธิทั้งสิ้น (Net Worth)", payload.summary.totalNetWorth]);

    // 2. บันทึกประวัติรายการ (Transactions Sheet)
    var txSheet = ss.getSheetByName("รายรับรายจ่าย") || ss.insertSheet("รายรับรายจ่าย");
    txSheet.clear();
    txSheet.appendRow(["วันที่", "ประเภท", "หมวดหมู่", "จำนวนเงิน (บาท)", "วิธีชำระ", "หมายเหตุ"]);
    if (payload.transactions && payload.transactions.length > 0) {
      for (var i = 0; i < payload.transactions.length; i++) {
        var t = payload.transactions[i];
        txSheet.appendRow([t.date, t.group, t.category, t.amount, t.paymentMethod || "-", t.note || "-"]);
      }
    }

    // 3. บันทึกทองคำ & สหกรณ์ (Investments Sheet)
    var invSheet = ss.getSheetByName("ทองคำและสหกรณ์") || ss.insertSheet("ทองคำและสหกรณ์");
    invSheet.clear();
    invSheet.appendRow(["หมวดสินทรัพย์", "รายการ", "จำนวน/น้ำหนัก", "ต้นทุนรวม", "มูลค่าตลาดปัจจุบัน", "หมายเหตุ"]);
    
    // ทองคำ
    if (payload.investments && payload.investments.physicalGold) {
      payload.investments.physicalGold.forEach(function(g) {
        invSheet.appendRow(["ทองคำสะสม", g.name, g.weightBaht + " บาททอง", g.totalCost, g.currentValue, g.note || ""]);
      });
    }
    // สหกรณ์
    if (payload.investments && payload.investments.cooperativeShares) {
      payload.investments.cooperativeShares.forEach(function(s) {
        invSheet.appendRow(["หุ้นสหกรณ์", s.coopName, s.shareCount + " หุ้น", s.totalValue, s.totalValue, "ปันผล " + s.lastDividendRate + "%"]);
      });
    }
    if (payload.investments && payload.investments.cooperativeDeposits) {
      payload.investments.cooperativeDeposits.forEach(function(d) {
        invSheet.appendRow(["เงินฝากสหกรณ์", d.coopName + " (" + d.accountType + ")", "-", d.balance, d.balance, "ดอกเบี้ย " + d.interestRate + "%"]);
      });
    }

    return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Saved to Google Sheet successfully" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`;
}
