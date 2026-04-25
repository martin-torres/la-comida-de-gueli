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

  const getItemDescription = useCallback((itemId: string, fallback?: string): string => {
    const resolver = getTranslationResolver();
    const translated = resolver.getMenuItemDescription(itemId, language);
    return translated ?? fallback ?? '';
  }, [language]);

  const getCategoryName = useCallback((categoryCode: string, fallback?: string): string => {
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
