export interface QuizAnswers {
  ordering_method: 'waiter' | 'whatsapp' | 'phone' | 'walkout' | 'mixed';
  language_support: 'none' | 'partial' | 'full' | 'not_sure';
  has_analytics: 'yes' | 'no' | 'not_sure';
  staff_errors: 'rare' | 'weekly' | 'daily' | 'constant';
  customer_data: 'none' | 'some' | 'full' | 'not_sure';
  payment_time: 'less_than_1min' | '1_to_3min' | '3_to_5min' | 'more_than_5min';
  world_cup_prep: 'not_started' | 'planning' | 'ready' | 'not_thinking';
  marketing_capability: 'none' | 'social_media' | 'whatsapp' | 'full';
}

export interface ScoreResult {
  menu: number;
  orders: number;
  retention: number;
  payment: number;
  analytics: number;
  total: number;
  gaps: Array<{ category: string; score: number; label: string }>;
  modules: string[];
}

const MODULE_MAP: Record<string, string[]> = {
  menu: ['multilingual_menu'],
  orders: ['qr_ordering', 'kitchen_display'],
  retention: ['customer_database', 'promotions_engine'],
  payment: ['multi_payment'],
  analytics: ['analytics_dashboard', 'promotions_engine'],
};

const CATEGORY_LABELS: Record<string, string> = {
  menu: 'Accesibilidad del Menú',
  orders: 'Eficiencia en Pedidos',
  retention: 'Retención de Clientes',
  payment: 'Velocidad de Pago',
  analytics: 'Datos y Analítica',
};

export function calculateScore(answers: QuizAnswers): ScoreResult {
  const menuScore = calculateMenuScore(answers.language_support);
  const orderScore = calculateOrderScore(answers.ordering_method, answers.staff_errors);
  const retentionScore = calculateRetentionScore(answers.customer_data);
  const paymentScore = calculatePaymentScore(answers.payment_time);
  const analyticsScore = calculateAnalyticsScore(answers.has_analytics, answers.marketing_capability);

  const scores = {
    menu: menuScore,
    orders: orderScore,
    retention: retentionScore,
    payment: paymentScore,
    analytics: analyticsScore,
  };

  const gaps = Object.entries(scores)
    .map(([category, score]) => ({
      category,
      score,
      label: CATEGORY_LABELS[category],
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 3);

  const modules = [...new Set(gaps.flatMap((gap) => MODULE_MAP[gap.category] || []))];

  return {
    ...scores,
    total: menuScore + orderScore + retentionScore + paymentScore + analyticsScore,
    gaps,
    modules,
  };
}

function calculateMenuScore(languageSupport: QuizAnswers['language_support']): number {
  switch (languageSupport) {
    case 'full': return 20;
    case 'partial': return 12;
    case 'not_sure': return 8;
    case 'none': return 3;
    default: return 0;
  }
}

function calculateOrderScore(orderingMethod: QuizAnswers['ordering_method'], staffErrors: QuizAnswers['staff_errors']): number {
  let score = 10;
  
  switch (orderingMethod) {
    case 'walkout': score -= 5; break;
    case 'phone': score -= 3; break;
    case 'whatsapp': score -= 1; break;
    case 'waiter': score += 0; break;
    case 'mixed': score -= 2; break;
  }

  switch (staffErrors) {
    case 'constant': score -= 5; break;
    case 'daily': score -= 3; break;
    case 'weekly': score -= 1; break;
    case 'rare': score += 0; break;
  }

  return Math.max(0, Math.min(20, score));
}

function calculateRetentionScore(customerData: QuizAnswers['customer_data']): number {
  switch (customerData) {
    case 'full': return 20;
    case 'some': return 12;
    case 'not_sure': return 8;
    case 'none': return 3;
    default: return 0;
  }
}

function calculatePaymentScore(paymentTime: QuizAnswers['payment_time']): number {
  switch (paymentTime) {
    case 'less_than_1min': return 20;
    case '1_to_3min': return 14;
    case '3_to_5min': return 8;
    case 'more_than_5min': return 3;
    default: return 0;
  }
}

function calculateAnalyticsScore(hasAnalytics: QuizAnswers['has_analytics'], marketingCapability: QuizAnswers['marketing_capability']): number {
  let score = 10;

  switch (hasAnalytics) {
    case 'yes': score += 5; break;
    case 'not_sure': score += 0; break;
    case 'no': score -= 3; break;
  }

  switch (marketingCapability) {
    case 'full': score += 5; break;
    case 'whatsapp': score += 2; break;
    case 'social_media': score += 1; break;
    case 'none': score -= 2; break;
  }

  return Math.max(0, Math.min(20, score));
}

export function getScoreLabel(score: number): { text: string; color: string } {
  if (score >= 80) return { text: '¡Listo para el Mundial!', color: 'text-green-600' };
  if (score >= 50) return { text: 'Necesitas prepararte', color: 'text-yellow-600' };
  return { text: 'Urgente: Actúa ahora', color: 'text-red-600' };
}

export function getScoreDescription(score: number): string {
  if (score >= 80) {
    return 'Tu restaurante está bien preparado. Unos pocos ajustes te pondrán en la cima para el Mundial 2026.';
  }
  if (score >= 50) {
    return 'Tienes una base sólida, pero los turistas del Mundial expondrán las grietas. Es momento de actuar.';
  }
  return 'Sin acción, tu restaurante será invisible para 5 millones de turistas. El momento de cambiar es ahora.';
}