import type { ReactNode } from 'react';
import {
  Pressable, ScrollView, StyleSheet, Text, View, type StyleProp, type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';

export function Page({ children, style, includeTop = false }: { children: ReactNode; style?: StyleProp<ViewStyle>; includeTop?: boolean }) {
  return (
    <SafeAreaView style={s.root} edges={includeTop ? ['top', 'bottom'] : ['bottom']}>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={[s.content, style]}>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <Text style={s.eyebrow}>{children}</Text>;
}

export function Heading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={s.heading}>
      <Text style={s.title}>{title}</Text>
      {subtitle ? <Text style={s.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[s.card, style]}>{children}</View>;
}

export function PrimaryButton({ label, onPress, disabled, variant = 'primary', hint }: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'outline' | 'danger';
  hint?: string;
}) {
  const fill = variant === 'primary';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={hint}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [s.button, fill ? s.buttonPrimary : s.buttonOutline,
        variant === 'danger' && s.buttonDanger,
        pressed && s.pressed, disabled && s.disabled]}
    >
      <Text style={[s.buttonText, !fill && s.buttonTextOutline,
        variant === 'danger' && { color: colors.danger }]}>{label}</Text>
    </Pressable>
  );
}

export function NavCard({ icon, title, description, onPress, small = false }: {
  icon: string; title: string; description: string; onPress: () => void; small?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress} accessibilityRole="button" accessibilityLabel={title}
      accessibilityHint={description}
      style={({ pressed }) => [s.navCard, pressed && s.pressed, small && { padding: 16 }]}
    >
      <View style={s.navIcon}><Text style={s.navIconText}>{icon}</Text></View>
      <View style={s.navCopy}>
        <Text style={s.navTitle}>{title}</Text>
        <Text style={s.navDescription}>{description}</Text>
      </View>
      <Text style={s.chevron} accessibilityElementsHidden>›</Text>
    </Pressable>
  );
}

export function Highlight({ children }: { children: ReactNode }) {
  return (
    <LinearGradient colors={['#1E5050', '#143438']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.highlight}>
      {children}
    </LinearGradient>
  );
}

export function Notice({ children, warning = false }: { children: ReactNode; warning?: boolean }) {
  return <View style={[s.notice, warning && { borderColor: '#765A43' }]}>
    <Text style={[s.noticeText, warning && { color: colors.warning }]}>{children}</Text>
  </View>;
}

export function ProgressDots({ current, total }: { current: number; total: number }) {
  return <View style={s.dots} accessibilityLabel={`Etapa ${current + 1} de ${total}`}>
    {Array.from({ length: total }, (_, i) =>
      <View key={i} style={[s.dot, i === current && s.dotActive]} />)}
  </View>;
}

export const ui = StyleSheet.create({
  body: { color: colors.text, fontSize: 16, lineHeight: 25 },
  bodyMuted: { color: colors.muted, fontSize: 14, lineHeight: 22 },
  cardTitle: { color: colors.text, fontSize: 19, fontWeight: '700' },
  sectionTitle: { color: colors.text, fontSize: 20, fontWeight: '700', marginBottom: 12 },
  centered: { textAlign: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  gap: { gap: 12 },
});

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: { flexGrow: 1, paddingHorizontal: 20, paddingTop: 24, paddingBottom: 44, gap: 20, width: '100%', maxWidth: 760, alignSelf: 'center' },
  eyebrow: { color: colors.primary, fontSize: 12, fontWeight: '700', letterSpacing: 1.8 },
  heading: { gap: 10 },
  title: { color: colors.text, fontSize: 32, lineHeight: 39, fontWeight: '800' },
  subtitle: { color: colors.muted, fontSize: 16, lineHeight: 24 },
  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 22, padding: 20, gap: 12 },
  button: { minHeight: 54, alignItems: 'center', justifyContent: 'center', borderRadius: 16, paddingVertical: 15, paddingHorizontal: 16, borderWidth: 1 },
  buttonPrimary: { backgroundColor: colors.primary, borderColor: colors.primary },
  buttonOutline: { backgroundColor: colors.surface, borderColor: colors.border },
  buttonDanger: { borderColor: '#765A43' },
  buttonText: { color: colors.background, fontSize: 16, fontWeight: '800', textAlign: 'center' },
  buttonTextOutline: { color: colors.primary },
  pressed: { opacity: 0.79, transform: [{ scale: 0.995 }] },
  disabled: { opacity: 0.45 },
  navCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 20, padding: 18, gap: 14, minHeight: 95 },
  navIcon: { width: 44, height: 44, borderRadius: 15, backgroundColor: colors.primaryDark, alignItems: 'center', justifyContent: 'center' },
  navIconText: { color: colors.primary, fontSize: 23, fontWeight: '600' },
  navCopy: { flex: 1, gap: 4 },
  navTitle: { color: colors.text, fontSize: 16, fontWeight: '700' },
  navDescription: { color: colors.muted, fontSize: 13, lineHeight: 19 },
  chevron: { color: colors.primary, fontSize: 29 },
  highlight: { padding: 23, borderRadius: 25, gap: 14, borderWidth: 1, borderColor: '#326262' },
  notice: { borderRadius: 14, padding: 15, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  noticeText: { fontSize: 13, lineHeight: 20, color: colors.muted },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 9, paddingVertical: 4 },
  dot: { width: 8, height: 8, borderRadius: 5, backgroundColor: colors.border },
  dotActive: { width: 27, backgroundColor: colors.primary },
});
