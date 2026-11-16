# A.N.G.E.L. — relatório técnico de auditoria

**Data original:** 12 de novembro de 2026  
**Revisão:** 14 de novembro de 2026  
**Objeto:** código-fonte da versão reserva do A.N.G.E.L. 1.0  
**Status honesto:** funcionalidades implementadas em código; **execução real Android e compilação APK pendentes de confirmação**.

## Correção de compilação — 14/11/2026

Log da compilação falha no EAS apontou `android/settings.gradle` linha 34: `The project name 'A.N.G.E.L.' must not start or end with a '.'`. A configuração `expo.name` foi ajustada de `A.N.G.E.L.` para `ANGEL`, sem alterar a marca exibida nas telas. Os arquivos do ícone Android foram preservados da versão com logo enviado e a imagem de splash recebeu o mesmo símbolo. Adicionado teste para impedir regressão do nome inválido. **APK ainda precisa ser compilado e testado no dispositivo; não foi validado aqui.**

## Resultado automatizado (executado neste ambiente)

- **25 de 25 testes passaram** em `node tests/run-tests.cjs`.
- Varredura de sintaxe TypeScript/TSX em **15 arquivos do projeto**.
- Integridade de todas as importações relativas: **aprovada**.
- Todas as oito rotas do Stack possuem seus arquivos correspondentes: **aprovada**.
- `package.json`, `app.json` e `eas.json`: JSON válido, perfil `preview` gera APK, identidade Android declarada: **aprovados por inspeção**.
- Lógica pura da respiração (alternância e cálculo de segundos): **aprovada**.
- Lógica pura do diário (validação de dados, ordenação, limitações de texto e intensidade): **aprovada**.
- O app não declara permissão de câmera, localização ou chamada telefônica direta: **verificado**.
- Verificação de coerência de tipos com declarações temporárias de compatibilidade: **sem erros**, mas **não equivale** ao `tsc --noEmit` com dependências reais do SDK.

## Testes que não puderam ser executados aqui

Este ambiente não tem conexão com o registro npm nem conta Expo/EAS e não possui Android SDK/telefone conectado. Por isso, **não foram executados**:

- `npm install` com todas as dependências reais;
- `npm run check` usando tipos reais do React Native/Expo SDK 58;
- inicialização no Expo Go / no browser com Metro;
- testes funcionais dos botões no aparelho;
- testes físicos de vibração e síntese de voz;
- compilação, instalação ou assinatura do APK Android;
- publicação em GitHub.

Esses itens são **pendências de validação**, e não resultados aprovados. Não descreva o arquivo como “APK auditado” antes de concluir essa etapa.

## Matriz de critérios acadêmicos

| Critério | Evidência no código |
|---|---|
| Identificação e problema | `README.md` e `TEXTO_ENTREGA.md` |
| Funcionalidades principais | Oito arquivos de rota em `src/app/` |
| React Native, Expo, TypeScript | `package.json` |
| Navegação / React Navigation via Expo Router | `src/app/_layout.tsx` |
| Hooks React / estados | `respiracao.tsx`, `aterramento.tsx`, `checkin.tsx`, `AppContext.tsx` |
| FlatList | `src/app/diario.tsx` |
| AsyncStorage | `src/context/AppContext.tsx` |
| Recurso nativo 1 — Haptics | `src/lib/native.ts`, botão teste em `configuracoes.tsx` |
| Recurso nativo 2 — Speech | `src/lib/native.ts`, botão teste em `configuracoes.tsx` |
| Configuração APK | `eas.json` perfil preview |
| Repositório Git | **Pendente** publicar e inserir link real |

## Checklist manual para a demonstração

- [ ] `npm install` conclui sem erro fatal.
- [ ] `npx expo install --check` e `npm run check` sem erros.
- [ ] `npm test` conclui com 25/25.
- [ ] App abre no Expo Go / aparelho e apresenta home.
- [ ] Tela de acolhimento e retorno funcionam.
- [ ] Respiração inicia em 4, alterna para 6, pausa e reinicia.
- [ ] Círculo anima, e desligar animação nas preferências funciona.
- [ ] Sair da tela pausa a respiração.
- [ ] Aterramento avança pelos sentidos sem travar.
- [ ] Check-in cria registro no diário.
- [ ] Fechar e reabrir o aplicativo preserva o diário.
- [ ] Excluir registro exige confirmação.
- [ ] Voz PT-BR e vibração respondem no aparelho (dois recursos nativos).
- [ ] Contato de confiança pode ser salvo e exibido.
- [ ] CVV 188 e SAMU 192 abrem apenas o discador, sem ligar automaticamente.
- [ ] Perfil preview do EAS gera APK e APK instala e abre sem Expo Go.
- [ ] GitHub possui o código e link do repositório é acessível.
- [ ] Capturas de tela e explicações são preparadas para apresentação de 14/11/2026 às 8h20.

## Restrições e alertas relevantes

1. O A.N.G.E.L. é um aplicativo acadêmico de **apoio inicial**, não um produto clínico nem um sistema de diagnóstico.
2. O diário usa AsyncStorage local não criptografado. Não insira informações altamente sensíveis durante demonstrações públicas.
3. A fala depende de mecanismo TTS; a vibração depende de hardware e ambiente. Navegador pode não reproduzir vibração.
4. O Expo Go é ambiente de desenvolvimento; a entrega de APK requer EAS/compilação real.
5. Números de apoio são específicos do Brasil. CVV 188 e SAMU 192 têm finalidades diferentes.
6. A versão reserva está **separada da sua versão em desenvolvimento**, evitando sobrescrever trabalho.

## Fontes oficiais consultadas

- Expo SDK 58: https://docs.expo.dev/versions/v58.0.0/
- Expo Haptics: https://docs.expo.dev/versions/v58.0.0/sdk/haptics/
- Expo Speech: https://docs.expo.dev/versions/v58.0.0/sdk/speech/
- AsyncStorage: https://docs.expo.dev/versions/v58.0.0/sdk/async-storage/
- Gerar APK: https://docs.expo.dev/build-reference/apk/
- SAMU: https://www.gov.br/saude/pt-br/composicao/saes/samu-192/samu-192
- CVV: https://cvv.org.br/o-cvv/
