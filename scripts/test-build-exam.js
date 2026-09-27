/* 模考配额与稀疏题库回归测试。 */
const assert = require('assert');
const fs = require('fs');
const vm = require('vm');
const read = (path) => fs.readFileSync(path, 'utf8');
const englishFiles = fs.readdirSync('cca-p/assets/data')
  .filter((name) => /^content\.en\.q.*\.js$/.test(name)).sort();
const source = read('cca-p/assets/app.js');
const extract = (name) => {
  const match = source.match(new RegExp(`^function ${name}\\([^]*?^}\\n`, 'm'));
  assert(match, `缺少 ${name}()`);
  return match[0];
};
const context = vm.createContext({});
vm.runInContext([
  read('cca-p/assets/data/notes.js'),
  read('cca-p/assets/data/questions.js'),
  read('cca-p/assets/data/content.en.js'),
  ...englishFiles.map((file) => read(`cca-p/assets/data/${file}`)),
  // 翻转输入便于断言选题确实经过随机排列函数，且不依赖随机测试结果。
  'const shuffle = (items) => [...items].reverse();',
  extract('examQuotas'), extract('buildExam'),
  'globalThis.data = { NOTES, QUESTIONS, SECTION_INDEX, CONTENT_EN, EXAM_META };',
].join('\n'), context);
const plain = (value) => JSON.parse(JSON.stringify(value));
const { NOTES, QUESTIONS, SECTION_INDEX, CONTENT_EN, EXAM_META } = plain(context.data);
const expected = [11, 8, 12, 10, 9, 9, 4];
const quotas = plain(context.examQuotas(63, NOTES));
assert.deepStrictEqual(quotas.map((c) => c.n), expected);
assert.deepStrictEqual(quotas.map((c) => c.d), ['d1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7']);
assert.strictEqual(EXAM_META.items, 63);
assert.strictEqual(NOTES.reduce((sum, d) => sum + d.weight, 0), 100);
assert.strictEqual(NOTES.reduce((sum, d) => sum + d.taskCount, 0), 38);
assert.strictEqual(Object.keys(SECTION_INDEX).length, 42);
const delivered = new Set(['3.1', '3.2', '3.3', '3.4', '3.5', '3.6', '3.7', '3.8', 'R.1']);
let writtenSections = 0;
for (const d of NOTES) {
  assert.strictEqual(d.blurb, '');
  assert.strictEqual(d.taskCount, d.id === 'ref' ? 0 : d.sections.length);
  assert(CONTENT_EN.domains[d.id]);
  for (const s of d.sections) {
    const en = CONTENT_EN.sections[s.id];
    assert(en && en.title, `${s.id} 缺少英文小节`);
    const zhPlaceholder = JSON.stringify(s.blocks) === JSON.stringify([{ t: 'p', v: '（待写）' }]);
    const enPlaceholder = JSON.stringify(en.blocks) === JSON.stringify([{ v: '(TODO)' }]);
    assert.strictEqual(zhPlaceholder, enPlaceholder, `${s.id} 中英文占位状态不一致`);
    if (delivered.has(s.id)) assert(!zhPlaceholder, `${s.id} 不能回退为占位`);
    if (!zhPlaceholder) {
      writtenSections++;
      assert(s.blocks.length > 0, `${s.id} 已写小节不能为空`);
      assert.strictEqual(s.blocks.length, en.blocks.length, `${s.id} 中英 block 数不同`);
      assert(!/（待写）|\(TODO\)/.test(JSON.stringify([s.blocks, en.blocks])), `${s.id} 残留占位文本`);
    }
  }
}
for (const id of delivered) assert(SECTION_INDEX[id], `${id} 已交付小节不能删除`);
for (const q of QUESTIONS) {
  assert.strictEqual(SECTION_INDEX[q.s].domainId, q.d);
  assert(CONTENT_EN.questions[q.id]);
  if (q.multi) {
    assert(Array.isArray(q.a));
    assert(q.q.includes(`选择 ${q.a.length} 项`));
  } else {
    assert(Number.isInteger(q.near) && q.near !== q.a);
  }
}
// 真实题库按各域可用题数抽取，增长后仍检查完整题库和配额边界。
const bankSnapshot = JSON.stringify(context.data.QUESTIONS);
const actual = plain(context.buildExam(63));
const available = quotas.map(({ d, n }) => Math.min(n, QUESTIONS.filter((q) => q.d === d).length));
assert.strictEqual(actual.qs.length, available.reduce((sum, n) => sum + n, 0));
assert.strictEqual(new Set(actual.qs.map((q) => q.id)).size, actual.qs.length);
assert.deepStrictEqual(quotas.map(({ d }) => actual.qs.filter((q) => q.d === d).length), available);
for (const q of actual.qs) assert.deepStrictEqual(q, QUESTIONS.find((item) => item.id === q.id));
assert.deepStrictEqual(actual.scenarios, []);
assert.strictEqual(JSON.stringify(context.data.QUESTIONS), bankSnapshot, '抽题不能修改真实题库');
// 三道种子题单独作为稀疏 fixture，保留原来的精确抽题回归。
context.seedQuestions = ['q001', 'q002', 'q003'].map((id) => {
  const matches = QUESTIONS.filter((q) => q.id === id);
  assert.strictEqual(matches.length, 1, `种子题 ${id} 必须存在且唯一`);
  return matches[0];
});
vm.runInContext('QUESTIONS.splice(0, QUESTIONS.length, ...seedQuestions);', context);
const sparse = plain(context.buildExam(63));
assert.strictEqual(sparse.qs.length, 3);
assert.deepStrictEqual(sparse.qs.map((q) => q.id).sort(), ['q001', 'q002', 'q003']);
assert.deepStrictEqual(sparse.scenarios, []);
const snapshot = JSON.stringify(NOTES);
for (let len = 0; len <= 130; len++) {
  const counts = plain(context.examQuotas(len, NOTES));
  assert.strictEqual(counts.reduce((sum, c) => sum + c.n, 0), len);
  assert(counts.every((c) => Number.isInteger(c.n) && c.n >= 0));
}
assert.strictEqual(JSON.stringify(NOTES), snapshot, '配额函数不能修改传入数据');
assert.deepStrictEqual(plain(context.examQuotas(63, [])), []);
assert.deepStrictEqual(plain(context.buildExam(0)), { qs: [], scenarios: [] });
// 用合成题库验证完整 63 题、每域配额、不重复，以及所有行业标签都能入选。
vm.runInContext(`QUESTIONS.splice(0, QUESTIONS.length, ...NOTES.filter(d => d.weight > 0).flatMap(d =>
  Array.from({ length: 20 }, (_, i) => ({ id: d.id + '-' + i, d: d.id,
    sc: Object.keys(SCENARIOS)[i % 7] }))));`, context);
const full = plain(context.buildExam(63));
assert.strictEqual(full.qs.length, 63);
assert.strictEqual(new Set(full.qs.map((q) => q.id)).size, 63);
assert.deepStrictEqual(quotas.map(({ d }) => full.qs.filter((q) => q.d === d).length), expected);
assert.strictEqual(new Set(full.qs.map((q) => q.sc)).size, 7);
assert.deepStrictEqual(full.scenarios, []);
vm.runInContext('QUESTIONS.length = 0;', context);
assert.deepStrictEqual(plain(context.buildExam(63)), { qs: [], scenarios: [] });
console.log(`✓ ${QUESTIONS.length} 道真实题按配额抽取 ${actual.qs.length} 道；63 题配额 11/8/12/10/9/9/4；三道种子 fixture 及空题库安全抽取；42 节占位状态一致，${writtenSections} 节正文双语完整，D3 / R.1 无占位回退`);

// A perfect score on a short bank is practice, not a full-exam pass.
const submit = extract('examSubmit');
for (const [total, partial, pass] of [[3, true, false], [63, false, true]]) {
  const exam = { qs: Array.from({ length: total }, (_, i) => ({ id: `item-${i}`, d: 'd1' })),
    ans: {}, start: Date.now() };
  const state = { exams: [] };
  const run = new Function('EXAM', 'S', 'EXAM_META', 'clearInterval', 'examTimerId',
    'isCorrect', 'record', 'save', 'updateWrongPill', 'go', submit + '\nexamSubmit(false);');
  run(exam, state, EXAM_META, () => {}, null, () => true, () => {}, () => {}, () => {}, () => {});
  assert.strictEqual(exam.saved.partial, partial);
  assert.strictEqual(exam.saved.pass, pass);
  assert.strictEqual(state.exams[0], exam.saved);
}
console.log('✓ 三题满分不算完整模考通过；63 题满分仍通过');

// Render the actual result summary template, including its conditional t() calls.
// Static esc(t('key')) matching would miss the pass/fail ternary that regressed.
const heroStart = source.indexOf('<div class="card score-hero">', source.indexOf('function examResult(e)'));
const heroEnd = source.indexOf('\n    <h2>', heroStart);
assert(heroStart >= 0 && heroEnd > heroStart, '缺少结果页成绩摘要模板');
const helpers = source.slice(source.indexOf('const esc ='), source.indexOf('/** hash 可能'));
const fmtTime = source.match(/^const fmtTime = [^]*?^};/m);
assert(fmtTime, '缺少 fmtTime');
vm.runInContext([
  read('cca-p/assets/data/i18n.js'), helpers, fmtTime[0],
  'const LANG = () => globalThis.testLang;', extract('t'),
  'globalThis.renderResultHero = (e) => `' + source.slice(heroStart, heroEnd) + '`;',
].join('\n'), context);
for (const lang of ['zh', 'en']) {
  context.testLang = lang;
  for (const pass of [true, false]) {
    const exam = { partial: false, pass, score: pass ? 1000 : 0,
      correct: pass ? 63 : 0, total: 63, dur: 120000, timeout: false };
    const html = context.renderResultHero(exam);
    const label = lang === 'zh' ? (pass ? '✓ 通过' : '✗ 未通过') : (pass ? '✓ Passed' : '✗ Not passed');
    const msg = html.match(/<div class="msg">([^]*?)<\/div>/)?.[1];
    assert(msg && msg.includes(`<b>${label}</b>`), `${lang} 完整模考状态须由模板加粗`);
    assert(!/&lt;\/?b&gt;/.test(html), `${lang} 不得显示字面 HTML 标签`);
  }
  const partial = context.renderResultHero({ partial: true, pass: false, score: 1000,
    correct: 3, total: 3, dur: 1000, timeout: false });
  const label = lang === 'zh' ? '非完整模考' : 'Partial mock exam';
  assert.strictEqual(partial.split(label).length - 1, 1, '非完整模考标签仍只出现一次');
  assert(!/<div class="msg">\s*<b>/.test(partial), '非完整模考不显示通过判断');
}
console.log('✓ 中英文 63 题完整模考通过/未通过状态正常加粗，无字面 HTML；非完整模考保持原样');
