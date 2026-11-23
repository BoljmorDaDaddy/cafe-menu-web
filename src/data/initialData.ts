import { MenuItem, TVSlide, CafeSettings } from '../types';

export const INITIAL_MENU_ITEMS: MenuItem[] = [];

export const INITIAL_SLIDES: TVSlide[] = [
  {
    id: 'slide-1',
    title: 'Өглөөний тансаг амт & кофены хослол',
    subtitle: 'Шинэхэн шарсан бриош, авокадо тост ба гар аргаар исгэсэн эспрессог өглөө бүр танд зориулж бэлтгэж байна.',
    badge: 'Өглөөний Цай · 08:00 - 11:30',
    price_highlight: '18,500₮-с',
    image_url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1600&q=85',
    template: 'split_promo',
    duration_seconds: 9,
    is_active: true,
    sort_order: 1
  },
  {
    id: 'slide-2',
    title: 'Шилдэг Хар Ангус Үхрийн Махан Стейк',
    subtitle: 'Шүүслэг, зөөлөн, розмарины анхилуун үнэртэй цөцгийн тосоор амталсан 250гр Рибай стейк.',
    badge: "Chef's Signature Dish",
    price_highlight: '42,000₮',
    image_url: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1600&q=85',
    template: 'hero_showcase',
    duration_seconds: 10,
    is_active: true,
    sort_order: 2
  },
  {
    id: 'slide-3',
    title: 'Өдрийн Онцлох Хоол & Ундаанууд',
    subtitle: 'Эрүүл шим тэжээлтэй, өдөр бүр шинэ ногоо жимсээр бэлтгэсэн амтат сонголтууд.',
    badge: 'Popular Menu Board',
    price_highlight: 'Онцлох 4 төрөл',
    image_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=85',
    template: 'menu_board',
    duration_seconds: 12,
    is_active: true,
    sort_order: 3
  },
  {
    id: 'slide-4',
    title: 'Үдээс хойшхи Комбо: Кофе + Шинэхэн Круассан',
    subtitle: 'Аливаа халуун кофе дээр Франц цөцгийн тостой круассаныг онцгой хөнгөлөлттэй үнээр аваарай.',
    badge: 'Happy Hour · 14:00 - 17:00',
    price_highlight: '14,000₮ (19,000₮ байсан)',
    image_url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1600&q=85',
    template: 'special_offer',
    duration_seconds: 8,
    is_active: true,
    sort_order: 4
  }
];

export const INITIAL_SETTINGS: CafeSettings = {
  id: 'default',
  cafe_name: "Mo's Cafe",
  tagline: 'Өдөр бүрийн төгс амт, тав тухтай орчин',
  phone: '+976 8911 9439',
  address: 'Эрдэнэт хот, 4-25, 1-р давхар',
  opening_hours: 'Даваа - Бямба 08:00 - 20:00',
  wifi_name: 'AuraCafe_Guest',
  wifi_pass: 'auracoffee2026',
  rag_api_url: '',
  admin_pin: '8888'
};

// Preset high quality food & beverage image library for admin 1-click pick
export const PRESET_IMAGE_LIBRARY = [
  { label: 'Авокадо тост', url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=80', cat: 'breakfast' },
  { label: 'Англи өглөөний цай', url: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=900&q=80', cat: 'breakfast' },
  { label: 'Круассан', url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=900&q=80', cat: 'breakfast' },
  { label: 'Гранола тараг', url: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?auto=format&fit=crop&w=900&q=80', cat: 'breakfast' },
  { label: 'Мөөгний крем шөл', url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=900&q=80', cat: 'soup' },
  { label: 'Хулууны шөл', url: 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?auto=format&fit=crop&w=900&q=80', cat: 'soup' },
  { label: 'Махан борцтой шөл', url: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=900&q=80', cat: 'soup' },
  { label: 'Улаан лоолийн шөл', url: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=900&q=80', cat: 'soup' },
  { label: 'Ангус стейк', url: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=900&q=80', cat: 'main' },
  { label: 'Хулд загас (Salmon)', url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=900&q=80', cat: 'main' },
  { label: 'Паста гоймон', url: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281781?auto=format&fit=crop&w=900&q=80', cat: 'main' },
  { label: 'Бургер', url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80', cat: 'main' },
  { label: 'Цезарь салад', url: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=900&q=80', cat: 'salad' },
  { label: 'Буррата бяслагтай салад', url: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb22509?auto=format&fit=crop&w=900&q=80', cat: 'salad' },
  { label: 'Авокадо Киноа салад', url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=900&q=80', cat: 'salad' },
  { label: 'Карамель Маккиато', url: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&w=900&q=80', cat: 'coffee' },
  { label: 'Капучино арт', url: 'https://images.unsplash.com/photo-1572442388796-11668ba67e53?auto=format&fit=crop&w=900&q=80', cat: 'coffee' },
  { label: 'Мөстэй Латте', url: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=900&q=80', cat: 'coffee' },
  { label: 'Колд Брю', url: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=900&q=80', cat: 'coffee' },
  { label: 'Маракуйя Лимонад', url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=900&q=80', cat: 'cold_drinks' },
  { label: 'Матча Латте', url: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=900&q=80', cat: 'cold_drinks' },
  { label: 'Жимсний смүүти', url: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=900&q=80', cat: 'cold_drinks' },
  { label: 'Чацарганатай цай', url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=900&q=80', cat: 'tea' },
  { label: 'Ногоон мэлрэг цай', url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=900&q=80', cat: 'tea' },
  { label: 'Жимсний халуун цай', url: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=900&q=80', cat: 'tea' }
];
