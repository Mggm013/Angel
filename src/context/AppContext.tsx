import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  DEFAULT_SETTINGS, ENTRY_KEY, SETTINGS_KEY, normalizeEntries, normalizeSettings,
  type JournalEntry, type Settings,
} from '../lib/journal';

type AppContextValue = {
  entries: JournalEntry[];
  settings: Settings;
  loaded: boolean;
  error: string | null;
  addEntry: (entry: JournalEntry) => void;
  removeEntry: (id: string) => void;
  updateSettings: (partial: Partial<Settings>) => void;
  clearAll: () => void;
  dismissError: () => void;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [settings, setSettings] = useState<Settings>({ ...DEFAULT_SETTINGS });
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carrega uma vez; a gravação só começa depois da leitura inicial.
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [savedEntries, savedSettings] = await Promise.all([
          AsyncStorage.getItem(ENTRY_KEY), AsyncStorage.getItem(SETTINGS_KEY),
        ]);
        if (active) {
          if (savedEntries !== null) setEntries(normalizeEntries(JSON.parse(savedEntries)));
          if (savedSettings !== null) setSettings(normalizeSettings(JSON.parse(savedSettings)));
        }
      } catch {
        if (active) setError('Não foi possível ler os dados salvos. Verifique o armazenamento do dispositivo.');
      } finally {
        if (active) setLoaded(true);
      }
    })();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(ENTRY_KEY, JSON.stringify(entries))
      .catch(() => setError('Não foi possível salvar o diário no dispositivo.'));
  }, [entries, loaded]);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
      .catch(() => setError('Não foi possível salvar as preferências no dispositivo.'));
  }, [settings, loaded]);

  return (
    <AppContext.Provider value={{
      entries, settings, loaded, error,
      addEntry: (entry) => setEntries((old) => [entry, ...old]),
      removeEntry: (id) => setEntries((old) => old.filter((entry) => entry.id !== id)),
      updateSettings: (partial) => setSettings((old) => ({ ...old, ...partial })),
      clearAll: () => {
        setEntries([]);
        setSettings({ ...DEFAULT_SETTINGS });
      },
      dismissError: () => setError(null),
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const value = useContext(AppContext);
  if (!value) throw new Error('useApp deve estar dentro de AppProvider');
  return value;
}
