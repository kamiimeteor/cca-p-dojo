/* 导入存档校验回归测试 —— 跑 `node scripts/test-import-guard.js`
 *
 * 背景：sanitizeState() 是「收紧」不是「校验」，对任何认不出的输入都返回一份空存档。
 * 所以 stageImport() 必须先用 looksLikeArchive() 把关，否则导入 `{}` 之后点「替换」
 * 会一键清空本地进度（无二次确认、不可撤销）。
 *
 * app.js 是浏览器脚本、没有模块导出，直接 require 会因为访问 DOM 而崩，
 * 所以按仓库既有测试的做法从源码里抠出目标函数，放进独立沙箱里跑。 */
const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

const source = fs.readFileSync('cca-p/assets/app.js', 'utf8');

const keysMatch = source.match(/^const ARCHIVE_KEYS = \[[\s\S]*?\];\n/m);
assert(keysMatch, 'cca-p/assets/app.js 缺少 ARCHIVE_KEYS');
const fnMatch = source.match(/^function looksLikeArchive\([\s\S]*?^}\n/m);
assert(fnMatch, 'cca-p/assets/app.js 缺少 looksLikeArchive()');

const sandbox = {};
vm.runInNewContext(`${keysMatch[0]}${fnMatch[0]}`, sandbox, { filename: 'looksLikeArchive.js' });
const { looksLikeArchive } = sandbox;
assert.equal(typeof looksLikeArchive, 'function', 'looksLikeArchive 未能载入');

/* ---- 必须拒绝：合法 JSON，但不是存档 ---- */
const rejects = [
  ['{}', '空对象'],
  ['[]', '空数组'],
  ['[{"qstats":{}}]', '数组包着存档'],
  ['"hello"', '字符串'],
  ['123', '数字'],
  ['null', 'null'],
  ['true', '布尔'],
  ['{"foo":"bar"}', '无关对象'],
  ['{"app":"cca-p","Qstats":{}}', 'key 大小写不符'],
  ['{"app":"cca-f","qstats":{"q001":{"seen":1}},"read":["1.1"]}', '其他站点且 ID 重合的存档'],
  ['{"qstats":{"q001":{"seen":1}},"read":["1.1"]}', '无站点标记的旧存档'],
  ['{"app":"cca-p","v":1}', '只有站点标记，没有状态字段'],
];
for (const [json, label] of rejects) {
  assert.equal(
    looksLikeArchive(JSON.parse(json)), false,
    `应拒绝 ${label}：${json}`,
  );
}

/* ---- 必须接受：真实存档，包括全新用户导出的空存档 ---- */
const accepts = [
  ['{"qstats":{},"wrong":{},"exams":[],"marks":[],"read":[],"prefs":{"theme":"light","lang":"zh"}}', '全新用户的空存档'],
  ['{"qstats":{"q001":{"seen":1,"ok":1,"no":0,"streak":1,"last":true}}}', '只有 qstats'],
  ['{"prefs":{"theme":"dark"}}', '只有 prefs'],
  ['{"read":["1.1"]}', '只有 read'],
  ['{"exams":[]}', '只有 exams'],
  ['{"marks":["q005"]}', '只有 marks'],
  ['{"wrong":{}}', '只有 wrong'],
  ['{"qstats":{},"unknownFuture":1}', '带未来新增字段'],
];
for (const [json, label] of accepts) {
  assert.equal(
    looksLikeArchive({ app: 'cca-p', v: 1, ...JSON.parse(json) }), true,
    `应接受 ${label}：${json}`,
  );
}

/* ---- 继承来的 key 不算命中 ---- */
assert.equal(
  looksLikeArchive(Object.assign(Object.create({ qstats: {} }), { app: 'cca-p' })), false,
  'qstats 只在原型链上时不应算存档',
);

/* ---- stageImport 必须在 sanitizeState 之前调用这道闸 ---- */
const stage = source.match(/^function stageImport\([\s\S]*?^}\n/m);
assert(stage, 'cca-p/assets/app.js 缺少 stageImport()');
const guardAt = stage[0].indexOf('looksLikeArchive');
const sanitizeAt = stage[0].indexOf('sanitizeState');
assert(guardAt !== -1, 'stageImport() 没有调用 looksLikeArchive()');
assert(sanitizeAt !== -1, 'stageImport() 没有调用 sanitizeState()');
assert(
  guardAt < sanitizeAt,
  'looksLikeArchive() 必须在 sanitizeState() 之前 —— 否则闸门形同虚设',
);

console.log(`✓ 导入校验：拒绝 ${rejects.length} 种非存档 JSON，接受 ${accepts.length} 种真实存档，闸门在 sanitizeState 之前`);

// Run the real sanitizer and merger: site metadata must never become state.
const stateContext = vm.createContext({});
const data = fs.readFileSync('cca-p/assets/data/notes.js', 'utf8') + '\n'
  + fs.readFileSync('cca-p/assets/data/questions.js', 'utf8');
const merge = source.match(/^function mergeState\([^]*?^}\n/m)[0];
vm.runInContext(data + '\n' + source.slice(0, source.indexOf('let S = (() =>')) + '\n' + merge
  + '\nglobalThis.empty = DEFAULT_STATE;', stateContext);
const ownState = stateContext.sanitizeState({
  qstats: { q001: { seen: 2, ok: 1, no: 1, streak: 0, last: false } },
  wrong: { q001: { added: 1, streak: 0, times: 1 } },
  exams: [{ ts: 1, score: 1000, pass: true, total: 3, correct: 3,
    dur: 100, byDom: { d3: { n: 1, ok: 1 } }, detail: [{ qid: 'q001', pick: 2 }] }],
  marks: ['q001'], read: ['1.1'], prefs: { theme: 'dark', lang: 'en' },
});
const archived = JSON.parse(JSON.stringify(stateContext.progressArchive(ownState)));
assert.strictEqual(archived.app, 'cca-p');
assert.strictEqual(archived.v, 1);
assert(stateContext.looksLikeArchive(archived));
const restored = stateContext.sanitizeState(archived);
assert.deepStrictEqual(restored, ownState, '本站存档往返必须保持数据');
assert(!Object.hasOwn(restored, 'app') && !Object.hasOwn(restored, 'v'));
const local = stateContext.sanitizeState({ marks: ['q003'], read: ['2.5'] });
const merged = stateContext.mergeState(local, restored);
assert.deepStrictEqual([...merged.marks].sort(), ['q001', 'q003']);
assert.deepStrictEqual([...merged.read].sort(), ['1.1', '2.5']);
assert.deepStrictEqual(merged.qstats.q001, restored.qstats.q001);
assert(!Object.hasOwn(merged, 'app') && !Object.hasOwn(merged, 'v'));
assert.strictEqual(restored.exams[0].partial, true, '旧的三题记录也须识别为非完整模考');
assert.strictEqual(restored.exams[0].pass, false, '非完整模考不能记为通过');
assert.strictEqual(stateContext.sanitizeState({ exams: [{ total: 63, pass: true }] }).exams[0].pass, true);
assert.match(source, /new Blob\(\[JSON.stringify\(progressArchive\(S\), null, 2\)/);
assert.match(source, /copyWithFlash\(e.currentTarget, JSON.stringify\(progressArchive\(S\)\)/);
console.log('✓ 本站存档导出、清理、合并往返一致；app/v 不进入状态；非完整模考标记保留');

// Mock the database transport to check both cloud write paths and guarded reads.
async function checkCloudArchive() {
  const sync = fs.readFileSync('cca-p/assets/sync.js', 'utf8');
  const pull = sync.match(/^async function cloudPull\([^]*?^}\n/m)[0];
  const push = sync.match(/^async function cloudPush\([^]*?^}\n/m)[0];
  const stable = sync.match(/^function stableStr\([^]*?^}\n/m)[0];
  let remote = null, written;
  const query = {
    eq() { return this; },
    select() { return this; },
    maybeSingle: async () => ({ data: remote, error: null }),
    update(payload) { written = payload; return this; },
    insert(payload) { written = payload; return this; },
    then(resolve) { return Promise.resolve({ data: [{ version: 2 }], error: null }).then(resolve); },
  };
  Object.assign(stateContext, {
    CLOUD: { gen: 1, user: { id: 'test-user' }, version: 1, lastPushed: null },
    loadSupabase: async () => ({ from: () => query }),
    t: (key) => key, S: ownState,
  });
  vm.runInContext(stable + pull + push, stateContext);
  for (const raw of [{ qstats: {} }, { app: 'other-site', qstats: {} }]) {
    remote = { data: raw, version: 1 };
    await assert.rejects(stateContext.cloudPull(), /import_wrong_app/);
  }
  remote = { data: archived, version: 1 };
  const pulled = await stateContext.cloudPull();
  assert.deepStrictEqual(pulled.state, ownState);
  assert(!Object.hasOwn(pulled.state, 'app'));
  await stateContext.cloudPush({ authoritative: true });
  assert.deepStrictEqual(JSON.parse(JSON.stringify(written.data)), archived, '云端 update 必须使用本站导出格式');
  stateContext.CLOUD.version = null;
  remote = null;
  await stateContext.cloudPush({ authoritative: true });
  assert.deepStrictEqual(JSON.parse(JSON.stringify(written.data)), archived, '云端 insert 必须使用本站导出格式');
  assert.match(sync, /conflictRemote = JSON.stringify\(progressArchive\(remote.state\)\)/,
    '云端冲突预览必须保留本站标记');
  console.log('✓ 云端读写和冲突预览使用本站格式，拒绝其他站点及无标记数据');
}
checkCloudArchive().catch((error) => { console.error(error); process.exitCode = 1; });
