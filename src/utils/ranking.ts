import { RankingEntry, Difficulty } from '../types';

const APPS_SCRIPT_API = 'https://script.google.com/macros/s/AKfycbwk6I3OvEN4GL1zjBcDvarlN_LVGrKWHXYbFVIOgXOOC1_Us1gEnT0dHIEiEkZLApuV/exec';

export async function fetchRanking(): Promise<RankingEntry[]> {
  try {
    console.log('[Ranking] Fetching from Apps Script...');
    const res = await fetch(`${APPS_SCRIPT_API}?juego=tetris`);
    if (!res.ok) {
      console.error('[Ranking] API response not OK:', res.status);
      throw new Error('API error: ' + res.status);
    }
    const data = await res.json();
    console.log('[Ranking] Raw data from Apps Script:', data);
    
    if (!Array.isArray(data)) {
      console.error('[Ranking] Data is not an array:', data);
      return [];
    }
    
    const mapped = data.map((item: any) => ({
      name: item.nombre,
      score: item.puntos,
      date: item.fecha,
      difficulty: '-' // Harders to map since Apps Script columns are fixed to 3, fallback
    }));
    
    const sorted = mapped
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
    juego: 'tetris',
    nombre: `${name.trim().toUpperCase()} [${difficulty.substring(0,3)}]`, // Pack difficulty into name to preserve it
    puntos: score
  };

  console.log('[Ranking] Saving score:', entry);

  try {
    const res = await fetch(APPS_SCRIPT_API, {
      method: 'POST',
      body: JSON.stringify(entry),
    });
    
    if (!res.ok && res.type !== 'opaque') {
      console.error('[Ranking] Save response not OK:', res.status);
      throw new Error('API error: ' + res.status);
    }
    
    return true;
  } catch (error) {
    console.error('[Ranking] Error saving score:', error);
    alert('Error guardando ranking. Intenta de nuevo.');
    return false;
  }
}