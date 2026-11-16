import { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { Animated, AppState, Easing, Platform, StyleSheet, Text, View } from 'react-native';
import { Eyebrow, Heading, Notice, Page, PrimaryButton, ui } from '../components/UI';
import { useApp } from '../context/AppContext';
import { BREATH_SECONDS, countRemaining, nextBreathPhase, type BreathPhase } from '../lib/breathing';
import { readAloud, stopVoice, touch } from '../lib/native';
import { colors } from '../theme/colors';

const INITIAL = BREATH_SECONDS.inspire;

export default function RespiracaoScreen() {
  const { settings } = useApp();
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<BreathPhase>('inspire');
  const [remaining, setRemaining] = useState(INITIAL);
  const [cycles, setCycles] = useState(0);
  const remainingRef = useRef(INITIAL);
  const circle = useRef(new Animated.Value(0.9)).current;

  const reset = () => {
    setRunning(false);
    circle.stopAnimation();
    circle.setValue(settings.animation ? 0.9 : 1);
    remainingRef.current = INITIAL;
    setRemaining(INITIAL);
    setPhase('inspire');
    setCycles(0);
    stopVoice();
  };

  // Pausa ao mudar de tela ou minimizar: evita orientar uma respiração sem controle do usuário.
  useFocusEffect(useCallback(() => {
    return () => {
      setRunning(false);
      stopVoice();
    };
  }, []));

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state !== 'active') {
        setRunning(false);
        stopVoice();
      }
    });
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (!running) return;
    const phaseAtStart = phase;
    const secondsAtStart = remainingRef.current;
    const startedAt = Date.now();

    if (settings.animation) {
      Animated.timing(circle, {
        toValue: phaseAtStart === 'inspire' ? 1.14 : 0.9,
        duration: secondsAtStart * 1000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: Platform.OS !== 'web',
      }).start();
    } else {
      circle.setValue(1);
    }

    readAloud(phaseAtStart === 'inspire' ? 'Inspire suavemente' : 'Solte o ar devagar', settings.voice);
    void touch(settings.haptics);

    const timer = setInterval(() => {
      const next = countRemaining(secondsAtStart, Date.now() - startedAt);
      if (next > 0) {
        remainingRef.current = next;
        setRemaining((old) => old === next ? old : next);
        return;
      }
      const nextPhase = nextBreathPhase(phaseAtStart);
      const nextSeconds = BREATH_SECONDS[nextPhase];
      remainingRef.current = nextSeconds;
      setRemaining(nextSeconds);
      setPhase(nextPhase);
      if (phaseAtStart === 'expire') setCycles((old) => old + 1);
    }, 100);

    return () => {
      clearInterval(timer);
      circle.stopAnimation();
    };
  }, [running, phase, settings.animation, settings.voice, settings.haptics, circle]);

  const isInhaling = phase === 'inspire';
  return <Page style={styles.page}>
    <Eyebrow>UM INSTANTE DE PAUSA</Eyebrow>
    <Heading title="Encontre seu ritmo" subtitle="Se estiver confortável, acompanhe o círculo. Você pode respirar normalmente ou interromper a qualquer momento." />
    <View style={styles.stage}>
      <Animated.View style={[styles.circle, { transform: [{ scale: circle }] }]} accessibilityLabel={`${isInhaling ? 'Inspirar' : 'Expirar'}, ${remaining} segundos restantes`}>
        <Text style={styles.phase}>{isInhaling ? 'Inspire suavemente' : 'Solte o ar devagar'}</Text>
        <Text style={styles.seconds}>{remaining}</Text>
        <Text style={styles.small}>segundos</Text>
      </Animated.View>
    </View>
    <View style={styles.progress}>
      <Text style={ui.bodyMuted}>{cycles} {cycles === 1 ? 'ciclo concluído' : 'ciclos concluídos'}</Text>
      <Text style={ui.bodyMuted}>{running ? 'Em andamento' : 'Pausado'}</Text>
    </View>
    <PrimaryButton label={running ? 'Pausar exercício' : remaining === INITIAL && cycles === 0 ? 'Iniciar exercício' : 'Continuar exercício'} onPress={() => { setRunning((old) => !old); if (running) stopVoice(); }} />
    <PrimaryButton variant="outline" label="Reiniciar exercício" onPress={reset} />
    <Notice>Exercício opcional: 4 segundos para inspirar e 6 para expirar, sem prender o ar. Se sentir tontura, falta de ar ou desconforto, pare e volte à respiração natural.</Notice>
  </Page>;
}

const styles = StyleSheet.create({
  page: { gap: 18 },
  stage: { height: 276, alignItems: 'center', justifyContent: 'center' },
  circle: { width: 212, height: 212, borderRadius: 110, backgroundColor: colors.surfaceElevated, borderWidth: 3, borderColor: colors.primary, alignItems: 'center', justifyContent: 'center', shadowColor: colors.primary, shadowOpacity: 0.1, shadowRadius: 16, elevation: 4 },
  phase: { color: colors.primary, fontSize: 15, fontWeight: '700', textAlign: 'center' },
  seconds: { color: colors.text, fontSize: 73, fontWeight: '800', lineHeight: 88 },
  small: { color: colors.muted, fontSize: 13 },
  progress: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 4 },
});
