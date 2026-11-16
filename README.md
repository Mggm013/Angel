# A.N.G.E.L. — versão reserva do aplicativo

**A.N.G.E.L. = Assistente de Navegação Guiada para Equilíbrio e Leveza**

**Correção de build (14/11/2026):** o identificador interno em `app.json` agora é `ANGEL` (sem ponto no fim), impedindo o erro do Gradle `The project name 'A.N.G.E.L.' must not start or end with a '.'`. A marca **A.N.G.E.L.** continua nas telas. O ícone e o splash usam o desenho de asas e auréola enviado. A configuração `eas.json` usa `appVersionSource: local`.

Aplicativo acadêmico de apoio inicial a momentos de ansiedade, desenvolvido em **React Native + Expo SDK 58 + TypeScript**. Esta pasta é uma versão **independente** do projeto que está sendo desenvolvido passo a passo: não sobrescreva o seu `angel` original.

## Funcionalidades

- Tela inicial com acesso rápido aos exercícios.
- Tela de acolhimento e orientações sem promessa de atendimento clínico.
- Respiração 4 s inspirando / 6 s expirando, com contador, animação e controles de iniciar, pausar e reiniciar. Pausa ao perder foco ou ir para segundo plano.
- Aterramento 5-4-3-2-1 com confirmação progressiva, opção de pular e conclusão.
- Check-in emocional com cinco opções, intensidade e anotação opcional.
- Diário local com `FlatList`, leitura persistente, exclusão confirmada e estado vazio.
- Preferências persistentes: vibração, síntese de voz, animação e contato de confiança.
- Recursos nativos: **Expo Haptics** (vibração tátil) e **Expo Speech** (síntese de voz em PT-BR).
- Telefones de apoio no Brasil: CVV 188, SAMU 192, discador para contato de confiança.
- Interface escura verde-petróleo/turquesa, sem login, localização ou câmera.

## Instalação — Windows/Git Bash, sem precisar de admin para instalar o Expo

1. Extraia o ZIP para uma pasta **separada** da sua pasta `angel` original. Exemplo: `~/Downloads/ANGEL_Reserva_Corrigido`.
2. Abra Git Bash. Ative temporariamente a instalação portátil do Node 26 que já funcionou no computador da faculdade:
   ```bash
   export PATH="$HOME/Downloads/node-v26.13.0-win-x64:$PATH"
   node -v
   ```
   Altere o nome da pasta se o arquivo portátil estiver em outro lugar.
3. Entre nesta pasta, onde está `package.json`:
   ```bash
   cd ~/Downloads/ANGEL_Reserva_Corrigido
   npm install
   ```
4. Verifique bibliotecas e tipos:
   ```bash
   npx expo install --check
   npm run check
   npm test
   ```
5. Inicie o projeto:
   ```bash
   npx expo start --go --clear
   ```
   Abra o QR Code no Expo Go. O suporte a versões do SDK pode variar no celular; confira a opção compatível em https://expo.dev/go.
6. Para testar no navegador, pressione `w` no terminal Expo, ou execute `npm run web` em outro momento.

**Sem rede:** `npm install`, `npx expo` e builds na nuvem necessitam acesso às dependências e serviços. Se a rede institucional bloquear, use uma rede permitida ou peça suporte ao TI. Não contorne políticas da faculdade.

## Criar APK via EAS Build

A configuração `eas.json` já possui um perfil **preview** com `android.buildType = "apk"`.

1. Crie uma conta em https://expo.dev e entre nela no terminal.
2. Execute, dentro desta pasta:
   ```bash
   npx eas-cli@latest login
   npx eas-cli@latest build:configure
   npx eas-cli@latest build --platform android --profile preview --clear-cache
   ```
3. Se solicitado, vincule/crie um projeto EAS e autorize a geração das credenciais Android.
4. Quando a compilação terminar, abra o link do APK no Android, instale e execute os testes de `AUDITORIA.md`.

**Atenção:** o ZIP contém o **código completo e configuração de build**, mas não contém APK pré-compilado. O serviço EAS exige acesso à internet e conta autenticada; a compilação não foi executada dentro deste ambiente.

## Publicar o repositório no GitHub

Depois de criar um repositório **vazio** no GitHub, use os comandos abaixo nesta pasta:

```bash
git init
git add .
git commit -m "Versão reserva A.N.G.E.L. 1.0"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/angel-reserva.git
git push -u origin main
```

Troque `SEU-USUARIO` e confirme que o repositório foi realmente publicado antes de colocar seu link no relatório. Se o Git pedir autenticação, siga a autenticação oficial do GitHub.

## Organização do código

| Caminho | Responsabilidade |
|---|---|
| `src/app/_layout.tsx` | Navegação Stack, tema de cabeçalho e provedor global |
| `src/app/index.tsx` | Tela inicial |
| `src/app/acolhimento.tsx` | Orientação inicial |
| `src/app/respiracao.tsx` | Contador, animação, voz e pausa automática |
| `src/app/aterramento.tsx` | Técnica sensorial 5-4-3-2-1 |
| `src/app/checkin.tsx` | Formulário emocional |
| `src/app/diario.tsx` | Histórico e exclusão usando FlatList |
| `src/app/apoio.tsx` | Discadores de ajuda |
| `src/app/configuracoes.tsx` | Switch, voz, vibração, privacidade |
| `src/context/AppContext.tsx` | Carrega e salva dados com AsyncStorage |
| `src/components/UI.tsx` | Componentes visuais reaproveitáveis |
| `src/theme/colors.ts` | Paleta de cores |
| `src/lib/journal.ts` | Tipos, validação e regras do diário |
| `src/lib/breathing.ts` | Lógica pura das fases da respiração |
| `src/lib/native.ts` | Adaptação para haptics e speech |
| `tests/run-tests.cjs` | Testes de lógica e checagens sintáticas |

## Segurança e privacidade

O aplicativo **não diagnostica nem trata ansiedade**, não substitui profissionais e não exige conta. Os registros ficam no próprio aparelho com AsyncStorage, **sem criptografia**. Não há backend, sincronização, API remota, nem localização. O discador é iniciado apenas após o toque do usuário. O aplicativo oferece contatos nacionais de apoio e emergência.

## Créditos e contexto acadêmico

Projeto didático elaborado como alternativa de segurança para apresentação da disciplina. Se utilizar código ou documentação gerados com auxílio de IA, descreva esse uso de forma transparente conforme as regras da instituição. Não afirme que a versão foi testada em Android ou publicada se isso ainda não ocorreu.

## Verificação rápida da correção

```bash
node -e "const a=require('./app.json');console.log(a.expo.name, a.expo.icon)"
```

O resultado deve começar com `ANGEL ./assets/icon.png`. Para evitar compilar a pasta antiga, execute `pwd` e confirme que está em `ANGEL_Reserva_Corrigido`.
