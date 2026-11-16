import { useState } from 'react';
import { useRouter } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Heading, Notice, PrimaryButton, ui } from '../components/UI';
import { useApp } from '../context/AppContext';
import { formatDate, moodById, type JournalEntry } from '../lib/journal';
import { touch } from '../lib/native';
import { colors } from '../theme/colors';

export default function DiarioScreen() {
  const router = useRouter();
  const { entries, loaded, removeEntry, settings } = useApp();
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  function renderEntry({ item }: { item: JournalEntry }) {
    const mood = moodById(item.mood);
    return <Card style={styles.entry}>
      <View style={styles.entryTop}>
        <Text style={styles.mood}>{mood.icon}  {mood.label}</Text>
        <Text style={styles.intensity}>{item.intensity}/5</Text>
      </View>
      <Text style={ui.bodyMuted}>{formatDate(item.createdAt)}</Text>
      {item.note ? <Text style={ui.body}>{item.note}</Text> : <Text style={ui.bodyMuted}>Sem anotação adicional.</Text>}
      {pendingDelete === item.id ? <View style={styles.deleteActions}>
        <Text style={{ color: colors.warning }}>Excluir permanentemente este registro?</Text>
        <PrimaryButton label="Sim, excluir" variant="danger" onPress={() => { removeEntry(item.id); setPendingDelete(null); }} />
        <PrimaryButton label="Cancelar" variant="outline" onPress={() => setPendingDelete(null)} />
      </View> : <Pressable accessibilityRole="button" accessibilityLabel="Excluir este registro" onPress={() => { setPendingDelete(item.id); void touch(settings.haptics); }} style={styles.deleteLink}>
        <Text style={styles.deleteText}>Excluir registro</Text>
      </Pressable>}
    </Card>;
  }

  return <SafeAreaView style={styles.root} edges={['bottom']}>
    <FlatList
      data={entries}
      keyExtractor={(item) => item.id}
      renderItem={renderEntry}
      contentContainerStyle={styles.content}
      ListHeaderComponent={<View style={styles.header}>
        <Heading title="Meu diário emocional" subtitle="Seus registros ficam neste aparelho. Acompanhar sentimentos pode ajudar você a perceber padrões sem se cobrar." />
        <PrimaryButton label="Novo check-in" onPress={() => router.push('/checkin')} />
        <Text style={ui.bodyMuted}>{entries.length} {entries.length === 1 ? 'registro salvo' : 'registros salvos'}</Text>
      </View>}
      ListEmptyComponent={<Card><Text style={ui.cardTitle}>{loaded ? 'Seu diário está em branco' : 'Carregando...'}</Text><Text style={ui.bodyMuted}>{loaded ? 'Você pode começar com um check-in, sem precisar escrever muito.' : 'Lendo os dados salvos no dispositivo.'}</Text></Card>}
      ListFooterComponent={<Notice>Privacidade: os dados são armazenados localmente pelo AsyncStorage, que não oferece criptografia. Limpar os dados do aplicativo ou desinstalá-lo pode apagar os registros.</Notice>}
    />
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: { gap: 14, padding: 20, paddingBottom: 44, width: '100%', maxWidth: 760, alignSelf: 'center', flexGrow: 1 },
  header: { gap: 17, marginBottom: 4 },
  entry: { gap: 10 },
  entryTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  mood: { color: colors.text, fontSize: 18, fontWeight: '700' },
  intensity: { color: colors.primary, fontSize: 14, fontWeight: '800' },
  deleteLink: { alignSelf: 'flex-start', minHeight: 44, justifyContent: 'center' },
  deleteText: { color: colors.danger, fontSize: 13 },
  deleteActions: { gap: 9, paddingTop: 5 },
});
