import React from 'react';
import type { Lead, LeadStatus, PainScores } from '../../../data/contracts/leads-repo';
import { leadsRepository } from '../../../data/pocketbase';
import { X, Phone, Mail, Users, Target } from 'lucide-react';

const STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'Nuevo',
  qualified: 'Calificado',
  demo_scheduled: 'Demo Agendada',
  trial_started: 'Prueba Iniciada',
  closed_won: 'Ganado',
  closed_lost: 'Perdido',
  nurture: 'Nutrir',
};

const STATUS_OPTIONS: LeadStatus[] = ['new', 'qualified', 'demo_scheduled', 'trial_started', 'closed_won', 'closed_lost', 'nurture'];

const MODULE_NAMES: Record<string, string> = {
  multilingual_menu: 'Menú Multilingüe',
  qr_ordering: 'Ordenes QR',
  kitchen_display: 'Pantalla de Cocina',
  customer_database: 'Base de Clientes',
  promotions_engine: 'Promociones Inteligentes',
  multi_payment: 'Pagos Múltiples',
  analytics_dashboard: 'Dashboard de Analítica',
};

interface LeadDetailProps {
  leadId: string;
  onClose: () => void;
  onUpdate: () => void;
}

export const LeadDetail: React.FC<LeadDetailProps> = ({ leadId, onClose, onUpdate }) => {
  const [lead, setLead] = React.useState<Lead | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [notes, setNotes] = React.useState('');
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    loadLead();
  }, [leadId]);

  const loadLead = async () => {
    setLoading(true);
    try {
      const data = await leadsRepository.getById(leadId);
      if (data) {
        setLead(data);
        setNotes(data.notes || '');
      }
    } catch (error) {
      console.error('Error loading lead:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: LeadStatus) => {
    if (!lead) return;
    setIsSaving(true);
    try {
      await leadsRepository.updateStatus(lead.id, newStatus);
      await loadLead();
      onUpdate();
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!lead) return;
    setIsSaving(true);
    try {
      await leadsRepository.update(lead.id, { notes });
      await loadLead();
      onUpdate();
    } catch (error) {
      console.error('Error saving notes:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8">
          <p className="text-gray-500">Lead no encontrado</p>
          <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-100 rounded-lg">Cerrar</button>
        </div>
      </div>
    );
  }

  const painScores = lead.pain_scores as PainScores | undefined;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{lead.restaurant_name}</h2>
            <p className="text-sm text-gray-500">{lead.owner_name}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <Phone className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium">{lead.phone}</span>
            </div>
            {lead.email && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium">{lead.email}</span>
              </div>
            )}
            {lead.table_count && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium">{lead.table_count} mesas</span>
              </div>
            )}
            {lead.daily_customers && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Target className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium">{lead.daily_customers} clientes/día</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100">
            <div className={`text-3xl font-black ${
              (lead.readiness_score || 0) >= 80 ? 'text-green-600' :
              (lead.readiness_score || 0) >= 50 ? 'text-amber-600' :
              'text-red-600'
            }`}>
              {lead.readiness_score || 0}/100
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">World Cup Readiness Score</p>
              <p className="text-xs text-gray-500">{lead.biggest_pain}</p>
            </div>
          </div>

          {painScores && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Desglose de puntajes</h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(painScores).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600 capitalize">{key}</span>
                    <span className={`text-sm font-bold ${
                      value >= 15 ? 'text-green-600' :
                      value >= 10 ? 'text-amber-600' :
                      'text-red-600'
                    }`}>
                      {value}/20
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {lead.identified_modules && lead.identified_modules.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Módulos recomendados</h3>
              <div className="flex flex-wrap gap-2">
                {lead.identified_modules.map((module) => (
                  <span key={module} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                    {MODULE_NAMES[module] || module}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Estado</h3>
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  disabled={isSaving}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    lead.status === status
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {STATUS_LABELS[status]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Notas</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
              placeholder="Agrega notas sobre este lead..."
            />
            <button
              onClick={handleSaveNotes}
              disabled={isSaving}
              className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Guardando...' : 'Guardar notas'}
            </button>
          </div>

          <div className="pt-4 border-t border-gray-100 text-xs text-gray-400 space-y-1">
            <p>Creado: {new Date(lead.created).toLocaleString('es-MX')}</p>
            <p>Actualizado: {new Date(lead.updated).toLocaleString('es-MX')}</p>
            <p>ID: {lead.id}</p>
          </div>
        </div>
      </div>
    </div>
  );
};