/* 模考配额与稀疏题库回归测试。 */
const assert = require('assert');
const fs = require('fs');
const vm = require('vm');
const read = (path) => fs.readFileSync(path, 'utf8');
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
  read('cca-p/assets/data/content.en.q1.js'),
  read('cca-p/assets/data/content.en.q2.js'),
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
for (const d of NOTES) {
  assert.strictEqual(d.blurb, '');
  assert.strictEqual(d.taskCount, d.id === 'ref' ? 0 : d.sections.length);
  assert(CONTENT_EN.domains[d.id]);
  for (const s of d.sections) {
    assert.deepStrictEqual(s.blocks, [{ t: 'p', v: '（待写）' }]);
    assert.deepStrictEqual(CONTENT_EN.sections[s.id].blocks, [{ v: '(TODO)' }]);
    assert(CONTENT_EN.sections[s.id].title);
  }
}
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
console.log('✓ 63 题配额 11/8/12/10/9/9/4；3 题及空题库安全抽取；42 个中英文占位小节完整');

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
