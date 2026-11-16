import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';

/** Recursos opcionais: falhas ou ausência de hardware não devem interromper o apoio. */
export async function touch(enabled: boolean) {
  if (!enabled) return;
  try { await Haptics.selectionAsync(); } catch { /* Recurso indisponível */ }
}

export async function successTouch(enabled: boolean) {
  if (!enabled) return;
  try { await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); }
  catch { /* Recurso indisponível */ }
}

export function stopVoice() {
  try { void Speech.stop().catch(() => {}); } catch { /* Recurso indisponível */ }
}

export function readAloud(text: string, enabled: boolean) {
  if (!enabled) return;
  try {
    void Speech.stop().catch(() => {});
    Speech.speak(text, { language: 'pt-BR', rate: 0.85, pitch: 1.0 });
  } catch { /* Recurso indisponível */ }
}
