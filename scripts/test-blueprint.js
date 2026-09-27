/* 蓝图规则回归：直接调用纯函数，不启动子进程。 */
const assert = require('node:assert/strict');
const { TARGETS, checkBlueprint, loadBlueprint, selectionCounts } = require('./check-blueprint');
const { renderCoverage, noteStatus } = require('./gen-coverage');
const copy = (value) => JSON.parse(JSON.stringify(value));
function fixture() {
  return {
    notes: [{ id: 'd1', zh: '域一', sections: [{ id: '1.1' }] },
      { id: 'd2', zh: '域二', sections: [{ id: '2.1' }] }, { id: 'ref', sections: [{ id: 'R.1' }] }],
    sectionIndex: { '1.1': { domainId: 'd1' }, '2.1': { domainId: 'd2' }, 'R.1': { domainId: 'ref' } },
    scenarios: { fin: '金融', gen: '通用' },
    questions: [{ id: 'q001', d: 'd1', s: '1.1', sc: 'fin', diff: 2,
      multi: true, a: [0, 2], q: '选择 2 项', o: ['甲', '乙', '丙'] }],
    english: { questions: { q001: { q: 'Select TWO options.' } } },
  };
}
let cases = 0;
function rejects(change, expected) {
  const data = fixture(); change(data);
  for (const strict of [false, true]) {
    const result = checkBlueprint(data, { strict });
    assert.equal(result.exitCode, 1);
    assert(result.errors.some((e) => expected.test(e)), JSON.stringify(result.errors));
  }
  cases++;
}
rejects((d) => { d.questions[0].q = '应该怎么办？'; }, /中文题干/);
rejects((d) => { d.questions[0].q = '选择三项'; }, /中文题干/);
rejects((d) => { d.english.questions.q001.q = 'Select THREE options'; }, /英文题干/);
rejects((d) => { d.english.questions.q001.q = 'Choose the right answers'; }, /英文题干/);
rejects((d) => { d.questions[0].s = '2.1'; }, /不属于/);
rejects((d) => { d.questions[0].s = 'R.1'; d.questions[0].d = 'ref'; }, /附录/);
rejects((d) => { d.questions[0].s = '8.1'; }, /未知 section/);
rejects((d) => { d.questions[0].d = 'd9'; }, /未知 Domain/);
rejects((d) => { d.questions.push(copy(d.questions[0])); }, /重复/);
rejects((d) => { d.questions[0].id = 'q01'; }, /3 位/);
rejects((d) => { d.questions[0].sc = 'unknown'; }, /行业/);
rejects((d) => { d.questions[0].sc = 'toString'; }, /行业/);
rejects((d) => { d.questions[0].diff = '2'; }, /diff/);
rejects((d) => { d.questions[0].a = [0, 0]; }, /下标重复/);
rejects((d) => { d.questions[0].a = [0, 3]; }, /超出选项/);
rejects((d) => { d.questions[0].a = [0]; }, /至少 2/);
rejects((d) => { d.questions[0].multi = false; }, /单选/);
rejects((d) => { d.questions[0].multi = false; d.questions[0].a = -1; }, /单选/);
rejects((d) => { d.questions[0].multi = false; d.questions[0].a = 3; }, /单选/);
rejects((d) => {
  d.questions[0].multi = false; d.questions[0].a = 0;
  d.english.questions.q001.q = 'Select one option.';
}, /单选题中文题尾/);
rejects((d) => {
  delete d.questions[0].multi; d.questions[0].a = 0;
  d.questions[0].q = '选择一项。';
}, /单选题英文题尾/);
const single = fixture();
single.questions[0].multi = false; single.questions[0].a = 0;
single.questions[0].q = '正文讨论选择两项。请选择一项。';
single.english.questions.q001.q = 'Select two options during setup. Select one option.';
assert.equal(checkBlueprint(single).errors.length, 0);
assert.deepEqual(selectionCounts('选择二项；选择 2 项', 'zh'), [2]);
assert.deepEqual(selectionCounts('SELECT two; Select 2 options', 'en'), [2]);
const two = fixture();
two.questions[0].q = '系统只能选择一项工具。请选择两项。';
two.english.questions.q001.q = 'The system can select one tool. Select TWO options.';
assert.equal(checkBlueprint(two).errors.length, 0, '正文数量不能干扰末句指令，且应接受两');
assert.deepEqual(selectionCounts('选择两项。', 'zh'), [2]);
assert.deepEqual(selectionCounts('正文只能选择一项工具。没有作答指令。', 'zh'), []);
assert.deepEqual(selectionCounts('Select TWO options. Explain your reasoning.', 'en'), []);
assert.deepEqual(selectionCounts('系统只能选择一项工具。', 'zh'), []);
assert.deepEqual(selectionCounts('The system can select one tool.', 'en'), []);
rejects((d) => { d.questions[0].q = '选择两项。请解释原因。'; }, /中文题干/);
const sparse = fixture();
const snapshot = JSON.stringify(sparse);
assert.equal(checkBlueprint(sparse).exitCode, 0);
assert.equal(checkBlueprint(sparse, { strict: true }).exitCode, 1);
assert.match(checkBlueprint(sparse).status, /^BLUEPRINT INCOMPLETE/);
assert.equal(JSON.stringify(sparse), snapshot, '校验不能修改传入数据');
delete sparse.english.questions.q001;
assert.equal(checkBlueprint(sparse).errors.length, 0, '缺失英文层不属于本轮硬规则');
const empty = fixture(); empty.questions = [];
assert.equal(checkBlueprint(empty).exitCode, 0);
assert.equal(checkBlueprint(empty, { strict: true }).exitCode, 1);

const real = loadBlueprint();
const realProgress = checkBlueprint(real);
const realStrict = checkBlueprint(real, { strict: true });
assert.deepEqual(realProgress.errors, []);
assert.equal(realProgress.exitCode, 0);
assert.deepEqual(realStrict.errors, []);
assert.equal(realStrict.exitCode, realProgress.gaps.length ? 1 : 0);
const seeds = copy(real);
seeds.questions = ['q001', 'q002', 'q003'].map((id) => {
  const matches = seeds.questions.filter((q) => q.id === id);
  assert.equal(matches.length, 1, `种子题 ${id} 必须存在且唯一`);
  return matches[0];
});
seeds.english.questions = Object.fromEntries(seeds.questions.map((q) => [q.id, real.english.questions[q.id]]));
assert.equal(seeds.questions.length, 3);
assert.equal(checkBlueprint(seeds).exitCode, 0);
assert.equal(checkBlueprint(seeds, { strict: true }).exitCode, 1);
// Fill every official objective and all quota dimensions to prove strict can pass.
const complete = copy(real); complete.questions = []; complete.english.questions = {};
for (const d of complete.notes.filter((d) => Object.hasOwn(TARGETS.domains, d.id))) {
  for (let i = 0; i < TARGETS.domains[d.id]; i++) {
    const n = complete.questions.length;
    const multi = n < 38;
    const id = `q${String(n + 1).padStart(3, '0')}`;
    complete.questions.push({ id, d: d.id, s: d.sections[i % d.sections.length].id,
      sc: Object.keys(complete.scenarios)[n % 7], diff: n < 48 ? 1 : n < 143 ? 2 : 3,
      q: multi ? '选择二项' : '选择最佳答案', o: ['甲', '乙', '丙'], a: multi ? [0, 2] : 1, multi });
    complete.english.questions[id] = { q: multi ? 'Select TWO options' : 'Choose the best answer' };
  }
}
assert.equal(complete.questions.length, 190);
const done = checkBlueprint(complete, { strict: true });
assert.equal(done.status, 'BLUEPRINT OK', JSON.stringify(done));
assert.equal(done.exitCode, 0);
const above = copy(complete);
above.questions.push({ ...above.questions[0], id: 'q191' });
assert.equal(checkBlueprint(above, { strict: true }).exitCode, 0, '目标以上题数也应达标');
const overMulti = copy(complete);
for (const q of overMulti.questions) { q.multi = true; q.a = [0, 2]; q.q = '选择 2 项'; }
overMulti.english.questions = {};
assert(checkBlueprint(overMulti).gaps.some((g) => g.includes('多选')));
// Independently violate each quota dimension while preserving question validity.
for (const [change, expected] of [
  [(data) => { for (const q of data.questions) q.sc = 'gen'; }, /行业占比/],
  [(data) => { for (const q of data.questions) q.diff = 2; }, /diff/],
  [(data) => { for (const q of data.questions) { q.multi = false; q.a = 0; q.q = '选择一项'; data.english.questions[q.id].q = 'Select one option'; } }, /多选/],
  [(data) => { for (const q of data.questions.filter((q) => q.d === 'd1')) q.s = '1.1'; }, /^1\.2:/],
  [(data) => { for (const q of data.questions.filter((q) => q.d === 'd7')) { q.d = 'd1'; q.s = '1.1'; } }, /^d7:/],
]) {
  const data = copy(complete); change(data);
  const result = checkBlueprint(data, { strict: true });
  assert.equal(result.errors.length, 0);
  assert.equal(result.exitCode, 1);
  assert(result.gaps.some((gap) => expected.test(gap)));
  assert.equal(checkBlueprint(data).exitCode, 0);
}
assert.equal(noteStatus({ blocks: [{ t: 'p', v: '（待写）' }] }), '待写');
assert.equal(noteStatus({ blocks: [{ t: 'p', v: '正文' }] }), '✓');
const generated = renderCoverage(real, '2026-01-01T00:00:00.000Z');
assert.equal((generated.match(/^\| \d+\.\d+ \|/gm) || []).length, 38);
assert(!generated.includes('| R.1 |'));
assert.equal(generated, renderCoverage(real, '2026-01-01T00:00:00.000Z'));
assert.equal(generated.replace(/^生成时间：.*$/m, ''), renderCoverage(real, '2026-01-02T00:00:00.000Z').replace(/^生成时间：.*$/m, ''));
console.log(`✓ 蓝图：${cases} 类硬错误；进度/终检、190 题达标、真实题库、三道种子 fixture 及 38 行覆盖图均通过`);

// Unchanged coverage must preserve both bytes and modification time.
const fs = require('node:fs'), os = require('node:os'), path = require('node:path');
const { writeCoverage } = require('./gen-coverage');
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ccap-coverage-test-'));
const output = path.join(dir, 'coverage.md');
try {
  assert.equal(writeCoverage(output, generated), true);
  const time = fs.statSync(output, { bigint: true }).mtimeNs;
  assert.equal(writeCoverage(output, renderCoverage(real, '2026-01-02T00:00:00.000Z')), false);
  assert.equal(fs.readFileSync(output, 'utf8'), generated);
  assert.equal(fs.statSync(output, { bigint: true }).mtimeNs, time);
  assert.equal(writeCoverage(output, generated.replace('待写', '✓')), true);
} finally { fs.unlinkSync(output); fs.rmdirSync(dir); }
console.log('✓ 覆盖图无内容变化时不改文件、时间戳或 mtime；内容变化时更新');
