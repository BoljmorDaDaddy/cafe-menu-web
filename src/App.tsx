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
import { WinterScene } from './components/WinterScene';

const SNOWFLAKES = [
  { left: '5%', delay: '-17s', duration: '24s', size: '2.5rem', opacity: 0.55 },
  { left: '18%', delay: '-8s', duration: '31s', size: '1.5rem', opacity: 0.4 },
  { left: '32%', delay: '-23s', duration: '27s', size: '3rem', opacity: 0.5 },
  { left: '47%', delay: '-4s', duration: '34s', size: '1.75rem', opacity: 0.48 },
  { left: '63%', delay: '-19s', duration: '26s', size: '2.25rem', opacity: 0.42 },
  { left: '79%', delay: '-11s', duration: '32s', size: '3.25rem', opacity: 0.5 },
  { left: '94%', delay: '-26s', duration: '29s', size: '1.75rem', opacity: 0.45 },
  { left: '11%', delay: '-7s', duration: '18s', size: '1.25rem', opacity: 0.36 },
  { left: '24%', delay: '-13s', duration: '21s', size: '1rem', opacity: 0.34 },
  { left: '39%', delay: '-3s', duration: '17s', size: '1.75rem', opacity: 0.42 },
  { left: '55%', delay: '-22s', duration: '19s', size: '1rem', opacity: 0.33 },
  { left: '71%', delay: '-9s', duration: '16s', size: '1.4rem', opacity: 0.39 },
  { left: '87%', delay: '-18s', duration: '23s', size: '1.15rem', opacity: 0.35 },
  { left: '2%', delay: '-5s', duration: '20s', size: '1.65rem', opacity: 0.4 },
  { left: '49%', delay: '-14s', duration: '22s', size: '1.35rem', opacity: 0.37 },
  { left: '97%', delay: '-11s', duration: '17s', size: '1.4rem', opacity: 0.38 },
  { left: '33%', delay: '-1s', duration: '19s', size: '1.1rem', opacity: 0.35 },
  { left: '60%', delay: '-16s', duration: '21s', size: '1.5rem', opacity: 0.37 },
  { left: '82%', delay: '-6s', duration: '18s', size: '1rem', opacity: 0.34 },
];

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
        
        setMenuItems(items);
        setSlides(slds && slds.length > 0 ? slds : INITIAL_SLIDES);
        setSettings(stgs && stgs.id ? stgs : INITIAL_SETTINGS);
      } catch (e) {
        console.error('Critical data fetch error:', e);
        setMenuItems([]);
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
    return filteredItems.filter((i) => i.is_featured);
  }, [filteredItems]);

  // Best Selling Items (shown as list cards like Image 1 bottom section)
  const bestSellingItems = useMemo(() => {
    return filteredItems;
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
    <div className="winter-night-shell min-h-screen text-[#F5EBDD] flex flex-col relative selection:bg-[#C49A45]/40 selection:text-white">
      <div className="winter-snowfall" aria-hidden="true">
        {SNOWFLAKES.map((flake, index) => (
          <span
            key={index}
            className="winter-snowflake"
            style={{
              left: flake.left,
              animationDelay: flake.delay,
              animationDuration: flake.duration,
              fontSize: flake.size,
              opacity: flake.opacity,
            }}
          >
            ❄
          </span>
        ))}
      </div>
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
              <h2 className="text-sm font-bold text-[#F5EBDD] uppercase tracking-wider">Онцлох сонголтууд</h2>
              <button
                onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })}
                className="text-xs font-semibold text-[#C49A45] hover:text-[#F5EBDD] transition-colors"
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
              <h2 className="text-sm font-bold text-[#F5EBDD] uppercase tracking-wider">Хамгийн их захиалдаг</h2>
              <button
                onClick={() => { setActiveType('all'); setActiveCategory('all'); }}
                className="text-xs font-semibold text-[#C49A45] hover:text-[#F5EBDD] transition-colors"
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
                <h3 className="font-serif text-base font-bold text-[#F5EBDD]">Хоолны Цэс</h3>
              </div>
              <span className="text-xs text-[#D4C8B5] font-medium">{foodItems.length} сонголт</span>
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
                <h3 className="font-serif text-base font-bold text-[#F5EBDD]">Уух Зүйлс</h3>
              </div>
              <span className="text-xs text-[#D4C8B5] font-medium">{drinkItems.length} сонголт</span>
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
      <WinterScene />
      <div className="winter-snowdrift" aria-hidden="true" />
    </div>
  );
}
