/* 进度条状态颜色回归测试 —— 跑 `node scripts/test-progress-colors.js` */
const assert = require('assert');
const fs = require('fs');

const css = fs.readFileSync('cca-p/assets/styles.css', 'utf8');
const tokens = fs.readFileSync('shared/theme.css', 'utf8');
const root = tokens.match(/:root\s*{([\s\S]*?)\n}/)?.[1] || '';
const dark = tokens.match(/\[data-theme="dark"\]\s*{([\s\S]*?)\n}/)?.[1] || '';
const value = (block, name) => block.match(new RegExp(`--${name}:\\s*([^;]+);`))?.[1].trim();

for (const [theme, block] of [['light', root], ['dark', dark]]) {
  const current = value(block, 'current');
  assert(current, `${theme} 主题缺少 --current 颜色`);
  assert.notEqual(current, value(block, 'bad'), `${theme} 主题的当前题不能与错题同色`);
  assert.notEqual(current, value(block, 'accent'), `${theme} 主题的当前题不能继续使用红色强调色`);
}

assert.match(
  css,
  /\.progress-strip i\.cur\s*{[^}]*background:\s*var\(--current\);[^}]*transform:\s*scaleY\(/,
  '当前题应使用独立颜色，并通过粗细与其他状态区分',
);

assert.match(
  css,
  /\.opt:hover:not\(:disabled\)\s*{[^}]*border-color:\s*var\(--current\)/,
  '选项悬停应使用紫色交互态，不能使用红色',
);
assert.match(
  css,
  /\.opt:focus-visible\s*{[^}]*outline:\s*2px solid var\(--current\)/,
  '键盘聚焦应使用紫色轮廓',
);
assert.match(css, /\.opt\.sel\s*{[^}]*border-color:\s*var\(--current\)/, '多选选中边框应使用紫色');
assert.match(css, /\.opt\.sel \.ltr\s*{[^}]*background:\s*var\(--current\)/, '多选选中字母应使用紫色');
assert.match(css, /\.opt\.wrong\s*{[^}]*border-color:\s*var\(--bad\)/, '红色只保留给判错状态');

console.log('✓ 状态颜色：绿色答对、红色答错、紫色表示当前题及判分前交互、浅灰表示未做');

const luminance = (hex) => {
  const c = hex.match(/\w\w/g).map((v) => parseInt(v, 16) / 255)
    .map((v) => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return c[0] * 0.2126 + c[1] * 0.7152 + c[2] * 0.0722;
};
for (const id of ['d6', 'd7']) {
  const hex = css.match(new RegExp(`\\.tag\\.${id}\\s*\\{\\s*background:\\s*#([a-f0-9]{6})`))?.[1];
  assert(hex, `${id} 必须有独立背景色`);
  assert((1.05 / (luminance(hex) + 0.05)) >= 4.5, `${id} 背景与白字对比度至少为 4.5:1`);
  assert(new RegExp(`\\.tag\\.${id}[^{}]*\\{ color: #fff; \\}`).test(css), `${id} 必须使用白字`);
}
console.log('✓ d6/d7 白字配色对比度通过，深浅主题共用');
