import { supabase } from '../utils/supabase';
import type { MenuItem, TVSlide, CafeSettings, MenuCategory } from '../types';
import { INITIAL_MENU_ITEMS, INITIAL_SLIDES, INITIAL_SETTINGS } from '../data/initialData';

const MENU_STORAGE_KEY = 'aura_cafe_menu_items_v1';
const SLIDES_STORAGE_KEY = 'aura_cafe_tv_slides_v1';
const SETTINGS_STORAGE_KEY = 'aura_cafe_settings_v1';

class DataService {
  private listeners: Set<() => void> = new Set();
  public isConnected: boolean = false;

  constructor() {
    this.initRealtime();
  }

  // Subscribe components to state changes
  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (err) {
        console.error('Listener notify error:', err);
      }
    });
  }

  private initRealtime() {
    try {
      supabase
        .channel('cafe-realtime-channel')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'menu_items' },
          () => {
            this.notify();
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'slides' },
          () => {
            this.notify();
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'cafe_settings' },
          () => {
            this.notify();
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            this.isConnected = true;
          }
        });
    } catch (err) {
      console.warn('Realtime channel init note:', err);
    }
  }

  // Helper to handle image uploads to Supabase Storage
  private async uploadImage(base64Image: string, folder: 'menu' | 'slides'): Promise<string> {
    if (!base64Image.startsWith('data:image')) {
      return base64Image; // Already a URL
    }

    try {
      // Extract extension and binary data
      const match = base64Image.match(/^data:image\/([a-zA-Z+]+);base64,(.+)$/);
      if (!match) throw new Error('Invalid base64 image');

      const extension = match[1] === 'jpeg' ? 'jpg' : match[1];
      const data = match[2];
      const binary = atob(data);
      const array = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        array[i] = binary.charCodeAt(i);
      }
      const blob = new Blob([array], { type: `image/${extension}` });
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${extension}`;
      const filePath = `${folder}/${fileName}`;

      // Upload to 'images' bucket
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, blob, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (err) {
      console.error('Image upload failed:', err);
      return base64Image; // Fallback to base64 if upload fails
    }
  }

  // --- MENU ITEMS ---

  public async getMenuItems(): Promise<MenuItem[]> {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('sort_order', { ascending: true });

      if (!error && data && data.length > 0) {
        this.isConnected = true;
        localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(data));
        return data as MenuItem[];
      }
    } catch {
      // Supabase table may not be created yet, fallback gracefully
    }

    // LocalStorage fallback
    const local = localStorage.getItem(MENU_STORAGE_KEY);
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        console.error('Failed to parse local menu data', e);
      }
    }

    // Default seed
    localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(INITIAL_MENU_ITEMS));
    return INITIAL_MENU_ITEMS;
  }

  public async saveMenuItem(item: Partial<MenuItem> & { name: string; category: MenuCategory; price: number; image_url: string }): Promise<MenuItem> {
    const isNew = !item.id;
    const now = new Date().toISOString();

    // 1. Handle Image Upload
    let finalImageUrl = item.image_url;
    if (item.image_url && item.image_url.startsWith('data:image')) {
      finalImageUrl = await this.uploadImage(item.image_url, 'menu');
    }

    // 2. Construct a "Clean" object to avoid 400 Bad Request
    // We explicitly cast types and provide defaults for EVERY field
    const validCategories: MenuCategory[] = ['breakfast', 'soup', 'main', 'salad', 'coffee', 'cold_drinks', 'tea'];
    const safeCategory: MenuCategory = validCategories.includes(item.category as MenuCategory)
      ? (item.category as MenuCategory)
      : 'main';
    const itemToSave: MenuItem = {
      id: item.id || `item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: String(item.name || 'Unnamed Item'),
      name_en: String(item.name_en || ''),
      category: safeCategory,
      type: ['coffee', 'cold_drinks', 'tea'].includes(item.category) ? 'drink' : 'food',
      price: Number(item.price) || 0,
      image_url: String(finalImageUrl || ''),
      description: String(item.description || ''),
      ingredients: Array.isArray(item.ingredients) ? item.ingredients : [],
      calories: Number(item.calories) || 0,
      prep_time: String(item.prep_time || '10-15 мин'),
      allergens: Array.isArray(item.allergens) ? item.allergens : [],
      is_available: !!item.is_available,
      is_featured: !!item.is_featured,
      tags: Array.isArray(item.tags) ? item.tags : [],
      sort_order: Number(item.sort_order) || 99,
      updated_at: now,
      created_at: item.created_at || now,
    };

    console.log('🚀 Saving to Supabase payload:', itemToSave);

    // 3. Update LocalStorage first (so UI feels instant)
    const current = await this.getMenuItems();
    let updated: MenuItem[];
    if (isNew) {
      updated = [itemToSave, ...current];
    } else {
      updated = current.map((i) => (i.id === itemToSave.id ? itemToSave : i));
    }
    localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(updated));

    // 4. Supabase Upsert
    try {
      const { data, error } = await supabase.from('menu_items').upsert(itemToSave).select();
      if (error) {
        console.error('Supabase Upsert Error Detail:', error);
        throw error;
      }
    } catch (err) {
      console.warn('Supabase menu item save failed, using local cache only:', err);
    }

    this.notify();
    return itemToSave;
  }

  public async deleteMenuItem(id: string): Promise<boolean> {
    const current = await this.getMenuItems();
    const target = current.find((i) => i.id === id);

    if (target && target.image_url && target.image_url.includes('/images/menu/')) {
      try {
        // Extract the path after 'images/'
        const pathParts = target.image_url.split('/images/');
        const filePath = pathParts[1].split('?')[0]; // Remove query params if any
        
        await supabase.storage.from('images').remove([filePath]);
        console.log(`Deleted image from storage: ${filePath}`);
      } catch (err) {
        console.warn('Failed to delete image from storage:', err);
        // We continue to delete the DB record even if image deletion fails
      }
    }

    const updated = current.filter((i) => i.id !== id);
    localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(updated));

    try {
      await supabase.from('menu_items').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase menu item delete note:', err);
    }

    this.notify();
    return true;
  }

  public async toggleItemAvailability(id: string): Promise<boolean> {
    const current = await this.getMenuItems();
    const target = current.find((i) => i.id === id);
    if (!target) return false;

    const newStatus = !target.is_available;
    return !!(await this.saveMenuItem({ ...target, is_available: newStatus }));
  }

  // --- TV SLIDES ---

  public async getSlides(): Promise<TVSlide[]> {
    try {
      const { data, error } = await supabase
        .from('slides')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) {
        console.warn('Supabase slides fetch error, using local cache:', error.message);
      } else if (data && data.length > 0) {
        this.isConnected = true;
        localStorage.setItem(SLIDES_STORAGE_KEY, JSON.stringify(data));
        return data as TVSlide[];
      } else if (data && data.length === 0) {
        // DB is reachable but empty — don't resurrect stale localStorage/seed data.
        // (Old code only used localStorage when the fetch threw, so a fresh
        // delete-all in Supabase would be overwritten by cached rows.)
        this.isConnected = true;
        localStorage.setItem(SLIDES_STORAGE_KEY, JSON.stringify([]));
        return [];
      }
    } catch {
      // Network failure — fall through to cache
    }

    const local = localStorage.getItem(SLIDES_STORAGE_KEY);
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        console.error('Failed to parse local slides', e);
      }
    }

    localStorage.setItem(SLIDES_STORAGE_KEY, JSON.stringify(INITIAL_SLIDES));
    return INITIAL_SLIDES;
  }

  public async saveSlide(slide: Partial<TVSlide> & { title: string; image_url: string }): Promise<TVSlide> {
    const isNew = !slide.id;
    const now = new Date().toISOString();

    // Upload image to Supabase Storage if it's a base64 string
    let finalImageUrl = slide.image_url;
    if (slide.image_url.startsWith('data:image')) {
      finalImageUrl = await this.uploadImage(slide.image_url, 'slides');
    }

    // NOTE: `slides.id` is UUID in Supabase. `crypto.randomUUID()` keeps
    // inserts valid; the old `slide-<timestamp>` strings caused
    // "invalid input syntax for type uuid" and the row was never stored.
    const slideToSave: TVSlide = {
      id: slide.id || (typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `00000000-0000-4000-8000-${Date.now().toString(16).padStart(12, '0')}`),
      title: slide.title,
      subtitle: slide.subtitle || '',
      badge: slide.badge || '',
      price_highlight: slide.price_highlight || '',
      image_url: finalImageUrl,
      template: slide.template || 'split_promo',
      duration_seconds: Number(slide.duration_seconds || 8),
      is_active: slide.is_active !== undefined ? slide.is_active : true,
      sort_order: slide.sort_order || 1,
      updated_at: now,
      created_at: slide.created_at || now,
    };

    const current = await this.getSlides();
    let updated: TVSlide[];
    if (isNew) {
      updated = [...current, slideToSave];
    } else {
      updated = current.map((s) => (s.id === slideToSave.id ? slideToSave : s));
    }
    localStorage.setItem(SLIDES_STORAGE_KEY, JSON.stringify(updated));

    try {
      const { data, error } = await supabase.from('slides').upsert(slideToSave).select();
      if (error) {
        console.error('Supabase slide save error (local copy kept):', error.message, error);
      } else {
        console.log('✅ Slide saved to Supabase:', data);
      }
    } catch (err) {
      console.warn('Supabase slide save note (using local cache):', err);
    }

    this.notify();
    return slideToSave;
  }

  public async deleteSlide(id: string): Promise<boolean> {
    const current = await this.getSlides();
    const target = current.find((s) => s.id === id);

    if (target && target.image_url && target.image_url.includes('/images/slides/')) {
      try {
        // Extract the path after 'images/'
        const pathParts = target.image_url.split('/images/');
        const filePath = pathParts[1].split('?')[0];
        
        await supabase.storage.from('images').remove([filePath]);
        console.log(`Deleted slide image from storage: ${filePath}`);
      } catch (err) {
        console.warn('Failed to delete slide image from storage:', err);
      }
    }

    const updated = current.filter((s) => s.id !== id);
    localStorage.setItem(SLIDES_STORAGE_KEY, JSON.stringify(updated));

    try {
      await supabase.from('slides').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase slide delete note:', err);
    }

    this.notify();
    return true;
  }

  // --- CAFE SETTINGS ---

  public async getSettings(): Promise<CafeSettings> {
    try {
      const { data, error } = await supabase
        .from('cafe_settings')
        .select('*')
        .limit(1);

      if (!error && data && data.length > 0) {
        this.isConnected = true;
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(data[0]));
        return data[0] as CafeSettings;
      }
    } catch (err) {
      console.warn('Supabase settings fetch note:', err);
    }

    const local = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        console.error('Failed to parse local settings', e);
      }
    }

    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(INITIAL_SETTINGS));
    return INITIAL_SETTINGS;
  }

  public async saveSettings(settings: Partial<CafeSettings>): Promise<CafeSettings> {
    const current = await this.getSettings();
    const updated: CafeSettings = {
      ...current,
      ...settings,
      updated_at: new Date().toISOString()
    };

    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));

    try {
      await supabase.from('cafe_settings').upsert(updated);
    } catch (err) {
      console.warn('Supabase settings save note:', err);
    }

    this.notify();
    return updated;
  }

  public resetToDefault() {
    localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(INITIAL_MENU_ITEMS));
    localStorage.setItem(SLIDES_STORAGE_KEY, JSON.stringify(INITIAL_SLIDES));
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(INITIAL_SETTINGS));
    this.notify();
  }
}

export const dataService = new DataService();
