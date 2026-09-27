/* 在临时目录验证真实 CLI 的两个源码入口，不修改应用文件。 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ccap-i18n-test-'));
const assets = path.join(dir, 'cca-p/assets');
try {
  fs.mkdirSync(path.join(assets, 'data'), { recursive: true });
  fs.copyFileSync(path.join(root, 'cca-p/assets/data/i18n.js'), path.join(assets, 'data/i18n.js'));
  for (const target of ['app.js', 'sync.js']) {
    for (const source of ["esc(t('wrong_sub', n))", "esc(t('wrong_sub',))"]) {
      for (const file of ['app.js', 'sync.js']) fs.writeFileSync(path.join(assets, file), file === target ? source : '');
      const result = spawnSync(process.execPath, [path.join(__dirname, 'check-i18n.js')], { cwd: dir, encoding: 'utf8' });
      assert.equal(result.status, 1, `${target} 未以 1 退出`);
      assert.match(result.stderr, /HTML.*wrong_sub/);
    }
  }
} finally {
  for (const file of ['app.js', 'sync.js', 'data/i18n.js']) fs.unlinkSync(path.join(assets, file));
  for (const subdir of ['cca-p/assets/data', 'cca-p/assets', 'cca-p', '']) fs.rmdirSync(path.join(dir, subdir));
}
console.log('✓ app.js / sync.js 的带参数及尾逗号反例均以 1 退出');
