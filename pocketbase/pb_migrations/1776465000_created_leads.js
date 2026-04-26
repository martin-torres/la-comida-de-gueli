/// <reference path="../pb_data/types.d.ts" />

migrate((db) => {
  const dao = new Dao(db);
  const collection = new Collection({
    name: 'leads',
    type: 'base',
    schema: [
      { name: 'restaurant_name', type: 'text', required: true },
      { name: 'owner_name', type: 'text', required: true },
      { name: 'phone', type: 'text', required: true },
      { name: 'email', type: 'email', required: false },
      { name: 'current_pos', type: 'text', required: false },
      { name: 'table_count', type: 'number', required: false },
      { name: 'daily_customers', type: 'number', required: false },
      { name: 'pain_scores', type: 'json', required: false },
      { name: 'identified_modules', type: 'json', required: false },
      { name: 'readiness_score', type: 'number', required: false },
      { name: 'biggest_pain', type: 'text', required: false },
      { name: 'source', type: 'select', required: false, options: { values: ['landing_page', 'in_person', 'referral', 'walk_in'] } },
      { name: 'status', type: 'select', required: false, options: { values: ['new', 'qualified', 'demo_scheduled', 'trial_started', 'closed_won', 'closed_lost', 'nurture'] } },
      { name: 'notes', type: 'text', required: false },
      { name: 'assigned_to', type: 'relation', required: false, options: { collectionId: '_pb_users_auth_', cascadeDelete: false } },
      { name: 'booked_demo_at', type: 'date', required: false },
      { name: 'trial_ends_at', type: 'date', required: false },
    ],
    indexes: [
      'CREATE UNIQUE INDEX idx_leads_phone ON leads (phone)',
      'CREATE INDEX idx_leads_status_source ON leads (status, source)',
      'CREATE INDEX idx_leads_readiness_score ON leads (readiness_score)',
    ],
    listRule: '@request.auth.id != ""',
    viewRule: '@request.auth.id != ""',
    createRule: '',
    updateRule: '@request.auth.id != ""',
    deleteRule: '@request.auth.id != ""',
  });

  return dao.saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId('leads');
  if (collection) {
    return dao.deleteCollection(collection);
  }
});