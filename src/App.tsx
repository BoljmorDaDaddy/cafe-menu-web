import { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { CategoryNav } from './components/CategoryNav';
import { MenuCard } from './components/MenuCard';
import { BestSellingItem } from './components/BestSellingItem';
import { ItemDetailModal } from './components/ItemDetailModal';
import { LoginPage } from './components/LoginPage';
// PromoBanner removed — not shown on customer-facing menu
import { ChatbotWidget } from './components/ChatbotWidget';
import { TvDisplay } from './components/TvDisplay';
import { AdminDashboard } from './components/AdminDashboard';
import { NotFoundPage } from './components/NotFoundPage';
import { BottomNav } from './components/BottomNav';
import { Footer } from './components/Footer';
import { SeoHead } from './components/SeoHead';
import type { MenuItem, TVSlide, CafeSettings, MenuCategory } from './types';
import { dataService } from './services/dataService';
import { INITIAL_MENU_ITEMS, INITIAL_SLIDES, INITIAL_SETTINGS } from './data/initialData';
import { UtensilsCrossed, Coffee, SearchX } from 'lucide-react';

export default function App() {
  // Navigation View State
  const [activeView, setActiveView] = useState<'menu' | 'tv' | 'admin' | '404'>('menu');

  // Auth State
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  // Core Data States
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [slides, setSlides] = useState<TVSlide[]>(INITIAL_SLIDES);
  const [settings, setSettings] = useState<CafeSettings>(INITIAL_SETTINGS);

  // Interaction States
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [activeType, setActiveType] = useState<'all' | 'food' | 'drink'>('all');
  const [activeCategory, setActiveCategory] = useState<'all' | MenuCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);

  // Initial Data Fetch & Realtime Subscription
  useEffect(() => {
    const checkAdminSession = () => {
      const sessionExpiry = localStorage.getItem('admin_session_expiry');
      if (sessionExpiry && Date.now() < parseInt(sessionExpiry)) {
        setIsAdminAuth(true);
      }
    };

    checkAdminSession();

    const fetchData = async () => {
      try {
        const items = await dataService.getMenuItems();
        const slds = await dataService.getSlides();
        const stgs = await dataService.getSettings();
        
        // Ensure we never have empty states by falling back to INITIAL_DATA
        setMenuItems(items && items.length > 0 ? items : INITIAL_MENU_ITEMS);
        setSlides(slds && slds.length > 0 ? slds : INITIAL_SLIDES);
        setSettings(stgs && stgs.id ? stgs : INITIAL_SETTINGS);
      } catch (e) {
        console.error('Critical data fetch error:', e);
        setMenuItems(INITIAL_MENU_ITEMS);
        setSlides(INITIAL_SLIDES);
        setSettings(INITIAL_SETTINGS);
      }
    };

    fetchData();

    // Subscribe to realtime updates from Supabase / dataService
    const unsubscribe = dataService.subscribe(() => {
      fetchData();
    });

    return () => unsubscribe();
  }, []);

  // URL Hash / Path sync
  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();

      if (path.includes('/tv') || path.includes('/slide') || hash === '#tv' || hash === '#slide') {
        setActiveView('tv');
      } else if (path.includes('/admin') || hash === '#admin') {
        if (!isAdminAuth) {
          setShowLogin(true);
        } else {
          setActiveView('admin');
        }
      } else {
        setActiveView('menu');
      }
    };

    handleUrlChange();
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, [isAdminAuth]);

  // Set view and sync hash
  const navigateTo = (view: 'menu' | 'tv' | 'admin' | '404') => {
    if (view === 'admin') {
      if (!isAdminAuth) {
        setShowLogin(true);
        setActiveView('menu');
        return;
      }
    }

    if (view === 'tv' && !isAdminAuth) {
      console.warn('Access restricted');
      return;
    }

    setActiveView(view);
    if (view === 'menu') {
      window.history.pushState(null, '', '/');
      window.location.hash = '';
    } else {
      window.location.hash = view;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminLogin = () => {
    // In a real app, we'd validate the PIN here or via API
    // For now, we grant access and set a 20-minute token
    const expiry = Date.now() + 20 * 60 * 1000;
    localStorage.setItem('admin_session_expiry', expiry.toString());
    setIsAdminAuth(true);
    setShowLogin(false);
    setActiveView('admin');
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('admin_session_expiry');
    setIsAdminAuth(false);
    setActiveView('menu');
  };

  // Filter Menu Items
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      // 1. Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesNameEn = item.name_en?.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesIng = item.ingredients?.some((ing) => ing.toLowerCase().includes(q));
        const matchesTag = item.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesNameEn && !matchesDesc && !matchesIng && !matchesTag) {
          return false;
        }
      }

      // 2. Type Filter ('food' or 'drink')
      if (activeType !== 'all' && item.type !== activeType) {
        return false;
      }

      // 3. Category Filter
      if (activeCategory !== 'all' && item.category !== activeCategory) {
        return false;
      }

      return true;
    });
  }, [menuItems, searchQuery, activeType, activeCategory]);

  // Featured Item for Hero Banner
  const heroItem = useMemo(() => {
    return menuItems.find((m) => m.is_featured && m.category === 'coffee') || menuItems[0];
  }, [menuItems]);

  // Popular / Featured items (shown in horizontal grid like Image 1)
  const popularItems = useMemo(() => {
    return filteredItems.filter((i) => i.is_featured).slice(0, 6);
  }, [filteredItems]);

  // Best Selling Items (shown as list cards like Image 1 bottom section)
  const bestSellingItems = useMemo(() => {
    return filteredItems.slice(0, 4);
  }, [filteredItems]);

  // Separate Foods and Drinks
  const foodItems = useMemo(() => {
    return filteredItems.filter((i) => i.type === 'food');
  }, [filteredItems]);

  const drinkItems = useMemo(() => {
    return filteredItems.filter((i) => i.type === 'drink');
  }, [filteredItems]);

  // Render TV Display View
  if (activeView === 'tv') {
    return (
      <>
        <SeoHead view="tv" settings={settings} />
        <TvDisplay
          slides={slides}
          menuItems={menuItems}
          settings={settings}
          onExit={() => navigateTo('menu')}
        />
      </>
    );
  }

  // Render Admin Dashboard View
  if (activeView === 'admin') {
    return (
      <>
        <SeoHead view="admin" settings={settings} />
        <AdminDashboard
          menuItems={menuItems}
          slides={slides}
          settings={settings}
          onNavigateToTv={() => navigateTo('tv')}
          onNavigateToMenu={() => navigateTo('menu')}
        />
      </>
    );
  }

  // Render Login Page
  if (showLogin) {
    return (
      <LoginPage 
        onLoginSuccess={handleAdminLogin} 
        onBackToMenu={() => setShowLogin(false)} 
      />
    );
  }

  // Render 404 View
  if (activeView === '404') {
    return (
      <>
        <SeoHead view="404" settings={settings} />
        <NotFoundPage
          onNavigateToMenu={() => navigateTo('menu')}
          onNavigateToTv={() => navigateTo('tv')}
        />
      </>
    );
  }

  // Render Customer-Facing Menu View (Dual-Tone Cream & Espresso Palette matching Image 1 & 2)
  return (
    <div className="min-h-screen bg-[#fcfbf7] text-[#2d241e] flex flex-col relative selection:bg-[#bfa89e]/30 selection:text-[#2d241e]">
      {/* Dynamic SEO, Schema.org and Meta head tags */}
      <SeoHead view="menu" settings={settings} />

      {/* Top Header matching Image 1 with search bar, bell, and user avatar */}
      <Navbar
        settings={settings}
        activeView={activeView}
        onNavigate={navigateTo}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isSearchOpen={isSearchOpen}
        setIsSearchOpen={setIsSearchOpen}
        onOpenAiChat={() => setIsAiChatOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 pt-5 pb-24">
        {/* SECTION 2: Categories Section with square white cards & orange line icons */}
        <CategoryNav
          activeType={activeType}
          onSelectType={(type) => {
            setActiveType(type);
            setActiveCategory('all');
          }}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />

        {/* Search Result Feedback Header */}
        {searchQuery && (
          <div className="mb-6 p-4 bg-white rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
            <span className="text-xs sm:text-sm text-stone-700">
              &quot;<span className="text-amber-600 font-bold">{searchQuery}</span>&quot; хайлтын үр дүн: {filteredItems.length} сонголт олдлоо
            </span>
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-amber-600 hover:text-amber-800 font-semibold"
            >
              Бүгдийг харах
            </button>
          </div>
        )}

        {/* Empty State when no items match search */}
        {filteredItems.length === 0 && (
          <div className="bg-white rounded-3xl p-10 text-center my-8 border border-stone-200 shadow-sm">
            <SearchX className="w-12 h-12 text-stone-400 mx-auto mb-3" />
            <h3 className="font-serif text-lg font-bold text-[#1C120C] mb-1">
              Таны хайсан хоол олдсонгүй
            </h3>
            <p className="text-xs text-stone-500 mb-4 max-w-sm mx-auto">
              Өөр нэр эсвэл орцоор хайж үзнэ үү. Эсвэл манай RAG AI туслахаас асууж болно.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveType('all');
                setActiveCategory('all');
              }}
              className="px-5 py-2.5 rounded-full bg-amber-500 text-white font-bold text-xs shadow-md"
            >
              Цэсийг бүтнээр нь харах
            </button>
          </div>
        )}

        {/* SECTION 3: Popular Drinks / Dishes matching Image 1 */}
        {!searchQuery && activeCategory === 'all' && popularItems.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4 px-1">
              <h2 className="text-sm font-bold text-[#123F36] uppercase tracking-wider">Онцлох сонголтууд</h2>
              <button
                onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })}
                className="text-xs font-semibold text-[#C49A45] hover:text-[#123F36] transition-colors"
              >
                Бүгдийг харах
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {popularItems.map((item) => (
                <MenuCard
                  key={item.id}
                  item={item}
                  onSelect={(item) => setSelectedItem(item)}
                />
              ))}
            </div>
          </section>
        )}



        {/* SECTION 5: Best Selling Section matching Image 1 bottom cards */}
        {!searchQuery && activeCategory === 'all' && bestSellingItems.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center justify-between mb-4 px-1">
              <h2 className="text-sm font-bold text-[#123F36] uppercase tracking-wider">Хамгийн их захиалдаг</h2>
              <button
                onClick={() => { setActiveType('all'); setActiveCategory('all'); }}
                className="text-xs font-semibold text-[#C49A45] hover:text-[#123F36] transition-colors"
              >
                Бүгдийг харах
              </button>
            </div>

            <div className="space-y-3">
              {bestSellingItems.map((item) => (
                <BestSellingItem
                  key={item.id}
                  item={item}
                  onSelect={(item) => setSelectedItem(item)}
                />
              ))}
            </div>
          </section>
        )}

        {/* SECTION 6: Complete Foods List (when filtering or searching) */}
        {(activeType === 'food' || searchQuery || activeCategory !== 'all') && foodItems.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center justify-between mb-4 border-b border-[#d9cfba] pb-3 px-1">
              <div className="flex items-center gap-2">
                <UtensilsCrossed className="w-4 h-4 text-[#C49A45]" />
                <h3 className="font-serif text-base font-bold text-[#123F36]">Хоолны Цэс</h3>
              </div>
              <span className="text-xs text-[#5c6b64] font-medium">{foodItems.length} сонголт</span>
            </div>

            <div className="flex flex-col gap-3">
              {foodItems.map((item) => (
                <MenuCard key={item.id} item={item} onSelect={(item) => setSelectedItem(item)} />
              ))}
            </div>
          </section>
        )}

        {/* SECTION 7: Complete Drinks List (when filtering or searching) */}
        {(activeType === 'drink' || searchQuery || activeCategory !== 'all') && drinkItems.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center justify-between mb-4 border-b border-[#d9cfba] pb-3 px-1">
              <div className="flex items-center gap-2">
                <Coffee className="w-4 h-4 text-[#C49A45]" />
                <h3 className="font-serif text-base font-bold text-[#123F36]">Уух Зүйлс</h3>
              </div>
              <span className="text-xs text-[#5c6b64] font-medium">{drinkItems.length} сонголт</span>
            </div>

            <div className="flex flex-col gap-3">
              {drinkItems.map((item) => (
                <MenuCard key={item.id} item={item} onSelect={(item) => setSelectedItem(item)} />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Item Detail Modal Drawer */}
      <ItemDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />

      {/* RAG AI Chatbot Widget (Floating Circle in bottom right corner) */}
      <ChatbotWidget
        menuItems={menuItems}
        settings={settings}
        isOpen={isAiChatOpen}
        onToggle={() => setIsAiChatOpen(!isAiChatOpen)}
        onSelectItem={(item) => {
          setSelectedItem(item);
          setIsAiChatOpen(false);
        }}
      />

      {/* Luxury Cafe Footer */}
      <Footer settings={settings} onNavigate={navigateTo} />
    </div>
  );
}
