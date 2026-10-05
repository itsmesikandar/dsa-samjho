export const SECTIONS = [
  { id: 'kya-hai', n: 1, title: 'Ye kya hai?' },
  { id: 'kyun', n: 2, title: 'Kyun chahiye?' },
  { id: 'dekho', n: 3, title: 'Dekho kaisa dikhta hai' },
  { id: 'kaise', n: 4, title: 'Kaise kaam karta hai' },
  { id: 'operations', n: 5, title: 'Operations aur unki cost' },
  { id: 'code', n: 6, title: 'Code' },
  { id: 'examples', n: 7, title: 'Examples' },
  { id: 'kab', n: 8, title: 'Kab use karein / kab NAHI' },
  { id: 'real-world', n: 9, title: 'Asli duniya mein kahan?' },
  { id: 'galtiyan', n: 10, title: 'Common galtiyan & edge cases' },
  { id: 'interview', n: 11, title: 'Interview corner' },
  { id: 'practice', n: 12, title: 'Practice problems' },
  { id: 'revision', n: 13, title: 'Quick revision' },
  { id: 'aage', n: 14, title: 'Connections — aage kya?' },
] as const;

export type SectionId = (typeof SECTIONS)[number]['id'];
