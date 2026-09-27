/* CCAR-P 题库蓝图校验：默认报告进度，--strict 要求全部配额达标。 */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

// 各域题数来自官方权重 × 190，人工取整；其余比例为本题库的编写目标。
const TARGETS = {
  total: 190,
  domains: { d1: 32, d2: 25, d3: 36, d4: 30, d5: 27, d6: 27, d7: 13 },
  perObjective: 4,
  multi: { min: 0.20, max: 0.30 },
  difficulty: { 1: 0.25, 2: 0.50, 3: 0.25 },
  difficultyTolerance: 0.10,
  industryMin: 0.08,
};
const ROOT = path.resolve(__dirname, '..');
const has = (object, key) => Object.prototype.hasOwnProperty.call(object, key);

function loadBlueprint(root = ROOT) {
  const dir = path.join(root, 'cca-p/assets/data');
  const zh = vm.createContext({});
  const en = vm.createContext({});
  const run = (context, file) => vm.runInContext(fs.readFileSync(path.join(dir, file), 'utf8'),
    context, { filename: file, timeout: 1000 });
  run(zh, 'notes.js');
  run(zh, 'questions.js');
  run(en, 'content.en.js');
  for (const file of fs.readdirSync(dir).filter((f) => /^content\.en\.q.*\.js$/.test(f)).sort()) run(en, file);
  const data = vm.runInContext('({ notes: NOTES, sectionIndex: SECTION_INDEX, questions: QUESTIONS, scenarios: SCENARIOS })', zh);
  data.english = vm.runInContext('CONTENT_EN', en);
  return JSON.parse(JSON.stringify(data));
}

function selectionCounts(text, language) {
  if (typeof text !== 'string') return [];
  const words = language === 'zh'
    ? { 一: 1, 二: 2, 两: 2, 三: 3, 四: 4, 五: 5 }
    : { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10 };
  const last = text.trim().replace(/[。！？.!?；;\s”’"')）]+$/u, '').split(/[。！？.!?；;\n]+/u).pop().trim();
  const pattern = language === 'zh' ? /选择\s*(\d+|[一二两三四五])\s*项\s*$/g
    : /\bselect\s+(\d+|one|two|three|four|five|six|seven|eight|nine|ten)\b(?:\s+(?:options?|answers?|responses?|items?|choices?))?\s*$/gi;
  return [...last.matchAll(pattern)].map((m) => words[m[1].toLowerCase()] ?? Number(m[1]));
}

function validateQuestions({ notes, sectionIndex, questions, scenarios, english }) {
  const errors = [];
  const domains = new Set(notes.map((d) => d.id));
  const ids = new Set();
  questions.forEach((q, index) => {
    const label = typeof q?.id === 'string' ? q.id : `题目 #${index + 1}`;
    const fail = (message) => errors.push(`${label}: ${message}`);
    if (!q || typeof q !== 'object') { fail('题目必须是对象'); return; }
    if (typeof q.id !== 'string' || !/^q\d{3}$/.test(q.id)) fail('id 必须是 q + 3 位数字');
    if (ids.has(q.id)) fail('id 重复');
    ids.add(q.id);
    if (!domains.has(q.d)) fail(`未知 Domain ${q.d}`);
    const section = has(sectionIndex, q.s) ? sectionIndex[q.s] : null;
    if (!section) fail(`未知 section ${q.s}`);
    else {
      if (section.domainId !== q.d) fail(`section ${q.s} 不属于 ${q.d}`);
      if (section.domainId === 'ref') fail('不能使用 ref 附录 section');
    }
    if (!has(scenarios, q.sc)) fail(`未知行业标签 ${q.sc}`);
    if (![1, 2, 3].includes(q.diff)) fail('diff 必须为 1、2 或 3');
    const validIndex = (n) => Array.isArray(q.o) && Number.isInteger(n) && n >= 0 && n < q.o.length;
    if (q.multi === true) {
      if (!Array.isArray(q.a) || q.a.length < 2) fail('多选答案须为至少 2 项的数组');
      else {
        if (new Set(q.a).size !== q.a.length) fail('多选答案下标重复');
        if (!q.a.every(validIndex)) fail('多选答案下标超出选项范围或不是整数');
      }
      const count = Array.isArray(q.a) ? q.a.length : 0;
      const zhCounts = selectionCounts(q.q, 'zh');
      if (!zhCounts.length || zhCounts.some((n) => n !== count)) fail('中文题干须包含与答案数量一致的「选择 N 项」');
      const translation = english?.questions?.[q.id];
      if (translation && has(translation, 'q')) {
        const enCounts = selectionCounts(translation.q, 'en');
        if (!enCounts.length || enCounts.some((n) => n !== count)) fail('英文题干须包含与答案数量一致的 Select N');
      }
    } else {
      if (!validIndex(q.a)) fail('单选答案须为选项范围内的整数');
      if (selectionCounts(q.q, 'zh').some((n) => n >= 2)) fail('单选题中文题尾不能要求选择多项');
      if (selectionCounts(english?.questions?.[q.id]?.q, 'en').some((n) => n >= 2)) fail('单选题英文题尾不能要求选择多项');
    }
  });
  return errors;
}

function measureCoverage({ notes, questions, scenarios }, targets = TARGETS) {
  const total = questions.length;
  const ratio = (n) => total ? n / total : 0;
  const count = (predicate) => questions.filter((q) => q && predicate(q)).length;
  const domains = notes.filter((d) => has(targets.domains, d.id)).map((d) => ({
    id: d.id, title: d.zh, count: count((q) => q.d === d.id), target: targets.domains[d.id],
    sections: d.sections.map((s) => ({ id: s.id, count: count((q) => q.s === s.id && q.d === d.id) })),
  }));
  const multi = count((q) => q.multi === true);
  const difficulty = Object.entries(targets.difficulty).map(([id, target]) => {
    const n = count((q) => q.diff === Number(id));
    return { id: Number(id), count: n, ratio: ratio(n), target };
  });
  const industries = Object.keys(scenarios).map((id) => {
    const n = count((q) => q.sc === id);
    return { id, count: n, ratio: ratio(n) };
  });
  return { total, domains, multi: { count: multi, ratio: ratio(multi) }, difficulty, industries };
}

function quotaGaps(stats, targets = TARGETS) {
  const gaps = [];
  for (const d of stats.domains) {
    if (d.count < d.target) gaps.push(`${d.id}: ${d.count}/${d.target} 题`);
    for (const s of d.sections) if (s.count < targets.perObjective) gaps.push(`${s.id}: ${s.count}/${targets.perObjective} 题`);
  }
  const within = (value, min, max) => value >= min - 1e-10 && value <= max + 1e-10;
  if (!within(stats.multi.ratio, targets.multi.min, targets.multi.max)) gaps.push('多选占比不在 20%–30%');
  for (const d of stats.difficulty) {
    if (!within(d.ratio, d.target - targets.difficultyTolerance, d.target + targets.difficultyTolerance)) gaps.push(`diff ${d.id} 占比未达到目标 ±10 个百分点`);
  }
  for (const sc of stats.industries) if (sc.id !== 'gen' && sc.ratio < targets.industryMin - 1e-10) gaps.push(`${sc.id} 行业占比不足 8%`);
  return gaps;
}

// Pure result: importing this module never reads files, writes output or exits.
function checkBlueprint(data, { strict = false } = {}) {
  const errors = validateQuestions(data);
  const stats = measureCoverage(data);
  const gaps = quotaGaps(stats);
  const exitCode = errors.length || (strict && gaps.length) ? 1 : 0;
  const status = exitCode ? 'BLUEPRINT FAIL' : gaps.length ? `BLUEPRINT INCOMPLETE (${gaps.length} gaps)` : 'BLUEPRINT OK';
  return { errors, stats, gaps, exitCode, status };
}

function formatBlueprint(result) {
  const { stats, errors, status } = result;
  const percent = (n) => `${(n * 100).toFixed(1)}%`;
  const lines = [`题库 ${stats.total} / ${TARGETS.total}`, '| Domain | 已写 / 目标 | 各 objective 题数（⚠ <4） |', '| --- | --- | --- |'];
  for (const d of stats.domains) lines.push(`| ${d.id} ${d.title} | ${d.count} / ${d.target}${d.count < d.target ? ' ⚠' : ''} | ${d.sections.map((s) => `${s.id}: ${s.count}${s.count < TARGETS.perObjective ? ' ⚠' : ''}`).join(' · ')} |`);
  lines.push(`多选：${stats.multi.count}/${stats.total} = ${percent(stats.multi.ratio)}（目标 20%–30%）`);
  lines.push(`难度：${stats.difficulty.map((d) => `diff ${d.id}: ${d.count} (${percent(d.ratio)}; 目标 ${percent(d.target)} ±10pp)`).join(' · ')}`);
  lines.push(`行业：${stats.industries.map((s) => `${s.id}: ${s.count} (${percent(s.ratio)})`).join(' · ')}（除 gen 外各 ≥8%）`);
  // Domain and objective gaps are already shown explicitly in the table.
  for (const gap of result.gaps.filter((g) => !/^(d\d|\d+\.\d+):/.test(g))) lines.push(`⚠ ${gap}`);
  for (const error of errors) lines.push(`ERROR ${error}`);
  lines.push(status);
  return lines.join('\n');
}

if (require.main === module) {
  try {
    const result = checkBlueprint(loadBlueprint(), { strict: process.argv.includes('--strict') });
    console.log(formatBlueprint(result));
    process.exitCode = result.exitCode;
  } catch (error) {
    console.error(`ERROR ${error.message}\nBLUEPRINT FAIL`);
    process.exitCode = 1;
  }
}
module.exports = { TARGETS, loadBlueprint, selectionCounts, validateQuestions, measureCoverage, quotaGaps, checkBlueprint, formatBlueprint };
