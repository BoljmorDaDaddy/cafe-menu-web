import { MenuItem, CafeSettings } from '../types';

export interface RagResponse {
  reply: string;
  suggestedItems?: MenuItem[];
}

export async function askRagAi(
  question: string,
  menuItems: MenuItem[],
  settings: CafeSettings
): Promise<RagResponse> {
  const apiUrl = settings.rag_api_url || import.meta.env.VITE_RAG_API_URL;

  // 1. If external API is configured, call it
  if (apiUrl && apiUrl.trim() !== '') {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: question,
          context: {
            cafe_name: settings.cafe_name,
            opening_hours: settings.opening_hours,
            wifi: `${settings.wifi_name} (Pass: ${settings.wifi_pass})`,
            address: settings.address,
            menu_summary: menuItems.map((m) => ({
              id: m.id,
              name: m.name,
              name_en: m.name_en,
              category: m.category,
              price: m.price,
              calories: m.calories,
              allergens: m.allergens,
              is_available: m.is_available,
            })),
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return {
          reply: data.reply || data.message || 'Хариулт амжилттай ирлээ.',
          suggestedItems: data.suggested_items,
        };
      }
    } catch (err) {
      console.warn('External RAG API error, falling back to local intelligent engine:', err);
    }
  }

  // 2. Intelligent Built-in RAG Engine (Mongolian & English context-aware)
  const q = question.toLowerCase();

  // Wi-Fi query
  if (q.includes('wifi') || q.includes('вайфай') || q.includes('нууц үг') || q.includes('интернет') || q.includes('password')) {
    return {
      reply: `Манай кафены Wi-Fi сүлжээний нэр: **${settings.wifi_name}**, Нууц үг: **${settings.wifi_pass}**. Та тухлан сууж ажиллах буюу амраарай! ☕`,
    };
  }

  // Hours query
  if (q.includes('цаг') || q.includes('нээх') || q.includes('хаах') || q.includes('хүртэл') || q.includes('hours') || q.includes('open')) {
    return {
      reply: `Манай ${settings.cafe_name} нь **${settings.opening_hours}** цагийн хооронд өдөр бүр ажиллаж байна. Хаяг: ${settings.address}.`,
    };
  }

  // Address query
  if (q.includes('хаяг') || q.includes('байршил') || q.includes('хаана') || q.includes('location') || q.includes('address')) {
    return {
      reply: `Манай байршил: **${settings.address}**. Утас: ${settings.phone}. Тавтай морилно уу!`,
    };
  }

  // Vegan / Vegetarian
  if (q.includes('веган') || q.includes('vegan') || q.includes('цагаан хоол') || q.includes('vegetarian') || q.includes('ногоо')) {
    const veganItems = menuItems.filter(
      (m) =>
        m.tags.some((t) => t.toLowerCase().includes('vegan') || t.toLowerCase().includes('vegetarian')) ||
        m.category === 'salad' ||
        m.category === 'tea'
    );
    return {
      reply: `Манайд танд зориулсан шинэхэн, амтат веган болон цагаан хоолны төрлүүд байна. Тухайлбал: Шарсан хулууны шөл, Авокадо & Киноатай эрүүл мэндийн салад болон жимсний смүүтинүүд маш сайн сонголт болно! 🌱`,
      suggestedItems: veganItems.slice(0, 3),
    };
  }

  // Coffee recommendations
  if (q.includes('кофе') || q.includes('coffee') || q.includes('эспрессо') || q.includes('латте') || q.includes('капучино')) {
    const coffees = menuItems.filter((m) => m.category === 'coffee');
    return {
      reply: `Манай хамгийн онцлох кофе бол 100% арабика үрээр хийсэн **Давстай карамель маккиато** (11,000₮) болон 18 цагийн хүйтэн исгэлттэй **Колд Брю** юм. Та амттай юу, эсвэл хүчтэй хар кофе сонирхож байна уу? ☕`,
      suggestedItems: coffees.slice(0, 3),
    };
  }

  // Steak / Meat / Main dish
  if (q.includes('стейк') || q.includes('мах') || q.includes('хүнд') || q.includes('хоол') || q.includes('meat') || q.includes('steak') || q.includes('бургер')) {
    const mainItems = menuItems.filter((m) => m.category === 'main');
    return {
      reply: `Танд манай тогоочийн гарын үсэгтэй **Хар Ангус Үхрийн Махан Рибай Стейк** (42,000₮) болон гар хийцийн шүүслэг **Aura Artisan Бургер** (24,000₮)-ийг онцгойлон санал болгож байна. Дагалдах трюфельтэй шарсан төмс болон улаан дарсан соустай! 🥩`,
      suggestedItems: mainItems.slice(0, 3),
    };
  }

  // Breakfast query
  if (q.includes('өглөө') || q.includes('breakfast') || q.includes('круассан') || q.includes('тост')) {
    const bfItems = menuItems.filter((m) => m.category === 'breakfast');
    return {
      reply: `Өглөөний цайнд хамгийн дуртай сонголт бол Франц бриош талхтай **Авокадотой өндөгний тост** (18,500₮) болон шаржигнуур **Франц круассан & ойн жимсний чанамал** (9,500₮) юм! 🥐`,
      suggestedItems: bfItems.slice(0, 3),
    };
  }

  // Allergens query
  if (q.includes('харшил') || q.includes('самар') || q.includes('глютен') || q.includes('сүү') || q.includes('allergy') || q.includes('nut') || q.includes('gluten')) {
    return {
      reply: `Манай цэсэн дэх хоол тус бүр дээр орсон харшил үүсгэгчдийг (Глютен, Сүү, Самар, Өндөг) тодорхой тэмдэглэсэн байгаа. Та тухайн хоолны картан дээр дарж орц найрлага, харшлын мэдээллийг нарийвчлан харах боломжтой. Сүүгүй сонголтоор овъёосны сүүг сонгох боломжтой! ✨`,
    };
  }

  // General recommendation
  const featured = menuItems.filter((m) => m.is_featured);
  return {
    reply: `Сайн байна уу! ${settings.cafe_name}-д тавтай морилно уу. Би танд цэсийн онцлох хоол ундаа, орц найрлага, шим тэжээлийн мэдээлэл болон кафены талаар мэдээлэл өгөхөд бэлэн байна. Та өнөөдөр ямар төрлийн хоол эсвэл уух зүйл сонирхож байна вэ?`,
    suggestedItems: featured.slice(0, 3),
  };
}
