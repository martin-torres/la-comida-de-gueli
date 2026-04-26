import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quiz } from './components/Quiz';
import { Results } from './components/Results';
import { LeadForm } from './components/LeadForm';
import type { LeadFormData } from './components/LeadForm';
import type { QuizAnswers } from './lib/scoring';
import { calculateScore } from './lib/scoring';
import { leadsRepository } from '../../data/pocketbase';
import type { ScoreResult } from './lib/scoring';

type Step = 'hero' | 'quiz' | 'results' | 'form' | 'booking' | 'thankyou';

export const LandingPage: React.FC = () => {
  const [step, setStep] = React.useState<Step>('hero');
  const [answers, setAnswers] = React.useState<QuizAnswers | null>(null);
  const [score, setScore] = React.useState<ScoreResult | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [leadId, setLeadId] = React.useState<string | null>(null);

  const handleQuizComplete = (quizAnswers: QuizAnswers) => {
    setAnswers(quizAnswers);
    const calculatedScore = calculateScore(quizAnswers);
    setScore(calculatedScore);
    setStep('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookDemo = () => {
    setStep('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartTrial = () => {
    setStep('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDownloadPDF = () => {
    alert('PDF Scorecard: Funcionalidad en desarrollo. Te enviaremos el PDF por correo.');
  };

  const handleFormSubmit = async (formData: LeadFormData) => {
    if (!score || !answers) return;

    setIsSubmitting(true);
    try {
      const lead = await leadsRepository.create({
        restaurant_name: formData.restaurant_name,
        owner_name: formData.owner_name,
        phone: formData.phone,
        email: formData.email,
        current_pos: formData.current_pos,
        table_count: formData.table_count,
        daily_customers: formData.daily_customers,
        pain_scores: {
          menu: score.menu,
          orders: score.orders,
          retention: score.retention,
          payment: score.payment,
          analytics: score.analytics,
        },
        identified_modules: score.modules,
        readiness_score: score.total,
        biggest_pain: score.gaps[0]?.label,
        source: 'landing_page',
        status: 'new',
      });

      setLeadId(lead.id);
      setStep('thankyou');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error saving lead:', error);
      alert('Hubo un error al guardar tus datos. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToQuiz = () => {
    setStep('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <AnimatePresence mode="wait">
        {step === 'hero' && (
          <motion.div
            key="hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
          >
            <div className="text-center max-w-3xl mx-auto">
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-6"
              >
                <span className="inline-block px-4 py-2 bg-amber-100 text-amber-800 text-sm font-bold rounded-full">
                  🏆 Mundial 2026 está llegando
                </span>
              </motion.div>

              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-6xl font-black text-gray-900 mb-6 leading-tight"
              >
                ¿Tu restaurante está listo para{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">
                  5 millones de turistas?
                </span>
              </motion.h1>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
              >
                Descubre tu puntaje de preparación para el Mundial 2026 en 2 minutos. 
                Identifica tus puntos débiles antes de que lleguen los turistas.
              </motion.p>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <button
                  onClick={scrollToQuiz}
                  className="px-10 py-5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-lg font-bold rounded-2xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105"
                >
                  Empezar diagnóstico gratis →
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-12 grid grid-cols-3 gap-8 max-w-lg mx-auto"
              >
                <div className="text-center">
                  <div className="text-3xl font-black text-gray-800">8</div>
                  <div className="text-sm text-gray-500">preguntas</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-gray-800">2</div>
                  <div className="text-sm text-gray-500">minutos</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-gray-800">100%</div>
                  <div className="text-sm text-gray-500">gratis</div>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="mt-16 text-center"
            >
              <p className="text-gray-400 text-sm">
                Hecho con ❤️ en Monterrey para restaurantes de Monterrey
              </p>
            </motion.div>
          </motion.div>
        )}

        {step === 'quiz' && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center px-4 py-12"
          >
            <Quiz onComplete={handleQuizComplete} />
          </motion.div>
        )}

        {step === 'results' && score && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen px-4 py-12"
          >
            <div className="max-w-3xl mx-auto mb-8">
              <button
                onClick={() => setStep('hero')}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                ← Regresar al inicio
              </button>
            </div>
            <Results
              score={score}
              onBookDemo={handleBookDemo}
              onStartTrial={handleStartTrial}
              onDownloadPDF={handleDownloadPDF}
            />
          </motion.div>
        )}

        {step === 'form' && (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center px-4 py-12"
          >
            <LeadForm onSubmit={handleFormSubmit} isLoading={isSubmitting} />
          </motion.div>
        )}

        {step === 'thankyou' && (
          <motion.div
            key="thankyou"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center px-4 py-12"
          >
            <div className="text-center max-w-lg mx-auto">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring' }}
                className="text-6xl mb-6"
              >
                🎉
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                ¡Gracias! Recibimos tu información
              </h2>
              <p className="text-gray-600 mb-8">
                Te contactaremos en menos de 24 horas para agendar tu demo. 
                Mientras tanto, revisa tu correo con tu scorecard completo.
              </p>
              <div className="space-y-4">
                <button
                  onClick={() => setStep('hero')}
                  className="w-full px-6 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg"
                >
                  Volver al inicio
                </button>
                <p className="text-sm text-gray-400">
                  ¿Conoces otro restaurante que necesite esto?{' '}
                  <button
                    onClick={() => {
                      setStep('hero');
                      window.scrollTo({ top: 0 });
                    }}
                    className="text-amber-600 hover:underline"
                  >
                    Comparte esta página
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};