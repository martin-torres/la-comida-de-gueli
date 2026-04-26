import React from 'react';
import { motion } from 'framer-motion';
import type { ScoreResult } from '../lib/scoring';
import { getScoreLabel, getScoreDescription } from '../lib/scoring';

interface ResultsProps {
  score: ScoreResult;
  onBookDemo: () => void;
  onStartTrial: () => void;
  onDownloadPDF: () => void;
}

const MODULE_DESCRIPTIONS: Record<string, string> = {
  multilingual_menu: 'Tu menú hablará inglés y coreano. Fotos + traducciones = clientes seguros.',
  qr_ordering: 'Los clientes ordenan desde su teléfono. Sin errores, sin esperas.',
  kitchen_display: 'La cocina ve los pedidos al instante. Priorizados por tiempo. Sin papel.',
  customer_database: 'Cada cliente queda registrado. Teléfono, preferencias, historial.',
  promotions_engine: 'Promociones inteligentes que sí funcionan. BOGO, combos, descuentos.',
  multi_payment: 'Tarjeta, Oxxo, MercadoPago, CoDi, efectivo. Todo en un flujo.',
  analytics_dashboard: 'Sabes qué vende, cuándo y por qué. Decisiones con datos, no a ojo.',
};

const MODULE_NAMES: Record<string, string> = {
  multilingual_menu: 'Menú Multilingüe',
  qr_ordering: 'Ordenes QR',
  kitchen_display: 'Pantalla de Cocina',
  customer_database: 'Base de Clientes',
  promotions_engine: 'Promociones Inteligentes',
  multi_payment: 'Pagos Múltiples',
  analytics_dashboard: 'Dashboard de Analítica',
};

export const Results: React.FC<ResultsProps> = ({
  score,
  onBookDemo,
  onStartTrial,
  onDownloadPDF,
}) => {
  const scoreLabel = getScoreLabel(score.total);
  const scoreDescription = getScoreDescription(score.total);

  const categories = [
    { key: 'menu', label: 'Menú', score: score.menu, icon: '📋' },
    { key: 'orders', label: 'Pedidos', score: score.orders, icon: '⚡' },
    { key: 'retention', label: 'Retención', score: score.retention, icon: '🔄' },
    { key: 'payment', label: 'Pagos', score: score.payment, icon: '💳' },
    { key: 'analytics', label: 'Analítica', score: score.analytics, icon: '📊' },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8 text-center"
      >
        <div className="mb-4">
          <span className="text-sm font-medium text-gray-400 uppercase tracking-wide">
            Puntaje de Preparación Mundial 2026
          </span>
        </div>
        
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="mb-4"
        >
          <span className={`text-7xl font-black ${scoreLabel.color}`}>
            {score.total}
          </span>
          <span className="text-2xl text-gray-400">/100</span>
        </motion.div>

        <h2 className={`text-2xl font-bold mb-3 ${scoreLabel.color}`}>
          {scoreLabel.text}
        </h2>
        <p className="text-gray-600 max-w-md mx-auto">
          {scoreDescription}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl shadow-xl p-6 md:p-8"
      >
        <h3 className="text-lg font-bold text-gray-800 mb-6">
          Desglose por categoría
        </h3>
        <div className="space-y-4">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-gray-700">
                  {cat.icon} {cat.label}
                </span>
                <span className="font-bold text-gray-800">{cat.score}/20</span>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${
                    cat.score >= 15 ? 'bg-green-500' :
                    cat.score >= 10 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${(cat.score / 20) * 100}%` }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-2xl shadow-xl p-6 md:p-8"
      >
        <h3 className="text-lg font-bold text-gray-800 mb-2">
          Tu plan de acción prioritario
        </h3>
        <p className="text-gray-500 text-sm mb-6">
          Basado en tus respuestas, estos son los 3 problemas más urgentes:
        </p>
        
        <div className="space-y-4">
          {score.gaps.map((gap, index) => (
            <motion.div
              key={gap.category}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="flex items-start gap-4 p-4 bg-red-50 rounded-xl border border-red-100"
            >
              <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                {index + 1}
              </div>
              <div>
                <h4 className="font-bold text-gray-800 mb-1">
                  {gap.label}: {gap.score}/20
                </h4>
                <p className="text-sm text-gray-600">
                  {MODULE_DESCRIPTIONS[score.modules[index]] || 'Módulo recomendado para mejorar esta área.'}
                </p>
                <span className="inline-block mt-2 px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                  {MODULE_NAMES[score.modules[index]] || 'Módulo personalizado'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-xl p-8 text-center text-white"
      >
        <h3 className="text-2xl font-bold mb-3">
          ¿Quieres ver cómo se ve en tu restaurante?
        </h3>
        <p className="text-amber-100 mb-6">
          Agenda una demo de 15 minutos. Te mostramos exactamente cómo cada módulo funciona con tu menú.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onBookDemo}
            className="px-8 py-4 bg-white text-orange-600 font-bold rounded-xl hover:bg-gray-100 transition-colors shadow-lg"
          >
            Agendar demo →
          </button>
          <button
            onClick={onStartTrial}
            className="px-8 py-4 bg-orange-700 text-white font-bold rounded-xl hover:bg-orange-800 transition-colors border-2 border-orange-400"
          >
            30 días gratis
          </button>
        </div>
        
        <button
          onClick={onDownloadPDF}
          className="mt-4 text-sm text-amber-200 hover:text-white transition-colors underline"
        >
          Descargar scorecard PDF
        </button>
      </motion.div>
    </div>
  );
};