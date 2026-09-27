/* 官方样题只在作者本机比对；仓库不保存任何官方派生常量。
 * 优先读取 gitignored 的 source/official-samples.txt；没有缓存时尝试本地 PDF。
 * PDF 提取需要 pdftotext 或 python3 + pypdf，可用 PDF_PYTHON 指定解释器。
 * 输出「全文缓存」或「PDF 提取并缓存全文」说明资料来源。
 * 无可用本地资料时打印 SAMPLE OVERLAP: SKIPPED (no local official samples)，退出 0。
 * 出题在作者本机进行；无资料的检出能力不作保证，CI 允许跳过。
 * 生成端和比对端共用 NFKC、小写、切词、去词尾、去尾 e 和双写辅音还原。
 * 四词哈希只在内存中生成，不写入仓库或其他输出文件。
 */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { execFileSync } = require('node:child_process');
const { createHash } = require('node:crypto');

const FUNCTION_WORDS = [
  'a', 'an', 'the', 'this', 'that', 'these', 'those', 'some', 'any', 'each', 'every',
  'all', 'both', 'either', 'neither', 'other', 'most', 'such',
  'of', 'in', 'on', 'at', 'to', 'for', 'from', 'by', 'with', 'without', 'about',
  'into', 'onto', 'over', 'under', 'before', 'after', 'between', 'through', 'than',
  'i', 'me', 'my', 'mine', 'we', 'us', 'our', 'ours', 'you', 'your', 'yours',
  'he', 'him', 'his', 'she', 'her', 'hers', 'it', 'its', 'they', 'them', 'their', 'theirs',
  'who', 'whom', 'whose', 'which', 'what', 'where', 'when', 'why', 'how', 'there',
  'be', 'am', 'is', 'are', 'was', 'were', 'been', 'being',
  'do', 'does', 'did', 'done', 'doing', 'have', 'has', 'had', 'having',
  'and', 'or', 'but', 'if', 'then', 'else', 'as', 'while', 'because', 'so', 'although',
  'can', 'could', 'may', 'might', 'must', 'shall', 'should', 'will', 'would', 'not', 'no',
];
// 短通用搭配足以覆盖套话；每条最多六词，不保存整段问答。
const GENERIC_PHRASES = [
  'most effective', // 泛指效果优劣，常见于各种考试的提问。
  'other options', // 泛指剩余选项，常见于各种考试的解析。
];
function stem(word) {
  if (word.length <= 3) return word;
  let base = word.replace(/(?:ing|ed|es|s)$/, '');
  if (base.length > 3) base = base.replace(/e$/, '');
  if (/(?:ing|ed)$/.test(word)) base = base.replace(/([b-df-hj-np-tv-z])\1$/, '$1');
  return base;
}
const functionWords = new Set(FUNCTION_WORDS.map(stem));
function tokenize(text) {
  return (text.normalize('NFKC').toLowerCase().match(/[a-z0-9]+/g) || []).map(stem);
}
const genericPhrases = GENERIC_PHRASES.map(tokenize);
function hashGram(words) {
  return createHash('sha256').update(words.join(' '), 'utf8').digest('hex').slice(0, 16);
}
function hashesForText(text) {
  const words = tokenize(text);
  const hashes = new Set();
  for (let i = 0; i + 4 <= words.length; i++) {
    const gram = words.slice(i, i + 4);
    if (gram.every((word) => functionWords.has(word))) continue;
    if (genericPhrases.some((phrase) => gram.some((_, start) =>
      phrase.every((word, offset) => gram[start + offset] === word)))) continue;
    hashes.add(hashGram(gram));
  }
  return hashes;
}
function checkText(value, hashes, root, exemptFields = new Set()) {
  const reference = new Set(hashes);
  const hits = [];
  function visit(value, field) {
    if (exemptFields.has(field)) return;
    if (typeof value === 'string') {
      for (const hash of hashesForText(value)) if (reference.has(hash)) hits.push({ field, hash });
    } else if (value && typeof value === 'object') {
      for (const [key, child] of Object.entries(value)) visit(child, `${field}.${key}`);
    }
  }
  visit(value, root);
  return hits;
}
function checkQuestions(questions, hashes) {
  return checkText(questions, hashes, 'questions');
}
function loadContent(root = path.resolve(__dirname, '..')) {
  const context = vm.createContext({});
  const dir = path.join(root, 'cca-p/assets/data');
  const files = ['notes.js', 'content.en.js',
    ...fs.readdirSync(dir).filter((f) => /^content\.en\.q.*\.js$/.test(f)).sort()];
  for (const file of files) {
    vm.runInContext(fs.readFileSync(path.join(dir, file), 'utf8'), context, { filename: file, timeout: 1000 });
  }
  return vm.runInContext('({ notes: { EXAM_META, NOTES }, english: CONTENT_EN })', context);
}
function checkContent(content, hashes) {
  // Only the official English objective title field is exempt. The same words
  // in prose, tables, block titles, or appendix titles are still checked.
  const exemptFields = new Set(content.notes.NOTES
    .filter((domain) => /^d[1-7]$/.test(domain.id))
    .flatMap((domain) => domain.sections
      .filter((section) => section.id.startsWith(`${domain.id.slice(1)}.`))
      .map((section) => `content.english.sections.${section.id}.title`)));
  return checkText(content, hashes, 'content', exemptFields);
}
function loadQuestions() {
  return loadContent().english.questions;
}

/** 从完整 Exam Guide 提取三道样题及解析，不把其他章节用于比对。 */
function extractSamples(text) {
  const normalized = text.normalize('NFKC');
  const start = normalized.search(/^Sample\s+1\s*[·—-]/im);
  if (start < 0) return null;
  const tail = normalized.slice(start);
  const end = tail.search(/^\d+\.\s+[^\n]+$/m);
  const samples = (end < 0 ? tail : tail.slice(0, end)).trim();
  const headings = [...samples.matchAll(/^Sample\s+(\d+)\s*[·—-]/gim)];
  if (headings.length < 1) return null;
  for (let i = 0; i < headings.length; i++) {
    const number = headings[i][1];
    const block = samples.slice(headings[i].index, headings[i + 1]?.index);
    if (!['A', 'B', 'C', 'D'].every((letter) => new RegExp('^\\s*' + letter + '\\.', 'm').test(block))) return null;
    if (!new RegExp('^Sample\\s+' + number + '\\s*:\\s*[A-D]\\.', 'im').test(samples)) return null;
  }
  return samples;
}

function loadSampleReferences(root = path.resolve(__dirname, '..')) {
  const cache = path.join(root, 'source/official-samples.txt');
  try {
    const samples = extractSamples(fs.readFileSync(cache, 'utf8'));
    if (samples) return { hashes: hashesForText(samples), mode: '全文缓存', samples };
  } catch (_) { /* 没有可读缓存时尝试本地 PDF。 */ }
  const python = process.env.PDF_PYTHON || 'python3';
  const pythonCode = 'import sys\nfrom pypdf import PdfReader\nprint("\\n".join(p.extract_text() or "" for p in PdfReader(sys.argv[1]).pages))';
  let files = [];
  try { files = fs.readdirSync(root).filter((f) => /\.pdf$/i.test(f)).sort(); }
  catch (_) { /* 根目录不存在或不可读时也应降级。 */ }
  for (const file of files) {
    const pdf = path.join(root, file);
    const extractors = [['pdftotext', ['-layout', pdf, '-']], [python, ['-c', pythonCode, pdf]]];
    for (const [command, args] of extractors) {
      try {
        const text = execFileSync(command, args, { encoding: 'utf8', timeout: 15000,
          maxBuffer: 8 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'] });
        const samples = extractSamples(text);
        if (!samples) continue;
        fs.mkdirSync(path.dirname(cache), { recursive: true });
        fs.writeFileSync(cache, samples + '\n');
        return { hashes: hashesForText(samples), mode: 'PDF 提取并缓存全文', samples };
      } catch (_) { /* 提取工具缺失或 PDF 不可读：尝试下一项，最终跳过。 */ }
    }
  }
  return { hashes: new Set(), samples: null, mode: 'SKIPPED' };
}

if (require.main === module) {
  try {
    const source = loadSampleReferences();
    if (!source.samples) {
      console.log('SAMPLE OVERLAP: SKIPPED (no local official samples)');
    } else {
      const hits = checkContent(loadContent(), source.hashes);
      if (hits.length) {
        for (const hit of hits) console.error(`✗ ${hit.field}: ${hit.hash}`);
        process.exitCode = 1;
      } else console.log(`✓ notes.js / content.en.js 全部文本及英文题目（豁免官方 objective 标题）：${source.mode}，重叠 0 命中`);
    }
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
module.exports = { checkQuestions, loadQuestions, checkContent, loadContent, loadSampleReferences, extractSamples, hashesForText };
