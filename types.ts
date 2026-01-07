
export interface Message {
  role: 'user' | 'assistant';
  content: string;
  id: string;
  timestamp: Date;
  groundingSources?: GroundingSource[];
  isSearching?: boolean;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface LegalTemplate {
  title: string;
  description: string;
  icon: string;
  prompt: string;
}
