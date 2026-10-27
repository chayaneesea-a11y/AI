import React, { useState } from 'react';
import {
  Sliders,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Palette,
  Tag,
  Sparkles,
} from 'lucide-react';
import { AppFinanceData, FinanceCategory, CategoryGroup } from '../types/finance';

interface CategoriesAndMenuTabProps {
  data: AppFinanceData;
  onAddCategory: (category: Omit<FinanceCategory, 'id'>) => void;
  onUpdateCategory: (category: FinanceCategory) => void;
  onDeleteCategory: (id: string) => void;
}

export const CategoriesAndMenuTab: React.FC<CategoriesAndMenuTabProps> = ({
  data,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
}) => {
  const [selectedGroup, setSelectedGroup] = useState<CategoryGroup>('salary_income');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<FinanceCategory | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [color, setColor] = useState('#10b981');
  const [group, setGroup] = useState<CategoryGroup>('salary_income');

  const colorPalette = [
    '#10b981', '#059669', '#3b82f6', '#0284c7',
    '#6366f1', '#8b5cf6', '#d946ef', '#ec4899',
    '#f43f5e', '#ef4444', '#f97316', '#eab308',
    '#14b8a6', '#64748b', '#334155',
  ];

  const openAddModal = (targetGroup: CategoryGroup) => {
    setEditingCategory(null);
    setName('');
    setColor(
      targetGroup === 'salary_income'
        ? '#10b981'
        : targetGroup === 'expense'
        ? '#ef4444'
        : targetGroup === 'savings'
        ? '#0284c7'
        : '#8b5cf6'
    );
    setGroup(targetGroup);
    setIsModalOpen(true);
  };

  const openEditModal = (category: FinanceCategory) => {
    setEditingCategory(category);
    setName(category.name);
    setColor(category.color);
    setGroup(category.group);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingCategory) {
      onUpdateCategory({
        ...editingCategory,
        name: name.trim(),
        color,
        group,
      });
    } else {
      onAddCategory({
        name: name.trim(),
        color,
        group,
        icon: 'Tag',
        isCustom: true,
      });
    }
    setIsModalOpen(false);
  };

  const filteredCategories = data.categories.filter((c) => c.group === selectedGroup);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Sliders className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg">จัดการและแก้ไขทุกเมนู & หมวดหมู่</h3>
              <p className="text-xs text-slate-500">
                คุณสามารถเพิ่ม ลบ หรือแก้ไขชื่อและสีของหมวดหมู่ได้ทุกเมนู เพื่อปรับให้เข้ากับชีวิตประจำวันของคุณ
              </p>
            </div>
          </div>
          <button
            onClick={() => openAddModal(selectedGroup)}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>เพิ่มหมวดหมู่ใหม่</span>
          </button>
        </div>
      </div>

      {/* Group Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setSelectedGroup('salary_income')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            selectedGroup === 'salary_income'
              ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-500/20'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span className="text-xs font-semibold text-emerald-700">1. รายรับเงินเดือน</span>
          <div className="text-base font-bold text-slate-800 mt-1">
            {data.categories.filter((c) => c.group === 'salary_income').length} หมวดหมู่
          </div>
        </button>

        <button
          onClick={() => setSelectedGroup('expense')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            selectedGroup === 'expense'
              ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-500/20'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span className="text-xs font-semibold text-rose-700">2. รายจ่ายประจำ</span>
          <div className="text-base font-bold text-slate-800 mt-1">
            {data.categories.filter((c) => c.group === 'expense').length} หมวดหมู่
          </div>
        </button>

        <button
          onClick={() => setSelectedGroup('savings')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            selectedGroup === 'savings'
              ? 'bg-sky-50 border-sky-300 ring-2 ring-sky-500/20'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span className="text-xs font-semibold text-sky-700">3. เงินเก็บสะสม</span>
          <div className="text-base font-bold text-slate-800 mt-1">
            {data.categories.filter((c) => c.group === 'savings').length} หมวดหมู่
          </div>
        </button>

        <button
          onClick={() => setSelectedGroup('investment')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            selectedGroup === 'investment'
              ? 'bg-indigo-50 border-indigo-300 ring-2 ring-indigo-500/20'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span className="text-xs font-semibold text-indigo-700">4. เงินลงทุน</span>
          <div className="text-base font-bold text-slate-800 mt-1">
            {data.categories.filter((c) => c.group === 'investment').length} หมวดหมู่
          </div>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h4 className="font-bold text-slate-800 text-base">
              รายการหมวดหมู่:{' '}
              {selectedGroup === 'salary_income'
                ? 'รายรับเงินเดือน'
                : selectedGroup === 'expense'
                ? 'รายจ่าย'
                : selectedGroup === 'savings'
                ? 'เงินเก็บ'
                : 'เงินลงทุน'}
            </h4>
            <p className="text-xs text-slate-500">คลิกที่ปุ่มดินสอเพื่อแก้ไขชื่อและสี หรือกดเพิ่มหมวดหมู่ใหม่</p>
          </div>
          <button
            onClick={() => openAddModal(selectedGroup)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>เพิ่มในหมวดนี้</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 mt-4">
          {filteredCategories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200/90 hover:border-slate-300 hover:shadow-xs transition-all bg-slate-50/50"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="font-semibold text-slate-800 text-sm truncate">{cat.name}</span>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => openEditModal(cat)}
                  title="แก้ไขหมวดหมู่"
                  className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDeleteCategory(cat.id)}
                  title="ลบหมวดหมู่"
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-800 mb-1">
              {editingCategory ? 'แก้ไขหมวดหมู่' : 'เพิ่มหมวดหมู่ใหม่'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">กำหนดชื่อและสีสำหรับหมวดหมู่นี้</p>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">กลุ่มหมวดหมู่</label>
                <select
                  value={group}
                  onChange={(e) => setGroup(e.target.value as CategoryGroup)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                >
                  <option value="salary_income">1. รายรับเงินเดือน (Salary & Income)</option>
                  <option value="expense">2. รายจ่ายประจำ (Expenses)</option>
                  <option value="savings">3. เงินเก็บสะสม (Savings)</option>
                  <option value="investment">4. เงินลงทุน (Investments)</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">ชื่อหมวดหมู่</label>
                <input
                  type="text"
                  placeholder="เช่น ค่าหนังสือ, ซื้อหุ้นกู้, กองทุนต่างประเทศ"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-semibold"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-2">เลือกโทนสีสัญลักษณ์</label>
                <div className="flex flex-wrap gap-2">
                  {colorPalette.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-7 h-7 rounded-full transition-transform cursor-pointer ${
                        color === c ? 'scale-125 ring-2 ring-offset-2 ring-slate-700' : 'hover:scale-110'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
                >
                  {editingCategory ? 'บันทึกการแก้ไข' : 'เพิ่มหมวดหมู่'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
