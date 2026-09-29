/* 练习页 / 进阶训练切换语言回归测试 —— 跑 `node scripts/test-practice-lang.js`
 *
 * Bug：练习页打开一道题、不作答，切换中英文后当前题变成了另一道；
 *      进阶训练「先答后看」「程度判断」换语言会重新洗牌回到第 1 题，先答后看还会丢掉已写的依据。
 * 根因：.lang-opt 处理器直接调 router()，routes.practice 会重新洗牌建题单 / 重开训练。
 * 这里抽出 app.js 里真实的 PRACTICE、BLIND、DEGREE 引擎、routes.practice 与 .lang-opt 处理器，
 * 在 vm 沙箱里用最小假 DOM 驱动（每次重写 #app 都会换掉其中的元素，输入框的值不会凭空保留），断言：
 *   1. 常规练习：未作答换语言，当前题、题单和进度不变，标签按新语言取文案；
 *   2. 常规练习：已作答换语言，恢复判分界面，不重复记分；
 *   3. 离开练习页后换语言，仍走 router；
 *   4. 先答后看第一步：当前题不变，已写的依据和猜的小节保留；
 *   5. 先答后看第二步已作答：当前题不变，不重复记分，并恢复判分；
 *   6. 程度判断：当前题和两项顺序不变；已作答时不重复记分。
 * 可传入其他 app.js 做对照：`node scripts/test-practice-lang.js <旧版 app.js>`（修复前的版本应失败）。
 */
const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

const file = process.argv[2] || 'cca-p/assets/app.js';
const source = fs.readFileSync(file, 'utf8');
const grab = (re, name) => {
  const m = source.match(re);
  assert(m, `${file} 缺少 ${name}`);
  return m[0];
};

const practiceState = grab(/^(?:\/\*[^\n]*\*\/\n)?const PRACTICE = [\s\S]*?(?=^const isWeak)/m, 'PRACTICE 定义');
const routePractice = grab(/^routes\.practice = \(rest\) => {[\s\S]*?^};\n/m, 'routes.practice');
const blindEngine = grab(/^const BLIND = [\s\S]*?^function blindDone\(\) {[\s\S]*?^}\n/m, '先答后看引擎');
const degreeEngine = grab(/^const DEGREE = [\s\S]*?^function degreeDone\(\) {[\s\S]*?^}\n/m, '程度判断引擎');
const practiceRun = grab(/^function practiceRun\(\) {[\s\S]*?^}\n/m, 'practiceRun()');
const langHandler = grab(/^\$\$\('\.lang-opt'\)\.forEach\([\s\S]*?^}\);\n/m, '.lang-opt 处理器');

/* ---------- 最小假 DOM ---------- */
function makeEl(extra = {}) {
  return {
    innerHTML: '', textContent: '', hidden: true, disabled: false, className: '', value: '',
    dataset: {}, onclick: null, oninput: null, onchange: null,
    classList: { add() {}, remove() {}, toggle() {} },
    focus() {}, insertAdjacentHTML() {}, closest() { return { remove() {} }; },
    ...extra,
  };
}

function harness(hash) {
  const QUESTIONS = Array.from({ length: 6 }, (_, i) => ({
    id: `q${i + 1}`, d: 'd1', s: '1.1', sc: 'gen', a: 0, near: 1,
    q: `stem-q${i + 1}`, o: ['A', 'B', 'C', 'D'], e: 'why', w: { 1: 'w1', 2: 'w2', 3: 'w3' },
  }));
  const env = { lang: 'zh', rotate: 0, records: [], reveals: [], routerCalls: 0 };
  const persistent = { '#progModal': makeEl(), '#fbModal': makeEl() };
  let els = {};
  let appHtml = '';
  const app = makeEl();
  Object.defineProperty(app, 'innerHTML', {
    get: () => appHtml,
    set: (v) => { appHtml = v; els = {}; renderOpts(); },   // 重写 #app：里面的元素全部换新
  });
  const langOpts = [makeEl({ dataset: { lang: 'zh' } }), makeEl({ dataset: { lang: 'en' } })];
  let opts = [];
  function renderOpts() {
    const ids = [...appHtml.matchAll(/class="opt" data-i="(\d+)"/g)].map((m) => m[1]);
    opts = (ids.length ? ids : ['0', '1', '2', '3']).map((i) => makeEl({ dataset: { i } }));
  }
  const $ = (sel) => (sel === '#app' ? app : persistent[sel] || (els[sel] ||= makeEl()));
  const $$ = (sel) => {
    if (sel === '.opt') return opts;
    if (sel === '.progress-strip i') return QUESTIONS.map(() => makeEl());
    if (sel === '.lang-opt') return langOpts;
    return [];
  };
  const t = (k) => `${env.lang}:${k}`;
  // 每次洗牌结果都不同：旧实现换语言时会拿到另一道当前题 / 另一种两项顺序
  const shuffle = (xs) => { env.rotate += 1; const r = env.rotate % xs.length; return [...xs.slice(r), ...xs.slice(0, r)]; };

  const ctx = vm.createContext({
    $, $$, QUESTIONS, t, shuffle, __env: env, location: { hash },
    esc: (s) => String(s), md: (s) => String(s), num: (n) => Number(n), pct: (a, b) => (b ? Math.round(a / b * 100) : 0),
    qView: (q) => q, bindMark() {}, isMulti: () => false, pickCount: () => 1,
    questionCard: (q) => `<card data-id="${q.id}">`,
    revealAnswer: (q, pick) => { env.reveals.push({ id: q.id, pick }); return pick === q.a; },
    record: (id, ok) => env.records.push({ id, ok }),
    updateWrongPill() {}, practiceMenu() {}, practiceDone() {}, go() {},
    NOTES: [{ id: 'd1', sections: [{ id: '1.1', title: 'sec' }] }], secView: (s) => s,
    LTR: ['A', 'B', 'C', 'D'], scenarioName: (x) => x,
    VALID_DOM: new Set(['d1']), VALID_SEC: new Set(['1.1']), safeDecode: (s) => s,
    domView: () => ({ title: t('dom') }), domOf: (x) => x, secTitle: () => t('sec'),
    isWeak: () => false, buildPracticeResume: (list) => ({ list: shuffle(list), i: 0, results: [] }),
    S: { prefs: { set lang(v) { env.lang = v; }, get lang() { return env.lang; } }, qstats: {}, marks: [] },
    LANG: () => env.lang, setLangMenu() {}, save() {}, paintChrome() {},
    syncTopbarHeight() {}, renderProgressBody() {}, openFeedback() {},
  });
  vm.runInContext(`
    const routes = {};
    ${practiceState}
    ${blindEngine}
    ${degreeEngine}
    ${routePractice}
    ${practiceRun}
    function router() {
      __env.routerCalls += 1;
      const [path, ...rest] = location.hash.slice(1).split('/').filter(Boolean);
      if (path === 'practice') routes.practice(rest);
    }
    ${langHandler}
    globalThis.__api = { PRACTICE, BLIND, DEGREE, router };`, ctx, { filename: file });

  return {
    api: ctx.__api, env, $, ctx,
    current: () => (appHtml.match(/(?:data-id="|stem-)(q\d+)/) || [])[1],
    pairOrder: () => [...appHtml.matchAll(/class="opt" data-i="(\d+)"/g)].map((m) => m[1]).join(','),
    switchLang: (lang) => langOpts.find((o) => o.dataset.lang === lang).onclick({ stopPropagation() {} }),
    opts: () => opts,
  };
}

/* 1. 常规练习未作答时换语言：当前题、题单、进度不变 */
{
  const h = harness('#/practice/all');
  h.api.router();
  const before = h.current();
  const listBefore = h.api.PRACTICE.list.map((q) => q.id).join(',');
  assert(before, '练习页应渲染出当前题');
  h.switchLang('en');
  assert.equal(h.current(), before, '未作答时切换语言，当前题不能被换掉');
  assert.equal(h.api.PRACTICE.list.map((q) => q.id).join(','), listBefore, '切换语言不能重新洗牌题单');
  assert.equal(h.api.PRACTICE.i, 0, '切换语言不能改变进度');
  assert.equal(h.env.records.length, 0, '未作答时不能产生答题记录');
  assert.match(h.$('#app').innerHTML, /en:practice_all/, '练习标签应按新语言重新取文案');
  h.switchLang('zh');
  assert.equal(h.current(), before, '再切回中文，当前题仍然不变');
}

/* 2. 常规练习已作答后换语言：保持判分界面，不重复记分 */
{
  const h = harness('#/practice/all');
  h.api.router();
  const q = h.current();
  h.opts()[0].onclick();                       // 作答（选 A）
  assert.equal(h.env.records.length, 1, '作答应记分一次');
  const results = [...h.api.PRACTICE.results];
  h.env.reveals.length = 0;
  h.switchLang('en');
  assert.equal(h.current(), q, '已作答时切换语言，当前题不变');
  assert.equal(h.env.records.length, 1, '切换语言不能重复记分');
  assert.deepEqual([...h.api.PRACTICE.results], results, '已作答结果保持不变');
  assert.deepEqual(h.env.reveals.map((r) => [r.id, r.pick]), [[q, 0]], '重绘后应恢复该题的判分界面和所选答案');
}

/* 3. 离开练习页后换语言：照旧走 router */
{
  const h = harness('#/practice/all');
  h.api.router();
  h.ctx.location.hash = '#/notes';
  const calls = h.env.routerCalls;
  h.switchLang('en');
  assert.equal(h.env.routerCalls, calls + 1, '非练习页切换语言应重跑 router');
}

/* 4. 先答后看第一步：当前题不变，已写依据保留 */
{
  const h = harness('#/practice/blind');
  h.api.router();
  h.opts();
  const before = h.current();
  assert(before, '先答后看应渲染出题干');
  const note = h.$('#blindNote'), guess = h.$('#blindGuess');
  note.value = '先看约束再选'; if (note.oninput) note.oninput();
  guess.value = '1.1'; if (guess.onchange) guess.onchange();
  h.switchLang('en');
  assert.equal(h.current(), before, '先答后看换语言，当前题不能被换掉');
  assert.equal(h.api.BLIND.i, 0, '先答后看换语言不能回到新一轮');
  assert.equal(h.$('#blindNote').value, '先看约束再选', '先答后看换语言应保留已写的判断依据');
  assert.equal(h.$('#blindGuess').value, '1.1', '先答后看换语言应保留猜的小节');
  h.$('#revealBtn').onclick();
  assert.equal(h.api.BLIND.note, '先看约束再选', '展开选项时带上换语言前写的依据');
}

/* 5. 先答后看第二步已作答：不重复记分，恢复判分 */
{
  const h = harness('#/practice/blind');
  h.api.router();
  const q = h.current();
  h.$('#revealBtn').onclick();                 // 进入第二步
  h.opts()[0].onclick();                       // 作答
  assert.equal(h.env.records.length, 1);
  h.env.reveals.length = 0;
  h.switchLang('en');
  assert.equal(h.current(), q, '先答后看作答后换语言，当前题不变');
  assert.equal(h.env.records.length, 1, '先答后看换语言不能重复记分');
  assert.deepEqual(h.env.reveals.map((r) => [r.id, r.pick]), [[q, 0]], '先答后看重绘后应恢复判分界面');
}

/* 6. 程度判断：当前题与两项顺序不变；已作答不重复记分 */
{
  const h = harness('#/practice/degree');
  h.api.router();
  const q = h.current(), order = h.pairOrder();
  assert(q && order, '程度判断应渲染出题目和两项选项');
  h.switchLang('en');
  assert.equal(h.current(), q, '程度判断换语言，当前题不能被换掉');
  assert.equal(h.pairOrder(), order, '程度判断换语言，两项的顺序不能变');
  h.opts()[0].onclick();
  assert.equal(h.env.records.length, 1);
  h.switchLang('zh');
  assert.equal(h.current(), q, '程度判断作答后换语言，当前题不变');
  assert.equal(h.pairOrder(), order);
  assert.equal(h.env.records.length, 1, '程度判断换语言不能重复记分');
  assert(h.opts().every((b) => b.disabled), '程度判断重绘后应保持已判分状态');
}

console.log('✓ 练习页换语言：未作答 / 已作答的当前题保持不变，不重复记分，标签随语言更新；离开练习页仍走 router');
console.log('✓ 进阶训练换语言：先答后看保留当前题、步骤与已写依据，程度判断保留当前题与两项顺序，均不重复记分');
