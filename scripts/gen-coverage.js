/* 生成 objective 笔记/题库覆盖图；按笔记顺序和题号排序，内容不变时保留文件与时间戳。 */
const fs = require('node:fs');
const path = require('node:path');
const { loadBlueprint, TARGETS } = require('./check-blueprint');
const cell = (value) => String(value ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, '<br>');

function noteStatus(section) {
  return (section.blocks || []).every((b) => typeof b.v === 'string' && b.v.trim() === '（待写）') ? '待写' : '✓';
}
function renderCoverage(data, generatedAt) {
  const lines = ['# 蓝图覆盖图', '', `生成时间：${generatedAt}`, '', '由 scripts/gen-coverage.js 生成，勿手改。'];
  for (const d of data.notes.filter((d) => Object.hasOwn(TARGETS.domains, d.id))) {
    lines.push('', `## ${d.id} ${d.zh} / ${d.title}`, '',
      '| Objective | 中文标题 | 官方英文原文 | 笔记状态 | 题号列表 | 题数 |',
      '| --- | --- | --- | --- | --- | --- |');
    for (const s of d.sections) {
      const ids = data.questions.filter((q) => q.d === d.id && q.s === s.id).map((q) => q.id).sort();
      const en = data.english.sections[s.id]?.title;
      if (!en) throw new Error(`缺少 ${s.id} 的官方英文标题`);
      lines.push(`| ${[s.id, s.title, en, noteStatus(s), ids.join(', ') || '—', ids.length].map(cell).join(' | ')} |`);
    }
  }
  return lines.join('\n') + '\n';
}
function writeCoverage(output, content) {
  let previous;
  try { previous = fs.readFileSync(output, 'utf8'); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  const withoutTime = (text) => text.replace(/^生成时间：.*$/m, '');
  if (previous !== undefined && withoutTime(previous) === withoutTime(content)) return false;
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, content);
  return true;
}
if (require.main === module) {
  const root = path.resolve(__dirname, '..');
  const output = path.join(root, 'docs/coverage.md');
  const changed = writeCoverage(output, renderCoverage(loadBlueprint(root), new Date().toISOString()));
  console.log(changed ? '✓ 已生成 docs/coverage.md' : '✓ docs/coverage.md 内容未变，未重写');
}
module.exports = { noteStatus, renderCoverage, writeCoverage };
