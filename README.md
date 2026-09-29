<div align="center">

# CCAR-P 备考道场 · cca-p-dojo

**面向中文考生的 Claude Certified Architect – Professional（CCAR-P）交互式练习站**

复习笔记 · 刷题 · 错题集 · 模拟考试 · 进度导入导出。纯静态，零依赖，中英双语

**中文** · [English](README.en.md)

[![License](https://img.shields.io/badge/License-MIT-3f7d58)](LICENSE)
![题库](https://img.shields.io/badge/题库-190_题-6b5b95)
![笔记](https://img.shields.io/badge/笔记-38_节_+_1_节附录-2e7d7b)
![依赖](https://img.shields.io/badge/依赖-0-a1662f)

</div>

---

## 这是什么

cca-p-dojo 是一个离线可用的静态网页，用来准备 Anthropic 的 Claude Certified Architect – Professional 认证考试。
它把官方 Exam Guide 列出的 7 个 Domain、38 条 Task Statement 整理成结构化笔记，配 190 道原创场景题。
每道题都绑定到它考查的那一节笔记，答错后可以直接跳回去复习。

## 非官方声明

本项目**与 Anthropic 没有任何隶属或背书关系**，是社区自制的学习工具。Claude、Anthropic 及相关认证名称是 Anthropic PBC 的商标。

站内题目**不是官方真题**，也不是真题回忆。模考分数只是估算：本站按「正确数 / 总题数 × 1000」线性折算，官方换算分的计算方式可能不同，结果只用来判断掌握程度。

## 考试事实

以下规格来自官方 Exam Guide，请以官方原文为准。Exam Guide 可在 [Anthropic 认证页面](https://anthropic-partners.skilljar.com/claude-certified-architect-professional-certification)获取；本仓库**不附带**该 PDF。

| 项 | 官方值 |
| --- | --- |
| 考试代码 | CCAR-P |
| 题数 | 63 |
| 时长 | 120 分钟 |
| 及格线 | 720 / 1000（换算分） |
| 费用 | $175 USD |
| 题型 | 单选 + 多选混合，每题写明要选几项 |
| 考点 | 7 个 Domain、38 条 Task Statement |

## 功能

| 模块 | 说明 |
| --- | --- |
| **复习笔记** | 38 节正文对应 38 条 Task Statement，另有已完成的附录 R.1（干扰项类型）；其余附录（R.2–R.4）尚在计划中。每节包含考点、核心概念、决策规则、常见陷阱和题目信号，并区分官方说法与经验法则。 |
| **刷题** | 选完立即显示解析，并逐项说明错误选项为什么不成立，可一键跳回对应笔记。支持按 Domain、按小节、只做新题、薄弱题优先和收藏筛选。 |
| **错题集** | 答错自动收录，按 Domain 分组；同一道题连续答对 2 次后自动移出。 |
| **模拟考试** | 63 题、120 分钟倒计时，按官方 Domain 权重抽题（各 Domain 依次为 11 / 8 / 12 / 10 / 9 / 9 / 4 题）。作答过程不给反馈，交卷后给出 1000 分制估算分、各 Domain 得分和逐题回顾。 |
| **进阶训练（可选）** | 「先答后看」先只给题干，写下判断依据后再展开选项；「程度判断」只留正确项和一个最接近的干扰项，二选一。 |
| **导入导出** | 进度保存在浏览器 `localStorage`（key：`ccap.v1`）。页脚「管理进度」可以下载或复制进度，也可以通过文件、拖拽或粘贴导入；导入前会并列对比，再选择合并或替换。 |
| **中英双语** | 顶栏一键切换。界面、笔记和 190 道题（题干、选项、解析、错误项说明）都有中英两版。 |

## 题库覆盖

190 道原创场景题，其中 51 道多选。每个 Domain 的题量大致按官方权重分配，各题绑定到具体小节，覆盖全部 38 条 Task Statement。逐节题号见 `docs/coverage.md`（由 `scripts/gen-coverage.js` 生成）。

| Domain | 官方权重 | Task Statement | 题数 |
| --- | --- | --- | --- |
| D1 Solution Design & Architecture | 17% | 6 | 32 |
| D2 Claude Models, Prompting & Context Engineering | 13% | 5 | 25 |
| D3 Integration | 19% | 8 | 36 |
| D4 Evaluation, Testing & Optimization | 16% | 6 | 30 |
| D5 Governance, Safety & Risk Management | 14% | 5 | 27 |
| D6 Stakeholder Communication & Lifecycle Management | 14% | 5 | 27 |
| D7 Developer Productivity & Operational Enablement | 7% | 3 | 13 |
| **合计** | **100%** | **38** | **190** |

## 原创声明与事实来源

- 笔记和 190 道题均为本项目原创，**没有复制任何第三方备考仓库的文字，也没有改写或收录官方样题**。`scripts/check-sample-overlap.js` 会在作者本机把笔记和英文题目与本地的官方样题做四词片段比对，要求 0 命中；样题文件不进入仓库。
- 模型、thinking、定价等会变化的事实以撰写当天的 Anthropic 官方文档为准，并在正文注明查阅日期。每节用到的官方来源 URL 和核实范围记录在 [`docs/sources.md`](docs/sources.md)。
- 标为「经验法则」的内容是工程判断，不是 Anthropic 的官方规定。

## 本地运行

零依赖，不需要构建，也不需要 Node。在仓库根目录执行：

```bash
python3 -m http.server 4321
```

然后打开 <http://localhost:4321/>，首页会自动跳转到 `cca-p/`。

## 校验

`scripts/` 下是全部自动检查，都是零依赖的 Node 脚本，退出码非 0 即失败。改完任何内容后运行：

```bash
for f in scripts/*.js; do node "$f"; done
```

其中包括中英文案对齐、错误项解析完整性、题库蓝图配额（`node scripts/check-blueprint.js --strict`）、官方样题重叠检测，以及练习续做、换语言、导入保护等行为回归测试。脚本全部通过只说明格式和规则没问题，内容正确与否仍需对照笔记和官方来源人工核对。

## License

[MIT](LICENSE)
