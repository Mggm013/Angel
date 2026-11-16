# A.N.G.E.L. — Texto-base para a entrega acadêmica

## Identificação do aplicativo

**Nome:** A.N.G.E.L. — Assistente de Navegação Guiada para Equilíbrio e Leveza.

**Problema:** Em momentos de ansiedade, pode ser difícil encontrar recursos de apoio simples e de acesso rápido. O A.N.G.E.L. reúne orientação inicial, atividades sensoriais, respiração guiada, diário e canais de apoio em uma interface acolhedora, sem a exigência de cadastro.

## Principais funcionalidades implementadas no código

1. Acolhimento com acesso rápido aos recursos disponíveis.
2. Respiração guiada em fases de 4 e 6 segundos, com controle manual, pausa e animação visual opcional.
3. Técnica de aterramento 5-4-3-2-1 com etapas interativas.
4. Check-in emocional com escolha de sentimento, intensidade de 1 a 5 e nota opcional.
5. Diário com histórico, ordenação cronológica e exclusão de registros.
6. Preferências e contato de confiança, armazenados no aparelho.
7. Discador para os serviços CVV (188) e SAMU (192).

## Recursos tecnológicos utilizados

- React Native, Expo SDK 58, TypeScript, Expo Router (navegação Stack).
- Componentes `View`, `Text`, `Pressable`, `TextInput`, `ScrollView`, `FlatList` e `Switch`.
- Hooks `useState`, `useEffect`, `useRef`, `useCallback` e Context API.
- `Animated` para crescimento/contração do círculo; `AppState` para pausar ao minimizar.
- `@react-native-async-storage/async-storage` para persistência local.
- `Linking` para abrir o discador do telefone.
- Estilos organizados com `StyleSheet` e paleta de cores centralizada.

## Recursos nativos demonstráveis

1. **Expo Haptics:** vibração tátil, disponível como teste nas preferências e feedback nas interações.
2. **Expo Speech:** leitura em voz alta de orientações, usando síntese de voz do sistema em português.

> A disponibilidade efetiva de voz/vibração depende do hardware, da configuração e das permissões do dispositivo.

## APK e repositório Git

**APK:** [INSERIR NOME/ARQUIVO OU LINK APÓS A BUILD E INSTALAÇÃO DE TESTE]

**Repositório:** [INSERIR LINK REAL APÓS A PUBLICAÇÃO NO GITHUB]

Não inventar links ou afirmar que APK foi gerado enquanto a compilação ainda não tiver ocorrido.

## Limitações e responsabilidade

O aplicativo não é dispositivo médico, não diagnostica ansiedade, não substitui terapia ou atendimento emergencial. O diário utiliza armazenamento local não criptografado. Ausência de login, GPS e backend é uma decisão deliberada de escopo e privacidade.

## Declaração de uso de IA (modelo a adaptar à realidade)

"Ferramentas de inteligência artificial foram utilizadas como apoio na estruturação do projeto, elaboração de partes do código e revisão de textos e soluções técnicas. Os responsáveis pela entrega devem executar, testar, compreender, adaptar e validar o aplicativo antes de apresentá-lo, assumindo a autoria acadêmica correspondente às atividades efetivamente realizadas."
