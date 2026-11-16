import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Card, Eyebrow, Heading, Notice, Page, PrimaryButton, ui } from '../components/UI';
import { useApp } from '../context/AppContext';
import { MOODS, newEntry, type MoodId } from '../lib/journal';
import { successTouch, touch } from '../lib/native';
import { colors } from '../theme/colors';

export default function CheckinScreen() {
  const router = useRouter();
  const { addEntry, loaded, settings } = useApp();
  const [mood, setMood] = useState<MoodId | null>(null);
  const [intensity, setIntensity] = useState(3);
  const [note, setNote] = useState('');

  const save = () => {
    if (!loaded || !mood) return;
    addEntry(newEntry(mood, intensity, note));
    void successTouch(settings.haptics);
    router.replace('/diario');
  };

  return <Page>
    <Eyebrow>CHECK-IN EMOCIONAL</Eyebrow>
    <Heading title="Como você está agora?" subtitle="Não existe resposta certa. Registre apenas o que quiser compartilhar consigo mesmo." />
    <View style={styles.group}>
      {MOODS.map((item) => {
        const selected = mood === item.id;
        return <Pressable key={item.id} accessibilityRole="radio" accessibilityState={{ checked: selected }} accessibilityLabel={item.label}
          onPress={() => { setMood(item.id); void touch(settings.haptics); }} style={[styles.moodOption, selected && styles.moodSelected]}>
          <Text style={styles.moodIcon}>{item.icon}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.moodTitle}>{item.label}</Text>
            <Text style={ui.bodyMuted}>{item.help}</Text>
          </View>
          <Text style={styles.indicator}>{selected ? '●' : '○'}</Text>
        </Pressable>;
      })}
    </View>

    <Card>
      <Text style={ui.cardTitle}>Qual a intensidade do sentimento?</Text>
      <Text style={ui.bodyMuted}>1 = leve · 5 = muito intenso</Text>
      <View style={styles.scaleRow}>
        {[1, 2, 3, 4, 5].map((value) => <Pressable key={value} accessibilityRole="radio" accessibilityState={{ checked: value === intensity }}
          accessibilityLabel={`Intensidade ${value} de 5`} onPress={() => { setIntensity(value); void touch(settings.haptics); }}
          style={[styles.scaleItem, value === intensity && styles.scaleSelected]}>
          <Text style={[styles.scaleLabel, value === intensity && styles.scaleLabelSelected]}>{value}</Text>
        </Pressable>)}
      </View>
    </Card>

    <Card>
      <Text style={ui.cardTitle}>Quer escrever algo? (opcional)</Text>
      <TextInput
        accessibilityLabel="Anotação sobre seu momento"
        value={note} onChangeText={setNote} placeholder="O que aconteceu? O que pode me ajudar agora?"
        placeholderTextColor={colors.muted} multiline maxLength={500} textAlignVertical="top"
        style={styles.input}
      />
      <Text style={[ui.bodyMuted, { textAlign: 'right' }]}>{note.length}/500 caracteres</Text>
    </Card>
    <PrimaryButton label="Salvar no meu diário" disabled={!mood || !loaded} onPress={save} />
    <Notice>Os registros ficam apenas no armazenamento local deste dispositivo, sem conta ou servidor. Eles não são criptografados. Evite incluir informações que não gostaria de guardar no aparelho.</Notice>
  </Page>;
}

const styles = StyleSheet.create({
  group: { gap: 9 },
  moodOption: { flexDirection: 'row', alignItems: 'center', padding: 13, gap: 14, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, borderRadius: 16 },
  moodSelected: { borderColor: colors.primary, backgroundColor: '#214545' },
  moodIcon: { width: 42, textAlign: 'center', fontSize: 28, color: colors.primary },
  moodTitle: { color: colors.text, fontSize: 16, fontWeight: '700', marginBottom: 2 },
  indicator: { color: colors.primary, fontSize: 22 },
  scaleRow: { flexDirection: 'row', gap: 8 },
  scaleItem: { flex: 1, height: 52, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderRadius: 14, borderColor: colors.border, backgroundColor: colors.background },
  scaleSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  scaleLabel: { color: colors.text, fontWeight: '700', fontSize: 18 },
  scaleLabelSelected: { color: colors.background },
  input: { color: colors.text, backgroundColor: colors.background, padding: 15, borderRadius: 12, borderWidth: 1, borderColor: colors.border, minHeight: 120, fontSize: 15, lineHeight: 23 },
});
