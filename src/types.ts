export type Tag = 'outdoor' | 'school' | 'home';

export interface Choice {
  label: string;
  tag: Tag;
}

export interface Story {
  id: string;
  text: string;
  choices: Choice[];
}

export interface Quest {
  id: string;
  title: string;
  desc: string;
  tag: Tag;
}

export interface HistoryItem {
  date: string;
  title: string;
  tag: Tag;
}

export interface UserState {
  lastCompletedDate: string | null;
  dailyCompletions: number;
  streak: number;
  history: HistoryItem[];
}


