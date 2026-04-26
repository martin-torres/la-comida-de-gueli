import React from 'react';
import { motion } from 'framer-motion';

interface LeadFormProps {
  onSubmit: (data: LeadFormData) => void;
  isLoading?: boolean;
}

export interface LeadFormData {
  restaurant_name: string;
  owner_name: string;
  phone: string;
  email?: string;
  current_pos?: string;
  table_count?: number;
  daily_customers?: number;
}

export const LeadForm: React.FC<LeadFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = React.useState<LeadFormData>({
    restaurant_name: '',
    owner_name: '',
    phone: '',
    email: '',
    current_pos: '',
    table_count: undefined,
    daily_customers: undefined,
  });
  const [errors, setErrors] = React.useState<Partial<Record<keyof LeadFormData, string>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof LeadFormData, string>> = {};

    if (!formData.restaurant_name.trim()) {
      newErrors.restaurant_name = 'El nombre del restaurante es obligatorio';
    }
    if (!formData.owner_name.trim()) {
      newErrors.owner_name = 'Tu nombre es obligatorio';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es obligatorio';
    } else if (!/^[\d\s\-+()]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Ingresa un teléfono válido (mínimo 10 dígitos)';
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Ingresa un correo válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field: keyof LeadFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="w-full max-w-lg mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-8"
    >
      <h3 className="text-xl font-bold text-gray-800 mb-2">
        ¡Casi listo! Déjanos tus datos
      </h3>
      <p className="text-gray-500 text-sm mb-6">
        Te enviaremos tu scorecard y te contactaremos para la demo.
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del restaurante *
          </label>
          <input
            type="text"
            value={formData.restaurant_name}
            onChange={(e) => handleChange('restaurant_name', e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border-2 ${
              errors.restaurant_name ? 'border-red-300' : 'border-gray-200'
            } focus:border-amber-500 focus:outline-none transition-colors`}
            placeholder="Ej: Tacos El Güero"
          />
          {errors.restaurant_name && (
            <p className="mt-1 text-sm text-red-500">{errors.restaurant_name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tu nombre *
          </label>
          <input
            type="text"
            value={formData.owner_name}
            onChange={(e) => handleChange('owner_name', e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border-2 ${
              errors.owner_name ? 'border-red-300' : 'border-gray-200'
            } focus:border-amber-500 focus:outline-none transition-colors`}
            placeholder="Ej: Juan Pérez"
          />
          {errors.owner_name && (
            <p className="mt-1 text-sm text-red-500">{errors.owner_name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Teléfono *
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border-2 ${
              errors.phone ? 'border-red-300' : 'border-gray-200'
            } focus:border-amber-500 focus:outline-none transition-colors`}
            placeholder="81 1234 5678"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Correo electrónico
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border-2 ${
              errors.email ? 'border-red-300' : 'border-gray-200'
            } focus:border-amber-500 focus:outline-none transition-colors`}
            placeholder="juan@restaurante.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mesas
            </label>
            <input
              type="number"
              value={formData.table_count || ''}
              onChange={(e) => handleChange('table_count', parseInt(e.target.value) || 0)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-amber-500 focus:outline-none transition-colors"
              placeholder="15"
              min={1}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Clientes/día
            </label>
            <input
              type="number"
              value={formData.daily_customers || ''}
              onChange={(e) => handleChange('daily_customers', parseInt(e.target.value) || 0)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-amber-500 focus:outline-none transition-colors"
              placeholder="50"
              min={1}
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
      >
        {isLoading ? 'Guardando...' : 'Ver mi scorecard completo →'}
      </button>
    </motion.form>
  );
};