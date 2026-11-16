import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Card, Eyebrow, Highlight, NavCard, Page, PrimaryButton, ui } from '../components/UI';
import { useApp } from '../context/AppContext';
import { moodById } from '../lib/journal';
import { colors } from '../theme/colors';

export default function HomeScreen() {
  const router = useRouter();
  const { entries, loaded, error, dismissError } = useApp();
  const last = entries[0];

  return (
    <Page includeTop>
      <View style={styles.brand}>
        <View style={styles.logo}><Text style={styles.logoText}>A</Text></View>
        <View style={{ flex: 1 }}>
          <Text style={styles.brandName}>A.N.G.E.L.</Text>
          <Text style={styles.brandSubtitle}>Seu espaço de apoio</Text>
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="Abrir preferências" onPress={() => router.push('/configuracoes')} style={styles.settingsButton}>
          <Text style={styles.settingsText}>⚙</Text>
        </Pressable>
      </View>

      <View style={styles.greeting}>
        <Eyebrow>UM MOMENTO PARA VOCÊ</Eyebrow>
        <Text style={styles.heroTitle}>Um passo de cada vez.</Text>
        <Text style={ui.bodyMuted}>Nem todo dia precisa ser fácil. Você pode encontrar um ritmo mais gentil, sem cobrança.</Text>
      </View>

      <Highlight>
        <View style={styles.pill}><Text style={styles.pillText}>✦  ACOLHIMENTO IMEDIATO</Text></View>
        <Text style={styles.highlightTitle}>Precisa de apoio agora?</Text>
        <Text style={[ui.body, { color: colors.text }]}>Um caminho simples com orientações, respiração e exercícios sensoriais — sem cadastro e sem pressão.</Text>
        <PrimaryButton label="Começar acolhimento" onPress={() => router.push('/acolhimento')} hint="Abre a central de apoio para momentos difíceis" />
      </Highlight>

      {error ? <Card>
        <Text style={{ color: colors.warning }}>{error}</Text>
        <PrimaryButton variant="outline" label="Entendi" onPress={dismissError} />
      </Card> : null}

      <View style={styles.section}>
        <Text style={ui.sectionTitle}>Seu espaço de cuidado</Text>
        <NavCard icon="◉" title="Respiração guiada" description="Um círculo acompanha inspiração e expiração" onPress={() => router.push('/respiracao')} />
        <NavCard icon="✳" title="Voltar ao presente" description="Exercício sensorial 5-4-3-2-1" onPress={() => router.push('/aterramento')} />
        <NavCard icon="♡" title="Como estou hoje?" description="Faça um check-in emocional em poucos toques" onPress={() => router.push('/checkin')} />
        <NavCard icon="▤" title="Meu diário" description="Consulte seu histórico particular de registros" onPress={() => router.push('/diario')} />
      </View>

      <Card>
        <Text style={ui.cardTitle}>Seu último registro</Text>
        <Text style={ui.bodyMuted}>
          {!loaded ? 'Carregando registros...' : last ? `${moodById(last.mood).label} · intensidade ${last.intensity}/5` : 'Ainda não há registros. Tudo bem começar quando quiser.'}
        </Text>
        <PrimaryButton variant="outline" label={last ? 'Ver diário' : 'Fazer check-in'} onPress={() => router.push(last ? '/diario' : '/checkin')} />
      </Card>

      <NavCard icon="✚" title="Pedir ajuda" description="CVV, SAMU e contato de confiança" onPress={() => router.push('/apoio')} small />
      <Text style={styles.disclaimer}>O A.N.G.E.L. oferece apoio inicial. Não substitui profissionais de saúde ou atendimento de emergência.</Text>
    </Page>
  );
}

const styles = StyleSheet.create({
  brand: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logo: { width: 52, height: 52, borderRadius: 17, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary },
  logoText: { fontSize: 29, fontWeight: '900', color: colors.background },
  brandName: { fontSize: 20, color: colors.text, fontWeight: '800' },
  brandSubtitle: { color: colors.muted, fontSize: 12, marginTop: 2 },
  settingsButton: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, padding: 10, borderRadius: 14, minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  settingsText: { color: colors.primary, fontSize: 21 },
  greeting: { paddingTop: 18, gap: 14 },
  heroTitle: { color: colors.text, fontSize: 33, lineHeight: 39, fontWeight: '800' },
  pill: { backgroundColor: '#2A5C57', alignSelf: 'flex-start', borderRadius: 30, paddingHorizontal: 10, paddingVertical: 7 },
  pillText: { color: colors.primary, fontSize: 10, letterSpacing: 1.1, fontWeight: '800' },
  highlightTitle: { color: colors.text, fontSize: 25, lineHeight: 32, fontWeight: '800' },
  section: { gap: 12 },
  disclaimer: { color: colors.muted, fontSize: 12, lineHeight: 19, textAlign: 'center', paddingHorizontal: 14 },
});
