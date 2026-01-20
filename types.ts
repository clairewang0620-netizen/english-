
export interface Example {
  en: string;
  cn: string;
}

export interface Word {
  id: string;
  text: string;
  phonetic: string;
  pos: string; // e.g., 'n.', 'adj.', 'v.'
  definition: string;
  chinese: string;
  categories: string[];
  examples: Example[];
}

export interface WordGroup {
  id: string;
  title: string;
  words: string[]; // IDs of words
  locked?: boolean;
}

export interface ArticleParagraph {
  en: string;
  cn: string;
}

export interface Article {
  id: string;
  title: string;
  category: 'Tech' | 'Business' | 'Culture' | 'Society';
  summary: string;
  image: string; // URL for the article thumbnail
  paragraphs: ArticleParagraph[];
  keywords: { text: string; cn: string }[];
}

export enum PageType {
  HOME = 'home',
  LEARN = 'learn',
  DICTATION = 'dictation',
  READING = 'reading',
  MISTAKES = 'mistakes'
}
