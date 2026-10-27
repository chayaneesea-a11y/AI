export type TransactionType = 'salary_income' | 'other_income' | 'expense' | 'to_savings' | 'to_investment';

export type CategoryGroup = 'salary_income' | 'expense' | 'savings' | 'investment';

export interface Transaction {
  id: string;
  date: string; // YYYY-MM-DD
  type: TransactionType;
  category: string; // e.g., 'เงินเดือนหลัก', 'ค่าอาหาร', 'เงินฝากสหกรณ์'
  group: CategoryGroup;
  amount: number;
  note: string;
  paymentMethod?: string; // เช่น 'โอนเงิน', 'เงินสด', 'หักบัญชีเงินเดือน'
  createdAt: string;
  updatedAt: string;
}

// 1. เงินเก็บ (Savings)
export interface SavingsAccount {
  id: string;
  name: string; // เช่น 'เงินสำรองฉุกเฉิน (K-eSavings)', 'ฝากประจำ 12 เดือน'
  bank: string;
  accountNumber?: string;
  balance: number;
  interestRate: number; // % ต่อปี
  targetAmount?: number;
  note?: string;
  updatedAt: string;
}

// 2. เงินลงทุน (Investments)
// 2.1 ประกันชีวิต
export interface LifeInsurancePolicy {
  id: string;
  company: string; // เช่น 'AIA', 'เมืองไทยประกันชีวิต', 'FWD'
  policyName: string; // เช่น 'ประกันสะสมทรัพย์ 10/5', 'ประกันชีวิตตลอดชีพ'
  policyNumber?: string;
  annualPremium: number; // เบี้ยประกันต่อปี
  paymentFrequency: 'yearly' | 'monthly' | 'quarterly'; // งวดชำระ
  sumAssured: number; // ทุนประกันคุ้มครอง
  surrenderValue: number; // มูลค่าเวนคืนเงินสดสะสมปัจจุบัน
  taxDeductibleAmount: number; // ยอดลดหย่อนภาษี
  startDate: string;
  maturityDate: string;
  status: 'active' | 'paid_up' | 'matured';
  note?: string;
  updatedAt: string;
}

// 2.2 สหกรณ์ออมทรัพย์: เงินฝากสหกรณ์
export interface CooperativeDeposit {
  id: string;
  coopName: string; // เช่น 'สหกรณ์ออมทรัพย์ครู', 'สหกรณ์ออมทรัพย์พนักงาน...'
  accountType: string; // เช่น 'ออมทรัพย์พิเศษ', 'ออมทรัพย์ทั่วไป'
  accountNumber?: string;
  balance: number; // ยอดเงินฝากสะสม
  interestRate: number; // ดอกเบี้ย % (มักจะได้รับการยกเว้นภาษี)
  monthlyDeposit?: number; // ยอดหักฝากเพิ่มต่อเดือน
  note?: string;
  updatedAt: string;
}

// 2.2 สหกรณ์ออมทรัพย์: หุ้นสหกรณ์
export interface CooperativeShare {
  id: string;
  coopName: string; // เช่น 'สหกรณ์ออมทรัพย์...'
  shareCount: number; // จำนวนหุ้นสะสม
  parValue: number; // มูลค่าหุ้นละ (ปกติ 10 บาท/หุ้น)
  totalValue: number; // shareCount * parValue
  monthlyDeduction: number; // ยอดหักค่าหุ้นรายเดือนจากเงินเดือน (บาท)
  lastDividendRate: number; // เงินปันผลปีล่าสุด (%)
  lastDividendAmount: number; // เงินปันผลที่ได้รับ (บาท)
  note?: string;
  updatedAt: string;
}

// 2.3 ทองคำ: ทองคำสะสม (ทองแท่ง / ทองรูปพรรณ)
export interface PhysicalGold {
  id: string;
  name: string; // เช่น 'ทองคำแท่ง 96.5% ฮั่วเซ่งเฮง', 'สร้อยคอทองคำ 1 บาท'
  type: 'bar' | 'ornament'; // ทองแท่ง หรือ ทองรูปพรรณ
  purity: '96.5%' | '99.99%' | 'other';
  weightBaht: number; // น้ำหนัก (หน่วย: บาททอง) เช่น 1, 0.5 (2 สลึง)
  weightGrams?: number; // กรัม (1 บาท ~ 15.244 กรัม สำหรับทอง 96.5%)
  costPricePerBaht: number; // ราคาต้นทุนเฉลี่ยต่อบาท
  currentPricePerBaht: number; // ราคาตลาดปัจจุบันต่อบาท
  totalCost: number; // weightBaht * costPricePerBaht
  currentValue: number; // weightBaht * currentPricePerBaht
  storageLocation?: string; // สถานที่เก็บรักษา เช่น 'ตู้นิรภัยธนาคาร', 'ที่บ้าน'
  note?: string;
  updatedAt: string;
}

// 2.3 ทองคำ: หุ้นทองคำ / กองทุนรวมทองคำ
export interface GoldStock {
  id: string;
  symbol: string; // เช่น 'GOLD-D', 'KT-GOLD', 'TGoldH', 'IAU', 'GLD'
  fundName: string; // เช่น 'กองทุนเปิดเค โกลด์', 'SPDR Gold Shares'
  brokerOrApp: string; // เช่น 'Dime!', 'InnovestX', 'Finnomena'
  units: number; // จำนวนหน่วยลงทุน / จำนวนหุ้น
  avgCostPerUnit: number; // ราคาต้นทุนเฉลี่ย
  currentPricePerUnit: number; // ราคาปัจจุบัน
  totalCost: number; // units * avgCostPerUnit
  currentValue: number; // units * currentPricePerUnit
  note?: string;
  updatedAt: string;
}

// 2.4 สินทรัพย์ลงทุนอื่นๆ (Custom Investments)
export interface OtherInvestment {
  id: string;
  name: string; // เช่น 'กองทุน SSF/RMF', 'หุ้นไทย SET50', 'หุ้นสหรัฐฯ'
  category: 'mutual_fund' | 'thai_stock' | 'us_stock' | 'crypto' | 'real_estate' | 'other';
  institution: string; // สถาบัน/แอป
  costValue: number; // มูลค่าต้นทุน
  currentValue: number; // มูลค่าตลาดปัจจุบัน
  note?: string;
  updatedAt: string;
}

// หมวดหมู่ที่แก้ไขได้
export interface FinanceCategory {
  id: string;
  name: string;
  group: CategoryGroup;
  color: string;
  icon: string;
  isCustom?: boolean;
}

// ตั้งค่า Google Sheets
export interface GoogleSheetConfig {
  webhookUrl: string; // Google Apps Script Web App URL
  sheetUrl: string; // URL ของ Google Sheet สำหรับกดเปิดดู
  autoSyncOnSave: boolean; // ซิงค์อัตโนมัติเมื่อกดปุ่ม Real-time save
  lastSyncTime: string | null;
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
  lastSyncMessage?: string;
}

// ภาพรวมข้อมูลทั้งระบบ
export interface AppFinanceData {
  version: number;
  lastUpdated: string;
  // เงินเดือนและรายรับรายจ่าย
  salarySettings: {
    monthlySalary: number; // ฐานเงินเดือนหลัก
    otherFixedIncome: number; // รายรับประจำอื่นๆ
    payday: number; // วันที่เงินเดือนออก (เช่น วันที่ 25 หรือ สิ้นเดือน)
  };
  transactions: Transaction[];
  // เงินเก็บ
  savingsAccounts: SavingsAccount[];
  // เงินลงทุน
  investments: {
    insurance: LifeInsurancePolicy[];
    cooperativeDeposits: CooperativeDeposit[];
    cooperativeShares: CooperativeShare[];
    physicalGold: PhysicalGold[];
    goldStocks: GoldStock[];
    otherInvestments: OtherInvestment[];
  };
  // หมวดหมู่
  categories: FinanceCategory[];
  // Google Sheet
  googleSheetConfig: GoogleSheetConfig;
}
