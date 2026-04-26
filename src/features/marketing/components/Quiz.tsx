import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { QuizAnswers } from '../lib/scoring';

interface Question {
  id: keyof QuizAnswers;
  question: string;
  subtitle: string;
  options: { value: string; label: string; icon?: string }[];
}

const QUESTIONS: Question[] = [
  {
    id: 'ordering_method',
    question: '¿Cómo ordenan tus clientes actualmente?',
    subtitle: 'El método de ordenar afecta directamente la velocidad y precisión',
    options: [
      { value: 'waiter', label: 'Mesero toma el pedido' },
      { value: 'whatsapp', label: 'WhatsApp' },
      { value: 'phone', label: 'Teléfono' },
      { value: 'walkout', label: 'Se van si hay fila' },
      { value: 'mixed', label: 'Mixto / Variado' },
    ],
  },
  {
    id: 'language_support',
    question: '¿Tus turistas pueden leer tu menú?',
    subtitle: 'El Mundial traerá 5 millones de visitantes que no hablan español',
    options: [
      { value: 'full', label: 'Sí, menú multilingüe con fotos' },
      { value: 'partial', label: 'Algo de inglés, sin fotos' },
      { value: 'none', label: 'Solo español' },
      { value: 'not_sure', label: 'No estoy seguro' },
    ],
  },
  {
    id: 'has_analytics',
    question: '¿Sabes qué vende más y a qué hora?',
    subtitle: 'Los datos son el superpoder de los restaurantes exitosos',
    options: [
      { value: 'yes', label: 'Sí, tengo reportes claros' },
      { value: 'no', label: 'No, voy a ojo' },
      { value: 'not_sure', label: 'Algo, pero no detallado' },
    ],
  },
  {
    id: 'staff_errors',
    question: '¿Qué pasa en hora pico?',
    subtitle: 'La hora pico es donde se gana o se pierde dinero',
    options: [
      { value: 'rare', label: 'Todo fluye bien' },
      { value: 'weekly', label: 'Algunos errores semanales' },
      { value: 'daily', label: 'Errores diarios' },
      { value: 'constant', label: 'Caos constante' },
    ],
  },
  {
    id: 'customer_data',
    question: '¿Tienes datos de tus clientes?',
    subtitle: 'Un cliente que vuelve cuesta 5x menos que uno nuevo',
    options: [
      { value: 'full', label: 'Sí, teléfono y preferencias' },
      { value: 'some', label: 'Algunos números' },
      { value: 'none', label: 'Nada' },
      { value: 'not_sure', label: 'No estoy seguro' },
    ],
  },
  {
    id: 'payment_time',
    question: '¿Cuánto tarda cobrar una mesa?',
    subtitle: 'Cada minuto extra es una mesa que no se voltea',
    options: [
      { value: 'less_than_1min', label: 'Menos de 1 minuto' },
      { value: '1_to_3min', label: '1-3 minutos' },
      { value: '3_to_5min', label: '3-5 minutos' },
      { value: 'more_than_5min', label: 'Más de 5 minutos' },
    ],
  },
  {
    id: 'world_cup_prep',
    question: '¿Estás preparado para el Mundial 2026?',
    subtitle: '5 millones de turistas llegarán a Monterrey',
    options: [
      { value: 'ready', label: 'Sí, estoy listo' },
      { value: 'planning', label: 'Estoy planeando' },
      { value: 'not_started', label: 'No he empezado' },
      { value: 'not_thinking', label: 'No lo había considerado' },
    ],
  },
  {
    id: 'marketing_capability',
    question: '¿Cómo traes clientes de vuelta?',
    subtitle: 'El mejor cliente es el que ya te conoce',
    options: [
      { value: 'full', label: 'Campañas automatizadas' },
      { value: 'whatsapp', label: 'WhatsApp manual' },
      { value: 'social_media', label: 'Redes sociales' },
      { value: 'none', label: 'No hago nada' },
    ],
  },
];

interface QuizProps {
  onComplete: (answers: QuizAnswers) => void;
}

export const Quiz: React.FC<QuizProps> = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [answers, setAnswers] = React.useState<Partial<QuizAnswers>>({});
  const [direction, setDirection] = React.useState(1);

  const question = QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;

  const handleAnswer = (value: string) => {
    const newAnswers = { ...answers, [question.id]: value };
    setAnswers(newAnswers);

    if (currentQuestion < QUESTIONS.length - 1) {
      setDirection(1);
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300);
    } else {
      onComplete(newAnswers as QuizAnswers);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setDirection(-1);
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>Pregunta {currentQuestion + 1} de {QUESTIONS.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentQuestion}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="bg-white rounded-2xl shadow-xl p-6 md:p-8"
        >
          <div className="mb-6">
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
              {question.question}
            </h3>
            <p className="text-gray-500 text-sm md:text-base">
              {question.subtitle}
            </p>
          </div>

          <div className="space-y-3">
            {question.options.map((option) => (
              <motion.button
                key={option.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAnswer(option.value)}
                className="w-full text-left p-4 rounded-xl border-2 border-gray-100 hover:border-amber-400 hover:bg-amber-50 transition-all duration-200 group"
              >
                <span className="font-medium text-gray-700 group-hover:text-gray-900">
                  {option.label}
                </span>
              </motion.button>
            ))}
          </div>

          {currentQuestion > 0 && (
            <button
              onClick={handleBack}
              className="mt-6 text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              ← Regresar
            </button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};