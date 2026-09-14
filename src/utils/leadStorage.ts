// Lead Storage & CRM Utility for AI Chronicle
// Stores subscriber emails, sponsor inquiries, and provides CSV export capabilities

export interface LeadRecord {
  id: string;
  email: string;
  source: 'newsletter' | 'bundle_download' | 'sponsor_inquiry' | 'sponsor';
  createdAt: string;
  language: string;
  metadata?: Record<string, unknown>;
}

const STORAGE_KEY = 'ai_chronicle_leads_ledger_v1';

export const saveLead = (
  email: string,
  source: LeadRecord['source'],
  language: string = 'zh',
  metadata?: Record<string, unknown>
): boolean => {
  if (!email || email.trim().length < 3) return false;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const leads: LeadRecord[] = raw ? JSON.parse(raw) : [];
    
    // Check if already exists for this source
    const exists = leads.some(l => l.email.toLowerCase() === email.toLowerCase() && l.source === source);
    if (!exists) {
      leads.unshift({
        id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        email: email.trim().toLowerCase(),
        source,
        createdAt: new Date().toISOString(),
        language,
        metadata
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
    }
    return true;
  } catch (err) {
    console.error('Failed to save lead to ledger:', err);
    return false;
  }
};

export const getLeads = (): LeadRecord[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const exportLeadsToCSV = (): void => {
  const leads = getLeads();
  if (leads.length === 0) {
    alert('当前线索库为空，已有用户订阅或索取资料后即可导出！');
    return;
  }

  const header = ['ID', 'Contact', 'Source', 'CreatedAt', 'Language', 'Details'].join(',');
  const rows = leads.map(l => {
    const details = l.metadata ? `"${JSON.stringify(l.metadata).replace(/"/g, '""')}"` : '""';
    return [l.id, `"${l.email}"`, l.source, l.createdAt, l.language, details].join(',');
  });
  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [header, ...rows].join('\n');
  
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `AI_Chronicle_Leads_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
