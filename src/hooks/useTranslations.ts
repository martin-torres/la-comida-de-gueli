import { useEffect, useState, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslationResolver } from '../data/pocketbase/translation-resolver';
import type { SupportedLanguage } from '../utils/languageResolver';

const UI_DICTIONARY: Record<string, Record<SupportedLanguage, string>> = {
  promotionsTitle: { es: 'Promociones del Día', en: 'Daily Promotions', ko: '오늘의 프로모션' },
  menuButton: { es: 'Menú', en: 'Menu', ko: '메뉴' },
  addButton: { es: '+ Agregar', en: '+ Add', ko: '+ 추가' },
  noCategories: { es: 'No hay categorías disponibles', en: 'No categories available', ko: '사용 가능한 카테고리가 없습니다' },
  configureCategories: { es: 'Por favor configura las categorías en la pantalla de ajustes', en: 'Please configure categories in settings', ko: '설정에서 카테고리를 구성하세요' },
  menuTitle: { es: 'Menú', en: 'Menu', ko: '메뉴' },
  noProducts: { es: 'No hay productos disponibles', en: 'No products available', ko: '사용 가능한 제품이 없습니다' },
  noProductsInCategory: { es: 'Esta categoría no tiene items activos', en: 'This category has no active items', ko: '이 카테고리에 활성 항목이 없습니다' },
  checkoutTitle: { es: 'Tu Pedido', en: 'Your Order', ko: '주문' },
  upsellTitle: { es: '¿Te falta algo para acompañar?', en: 'Missing something on the side?', ko: '곁들일 것이 필요하신가요?' },
  deliveryTitle: { es: 'Entrega', en: 'Delivery', ko: '배달' },
  deliveryOptionLabel: { es: 'A Domicilio', en: 'Delivery', ko: '배달' },
  pickupOptionLabel: { es: 'Paso por él', en: 'Pickup', ko: '픽업' },
  namePlaceholder: { es: 'Tu nombre', en: 'Your name', ko: '이름' },
  addressPlaceholder: { es: 'Dirección de entrega', en: 'Delivery address', ko: '배달 주소' },
  addressPlaceholderWithLocation: { es: 'Dirección de entrega en {location}', en: 'Delivery address in {location}', ko: '{location} 배달 주소' },
  deliveryFeeTitle: { es: 'Envío', en: 'Shipping', ko: '배송' },
  subtotal: { es: 'Subtotal', en: 'Subtotal', ko: '소계' },
  distance: { es: 'Distancia', en: 'Distance', ko: '거리' },
  deliveryFee: { es: 'Envío', en: 'Shipping', ko: '배송' },
  total: { es: 'Total', en: 'Total', ko: '합계' },
  paymentTitle: { es: 'Pago', en: 'Payment', ko: '결제' },
  cardPayment: { es: 'Tarjeta', en: 'Card', ko: '카드' },
  cashPayment: { es: 'Efectivo', en: 'Cash', ko: '현금' },
  transferPayment: { es: 'Transferencia', en: 'Transfer', ko: '계좌이체' },
  codiInstructions: { es: 'Escanea el código QR con tu app bancaria', en: 'Scan the QR code with your banking app', ko: '은행 앱으로 QR 코드를 스캔하세요' },
  codiSubtext: { es: 'Pago seguro con CoDi - Banco de México', en: 'Secure payment with CoDi - Bank of Mexico', ko: 'CoDi 안전 결제 - 멕시코 은행' },
  mpInstructions: { es: 'Serás redirigido a Mercado Pago', en: 'You will be redirected to Mercado Pago', ko: 'Mercado Pago로 리디렉션됩니다' },
  mpSubtext: { es: 'Tarjeta, OXXO o transferencia', en: 'Card, OXXO or transfer', ko: '카드, OXXO 또는 계좌이체' },
  cashPaymentQuestion: { es: '¿Con cuánto pagas?', en: 'How much will you pay with?', ko: '얼마를 지불하시겠습니까?' },
  cashPaymentPlaceholder: { es: 'Ej. 500', en: 'E.g. 500', ko: '예: 500' },
  uploadTransferLabel: { es: 'Sube foto de tu transferencia', en: 'Upload transfer screenshot', ko: '계좌이체 스크린샷 업로드' },
  imageUploaded: { es: '¡Imagen cargada!', en: 'Image uploaded!', ko: '이미지 업로드 완료!' },
  uploadTransferPlaceholder: { es: 'Haz clic para subir captura', en: 'Click to upload screenshot', ko: '스크린샷을 업로드하려면 클릭' },
  confirmOrderPrefix: { es: 'CONFIRMAR PEDIDO', en: 'CONFIRM ORDER', ko: '주문 확인' },
  statusReceived: { es: 'Pedido Recibido', en: 'Order Received', ko: '주문 접수됨' },
  statusPreparing: { es: 'Cocinando al Carbón', en: 'Cooking with Charcoal', ko: '숯불 조리 중' },
  statusReady: { es: '¡Listo para Disfrutar!', en: 'Ready to Enjoy!', ko: '즐길 준비 완료!' },
  statusOnWay: { es: 'Volando a tu Mesa', en: 'Flying to Your Table', ko: '테이블로 배달 중' },
  statusDelivered: { es: '¡Buen Provecho!', en: 'Bon Appétit!', ko: '맛있게 드세요!' },
  yourOrder: { es: 'Tu Orden', en: 'Your Order', ko: '주문 내역' },
  newOrderButton: { es: 'Nuevo Pedido', en: 'New Order', ko: '새 주문' },
  cartButton: { es: 'Ver Carrito', en: 'View Cart', ko: '장바구니 보기' },
};

const CATEGORY_DICTIONARY: Record<string, Record<SupportedLanguage, string>> = {
  promo: { es: 'Promociones', en: 'Promotions', ko: '프로모션' },
  desayuno: { es: 'Desayunos', en: 'Breakfast', ko: '아침식사' },
  comida: { es: 'Comidas', en: 'Meals', ko: '식사' },
  arroz: { es: 'Arroces', en: 'Rice', ko: '밥' },
  guisado: { es: 'Guisados', en: 'Stews', ko: '스튜' },
  bebida: { es: 'Bebidas', en: 'Drinks', ko: '음료' },
  antojito: { es: 'Antojitos', en: 'Snacks', ko: '간식' },
  postre: { es: 'Postres', en: 'Desserts', ko: '디저트' },
  extra: { es: 'Extras', en: 'Extras', ko: '추가' },
};

const ITEM_DESCRIPTION_DICTIONARY: Record<string, Record<SupportedLanguage, string>> = {
  'Desayuno El Arrocito': {
    es: 'Chilaquiles verdes o rojos, huevos al gusto, frijoles, arroz y tortillas',
    en: 'Green or red chilaquiles, eggs to taste, beans, rice and tortillas',
    ko: '녹색 또는 빨간 칠라킬레, 취향대로 계란, 콩, 밥과 토르티야',
  },
  'Huevos Rancheros': {
    es: 'Huevos fritos sobre tortilla con salsa ranchera, frijoles y arroz',
    en: 'Fried eggs on tortilla with ranchera sauce, beans and rice',
    ko: '란체라 소스를 곁들인 토르티야 위의 계란후라이, 콩과 밥',
  },
  'Chilaquiles con Huevo': {
    es: 'Tortilla frita con salsa verde o roja, crema, queso y huevo',
    en: 'Fried tortilla with green or red sauce, cream, cheese and egg',
    ko: '녹색 또는 빨간 소스를 곁들인 튀긴 토르티야, 크림, 치즈와 계란',
  },
  'Arroz a la Tumbada': {
    es: 'Arroz rojo con mariscos y camarones, servido con limón y salsa',
    en: 'Red rice with seafood and shrimp, served with lemon and sauce',
    ko: '해산물과 새우를 곁들인 빨간 밥, 레몬과 소스 제공',
  },
  'Arroz con Pollo': {
    es: 'Arroz rojo con pollo deshebrado y verduras',
    en: 'Red rice with shredded chicken and vegetables',
    ko: '찢은 닭고기와 야채를 곁들인 빨간 밥',
  },
  'Arroz con Carne': {
    es: 'Arroz rojo con carne de res en trozos y verduras',
    en: 'Red rice with beef chunks and vegetables',
    ko: '쇠고기 덩어리와 야채를 곁들인 빨간 밥',
  },
  'Mole Poblano': {
    es: 'Pollo en mole poblano con arroz, frijoles y tortillas',
    en: 'Chicken in poblano mole with rice, beans and tortillas',
    ko: '쌀, 콩, 토르티야를 곁들인 폴라노 몰레 치킨',
  },
  'Bistec a la Mexicana': {
    es: 'Bistec con salsa de jitomate, cebolla, chile y guacamole',
    en: 'Steak with tomato sauce, onion, chili and guacamole',
    ko: '토마토 소스, 양파, 칠리와 과카몰리를 곁들인 스테이크',
  },
  'Cochinita Pibil': {
    es: 'Cerdo marinado en achiote, servido con cebolla morada y habanero',
    en: 'Pork marinated in achiote, served with purple onion and habanero',
    ko: '아치오테에 절인 돼지고기, 보라색 양파와 하바네로 제공',
  },
  'Coca-Cola 350ml': {
    es: 'Refresco de cola 350ml',
    en: 'Cola soda 350ml',
    ko: '콜라 350ml',
  },
  'Coca-Cola 600ml': {
    es: 'Refresco de cola 600ml',
    en: 'Cola soda 600ml',
    ko: '콜라 600ml',
  },
  'Agua Natural': {
    es: 'Agua natural 1L',
    en: 'Natural water 1L',
    ko: '생수 1L',
  },
  'Agua de Horchata': {
    es: 'Agua de horchata preparada en casa',
    en: 'Homemade horchata water',
    ko: '집에서 만든 오르차타 음료',
  },
  'Agua de Jamaica': {
    es: 'Agua de jamaica natural',
    en: 'Natural jamaica water',
    ko: '천연 하이비스커스 음료',
  },
  'Tacos de Canasta (3 pzs)': {
    es: 'Tacos de frijol, papa o chicharrón',
    en: 'Bean, potato or pork rind tacos',
    ko: '콩, 감자 또는 돼지껍질 타코',
  },
  'Quesadilla de Flor de Calabaza': {
    es: 'Quesadilla hecha a mano con queso Oaxaca',
    en: 'Handmade quesadilla with Oaxaca cheese',
    ko: '와하카 치즈를 곁들인 수제 퀘사디아',
  },
  'Gordita de Chicharrón': {
    es: 'Gordita de maíz rellena de chicharrón en salsa verde',
    en: 'Corn gordita stuffed with pork rind in green sauce',
    ko: '녹색 소스를 곁들인 돼지껍질로 속을 채운 옥수수 고르디타',
  },
  'Flan Napolitano': {
    es: 'Flan casero con caramelo',
    en: 'Homemade flan with caramel',
    ko: '캐러멜을 곁들인 집made 플랑',
  },
  'Pastel de Chocolate': {
    es: 'Rebanada de pastel de chocolate',
    en: 'Slice of chocolate cake',
    ko: '초콜릿 케이크 한 조각',
  },
  'Extra Tortillas (4 pzs)': {
    es: 'Tortillas de maíz adicionales',
    en: 'Additional corn tortillas',
    ko: '추가 옥수수 토르티야',
  },
  'Extra Guacamole': {
    es: 'Porción de guacamole',
    en: 'Portion of guacamole',
    ko: '과카몰리 한 인분',
  },
  'Extra Frijoles': {
    es: 'Porción adicional de frijoles',
    en: 'Additional portion of beans',
    ko: '추가 콩 한 인분',
  },
};

export function useTranslations() {
  const { language } = useLanguage();
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const resolver = getTranslationResolver();
    resolver.loadAll()
      .then(() => setLoaded(true))
      .catch(() => setLoaded(true));
  }, []);

  const t = useCallback((key: string, fallback?: string, vars?: Record<string, string>): string => {
    let text: string | undefined;
    const dict = UI_DICTIONARY[key];
    if (dict && dict[language]) {
      text = dict[language];
    } else {
      const resolver = getTranslationResolver();
      text = resolver.getUiText(key, language);
    }
    text = text ?? fallback ?? key;
    if (vars) {
      Object.entries(vars).forEach(([k, v]) => {
        text = text!.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
      });
    }
    return text;
  }, [language]);

  const getItemDescription = useCallback((itemId: string, itemName?: string, fallback?: string): string => {
    if (itemName && ITEM_DESCRIPTION_DICTIONARY[itemName]) {
      const translated = ITEM_DESCRIPTION_DICTIONARY[itemName][language];
      if (translated) return translated;
    }
    const resolver = getTranslationResolver();
    const translated = resolver.getMenuItemDescription(itemId, language);
    return translated ?? fallback ?? '';
  }, [language]);

  const getCategoryName = useCallback((categoryCode: string, fallback?: string): string => {
    const dict = CATEGORY_DICTIONARY[categoryCode];
    if (dict && dict[language]) {
      return dict[language];
    }
    const resolver = getTranslationResolver();
    const translated = resolver.getCategoryDisplayName(categoryCode, language);
    return translated ?? fallback ?? categoryCode;
  }, [language]);

  return {
    language,
    loaded,
    error,
    t,
    getItemDescription,
    getCategoryName,
  };
}
