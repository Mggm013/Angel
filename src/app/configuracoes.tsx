import { useState } from 'react';
import { StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { Card, Eyebrow, Heading, Notice, Page, PrimaryButton, ui } from '../components/UI';
import { useApp } from '../context/AppContext';
import { readAloud, stopVoice, successTouch, touch } from '../lib/native';
import { colors } from '../theme/colors';

function SettingRow({ label, description, value, onChange }: {
  label: string; description: string; value: boolean; onChange: (v: boolean) => void;
}) {
  return <View style={styles.settingRow}>
    <View style={{ flex: 1, gap: 3 }}><Text style={styles.settingLabel}>{label}</Text><Text style={ui.bodyMuted}>{description}</Text></View>
    <Switch accessibilityLabel={label} value={value} onValueChange={onChange} trackColor={{ false: colors.border, true: '#4A9282' }} thumbColor={value ? colors.primary : colors.muted} />
  </View>;
}

export default function ConfiguracoesScreen() {
  const { settings, updateSettings, clearAll } = useApp();
  const [confirm, setConfirm] = useState(false);
  const [number, setNumber] = useState(settings.trustedNumber);
  const [savedContact, setSavedContact] = useState(false);

  const saveNumber = () => {
    const sanitized = number.replace(/[^0-9+ ()-]/g, '').trim().slice(0, 30);
    updateSettings({ trustedNumber: sanitized });
    setNumber(sanitized);
    setSavedContact(true);
  };

  return <Page>
    <Eyebrow>AJUSTE AO SEU CONFORTO</Eyebrow>
    <Heading title="Preferências" subtitle="Você pode deixar o A.N.G.E.L. silencioso e sem animações quando precisar de menos estímulos." />
    <Card>
      <Text style={ui.cardTitle}>Recursos do dispositivo</Text>
      <SettingRow label="Vibrações suaves" description="Feedback tátil em alguns botões e mudanças de etapa" value={settings.haptics} onChange={(v) => updateSettings({ haptics: v })} />
      <SettingRow label="Orientação por voz" description="Leitura opcional das fases da respiração e do grounding" value={settings.voice} onChange={(v) => { updateSettings({ voice: v }); if (!v) stopVoice(); }} />
      <SettingRow label="Animação de respiração" description="Movimento de expansão e contração do círculo" value={settings.animation} onChange={(v) => updateSettings({ animation: v })} />
    </Card>
    <Card>
      <Text style={ui.cardTitle}>Demonstrar recursos nativos</Text>
      <PrimaryButton label="Testar vibração" onPress={() => { void successTouch(true); }} />
      <PrimaryButton label="Ouvir mensagem de teste" variant="outline" onPress={() => readAloud('Olá. Eu sou o A.N.G.E.L. Vamos seguir um passo de cada vez.', true)} />
      <PrimaryButton label="Parar fala" variant="outline" onPress={stopVoice} />
      <Text style={ui.bodyMuted}>A vibração pode não ocorrer em navegadores ou aparelhos sem suporte. A voz depende do mecanismo de síntese instalado no sistema.</Text>
    </Card>
    <Card>
      <Text style={ui.cardTitle}>Contato de confiança</Text>
      <Text style={ui.bodyMuted}>Número opcional salvo neste dispositivo. O aplicativo não importa sua agenda e não realiza chamadas sozinho.</Text>
      <TextInput value={number} onChangeText={(v) => { setNumber(v); setSavedContact(false); }}
        keyboardType="phone-pad" accessibilityLabel="Número de telefone do contato de confiança" placeholder="Ex.: (61) 99999-9999"
        placeholderTextColor={colors.muted} maxLength={30} style={styles.phone} />
      <PrimaryButton label="Salvar contato" onPress={saveNumber} />
      {savedContact ? <Text style={{ color: colors.primary }}>Contato atualizado neste dispositivo.</Text> : null}
    </Card>
    <Card>
      <Text style={ui.cardTitle}>Privacidade e dados</Text>
      <Text style={ui.bodyMuted}>Diário e preferências ficam armazenados no dispositivo por AsyncStorage, sem criptografia. Nenhuma conta ou servidor externo é utilizado pelo aplicativo.</Text>
      {confirm ? <View style={{ gap: 10 }}>
        <Text style={{ color: colors.warning }}>Confirma apagar todos os registros, o contato e as preferências?</Text>
        <PrimaryButton label="Sim, apagar tudo" variant="danger" onPress={() => { clearAll(); setNumber(''); setConfirm(false); void touch(true); }} />
        <PrimaryButton label="Cancelar" variant="outline" onPress={() => setConfirm(false)} />
      </View> : <PrimaryButton label="Apagar meus dados locais" variant="danger" onPress={() => setConfirm(true)} />}
    </Card>
    <Notice>O A.N.G.E.L. é um projeto acadêmico de apoio inicial. Não realiza diagnósticos e não substitui profissionais de saúde.</Notice>
  </Page>;
}

const styles = StyleSheet.create({
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 14, paddingVertical: 8 },
  settingLabel: { color: colors.text, fontSize: 16, fontWeight: '700' },
  phone: { color: colors.text, backgroundColor: colors.background, borderColor: colors.border, borderWidth: 1, borderRadius: 12, padding: 14, fontSize: 16 },
});
