/* 文案自检 —— 跑 `node scripts/check-i18n.js`
 *
 * 文案回归检查：
 *   1. 中英文案 key 不对齐 —— 少一条，切语言时那一处就空了
 *   2. 含 markdown（**加粗** / `代码`）的文案被 esc() 渲染 —— 星号会原样漏到界面上
 *   3. HTML 文案被 esc(t(...)) 转义 —— 标签会显示成字面文字
 */
const fs = require('node:fs');
const assert = require('node:assert/strict');
const read = (p) => fs.readFileSync(p, 'utf8');

const I18N = new Function(read('cca-p/assets/data/i18n.js') + ';return I18N')();
const src = read('cca-p/assets/app.js') + read('cca-p/assets/sync.js');

let bad = 0;

const zh = Object.keys(I18N.zh), en = Object.keys(I18N.en);
const miss = zh.filter((k) => !en.includes(k)).concat(en.filter((k) => !zh.includes(k)));
if (miss.length) { console.error('✗ 中英 key 不对齐:', miss.join(', ')); bad++; }
else console.log('✓ 中英 key 对齐（各 ' + zh.length + ' 条）');

const rich = zh.filter((k) => /\*\*|`/.test(String(I18N.zh[k])) || /\*\*|`/.test(String(I18N.en[k] || '')));
const escaped = [];
for (const k of rich) {
  const re = new RegExp('(esc|md)\\(\\s*t\\(\\s*[\'"]' + k + '[\'"]', 'g');
  const uses = [...src.matchAll(re)].map((m) => m[1]);
  if (uses.includes('esc')) escaped.push(k);
}
if (escaped.length) { console.error('✗ 含 markdown 却用 esc() 渲染:', escaped.join(', ')); bad++; }
else console.log('✓ ' + rich.length + ' 条含 markdown 的文案都用 md() 渲染');


/** 纯检查：只有真实 HTML 标签文案需要这道保护，<70% 不算标签。 */
function escapedHtmlKeys(i18n, source) {
  const keys = new Set(Object.values(i18n).flatMap((messages) => Object.keys(messages)));
  return [...keys].filter((key) => {
    if (!Object.values(i18n).some((messages) => /<[a-z/]/i.test(String(messages[key] ?? '')))) return false;
    const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp("esc\\s*\\(\\s*t\\s*\\(\\s*(['\"`])" + escapedKey + "\\1\\s*[,)]").test(source);
  });
}
const escapedHtml = escapedHtmlKeys(I18N, src);
if (escapedHtml.length) { console.error('✗ HTML 文案被 esc() 转义:', escapedHtml.join(', ')); bad++; }
else console.log('✓ HTML 文案没有被 esc(t(...)) 转义');
assert.deepEqual(escapedHtmlKeys(I18N, "esc(  t('wrong_sub'))"), ['wrong_sub']);
assert.deepEqual(escapedHtmlKeys(I18N, 'esc(\n t("wrong_sub"))'), ['wrong_sub']);
assert.deepEqual(escapedHtmlKeys(I18N, "esc(t('practice_weak_n'))"), [], '<70% 不属于 HTML 标签');
assert.deepEqual(escapedHtmlKeys(I18N, "esc(t ('wrong_sub'))"), ['wrong_sub']);
assert.deepEqual(escapedHtmlKeys(I18N, 'esc(t(`wrong_sub`))'), ['wrong_sub']);
assert.deepEqual(escapedHtmlKeys(I18N, 'esc ( t (`wrong_sub`) )'), ['wrong_sub']);
assert.deepEqual(escapedHtmlKeys(I18N, "esc(t('wrong_sub', n))"), ['wrong_sub']);
assert.deepEqual(escapedHtmlKeys(I18N, "esc(t('wrong_sub',))"), ['wrong_sub']);
console.log('✓ i18n 反例：wrong_sub 被转义可检出，<70% 不误报');

process.exit(bad ? 1 : 0);
