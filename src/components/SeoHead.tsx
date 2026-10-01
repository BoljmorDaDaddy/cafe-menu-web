import React, { useEffect } from 'react';
import { CafeSettings } from '../types';

interface SeoHeadProps {
  view: 'menu' | 'tv' | 'admin' | '404';
  settings: CafeSettings;
}

export const SeoHead: React.FC<SeoHeadProps> = ({ view, settings }) => {
  useEffect(() => {
    // 1. Dynamic Page Title
    let pageTitle = `${settings.cafe_name || 'Aura Artisan Cafe'} | Тансаг Амтат Хоол & Тусгай Кофены Цэс`;
    let metaDescription = `${settings.cafe_name}-ийн шинэхэн өглөөний цай, 1, 2-р хоол, органик салад, гар аргаар исгэсэн кофены албан ёсны дижитал цэс. Цагийн хуваарь: ${settings.opening_hours}.`;

    if (view === 'tv') {
      pageTitle = `${settings.cafe_name || 'Aura Cafe'} · Live TV Menu Board & Slides`;
      metaDescription = `Кафены дотоод TV дэлгэцэнд зориулсан шууд дамжуулах дижитал слайд ба онцлох цэсний самбар.`;
    } else if (view === 'admin') {
      pageTitle = `Админ Самбар | ${settings.cafe_name || 'Aura Cafe'} Удирдлага`;
      metaDescription = `Кафены хоол ундааны цэс, TV слайд болон тохиргоог realtime удирдах төв.`;
    } else if (view === '404') {
      pageTitle = `404 · Хуудас олдсонгүй | ${settings.cafe_name || 'Aura Cafe'}`;
      metaDescription = `Таны хайсан хуудас олдсонгүй. Aura Cafe-ийн дижитал цэс рүү буцна уу.`;
    }

    document.title = pageTitle;

    // 2. Meta description
    let descTag = document.querySelector('meta[name="description"]');
    if (!descTag) {
      descTag = document.createElement('meta');
      descTag.setAttribute('name', 'description');
      document.head.appendChild(descTag);
    }
    descTag.setAttribute('content', metaDescription);

    // 3. Canonical Tag
    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement('link');
      canonicalTag.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute('href', window.location.origin + window.location.pathname);

    // 4. OpenGraph and Twitter Tags
    const setMetaTag = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    const shareImage = 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80';
    setMetaTag('og:title', pageTitle);
    setMetaTag('og:description', metaDescription);
    setMetaTag('og:image', shareImage);
    setMetaTag('og:type', 'website');
    setMetaTag('og:url', window.location.href);

    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', pageTitle);
    setMetaTag('twitter:description', metaDescription);
    setMetaTag('twitter:image', shareImage);

    // 5. Schema.org Structured Data (LocalBusiness & Restaurant Schema)
    const restaurantSchema = {
      '@context': 'https://schema.org',
      '@type': 'CafeOrCoffeeShop',
      name: settings.cafe_name || 'Aura Artisan Cafe',
      image: shareImage,
      telephone: settings.phone,
      address: {
        '@type': 'PostalAddress',
        streetAddress: settings.address,
        addressLocality: 'Ulaanbaatar',
        addressCountry: 'MN',
      },
      servesCuisine: ['Mongolian', 'European', 'Artisan Coffee', 'Breakfast'],
      priceRange: '₮₮',
      openingHours: 'Mo-Su 08:00-22:00',
      hasMenu: window.location.origin,
    };

    const breadcrumbsSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Нүүр',
          item: window.location.origin,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: view === 'tv' ? 'TV Слайд' : view === 'admin' ? 'Админ' : 'Хоол ба Ундааны Цэс',
          item: window.location.href,
        },
      ],
    };

    let schemaScript = document.getElementById('json-ld-schema');
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.id = 'json-ld-schema';
      schemaScript.setAttribute('type', 'application/ld+json');
      document.head.appendChild(schemaScript);
    }
    schemaScript.textContent = JSON.stringify([restaurantSchema, breadcrumbsSchema]);
  }, [view, settings]);

  return null;
};
