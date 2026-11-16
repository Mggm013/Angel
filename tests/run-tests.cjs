'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const base = path.join(__dirname, '..');
let ts;
try { ts = require('typescript'); }
catch { ts = require('/opt/nvm/versions/node/v22.16.0/lib/node_modules/typescript'); }
let pass = 0;
const tests = [];
function test(name, fn) { tests.push([name, fn]); }
function loadPureTs(file) {
  const input = fs.readFileSync(path.join(base, file), 'utf8');
  const { outputText, diagnostics } = ts.transpileModule(input, {
    fileName: file, reportDiagnostics: true,
    compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS, strict: true },
  });
  assert.equal(diagnostics?.filter((x) => x.category === ts.DiagnosticCategory.Error).length, 0);
  const module = { exports: {} };
  vm.runInNewContext(`(function(module,exports){${outputText}\n})`, { console }, { filename: file })(module, module.exports);
  return module.exports;
}
const journal = loadPureTs('src/lib/journal.ts');
const breathing = loadPureTs('src/lib/breathing.ts');

for (const file of (function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : /\.tsx?$/.test(entry.name) ? [full] : [];
  });
})(path.join(base, 'src'))) {
  test(`TS/TSX sintaxe: ${path.relative(base, file)}`, () => {
    const out = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
      fileName: file, reportDiagnostics: true,
      compilerOptions: { jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS },
    });
    const errors = out.diagnostics?.filter((d) => d.category === ts.DiagnosticCategory.Error) ?? [];
    assert.equal(errors.length, 0, errors.map((d) => ts.flattenDiagnosticMessageText(d.messageText, '\n')).join('\n'));
  });
}

test('todos os caminhos relativos de import existem', () => {
  const files = (function walk(dir) {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const p = path.join(dir, entry.name);
      return entry.isDirectory() ? walk(p) : /\.tsx?$/.test(p) ? [p] : [];
    });
  })(path.join(base,'src'));
  for (const file of files) {
    const src = fs.readFileSync(file, 'utf8');
    const rex = /from\s+['"](\.[^'"]+)['"]/g;
    let match;
    while ((match = rex.exec(src))) {
      const target = path.resolve(path.dirname(file), match[1]);
      assert.ok(['.ts','.tsx','.js','/index.ts','/index.tsx'].some(ext=>fs.existsSync(target+ext)), `${path.relative(base,file)} -> ${match[1]}`);
    }
  }
});

test('telas de navegação existem', () => {
  const layout = fs.readFileSync(path.join(base, 'src/app/_layout.tsx'), 'utf8');
  for (const name of ['index','acolhimento','respiracao','aterramento','checkin','diario','apoio','configuracoes']) {
    assert.ok(layout.includes(`name="${name}"`), name);
    assert.ok(fs.existsSync(path.join(base,`src/app/${name}.tsx`)), name);
  }
});

test('configuração APK válida', () => {
  const p = JSON.parse(fs.readFileSync(path.join(base,'package.json'),'utf8'));
  const app = JSON.parse(fs.readFileSync(path.join(base,'app.json'),'utf8'));
  const eas = JSON.parse(fs.readFileSync(path.join(base,'eas.json'),'utf8'));
  assert.match(p.dependencies.expo, /^~58/);
  assert.equal(p.main,'expo-router/entry');
  assert.equal(eas.build.preview.android.buildType,'apk');
  assert.ok(app.expo.android.package);
  assert.ok(fs.existsSync(path.join(base,app.expo.icon)));
  assert.ok(!app.expo.name.startsWith('.') && !app.expo.name.endsWith('.'), 'Nome Expo inválido para Gradle: não pode começar ou terminar com ponto');
  assert.ok(fs.existsSync(path.join(base,app.expo.android.adaptiveIcon.foregroundImage)));
  assert.ok(fs.existsSync(path.join(base,'assets/splash-logo.png')));
});

test('app sem localização, câmera ou chamadas automáticas', () => {
  const app = JSON.parse(fs.readFileSync(path.join(base, 'app.json'), 'utf8'));
  const declared = JSON.stringify(app.expo.android.permissions ?? []);
  assert.ok(!/LOCATION|CAMERA|CALL_PHONE/.test(declared));
  const help = fs.readFileSync(path.join(base,'src/app/apoio.tsx'),'utf8');
  assert.ok(help.includes('Linking.openURL(`tel:${phone}`)'));
  assert.ok(help.includes('onPress'));
});

test('propriedades e defaults de configurações', () => {
  const x = journal.normalizeSettings({ voice: true, trustedNumber: 'test+55 A (61) 9999###' });
  assert.equal(x.voice, true);
  assert.equal(x.haptics, true);
  assert.ok(!x.trustedNumber.includes('#'));
});

test('registro válido é preservado; registros inválidos são descartados', () => {
  const r = journal.newEntry('ansioso', 4, ' Estou respirando. ');
  assert.equal(r.note,'Estou respirando.');
  const items = journal.normalizeEntries([null, r, { ...r, id: 'error', intensity: 20 }]);
  assert.equal(items.length,1);
  assert.equal(items[0].mood,'ansioso');
});

test('registros são apresentados em ordem decrescente', () => {
  const a = journal.newEntry('bem', 2, 'a'); a.id = 'a'; a.createdAt = '2026-10-12T00:00:00.000Z';
  const b = journal.newEntry('neutro', 3, 'b'); b.id = 'b'; b.createdAt = '2026-11-12T00:00:00.000Z';
  assert.equal(journal.normalizeEntries([a,b])[0].id,'b');
});

test('intensidade sempre entre 1 e 5 e nota limitada', () => {
  assert.equal(journal.newEntry('bem', 10, 'a'.repeat(900)).intensity,5);
  assert.equal(journal.newEntry('bem', -10, '').intensity,1);
  assert.equal(journal.newEntry('bem', 2, 'x'.repeat(900)).note.length,500);
});

test('alternância de fases e durações', () => {
  assert.equal(breathing.nextBreathPhase('inspire'), 'expire');
  assert.equal(breathing.nextBreathPhase('expire'), 'inspire');
  assert.equal(breathing.BREATH_SECONDS.inspire,4);
  assert.equal(breathing.BREATH_SECONDS.expire,6);
});

test('temporizador calcula 4,3,1,0 e não fica negativo', () => {
  assert.equal(breathing.countRemaining(4,0),4);
  assert.equal(breathing.countRemaining(4,1000),3);
  assert.equal(breathing.countRemaining(4,3100),1);
  assert.equal(breathing.countRemaining(4,5000),0);
});

for (const [name, fn] of tests) {
  try { fn(); pass++; process.stdout.write(`✓ ${name}\n`); }
  catch (error) { console.error(`✗ ${name}\n`,error); process.exitCode = 1; }
}
console.log(`\n${pass}/${tests.length} testes passaram`);
