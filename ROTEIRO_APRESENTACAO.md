# Roteiro de apresentação (4–6 minutos)

## 1. Identificação — 30 s

"Este é o A.N.G.E.L., Assistente de Navegação Guiada para Equilíbrio e Leveza. É um aplicativo de apoio inicial para pessoas que querem se orientar em momentos de ansiedade, com exercícios simples, registro emocional e acesso rápido a contatos de ajuda. Não substitui atendimento profissional."

## 2. Arquitetura e tecnologias — 60 s

- React Native gera telas nativas com componentes `View`, `Text`, `Pressable`, `TextInput`, `Switch` e `FlatList`.
- TypeScript melhora a organização de tipos e ajuda a identificar erros.
- Expo SDK 58 fornece ferramentas de desenvolvimento e módulos nativos.
- Expo Router usa a organização por arquivos em `src/app` para navegação entre as telas, baseada em Stack.
- `useState` guarda estados locais, como contador e check-in; `useEffect` controla o temporizador e a persistência.
- `AsyncStorage` guarda entradas e preferências no dispositivo, sem exigir login.

## 3. Demonstração prática — 2 minutos

1. Na home, toque em **Começar acolhimento**.
2. Mostre as orientações curtas e o botão **Respiração guiada**.
3. Inicie o ciclo; explique os 4 segundos de inspiração e 6 de expiração. Demonstre **Pausar** e **Reiniciar**.
4. Volte à home e mostre o exercício **5-4-3-2-1**, avançando etapas.
5. Faça um **check-in** e registre uma nota curta. Abra o **diário** e mostre o item salvo.
6. Vá a **Preferências** e clique em **Testar vibração** e **Ouvir mensagem de teste**, demonstrando os 2 recursos nativos.
7. Abra **Rede de apoio** e mostre os números 188 e 192, sem efetuar uma ligação.

## 4. Decisões de projeto — 40 s

"Escolhemos não usar GPS, câmera nem login porque isso não é necessário para os exercícios, reduz permissões e facilita o uso. O diário é local; informamos que não há criptografia. A pessoa pode pausar os exercícios e desabilitar animação, voz e vibração."

## 5. Perguntas prováveis

**O que é JSX?** Sintaxe parecida com HTML usada para declarar componentes React, dentro de TypeScript/TSX.

**O que significa `router.push('/respiracao')`?** Abre a rota correspondente ao arquivo `src/app/respiracao.tsx` na pilha de navegação.

**Por que `useState`?** O contador precisa atualizar a interface quando mudam fase, segundo ou estado de pausa.

**Por que `useEffect`?** Para iniciar e limpar temporizadores e carregar/salvar os dados conforme mudanças de estado.

**Como o diário persiste?** O contexto global lê do AsyncStorage ao abrir e regrava quando os registros mudam. A FlatList exibe os registros.

**Quais recursos nativos?** Vibração tátil (`expo-haptics`) e voz do sistema (`expo-speech`).

**Onde ficam os estilos?** Em `StyleSheet.create` e numa paleta centralizada em `src/theme/colors.ts`.

**O aplicativo usa internet?** Os exercícios e registros funcionam localmente após instalação. Compilar via EAS requer conexão; discagem telefônica usa rede celular.

**É um tratamento clínico?** Não. É uma ferramenta de apoio inicial e orientação, sem diagnóstico.

**Como foi usado apoio de IA?** Na estruturação e produção assistida de código, seguido de revisão técnica e testes por parte do grupo, se de fato realizados. Declare o uso de acordo com a política da instituição.
