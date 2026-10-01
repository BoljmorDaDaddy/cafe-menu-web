export type FoodCategory = 'breakfast' | 'soup' | 'main' | 'salad';
export type DrinkCategory = 'coffee' | 'cold_drinks' | 'tea';
export type MenuCategory = FoodCategory | DrinkCategory;

export type ItemType = 'food' | 'drink';

export interface MenuItem {
  id: string;
  name: string; // Mongolian name, e.g., 'Үхрийн махан стейк'
  name_en: string; // English name, e.g., 'Ribeye Steak & Herbs'
  category: MenuCategory;
  type: ItemType;
  price: number; // in MNT ₮, e.g. 28000
  image_url: string;
  description: string;
  ingredients: string[];
  calories: number; // kcal
  prep_time: string; // e.g. '15-20 мин'
  allergens: string[]; // e.g. ['Глютен', 'Сүү', 'Самар']
  is_available: boolean;
  is_featured: boolean;
  tags: string[]; // e.g. ["Шилдэг", "Chef's Special", "Шинэ", "Vegan"]
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
}

export type SlideTemplate = 'hero_showcase' | 'split_promo' | 'menu_board' | 'special_offer';

export interface TVSlide {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  price_highlight?: string;
  image_url: string;
  template: SlideTemplate;
  duration_seconds: number;
  is_active: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface CafeSettings {
  id: string;
  cafe_name: string;
  tagline: string;
  phone: string;
  address: string;
  opening_hours: string;
  rag_api_url: string;
  admin_pin: string;
  updated_at?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggested_items?: MenuItem[];
}
