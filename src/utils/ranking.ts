import { RankingEntry, Difficulty } from '../types';

const SHEETDB_API = 'https://sheetdb.io/api/v1/ue43sw297boe4';

export async function fetchRanking(): Promise<RankingEntry[]> {
  try {
    console.log('[Ranking] Fetching from SheetDB...');
    const res = await fetch(`${SHEETDB_API}?limit=50`);
    if (!res.ok) {
      console.error('[Ranking] API response not OK:', res.status);
      throw new Error('API error: ' + res.status);
    }
    const data = await res.json();
    console.log('[Ranking] Raw data from SheetDB:', data);
    
    if (!Array.isArray(data)) {
      console.error('[Ranking] Data is not an array:', data);
      return [];
    }
    
    const sorted = data
      .sort((a: any, b: any) => Number(b.score) - Number(a.score))
      .slice(0, 10);
    
    console.log('[Ranking] Sorted top 10:', sorted);
    return sorted;
  } catch (error) {
    console.error('[Ranking] Error fetching ranking:', error);
    return [];
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

  console.log('[Ranking] Saving score:', entry);

  try {
    const res = await fetch(SHEETDB_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([entry]),
    });
    
    if (!res.ok) {
      console.error('[Ranking] Save response not OK:', res.status);
      throw new Error('API error: ' + res.status);
    }
    
    const result = await res.json();
    console.log('[Ranking] Save result:', result);
    return true;
  } catch (error) {
    console.error('[Ranking] Error saving score:', error);
    alert('Error guardando ranking. Intenta de nuevo.');
    return false;
  }
}