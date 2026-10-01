import React, { useState } from 'react';
import {
  UtensilsCrossed,
  Tv,
  Settings,
  Plus,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  Copy,
  Check,
  Lock,
  LogOut,
  Image as ImageIcon,
} from 'lucide-react';
import type {
  MenuItem,
  TVSlide,
  CafeSettings,
  MenuCategory,
  SlideTemplate,
} from '../types';
import { dataService } from '../services/dataService';
import { PRESET_IMAGE_LIBRARY } from '../data/initialData';

interface AdminDashboardProps {
  menuItems: MenuItem[];
  slides: TVSlide[];
  settings: CafeSettings;
  onNavigateToTv: () => void;
  onNavigateToMenu: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  menuItems,
  slides,
  settings,
  onNavigateToTv,
  onNavigateToMenu,
}) => {
  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<'menu' | 'slides' | 'settings'>('menu');

  // Menu Form Modal State
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<Partial<MenuItem> | null>(null);
  const [ingredientsInput, setIngredientsInput] = useState('');
  const [allergensInput, setAllergensInput] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Slide Form Modal State
  const [isSlideModalOpen, setIsSlideModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<Partial<TVSlide> | null>(null);

  // Preset Image Picker Modal
  const [imagePickerTarget, setImagePickerTarget] = useState<'menu' | 'slide' | null>(null);

  // Settings State
  const [settingsForm, setSettingsForm] = useState<CafeSettings>(settings);
  const [isCopiedSql, setIsCopiedSql] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Handle PIN authentication
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === (settings.admin_pin || '8888')) {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  // Open Menu Item Create/Edit Modal
  const handleOpenMenuModal = (item?: MenuItem) => {
    if (item) {
      setEditingMenuItem({ ...item });
      setIngredientsInput(item.ingredients ? item.ingredients.join(', ') : '');
      setAllergensInput(item.allergens ? item.allergens.join(', ') : '');
      setTagsInput(item.tags ? item.tags.join(', ') : '');
    } else {
      setEditingMenuItem({
        name: '',
        name_en: '',
        category: 'main',
        type: 'food',
        price: 20000,
        image_url: '',
        description: '',
        calories: 350,
        prep_time: '15 мин',
        is_available: true,
        is_featured: false,
      });
      setIngredientsInput('');
      setAllergensInput('');
      setTagsInput('');
    }
    setIsMenuModalOpen(true);
  };

  // Save Menu Item
  const handleSaveMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMenuItem || !editingMenuItem.name) return;

    const ingredients = ingredientsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const allergens = allergensInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const tags = tagsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    await dataService.saveMenuItem({
      ...editingMenuItem,
      ingredients,
      allergens,
      tags,
    } as any);

    setIsMenuModalOpen(false);
    setEditingMenuItem(null);
    showNotice('Цэсийн мэдээлэл амжилттай хадгалагдлаа!');
  };

  // Delete Menu Item
  const handleDeleteMenuItem = async (id: string, name: string) => {
    if (window.confirm(`Та "${name}"-г цэснээс устгахдаа итгэлтэй байна уу?`)) {
      await dataService.deleteMenuItem(id);
      showNotice('Бүтээгдэхүүн устгагдлаа.');
    }
  };

  // Toggle Availability
  const handleToggleAvailability = async (id: string) => {
    await dataService.toggleItemAvailability(id);
  };

  // Open Slide Modal
  const handleOpenSlideModal = (slide?: TVSlide) => {
    if (slide) {
      setEditingSlide({ ...slide });
    } else {
      setEditingSlide({
        title: '',
        subtitle: '',
        badge: 'Шинэ Онцлох',
        price_highlight: '',
        image_url: '',
        template: 'split_promo',
        duration_seconds: 8,
        is_active: true,
        sort_order: slides.length + 1,
      });
    }
    setIsSlideModalOpen(true);
  };

  // Save Slide
  const handleSaveSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlide || !editingSlide.title) return;

    await dataService.saveSlide(editingSlide as any);
    setIsSlideModalOpen(false);
    setEditingSlide(null);
    showNotice('TV Слайд амжилттай хадгалагдлаа! Дэлгэц дээр шууд шинэчлэгдэнэ.');
  };

  // Delete Slide
  const handleDeleteSlide = async (id: string, title: string) => {
    if (window.confirm(`Та "${title}" слайдыг устгахдаа итгэлтэй байна уу?`)) {
      await dataService.deleteSlide(id);
      showNotice('Слайд устгагдлаа.');
    }
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await dataService.saveSettings(settingsForm);
    showNotice('Кафены тохиргоо амжилттай хадгалагдлаа!');
  };

  const showNotice = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  };

  const copySqlSchema = () => {
    const sqlContent = `-- Supabase Schema for Cafe Menu & TV Slides
CREATE TABLE IF NOT EXISTS public.menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    name_en TEXT,
    category TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'food',
    price NUMERIC NOT NULL,
    image_url TEXT NOT NULL,
    description TEXT,
    ingredients TEXT[] DEFAULT '{}',
    calories INTEGER DEFAULT 0,
    prep_time TEXT DEFAULT '10-15 мин',
    allergens TEXT[] DEFAULT '{}',
    is_available BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    tags TEXT[] DEFAULT '{}',
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.slides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    subtitle TEXT,
    badge TEXT,
    price_highlight TEXT,
    image_url TEXT NOT NULL,
    template TEXT NOT NULL DEFAULT 'split_promo',
    duration_seconds INTEGER DEFAULT 8,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.cafe_settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    cafe_name TEXT NOT NULL DEFAULT 'Aura Artisan Cafe',
    tagline TEXT DEFAULT 'Эрүүл амт, тав тухтай орчин',
    phone TEXT DEFAULT '+976 7700 8899',
    address TEXT DEFAULT 'Сүхбаатар дүүрэг, Central Tower 1F',
    opening_hours TEXT DEFAULT 'Өдөр бүр 08:00 - 22:00',
    wifi_name TEXT DEFAULT 'AuraCafe_Guest',
    wifi_pass TEXT DEFAULT 'auracoffee2026',
    rag_api_url TEXT DEFAULT '',
    admin_pin TEXT DEFAULT '8888',
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cafe_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public all access on menu_items" ON public.menu_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all access on slides" ON public.slides FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all access on cafe_settings" ON public.cafe_settings FOR ALL USING (true) WITH CHECK (true);

ALTER PUBLICATION supabase_realtime ADD TABLE public.menu_items;
ALTER PUBLICATION supabase_realtime ADD TABLE public.slides;
ALTER PUBLICATION supabase_realtime ADD TABLE public.cafe_settings;`;

    navigator.clipboard.writeText(sqlContent);
    setIsCopiedSql(true);
    setTimeout(() => setIsCopiedSql(false), 3000);
  };

  // If not authenticated, render PIN entry modal
  // Removed internal authentication check as it's now handled by LoginPage in App.tsx
  // This section is no longer needed.

  // Filtered menu items in admin
  const filteredItems = menuItems.filter((i) => {
    if (filterCategory === 'all') return true;
    return i.category === filterCategory;
  });

  return (
    <div className="min-h-screen bg-[#140C08] text-[#FDFBF7] pb-24">
      {/* Top Header */}
      <header className="sticky top-0 z-30 glass-panel border-b border-amber-900/30 backdrop-blur-md px-4 py-3 sm:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateToMenu}
              className="text-xs text-amber-300 hover:text-amber-200 glass-chip px-3 py-1.5 rounded-xl flex items-center gap-1"
            >
              <span>← Үйлчлүүлэгчийн цэс</span>
            </button>
            <span className="font-serif text-lg font-bold text-[#FDFBF7] hidden sm:inline">
              Удирдлагын самбар
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onNavigateToTv}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Tv className="w-4 h-4" />
              <span>TV Дэлгэц нээх</span>
            </button>

            <button
              onClick={() => setIsAuthenticated(false)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-400 hover:text-stone-200"
              title="Гарах"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 pt-6">
        {/* Notice alert */}
        {saveSuccessMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-sm flex items-center gap-2 shadow-lg animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="flex border-b border-amber-900/30 mb-8 overflow-x-auto no-scrollbar gap-2">
          <button
            onClick={() => setActiveTab('menu')}
            className={`pb-3 px-4 font-serif text-sm sm:text-base font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'menu'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>Хоол ба Ундааны цэс ({menuItems.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('slides')}
            className={`pb-3 px-4 font-serif text-sm sm:text-base font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'slides'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Tv className="w-4 h-4" />
            <span>TV Слайдын удирдлага ({slides.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-3 px-4 font-serif text-sm sm:text-base font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'settings'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Кафены тохиргоо & Supabase</span>
          </button>
        </div>

        {/* TAB 1: MENU ITEMS CRUD */}
        {activeTab === 'menu' && (
          <div className="space-y-6">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                {[
                  { id: 'all', label: 'Бүгд' },
                  { id: 'breakfast', label: 'Өглөөний цай' },
                  { id: 'soup', label: '1-р хоол' },
                  { id: 'main', label: '2-р хоол' },
                  { id: 'salad', label: 'Салад' },
                  { id: 'coffee', label: 'Кофе' },
                  { id: 'cold_drinks', label: 'Хүйтэн ундаа' },
                  { id: 'tea', label: 'Цай' },
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setFilterCategory(c.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      filterCategory === c.id
                        ? 'bg-amber-500 text-stone-950 font-bold'
                        : 'glass-chip text-stone-300 hover:text-white'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              {/* Add Item Button */}
              <button
                onClick={() => handleOpenMenuModal()}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-950/40 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Шинэ хоол/ундаа нэмэх</span>
              </button>
            </div>

            {/* Menu Items Table / Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="glass-card rounded-2xl p-4 flex gap-4 border border-amber-900/30 hover:border-amber-500/30 transition-all"
                >
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-20 h-20 rounded-xl object-cover shrink-0 bg-stone-900"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-bold uppercase text-amber-400">
                          {item.category}
                        </span>
                        <button
                          onClick={() => handleToggleAvailability(item.id)}
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            item.is_available
                              ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
                              : 'bg-red-950/80 text-red-400 border border-red-500/30'
                          }`}
                        >
                          {item.is_available ? 'Бэлэн' : 'Дууссан'}
                        </button>
                      </div>
                      <h4 className="font-serif text-sm font-bold text-[#FDFBF7] truncate">
                        {item.name}
                      </h4>
                      <p className="font-serif text-sm font-bold text-amber-400">
                        {item.price.toLocaleString()}₮
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                      <button
                        onClick={() => handleOpenMenuModal(item)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-amber-500/20 text-stone-300 hover:text-amber-200 transition-colors"
                        title="Засах"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteMenuItem(item.id, item.name)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-stone-300 hover:text-red-400 transition-colors"
                        title="Устгах"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: TV SLIDES CONTROLLER */}
        {activeTab === 'slides' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#FDFBF7]">
                  Кафены TV Дэлгэцийн слайдууд
                </h3>
                <p className="text-xs text-stone-400">
                  Энд өөрчилсөн бүх зүйл TV дэлгэц дээр realtime-аар шууд шинэчлэгдэнэ.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={onNavigateToTv}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-stone-200 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Eye className="w-4 h-4 text-amber-400" />
                  <span>Дэлгэц үзэх</span>
                </button>
                <button
                  onClick={() => handleOpenSlideModal()}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Шинэ слайд нэмэх</span>
                </button>
              </div>
            </div>

            {/* Slides List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {slides.map((slide) => (
                <div
                  key={slide.id}
                  className="glass-card rounded-2xl p-4 border border-amber-900/30 flex flex-col justify-between space-y-4"
                >
                  <div className="flex gap-4">
                    <img
                      src={slide.image_url}
                      alt={slide.title}
                      className="w-28 h-20 rounded-xl object-cover bg-stone-900 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                          {slide.template}
                        </span>
                        <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-md font-mono">
                          {slide.duration_seconds} сек
                        </span>
                      </div>
                      <h4 className="font-serif text-sm font-bold text-[#FDFBF7] truncate mt-1">
                        {slide.title}
                      </h4>
                      <p className="text-xs text-stone-400 line-clamp-1">
                        {slide.subtitle}
                      </p>
                      {slide.price_highlight && (
                        <p className="text-xs text-amber-400 font-bold mt-1">
                          {slide.price_highlight}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                        slide.is_active
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                          : 'bg-stone-800 text-stone-400'
                      }`}
                    >
                      {slide.is_active ? 'Идэвхтэй (Дэлгэцэнд гарна)' : 'Идэвхгүй'}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenSlideModal(slide)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-amber-500/20 text-stone-300 hover:text-amber-200"
                        title="Засах"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteSlide(slide.id, slide.title)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-stone-300 hover:text-red-400"
                        title="Устгах"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: SETTINGS & SUPABASE */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl space-y-8">
            {/* General Info Form */}
            <form onSubmit={handleSaveSettings} className="glass-card rounded-2xl p-6 space-y-4 border border-amber-900/30">
              <h3 className="font-serif text-lg font-bold text-[#FDFBF7]">
                Кафены ерөнхий мэдээлэл
              </h3>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Кафены нэр
                </label>
                <input
                  type="text"
                  value={settingsForm.cafe_name}
                  onChange={(e) => setSettingsForm({ ...settingsForm, cafe_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-black/50 border border-amber-900/40 rounded-xl text-sm text-[#FDFBF7] focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Слоган / Уриа үг
                </label>
                <input
                  type="text"
                  value={settingsForm.tagline}
                  onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-black/50 border border-amber-900/40 rounded-xl text-sm text-[#FDFBF7] focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Цагийн хуваарь
                  </label>
                  <input
                    type="text"
                    value={settingsForm.opening_hours}
                    onChange={(e) => setSettingsForm({ ...settingsForm, opening_hours: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-black/50 border border-amber-900/40 rounded-xl text-sm text-[#FDFBF7] focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Утасны дугаар
                  </label>
                  <input
                    type="text"
                    value={settingsForm.phone}
                    onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-black/50 border border-amber-900/40 rounded-xl text-sm text-[#FDFBF7] focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Wi-Fi Сүлжээний нэр
                  </label>
                  <input
                    type="text"
                    value={settingsForm.wifi_name}
                    onChange={(e) => setSettingsForm({ ...settingsForm, wifi_name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-black/50 border border-amber-900/40 rounded-xl text-sm text-[#FDFBF7] focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Wi-Fi Нууц үг
                  </label>
                  <input
                    type="text"
                    value={settingsForm.wifi_pass}
                    onChange={(e) => setSettingsForm({ ...settingsForm, wifi_pass: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-black/50 border border-amber-900/40 rounded-xl text-sm text-[#FDFBF7] focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Кафены хаяг, байршил
                </label>
                <input
                  type="text"
                  value={settingsForm.address}
                  onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-black/50 border border-amber-900/40 rounded-xl text-sm text-[#FDFBF7] focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  RAG AI Сервер API URL (Хэрэв хоосон үлдээвэл дотоод RAG AI ажиллана)
                </label>
                <input
                  type="text"
                  placeholder="https://your-rag-api.com/api/chat (Заавал биш)"
                  value={settingsForm.rag_api_url}
                  onChange={(e) => setSettingsForm({ ...settingsForm, rag_api_url: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-black/50 border border-amber-900/40 rounded-xl text-sm text-[#FDFBF7] placeholder-stone-600 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Админ нэвтрэх PIN код
                </label>
                <input
                  type="text"
                  value={settingsForm.admin_pin}
                  onChange={(e) => setSettingsForm({ ...settingsForm, admin_pin: e.target.value })}
                  className="w-32 px-3.5 py-2.5 bg-black/50 border border-amber-900/40 rounded-xl text-sm font-mono text-center text-[#FDFBF7] focus:outline-none focus:border-amber-400"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm tracking-wide transition-all shadow-md"
              >
                Тохиргоог хадгалах
              </button>
            </form>

            {/* Supabase SQL Setup helper */}
            <div className="glass-card rounded-2xl p-6 border border-amber-500/30 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-base font-bold text-amber-300">
                    Supabase Датабэйс Тохируулах
                  </h4>
                  <p className="text-xs text-stone-300">
                    Supabase SQL Editor-т дараах скриптийг нэг удаа хуулаад ажиллуулснаар датабэйс realtime холбогдоно.
                  </p>
                </div>
                <button
                  onClick={copySqlSchema}
                  className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold border border-amber-500/30 flex items-center gap-1.5 transition-all"
                >
                  {isCopiedSql ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{isCopiedSql ? 'Хуулагдлаа!' : 'SQL хуулах'}</span>
                </button>
              </div>

              <div className="p-3 bg-black/60 rounded-xl text-[11px] font-mono text-stone-400 max-h-36 overflow-y-auto">
                <p>-- Project: fhuzzbgehqvxwmohmvgz.supabase.co</p>
                <p>CREATE TABLE IF NOT EXISTS public.menu_items (...);</p>
                <p>CREATE TABLE IF NOT EXISTS public.slides (...);</p>
                <p>ALTER PUBLICATION supabase_realtime ADD TABLE public.menu_items, public.slides;</p>
              </div>
            </div>

            {/* Reset to Default demo data */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div>
                <h5 className="text-xs font-bold text-stone-300">
                  Цэсийг анхны жишээ өгөгдлөөр сэргээх
                </h5>
                <p className="text-[11px] text-stone-500">
                  Хэрэв анхны 25+ хоол, ундаа болон слайдуудыг буцаан сэргээхийг хүсвэл ашиглана уу.
                </p>
              </div>
              <button
                onClick={() => {
                  if (window.confirm('Бүх цэсийг анхны төлөв рүү буцаахдаа итгэлтэй байна уу?')) {
                    dataService.resetToDefault();
                    showNotice('Анхдагч өгөгдөл амжилттай сэргээгдлээ!');
                  }
                }}
                className="px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/80 text-red-300 text-xs font-medium border border-red-500/30 transition-colors"
              >
                Сэргээх
              </button>
            </div>
          </div>
        )}
      </main>

      {/* MODAL 1: ADD/EDIT MENU ITEM */}
      {isMenuModalOpen && editingMenuItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg glass-card rounded-3xl p-6 sm:p-7 border border-amber-500/30 shadow-2xl my-auto animate-scaleUp">
            <h3 className="font-serif text-xl font-bold text-[#FDFBF7] mb-4">
              {editingMenuItem.id ? 'Хоол/Ундаа засах' : 'Шинэ хоол/ундаа нэмэх'}
            </h3>

            <form onSubmit={handleSaveMenuItem} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1 no-scrollbar">
              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Ангилал (Category)
                </label>
                <select
                  value={editingMenuItem.category}
                  onChange={(e) => {
                    const cat = e.target.value as MenuCategory;
                    const type = ['coffee', 'cold_drinks', 'tea'].includes(cat) ? 'drink' : 'food';
                    setEditingMenuItem({ ...editingMenuItem, category: cat, type });
                  }}
                  className="w-full px-3.5 py-2.5 bg-black/60 border border-amber-900/40 rounded-xl text-xs sm:text-sm text-[#FDFBF7] focus:outline-none focus:border-amber-400"
                >
                  <optgroup label="🍽️ Хоол">
                    <option value="breakfast">Өглөөний цай (Breakfast)</option>
                    <option value="soup">1 дүгээр хоол (Soup / First Course)</option>
                    <option value="main">2 дугаар хоол (Main Course)</option>
                    <option value="salad">Салад (Salad)</option>
                  </optgroup>
                  <optgroup label="☕ Уух зүйлс">
                    <option value="coffee">Кофе (Coffee)</option>
                    <option value="cold_drinks">Хүйтэн ундаа (Cold Drinks / Smoothie)</option>
                    <option value="tea">Цай (Tea)</option>
                  </optgroup>
                </select>
              </div>

              {/* Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Нэр (Монгол)
                  </label>
                  <input
                    type="text"
                    required
                    value={editingMenuItem.name}
                    onChange={(e) => setEditingMenuItem({ ...editingMenuItem, name: e.target.value })}
                    placeholder="Жишээ: Рибай стейк"
                    className="w-full px-3.5 py-2 bg-black/60 border border-amber-900/40 rounded-xl text-xs sm:text-sm text-[#FDFBF7] focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Нэр (Англи)
                  </label>
                  <input
                    type="text"
                    value={editingMenuItem.name_en || ''}
                    onChange={(e) => setEditingMenuItem({ ...editingMenuItem, name_en: e.target.value })}
                    placeholder="Example: Ribeye Steak"
                    className="w-full px-3.5 py-2 bg-black/60 border border-amber-900/40 rounded-xl text-xs sm:text-sm text-[#FDFBF7] focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Price & Calories */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Үнэ (₮)
                  </label>
                  <input
                    type="number"
                    required
                    value={editingMenuItem.price}
                    onChange={(e) => setEditingMenuItem({ ...editingMenuItem, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-black/60 border border-amber-900/40 rounded-xl text-xs sm:text-sm text-[#FDFBF7] focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Калори (ккал)
                  </label>
                  <input
                    type="number"
                    value={editingMenuItem.calories || 0}
                    onChange={(e) => setEditingMenuItem({ ...editingMenuItem, calories: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-black/60 border border-amber-900/40 rounded-xl text-xs sm:text-sm text-[#FDFBF7] focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Image URL & File Chooser */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-stone-300">
                    Зургийн холбоос (Image URL)
                  </label>
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer group">
                      <div className="flex items-center justify-center gap-2 px-2 py-1 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-300 group-hover:bg-amber-500/30 transition-all text-[10px] font-semibold">
                        <ImageIcon className="w-3 h-3" />
                        <span>Файл сонгох</span>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setEditingMenuItem((prev) => ({ ...prev, image_url: reader.result as string }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => setImagePickerTarget('menu')}
                      className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Сангаас сонгох</span>
                    </button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={editingMenuItem.image_url}
                    onChange={(e) => setEditingMenuItem({ ...editingMenuItem, image_url: e.target.value })}
                    className="flex-1 px-3.5 py-2 bg-black/60 border border-amber-900/40 rounded-xl text-xs text-[#FDFBF7] focus:outline-none focus:border-amber-400"
                  />
                  {editingMenuItem.image_url && (
                    <img
                      src={editingMenuItem.image_url}
                      alt="preview"
                      className="w-10 h-10 rounded-lg object-cover border border-amber-500/30"
                    />
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Тайлбар (Description)
                </label>
                <textarea
                  rows={2}
                  value={editingMenuItem.description || ''}
                  onChange={(e) => setEditingMenuItem({ ...editingMenuItem, description: e.target.value })}
                  placeholder="Бүтээгдэхүүний амт, онцлог тайлбар..."
                  className="w-full px-3.5 py-2 bg-black/60 border border-amber-900/40 rounded-xl text-xs sm:text-sm text-[#FDFBF7] focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Ingredients */}
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Орц найрлага (Таслалаар зааглана уу)
                </label>
                <input
                  type="text"
                  value={ingredientsInput}
                  onChange={(e) => setIngredientsInput(e.target.value)}
                  placeholder="Жишээ: Үхрийн мах, Цөцгийн тос, Розмарин, Сармис"
                  className="w-full px-3.5 py-2 bg-black/60 border border-amber-900/40 rounded-xl text-xs sm:text-sm text-[#FDFBF7] focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Allergens & Tags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Харшил үүсгэгч (Таслалаар)
                  </label>
                  <input
                    type="text"
                    value={allergensInput}
                    onChange={(e) => setAllergensInput(e.target.value)}
                    placeholder="Глютен, Сүү, Самар"
                    className="w-full px-3.5 py-2 bg-black/60 border border-amber-900/40 rounded-xl text-xs sm:text-sm text-[#FDFBF7] focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Түлхүүр үгс / Tags
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="Шилдэг, Signature, Vegan"
                    className="w-full px-3.5 py-2 bg-black/60 border border-amber-900/40 rounded-xl text-xs sm:text-sm text-[#FDFBF7] focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Checkboxes */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-stone-300">
                  <input
                    type="checkbox"
                    checked={editingMenuItem.is_available}
                    onChange={(e) => setEditingMenuItem({ ...editingMenuItem, is_available: e.target.checked })}
                    className="rounded accent-amber-500 w-4 h-4"
                  />
                  <span>Бэлэн байгаа (In Stock)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-stone-300">
                  <input
                    type="checkbox"
                    checked={editingMenuItem.is_featured}
                    onChange={(e) => setEditingMenuItem({ ...editingMenuItem, is_featured: e.target.checked })}
                    className="rounded accent-amber-500 w-4 h-4"
                  />
                  <span>Онцлох бүтээгдэхүүн (Featured)</span>
                </label>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-amber-900/30">
                <button
                  type="button"
                  onClick={() => setIsMenuModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 text-xs font-semibold"
                >
                  Болих
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm shadow-md"
                >
                  Хадгалах
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD/EDIT TV SLIDE */}
      {isSlideModalOpen && editingSlide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg glass-card rounded-3xl p-6 sm:p-7 border border-amber-500/30 shadow-2xl my-auto animate-scaleUp">
            <h3 className="font-serif text-xl font-bold text-[#FDFBF7] mb-4">
              {editingSlide.id ? 'TV Слайд засах' : 'Шинэ TV Слайд үүсгэх'}
            </h3>

            <form onSubmit={handleSaveSlide} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1 no-scrollbar">
              {/* Template Style Selector */}
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Загвар загварын сонголт (Template)
                </label>
                <select
                  value={editingSlide.template}
                  onChange={(e) => setEditingSlide({ ...editingSlide, template: e.target.value as SlideTemplate })}
                  className="w-full px-3.5 py-2.5 bg-black/60 border border-amber-900/40 rounded-xl text-xs sm:text-sm text-[#FDFBF7] focus:outline-none focus:border-amber-400"
                >
                  <option value="split_promo">Split Promo (Зураг + Баруун талын танилцуулга & QR)</option>
                  <option value="hero_showcase">Hero Showcase (Бүтэн дэлгэцийн тансаг зурагтай)</option>
                  <option value="menu_board">Menu Board (Дижитал 4 хоолны үнэтэй самбар)</option>
                  <option value="special_offer">Special Offer (Онцгой хямдрал, комбо санал)</option>
                </select>
              </div>

              {/* Title & Subtitle */}
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Гарчиг (Headline)
                </label>
                <input
                  type="text"
                  required
                  value={editingSlide.title}
                  onChange={(e) => setEditingSlide({ ...editingSlide, title: e.target.value })}
                  placeholder="Жишээ: Өглөөний тансаг амттан"
                  className="w-full px-3.5 py-2 bg-black/60 border border-amber-900/40 rounded-xl text-xs sm:text-sm text-[#FDFBF7] focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Дэд гарчиг (Subtitle / Description)
                </label>
                <textarea
                  rows={2}
                  value={editingSlide.subtitle || ''}
                  onChange={(e) => setEditingSlide({ ...editingSlide, subtitle: e.target.value })}
                  placeholder="Дэлгэц дээр харагдах тайлбар үг..."
                  className="w-full px-3.5 py-2 bg-black/60 border border-amber-900/40 rounded-xl text-xs sm:text-sm text-[#FDFBF7] focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Badge & Price Highlight */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Шошго (Badge text)
                  </label>
                  <input
                    type="text"
                    value={editingSlide.badge || ''}
                    onChange={(e) => setEditingSlide({ ...editingSlide, badge: e.target.value })}
                    placeholder="Chef's Special · 14:00 - 17:00"
                    className="w-full px-3.5 py-2 bg-black/60 border border-amber-900/40 rounded-xl text-xs sm:text-sm text-[#FDFBF7] focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Үнийн тодотгол (Price Highlight)
                  </label>
                  <input
                    type="text"
                    value={editingSlide.price_highlight || ''}
                    onChange={(e) => setEditingSlide({ ...editingSlide, price_highlight: e.target.value })}
                    placeholder="Жишээ: 18,500₮ эсвэл 20% Хямдрал"
                    className="w-full px-3.5 py-2 bg-black/60 border border-amber-900/40 rounded-xl text-xs sm:text-sm text-[#FDFBF7] focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Duration & Order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Дэлгэцэнд байх хугацаа (Секунд)
                  </label>
                  <input
                    type="number"
                    min={3}
                    max={60}
                    value={editingSlide.duration_seconds}
                    onChange={(e) => setEditingSlide({ ...editingSlide, duration_seconds: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-black/60 border border-amber-900/40 rounded-xl text-xs sm:text-sm text-[#FDFBF7] focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Дараалал (Sort Order)
                  </label>
                  <input
                    type="number"
                    value={editingSlide.sort_order || 1}
                    onChange={(e) => setEditingSlide({ ...editingSlide, sort_order: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-black/60 border border-amber-900/40 rounded-xl text-xs sm:text-sm text-[#FDFBF7] focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Image URL & File Chooser */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-stone-300">
                    Арын зураг (Image URL)
                  </label>
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer group">
                      <div className="flex items-center justify-center gap-2 px-2 py-1 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-300 group-hover:bg-amber-500/30 transition-all text-[10px] font-semibold">
                        <ImageIcon className="w-3 h-3" />
                        <span>Файл сонгох</span>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setEditingSlide((prev) => ({ ...prev, image_url: reader.result as string }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => setImagePickerTarget('slide')}
                      className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Сангаас сонгох</span>
                    </button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={editingSlide.image_url}
                    onChange={(e) => setEditingSlide({ ...editingSlide, image_url: e.target.value })}
                    className="flex-1 px-3.5 py-2 bg-black/60 border border-amber-900/40 rounded-xl text-xs text-[#FDFBF7] focus:outline-none focus:border-amber-400"
                  />
                  {editingSlide.image_url && (
                    <img
                      src={editingSlide.image_url}
                      alt="preview"
                      className="w-10 h-10 rounded-lg object-cover border border-amber-500/30"
                    />
                  )}
                </div>
              </div>

              {/* Active Toggle */}
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-stone-300">
                  <input
                    type="checkbox"
                    checked={editingSlide.is_active}
                    onChange={(e) => setEditingSlide({ ...editingSlide, is_active: e.target.checked })}
                    className="rounded accent-amber-500 w-4 h-4"
                  />
                  <span>Идэвхтэй тоглуулах (TV дээр шууд харуулна)</span>
                </label>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-amber-900/30">
                <button
                  type="button"
                  onClick={() => setIsSlideModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 text-xs font-semibold"
                >
                  Болих
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm shadow-md"
                >
                  Хадгалах
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: 1-CLICK PRESET IMAGE PICKER */}
      {imagePickerTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl glass-card rounded-3xl p-6 border border-amber-500/30 shadow-2xl my-auto animate-scaleUp">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-serif text-lg font-bold text-[#FDFBF7]">
                  Чанартай кофены болон хоолны зургийн сан
                </h4>
                <p className="text-xs text-stone-400">
                  Аль нэг зураг дээр дарахад шууд холбогдоно.
                </p>
              </div>
              <button
                onClick={() => setImagePickerTarget(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-white"
              >
                Хаах
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-[60vh] overflow-y-auto no-scrollbar pr-1">
              {PRESET_IMAGE_LIBRARY.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    if (imagePickerTarget === 'menu' && editingMenuItem) {
                      setEditingMenuItem({ ...editingMenuItem, image_url: img.url });
                    } else if (imagePickerTarget === 'slide' && editingSlide) {
                      setEditingSlide({ ...editingSlide, image_url: img.url });
                    }
                    setImagePickerTarget(null);
                  }}
                  className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer border border-white/10 hover:border-amber-400 transition-all hover:scale-105"
                >
                  <img
                    src={img.url}
                    alt={img.label}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                    <span className="text-[11px] font-bold text-[#FDFBF7] truncate drop-shadow">
                      {img.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
