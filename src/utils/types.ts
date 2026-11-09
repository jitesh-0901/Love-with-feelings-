export interface StoryChapter {
  id: number;
  slug: string;
  title: string;
  tamilTitle: string;
  subtitle: string;
  targetSeconds: number;
}

export const STORY_CHAPTERS: StoryChapter[] = [
  { id: 1, slug: 'opening', title: 'The Broken Heart', tamilTitle: 'உடைந்த இதயம்', subtitle: 'A heart that wants to heal', targetSeconds: 0 },
  { id: 2, slug: 'letter', title: 'The Apology Letter', tamilTitle: 'மன்னிப்பு கடிதம்', subtitle: 'Handwritten with love & downloadable PDF', targetSeconds: 20 },
  { id: 3, slug: 'forgiveness', title: 'The Forgiveness', tamilTitle: 'மன்னிப்பு', subtitle: 'A sincere question to Ovi ma', targetSeconds: 50 },
  { id: 4, slug: 'questions', title: 'Heartfelt Questions', tamilTitle: 'உன் மனசின் குரல்', subtitle: 'Listening to your feelings', targetSeconds: 75 },
  { id: 5, slug: 'summary', title: 'Always Yours', tamilTitle: 'நிறைவு', subtitle: 'Sorry, you are mine always', targetSeconds: 100 },
];

export interface MemoryItem {
  id: string;
  imageUrl: string;
  caption: string;
  date: string;
  location: string;
  rotationDeg: number;
}

export interface QuestionResponses {
  q1?: string;
  q2?: string;
  q3?: string;
  q4?: string;
  q5?: string;
  q6?: string;
  q7?: string;
  q8?: string;
  q9?: string;
  q10?: string;
  q11?: string;
  q12?: string;
  q13?: string;
  personalNote: string;
  forgivenessAnswer?: 'YES, I FORGIVE YOU' | 'NO' | 'I NEED MORE TIME' | null;
  consentToSave?: boolean;
  submittedAt?: string;
}
