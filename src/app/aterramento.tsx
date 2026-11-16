import { useState } from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Card, Eyebrow, Heading, Notice, Page, PrimaryButton, ProgressDots, ui } from '../components/UI';
import { useApp } from '../context/AppContext';
import { readAloud, successTouch, touch } from '../lib/native';
import { colors } from '../theme/colors';

const STEPS = [
  { count: 5, title: 'Olhe ao redor', subtitle: 'Perceba 5 coisas que você consegue ver.', suggestion: 'Pode ser uma cor, uma forma, uma janela ou algum objeto.', icon: '◉' },
  { count: 4, title: 'Perceba o toque', subtitle: 'Observe 4 sensações de contato.', suggestion: 'Sinta os pés no chão, a roupa, uma cadeira ou suas mãos.', icon: '◇' },
  { count: 3, title: 'Escute com calma', subtitle: 'Identifique 3 sons que consegue ouvir.', suggestion: 'Próximos ou distantes. Não precisa encontrá-los todos.', icon: '♫' },
  { count: 2, title: 'Observe os aromas', subtitle: 'Se possível, perceba 2 cheiros.', suggestion: 'Se não houver nenhum aroma, tudo bem. Você pode avançar.', icon: '❋' },
  { count: 1, title: 'Perceba um sabor', subtitle: 'Observe 1 sabor ou a sensação na boca.', suggestion: 'Não precisa comer nem beber. Caso não seja confortável, pule esta etapa.', icon: '◡' },
] as const;

export default function AterramentoScreen() {
  const router = useRouter();
  const { settings } = useApp();
  const [stepIndex, setStepIndex] = useState(0);
  const [marked, setMarked] = useState(0);
  const [complete, setComplete] = useState(false);
  const step = STEPS[stepIndex];

  function goTo(index: number) {
    if (index >= STEPS.length) {
      setComplete(true);
      void successTouch(settings.haptics);
      readAloud('Você terminou. Retorne ao seu ritmo, com gentileza.', settings.voice);
      return;
    }
    setStepIndex(Math.max(0, index));
    setMarked(0);
    void touch(settings.haptics);
    readAloud(STEPS[Math.max(0, index)].subtitle, settings.voice);
  }

  if (complete) return <Page>
    <Eyebrow>VOCÊ CONCLUIU</Eyebrow>
    <Heading title="Você voltou ao presente." subtitle="O importante foi prestar atenção ao ambiente do jeito que conseguiu. Não existe nota ou resultado a alcançar." />
    <Card>
      <Text style={styles.completeIcon}>✦</Text>
      <Text style={[ui.body, ui.centered]}>Se quiser, faça uma pausa e observe como está se sentindo neste momento.</Text>
    </Card>
    <PrimaryButton label="Voltar ao acolhimento" onPress={() => router.replace('/acolhimento')} />
    <PrimaryButton variant="outline" label="Repetir exercício" onPress={() => { setStepIndex(0); setMarked(0); setComplete(false); }} />
  </Page>;

  return <Page>
    <Eyebrow>EXERCÍCIO 5-4-3-2-1</Eyebrow>
    <Heading title="Voltar ao presente" subtitle="Use os sentidos para observar o ambiente ao seu redor. Você pode pular qualquer etapa." />
    <ProgressDots current={stepIndex} total={STEPS.length} />
    <Card style={styles.focusCard}>
      <Text style={styles.stepIcon}>{step.icon}</Text>
      <Text style={styles.bigNumber}>{step.count}</Text>
      <Text style={styles.stepTitle}>{step.title}</Text>
      <Text style={[ui.body, ui.centered]}>{step.subtitle}</Text>
      <Text style={[ui.bodyMuted, ui.centered]}>{step.suggestion}</Text>
    </Card>
    <View style={styles.countRow}>
      <Text style={ui.bodyMuted}>Itens percebidos</Text>
      <Text style={styles.countText}>{marked} de {step.count}</Text>
    </View>
    <PrimaryButton label={marked < step.count ? 'Percebi mais um' : 'Etapa marcada'} onPress={() => { setMarked((m) => Math.min(step.count, m + 1)); void touch(settings.haptics); }} disabled={marked >= step.count} />
    <PrimaryButton label={stepIndex === STEPS.length - 1 ? 'Concluir exercício' : 'Próxima etapa / pular'} variant="outline" onPress={() => goTo(stepIndex + 1)} />
    {stepIndex > 0 ? <PrimaryButton label="Etapa anterior" variant="outline" onPress={() => goTo(stepIndex - 1)} /> : null}
    <Notice>Não é necessário encontrar todos os itens. Se o exercício não ajudar, escolha outra opção ou converse com alguém de confiança.</Notice>
  </Page>;
}

const styles = StyleSheet.create({
  focusCard: { alignItems: 'center', paddingVertical: 25, gap: 13 },
  stepIcon: { fontSize: 36, color: colors.primary },
  bigNumber: { color: colors.primary, fontSize: 72, fontWeight: '900', lineHeight: 83 },
  stepTitle: { color: colors.text, fontSize: 23, fontWeight: '800', textAlign: 'center' },
  countRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  countText: { color: colors.primary, fontSize: 16, fontWeight: '700' },
  completeIcon: { textAlign: 'center', fontSize: 90, color: colors.primary },
});
