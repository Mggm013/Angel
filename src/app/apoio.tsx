import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Linking, StyleSheet, Text, View } from 'react-native';
import { Card, Eyebrow, Heading, Notice, Page, PrimaryButton, ui } from '../components/UI';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';

export default function ApoioScreen() {
  const { settings } = useApp();
  const router = useRouter();
  const [message, setMessage] = useState('');
  const number = settings.trustedNumber.replace(/[^+\d]/g, '');

  async function openDialer(phone: string) {
    if (!phone) return;
    setMessage('');
    try {
      await Linking.openURL(`tel:${phone}`);
    } catch {
      setMessage('Não foi possível abrir o discador neste dispositivo. Você pode digitar o número manualmente.');
    }
  }

  return <Page>
    <Eyebrow>VOCÊ NÃO PRECISA ESTAR SOZINHO</Eyebrow>
    <Heading title="Pedir ajuda também é cuidado." subtitle="Conversar com uma pessoa de confiança ou um serviço de apoio pode ser um próximo passo importante." />

    <Card>
      <View style={styles.headingRow}><Text style={styles.number}>188</Text><Text style={styles.name}>CVV · apoio emocional</Text></View>
      <Text style={ui.bodyMuted}>Atendimento gratuito, sigiloso, 24 horas, em todo o Brasil.</Text>
      <PrimaryButton label="Abrir discador para 188" onPress={() => { void openDialer('188'); }} />
    </Card>
    <Card>
      <View style={styles.headingRow}><Text style={styles.number}>192</Text><Text style={styles.name}>SAMU · emergência</Text></View>
      <Text style={ui.bodyMuted}>Para emergências de saúde, como desmaio, dor intensa no peito, dificuldade importante para respirar ou outra situação grave.</Text>
      <PrimaryButton variant="outline" label="Abrir discador para 192" onPress={() => { void openDialer('192'); }} />
    </Card>
    <Card>
      <Text style={ui.cardTitle}>Pessoa de confiança</Text>
      <Text style={ui.bodyMuted}>{number ? `Número cadastrado: ${settings.trustedNumber}` : 'Você ainda não informou um número. Pode cadastrá-lo em Preferências.'}</Text>
      <PrimaryButton label={number ? 'Abrir discador do contato' : 'Configurar um contato'} variant="outline" onPress={() => {
        if (number) void openDialer(number);
        else router.push('/configuracoes');
      }} />
    </Card>
    {message ? <Notice warning>{message}</Notice> : null}
    <Notice>Os botões apenas abrem o discador do telefone; nenhuma ligação é realizada automaticamente. Em perigo imediato ou sintomas graves, procure atendimento de emergência.</Notice>
  </Page>;
}

const styles = StyleSheet.create({
  headingRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  number: { fontSize: 32, fontWeight: '900', color: colors.primary },
  name: { fontSize: 17, color: colors.text, fontWeight: '700', flex: 1 },
});
