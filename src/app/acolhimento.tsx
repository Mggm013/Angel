import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Card, Eyebrow, Heading, NavCard, Notice, Page, PrimaryButton, ui } from '../components/UI';
import { useApp } from '../context/AppContext';
import { readAloud, stopVoice, touch } from '../lib/native';
import { colors } from '../theme/colors';

const MESSAGE = 'Você pode fazer uma pausa. Sinta o apoio do chão. Olhe à sua volta. Não é necessário forçar a respiração. Você pode escolher o próximo passo.';

export default function AcolhimentoScreen() {
  const router = useRouter();
  const { settings } = useApp();

  return <Page>
    <Eyebrow>VOCÊ ESTÁ AQUI, NESTE MOMENTO</Eyebrow>
    <Heading title="Estamos aqui com você." subtitle="Você não precisa enfrentar tudo de uma vez. Escolha o que parece possível agora." />

    <Card>
      <Text style={ui.cardTitle}>Vamos começar devagar?</Text>
      <Text style={ui.body}>Se for confortável, sinta os pés apoiados no chão e observe o ambiente ao seu redor.</Text>
      <Text style={ui.bodyMuted}>A respiração pode seguir naturalmente. Não existe um jeito perfeito de fazer isso.</Text>
      <PrimaryButton variant="outline" label="Ouvir esta orientação" onPress={() => { void touch(settings.haptics); readAloud(MESSAGE, true); }} />
      <PrimaryButton variant="outline" label="Parar orientação por voz" onPress={stopVoice} />
    </Card>

    <View style={styles.section}>
      <Text style={ui.sectionTitle}>O que pode ajudar agora?</Text>
      <NavCard icon="◉" title="Respiração guiada" description="Siga um ritmo visual, com opção de pausar" onPress={() => router.push('/respiracao')} />
      <NavCard icon="✳" title="Perceber o ambiente" description="Técnica sensorial 5-4-3-2-1" onPress={() => router.push('/aterramento')} />
      <NavCard icon="♡" title="Registrar como me sinto" description="Escreva apenas se desejar" onPress={() => router.push('/checkin')} />
      <NavCard icon="✚" title="Falar com alguém" description="Acesse sua rede de apoio e contatos" onPress={() => router.push('/apoio')} />
    </View>

    <Notice warning>Se houver dor intensa no peito, desmaio, dificuldade importante para respirar ou outra emergência, procure atendimento imediato. No Brasil, o SAMU atende pelo 192.</Notice>
    <Text style={styles.footer}>Cada pessoa tem seu ritmo. Você pode parar ou escolher outro exercício a qualquer momento.</Text>
  </Page>;
}

const styles = StyleSheet.create({
  section: { gap: 12 },
  footer: { color: colors.muted, fontSize: 13, lineHeight: 21, textAlign: 'center' },
});
