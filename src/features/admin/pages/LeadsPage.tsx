import React, { useState, useEffect } from 'react';
import { leadsRepository } from '../../../data/pocketbase';
import type { Lead, LeadStatus, LeadSource } from '../../../data/contracts/leads-repo';
import { LeadDetail } from '../components/LeadDetail';
import { Search, Phone, Mail, Calendar, TrendingUp, Users, Target } from 'lucide-react';

const STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'Nuevo',
  qualified: 'Calificado',
  demo_scheduled: 'Demo Agendada',
  trial_started: 'Prueba Iniciada',
  closed_won: 'Ganado',
  closed_lost: 'Perdido',
  nurture: 'Nutrir',
};

const STATUS_COLORS: Record<LeadStatus, string> = {
  new: 'bg-blue-100 text-blue-700',
  qualified: 'bg-purple-100 text-purple-700',
  demo_scheduled: 'bg-amber-100 text-amber-700',
  trial_started: 'bg-green-100 text-green-700',
  closed_won: 'bg-emerald-100 text-emerald-700',
  closed_lost: 'bg-gray-100 text-gray-700',
  nurture: 'bg-pink-100 text-pink-700',
};

const SOURCE_LABELS: Record<LeadSource, string> = {
  landing_page: 'Landing Page',
  in_person: 'En Persona',
  referral: 'Referido',
  walk_in: 'Walk-in',
};

export const LeadsPage: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | ''>('');
  const [sortBy, setSortBy] = useState<'score' | 'date'>('score');
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    setLoading(true);
    try {
      const data = await leadsRepository.list();
      setLeads(data);
    } catch (error) {
      console.error('Error loading leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLeads = leads
    .filter((lead) => {
      if (statusFilter && lead.status !== statusFilter) return false;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return (
          lead.restaurant_name.toLowerCase().includes(term) ||
          lead.owner_name.toLowerCase().includes(term) ||
          lead.phone.includes(term)
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'score') {
        return (b.readiness_score || 0) - (a.readiness_score || 0);
      }
      return new Date(b.created).getTime() - new Date(a.created).getTime();
    });

  const stats = {
    total: leads.length,
    avgScore: leads.length > 0
      ? Math.round(leads.reduce((acc, l) => acc + (l.readiness_score || 0), 0) / leads.length)
      : 0,
    new: leads.filter((l) => l.status === 'new').length,
    demoScheduled: leads.filter((l) => l.status === 'demo_scheduled').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
        <button
          onClick={loadLeads}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          Actualizar
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-500">Total leads</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.avgScore}</p>
              <p className="text-sm text-gray-500">Puntaje promedio</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <Target className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.new}</p>
              <p className="text-sm text-gray-500">Nuevos</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.demoScheduled}</p>
              <p className="text-sm text-gray-500">Demos agendadas</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar restaurante, nombre o teléfono..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as LeadStatus | '')}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos los estados</option>
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'score' | 'date')}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="score">Por puntaje</option>
            <option value="date">Por fecha</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Restaurante</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Contacto</th>
                <th className="text-center px-4 py-3 text-sm font-semibold text-gray-600">Puntaje</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Estado</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Origen</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    No se encontraron leads
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => setSelectedLeadId(lead.id)}
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{lead.restaurant_name}</div>
                      <div className="text-sm text-gray-500">
                        {lead.table_count && `${lead.table_count} mesas`}
                        {lead.table_count && lead.daily_customers && ' · '}
                        {lead.daily_customers && `${lead.daily_customers} clientes/día`}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900">{lead.owner_name}</div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Phone className="w-3 h-3" />
                        {lead.phone}
                      </div>
                      {lead.email && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Mail className="w-3 h-3" />
                          {lead.email}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100">
                        <span className={`text-lg font-bold ${
                          (lead.readiness_score || 0) >= 80 ? 'text-green-600' :
                          (lead.readiness_score || 0) >= 50 ? 'text-amber-600' :
                          'text-red-600'
                        }`}>
                          {lead.readiness_score || 0}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        STATUS_COLORS[lead.status || 'new']
                      }`}>
                        {STATUS_LABELS[lead.status || 'new']}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {SOURCE_LABELS[lead.source || 'landing_page']}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(lead.created).toLocaleDateString('es-MX')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedLeadId && (
        <LeadDetail
          leadId={selectedLeadId}
          onClose={() => setSelectedLeadId(null)}
          onUpdate={loadLeads}
        />
      )}
    </div>
  );
};