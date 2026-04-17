import { RankingEntry, Difficulty } from '../types';

const SHEETDB_API = 'https://sheetdb.io/api/v1/ue43sw297boe4';
const LOCAL_STORAGE_KEY = 'tetris_neon_ranking';

export async function fetchRanking(): Promise<RankingEntry[]> {
  try {
    const res = await fetch(`${SHEETDB_API}?limit=10`);
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    const sorted = data
      .sort((a: RankingEntry, b: RankingEntry) => b.score - a.score)
      .slice(0, 10);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sorted));
    return sorted;
  } catch {
    const local = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
    return local;
  }
}

export async function saveScore(
  name: string,
  score: number,
  difficulty: Difficulty
): Promise<boolean> {
  const entry = {
    name: name.trim().toUpperCase(),
    score,
    difficulty,
    date: new Date().toISOString().split('T')[0],
  };
  try {
    const res = await fetch(SHEETDB_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([entry]),
    });
    if (!res.ok) throw new Error('API error');
    await fetchRanking();
    return true;
  } catch {
    const local = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
    local.push(entry);
    local.sort((a, b) => b.score - a.score);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(local.slice(0, 10)));
    return true;
  }
}