/** A expiração é maior que a inspiração, mas a pessoa pode pausar ou parar. */
export type BreathPhase = 'inspire' | 'expire';
export const BREATH_SECONDS: Record<BreathPhase, number> = { inspire: 4, expire: 6 };
export function nextBreathPhase(phase: BreathPhase): BreathPhase {
  return phase === 'inspire' ? 'expire' : 'inspire';
}
export function countRemaining(initialSeconds: number, elapsedMs: number): number {
  return Math.max(0, Math.ceil((initialSeconds * 1000 - Math.max(0, elapsedMs)) / 1000));
}
