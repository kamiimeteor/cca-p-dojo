/* 合成文本测试归一化；官方逐句回归只读取被忽略的本地缓存。 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { randomUUID } = require('node:crypto');
const { hashesForText, checkQuestions, checkContent, loadContent, loadSampleReferences, extractSamples } = require('./check-sample-overlap');
const reference = hashesForText('robots painted glowing rocks');
assert.equal(reference.size, 1);
assert.deepEqual(reference, hashesForText('ＲＯＢＯＴＳ, PAINTED; GLOWING—ROCKS'));
assert.deepEqual(reference, hashesForText('robot paint glow rock'));
assert.equal(checkQuestions({ q: 'robot paint glow rock' }, reference).length, 1);
assert.equal(checkQuestions({ q: 'amber kites cross mountains' }, reference).length, 0);
// 自编 e 结尾词，覆盖原形、单三、过去式、进行式；四个词一起变形。
const invented = hashesForText('flome brevate snove plade');
for (const text of ['flomes brevates snoves plades', 'flomed brevated snoved pladed', 'floming brevating snoving plading']) {
  assert.deepEqual(hashesForText(text), invented);
  assert.equal(checkQuestions({ q: text }, invented).length, 1);
}
assert.deepEqual(hashesForText('clap trim hop plan'), hashesForText('clapping trimmed hopping planned'));
assert.equal(hashesForText('it is in the').size, 0);
assert.equal(hashesForText('the most effective method').size, 0);
assert.equal(hashesForText('compare the other options').size, 0);
const missing = loadSampleReferences(path.join(os.tmpdir(), randomUUID()));
assert.equal(missing.samples, null);
assert.equal(missing.mode, 'SKIPPED');
assert.equal(missing.hashes.size, 0);
const structure = 'Sample 1 · Synthetic\nAmber birds circle towers.\nA.Copper\nB.Silver\nC.Tin\nD.Zinc\nSample 1: A. Violet foxes cross bridges.';
assert.equal(extractSamples(structure), structure);
assert.equal(extractSamples(structure.replace('D.Zinc', 'Zinc')), null);
assert.equal(extractSamples(structure.replace('Sample 1: A.', 'Result:')), null);
// Load real file shapes: prose, lists, tables, metadata, and question overlays
// must all be scanned. Exempt only the official objective title field.
const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'cca-overlap-'));
try {
  const dir = path.join(fixture, 'cca-p/assets/data');
  fs.mkdirSync(dir, { recursive: true });
  const phrase = 'robot paint glow rock';
  const section = { id: '3.1', title: '中文标题', blocks: [
    { t: 'p', v: `中文正文 ${phrase}` }, { t: 'list', v: [phrase] },
    { t: 'table', head: [phrase], rows: [[phrase]] },
  ] };
  fs.writeFileSync(path.join(dir, 'notes.js'), `const EXAM_META = ${JSON.stringify({ note: phrase })};
    const NOTES = ${JSON.stringify([{ id: 'd3', blurb: phrase, sections: [section] }])};`);
  fs.writeFileSync(path.join(dir, 'content.en.js'), `const CONTENT_EN = ${JSON.stringify({
    domains: { d3: { blurb: phrase } },
    sections: {
      '3.1': { title: phrase, blocks: [{ v: phrase }, { title: phrase, v: [phrase] },
        { head: [phrase], rows: [[phrase]] }] },
      'R.1': { title: phrase, blocks: [] },
    }, questions: {},
  })};`);
  fs.writeFileSync(path.join(dir, 'content.en.q1.js'), `CONTENT_EN.questions.q = { q: ${JSON.stringify(phrase)} };`);
  const fields = checkContent(loadContent(fixture), reference).map((hit) => hit.field).sort();
  assert.deepEqual(fields, [
    'content.notes.EXAM_META.note', 'content.notes.NOTES.0.blurb',
    'content.notes.NOTES.0.sections.0.blocks.0.v', 'content.notes.NOTES.0.sections.0.blocks.1.v.0',
    'content.notes.NOTES.0.sections.0.blocks.2.head.0', 'content.notes.NOTES.0.sections.0.blocks.2.rows.0.0',
    'content.english.domains.d3.blurb', 'content.english.sections.3.1.blocks.0.v',
    'content.english.sections.3.1.blocks.1.title', 'content.english.sections.3.1.blocks.1.v.0',
    'content.english.sections.3.1.blocks.2.head.0', 'content.english.sections.3.1.blocks.2.rows.0.0',
    'content.english.sections.R.1.title', 'content.english.questions.q.q',
  ].sort());
} finally { fs.rmSync(fixture, { recursive: true, force: true }); }
console.log('✓ 笔记全文、元数据、英文题目均检出；仅官方 objective 标题字段豁免');
console.log('✓ 合成屈折、双写辅音、通用词过滤、结构解析与无资料跳过测试通过');
const cache = path.join(__dirname, '../source/official-samples.txt');
if (!fs.existsSync(cache)) {
  console.log('SAMPLE SENTENCE TEST: SKIPPED (no local official samples)');
} else {
  const samples = extractSamples(fs.readFileSync(cache, 'utf8'));
  assert(samples, '本地缓存必须包含可识别的样题结构');
  const hashes = hashesForText(samples);
  // 去掉独立编号片段；其余至少四词的每句都必须命中，不嵌入原文。
  const sentences = samples.split(/[.!?]+/u).filter((sentence) =>
    (sentence.match(/[a-z0-9]+/gi) || []).length >= 4);
  assert(sentences.length > 0);
  sentences.forEach((sentence, index) => {
    assert(checkQuestions({ q: sentence }, hashes).length > 0, `本地样题第 ${index + 1} 句未检出`);
  });
  console.log(`✓ 本地样题 ${sentences.length} 个至少四词的句子逐句检出`);
}
