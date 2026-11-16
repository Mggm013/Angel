/** Regras puras, sem React, usadas pelo diário e pelos testes automáticos. */
export const MOODS = [
  { id: 'bem', icon: '☀', label: 'Bem', help: 'Hoje me sinto bem' },
  { id: 'tranquilo', icon: '◡', label: 'Tranquilo', help: 'Estou em paz' },
  { id: 'neutro', icon: '—', label: 'Neutro', help: 'Nem bem, nem mal' },
  { id: 'ansioso', icon: '≈', label: 'Ansioso', help: 'Preciso desacelerar' },
  { id: 'dificil', icon: '☁', label: 'Difícil', help: 'Hoje está pesado' },
] as const;

export type MoodId = (typeof MOODS)[number]['id'];
export type JournalEntry = {
  id: string;
  createdAt: string;
  mood: MoodId;
  intensity: number;
  note: string;
};

export const DEFAULT_SETTINGS = {
  haptics: true,
  voice: false,
  animation: true,
  trustedNumber: '',
};
export type Settings = typeof DEFAULT_SETTINGS;
export const ENTRY_KEY = '@angel:journal:v1';
export const SETTINGS_KEY = '@angel:settings:v1';

export function moodById(id: MoodId) {
  return MOODS.find((item) => item.id === id) ?? MOODS[2];
}

export function normalizeEntries(value: unknown): JournalEntry[] {
  if (!Array.isArray(value)) return [];
  const moods = MOODS.map((m) => m.id);
  return value.filter((entry): entry is JournalEntry => {
    if (!entry || typeof entry !== 'object') return false;
    const item = entry as Record<string, unknown>;
    return typeof item.id === 'string'
      && typeof item.createdAt === 'string'
      && !Number.isNaN(Date.parse(item.createdAt))
      && moods.includes(item.mood as MoodId)
      && typeof item.intensity === 'number'
      && Number.isInteger(item.intensity)
      && item.intensity >= 1
      && item.intensity <= 5
      && typeof item.note === 'string';
  }).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function normalizeSettings(value: unknown): Settings {
  if (!value || typeof value !== 'object') return { ...DEFAULT_SETTINGS };
  const settings = value as Record<string, unknown>;
  return {
    haptics: typeof settings.haptics === 'boolean' ? settings.haptics : true,
    voice: typeof settings.voice === 'boolean' ? settings.voice : false,
    animation: typeof settings.animation === 'boolean' ? settings.animation : true,
    trustedNumber: typeof settings.trustedNumber === 'string'
      ? settings.trustedNumber.replace(/[^0-9+ ()-]/g, '').slice(0, 30)
      : '',
  };
}

export function formatDate(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime())
    ? 'Data desconhecida'
    : date.toLocaleString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function newEntry(mood: MoodId, intensity: number, note: string): JournalEntry {
  const now = new Date();
  return {
    id: `${now.getTime()}-${Math.random().toString(36).slice(2, 10)}`,
    createdAt: now.toISOString(),
    mood,
    intensity: Math.max(1, Math.min(5, Math.round(intensity))),
    note: note.trim().slice(0, 500),
  };
}
