import type { LeadsRepo, Lead, LeadInput, LeadFilters, LeadStatus } from '../contracts';
import { pbClient } from './client';

export class PocketBaseLeadsRepository implements LeadsRepo {
  async create(leadData: LeadInput): Promise<Lead> {
    const lead = await pbClient.collection('leads').create({
      ...leadData,
      status: leadData.status || 'new',
      source: leadData.source || 'landing_page',
    });
    return lead as Lead;
  }

  async getById(id: string): Promise<Lead | null> {
    try {
      const lead = await pbClient.collection('leads').getOne(id);
      return lead as Lead;
    } catch {
      return null;
    }
  }

  async getByPhone(phone: string): Promise<Lead | null> {
    try {
      const leads = await pbClient.collection('leads').getFullList({
        filter: `phone = "${phone}"`,
        limit: 1,
      });
      return leads[0] as Lead || null;
    } catch {
      return null;
    }
  }

  async update(id: string, data: Partial<LeadInput>): Promise<Lead> {
    const lead = await pbClient.collection('leads').update(id, data);
    return lead as Lead;
  }

  async updateStatus(id: string, status: LeadStatus): Promise<Lead> {
    const lead = await pbClient.collection('leads').update(id, { status });
    return lead as Lead;
  }

  async list(filters?: LeadFilters): Promise<Lead[]> {
    const filterParts: string[] = [];
    
    if (filters?.status) {
      filterParts.push(`status = "${filters.status}"`);
    }
    if (filters?.source) {
      filterParts.push(`source = "${filters.source}"`);
    }
    if (filters?.minScore !== undefined) {
      filterParts.push(`readiness_score >= ${filters.minScore}`);
    }
    if (filters?.maxScore !== undefined) {
      filterParts.push(`readiness_score <= ${filters.maxScore}`);
    }
    if (filters?.search) {
      filterParts.push(`(restaurant_name ~ "${filters.search}" || owner_name ~ "${filters.search}" || phone ~ "${filters.search}")`);
    }

    const filter = filterParts.join(' && ');
    
    const leads = await pbClient.collection('leads').getFullList({
      filter: filter || undefined,
      sort: '-readiness_score,-created',
    });
    
    return leads.map((lead) => lead as Lead);
  }

  async delete(id: string): Promise<boolean> {
    try {
      await pbClient.collection('leads').delete(id);
      return true;
    } catch {
      return false;
    }
  }
}