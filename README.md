# ☕ AURA ARTISAN CAFE & BISTRO (Web + TV Signage + Admin + RAG AI)

A mobile-first, glassmorphic digital menu web application, in-cafe TV slideshow display system, and realtime administrative portal built with **React**, **TypeScript**, **Tailwind CSS**, and **Supabase**.

---

## ✨ Features & Architecture

### 1. 🍽️ Customer-Facing Digital Menu
- **Pure Visual Delight**: No login, no cookies, no order/cart friction.
- **Warm Luxury Aesthetic**: Deep espresso brown background (`#160E09`), soft cream content cards (`#FDFBF7`), and rich amber/caramel accents (`#D97706`).
- **Separated yet Unified Menu Categories**:
  - **Хоол (Foods)**:
    - 🥞 *Өглөөний цай* (Breakfast: Brioche avocado toast, English breakfast, French croissant, Granola bowl)
    - 🍲 *1 дүгээр хоол* (Soups: Wild mushroom velouté, Butternut squash soup, Traditional beef broth, Tuscan tomato soup)
    - 🥩 *2 дугаар хоол* (Main dishes: Black Angus ribeye steak, Atlantic salmon, Truffle chicken tagliatelle, Artisan smash burger)
    - 🥗 *Салад* (Salads: Caesar salad, Burrata Caprese, Quinoa & avocado bowl)
  - **Уух зүйлс (Drinks)**:
    - ☕ *Кофе* (Coffee: Salted caramel macchiato, Velvet cappuccino, Spanish iced latte, Cold brew)
    - 🍹 *Хүйтэн ундаа* (Cold Drinks: Passion fruit lemonade, Ceremonial Uji matcha, Wild berry acai smoothie)
    - 🍵 *Цай* (Tea: Wild sea buckthorn tea, Imperial jasmine green tea, Mountain lingonberry infusion)
- **Tap-to-Expand Item Cards**: Detailed modal drawer revealing high-res photography, price in ₮ (MNT), ingredients pills, calorie counts, prep time, allergen warnings (Gluten, Dairy, Nuts, Eggs), and chef pairing suggestions.
- **Search & Filter**: Live instant search by dish name, English name, or ingredients.

---

### 2. 📺 In-Cafe TV Display Mode (`/slide` or `/#tv`)
- Designed for **16:9 full-screen high-definition cafe TVs**.
- **Auto-looping slides** with customizable per-slide duration (seconds) controlled from Admin.
- **Smooth animated progress bar** at the top.
- **Realtime sync with Supabase**: changes made by the administrator in the admin dashboard reflect instantly on the TV screen without refreshing!
- **4 Distinct Luxury Slide Templates**:
  1. `hero_showcase`: Cinematic full bleed photography with luxury typography and floating glass price badges.
  2. `split_promo`: Left side dish high-res image & price, right side promo details, ingredients, and QR code.
  3. `menu_board`: Live 4-item digital menu board with prices and prep times.
  4. `special_offer`: Time-sensitive discount / Happy hour announcement banner.
- **Integrated Live Clock** (HH:MM) and Fullscreen toggle button.

---

### 3. 🛡️ Real-Time Admin Dashboard (`/admin` or `/#admin`)
- **PIN Protected**: Default PIN is `8888` (customizable).
- **Menu Items CRUD**:
  - Add new food or drink, Edit, Delete.
  - Category assignment (`breakfast`, `soup`, `main`, `salad`, `coffee`, `cold_drinks`, `tea`).
  - Price in Tugrik (₮), ingredients, calories, prep times, allergen warnings, tags.
  - **1-Click Preset Image Library**: 20+ pre-curated high-resolution food & beverage photos ready to select with a single click.
  - Instant **In-Stock / Sold-Out** toggle switch.
- **TV Slides Controller**:
  - Control what shows on the TV screen.
  - Set per-slide duration in seconds.
  - Change template style (`hero_showcase`, `split_promo`, `menu_board`, `special_offer`).
  - Add, edit, reorder, and toggle active status.
- **Cafe Settings**:
  - Edit Cafe Name, Tagline, Phone, Address, Opening Hours, Wi-Fi name & password.
  - RAG AI API URL configuration.
  - One-click copy for Supabase PostgreSQL schema.

---

### 4. 🤖 RAG AI Assistant Widget
- **Floating Circle Button** in the bottom-right corner with pulsing ambient glow.
- Expands into an upscale glassmorphic chat window.
- **Configurable External API**: If `VITE_RAG_API_URL` or `settings.rag_api_url` is provided, it calls your custom RAG backend.
- **Smart Built-in Knowledge Base**: If the API is left blank, it seamlessly acts as an intelligent context-aware assistant answering questions in Mongolian and English:
  - Menu recommendations ("Юу захиалбал зүгээр вэ?")
  - Vegan & Vegetarian suggestions ("Цагаан хоолтон сонголт")
  - Wi-Fi password and network details ("Wi-Fi нууц үг")
  - Opening hours and address ("Цагийн хуваарь")
  - Allergen details ("Самаргүй хоол")
  - Interactive suggested dish cards directly inside chat bubbles!

---

### 5. 🚀 SEO & Production Polish
- **Page Titles**: Unique titles that never display default Vite or React placeholders.
- **Schema.org Structured Data**:
  - `CafeOrCoffeeShop` / `Restaurant` JSON-LD schema with address, phone, price range, hours, and menu.
  - `BreadcrumbList` schema.
- **Static SEO Assets**:
  - `sitemap.xml`
  - `robots.txt`
  - `llms.txt` (structured for AI search engines)
  - Custom SVG Favicon (`public/favicon.svg`) with warm gold coffee cup.
- **Custom 404 Page**: Luxury error page with warm aesthetic and quick navigation return buttons.
- **Performance**:
  - Production source maps disabled.
  - Code-split into `vendor`, `supabase`, `icons`, and `index` chunks.
  - Lazy loading on all menu images.

---

## 💾 Supabase Setup

The app connects to Supabase using the credentials provided in `.env`:
```env
VITE_SUPABASE_URL=https://fhuzzbgehqvxwmohmvgz.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_2y1bjOuSI65upwNX3bW58w_QN21szzn
VITE_RAG_API_URL=
```

### Running the Database Migration:
1. Open your Supabase project dashboard: [https://supabase.com/dashboard/project/fhuzzbgehqvxwmohmvgz/sql](https://supabase.com/dashboard/project/fhuzzbgehqvxwmohmvgz/sql)
2. Copy the contents of `supabase-schema.sql` (or click "SQL хуулах" in the Admin Settings panel).
3. Paste and run it in the SQL Editor.
4. This creates `menu_items`, `slides`, and `cafe_settings` tables with full Row-Level-Security (RLS) and Realtime replication enabled!

> *Note: Even before running the SQL script, the web app functions immediately using synchronized resilient local storage with full demo data.*

---

## 🛠️ Development & Build

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```
