# 蓝图覆盖图

生成时间：2026-09-29T15:47:46.891Z

由 scripts/gen-coverage.js 生成，勿手改。

## d1 解决方案设计与架构 / Solution Design & Architecture

| Objective | 中文标题 | 官方英文原文 | 笔记状态 | 题号列表 | 题数 |
| --- | --- | --- | --- | --- | --- |
| 1.1 | 把业务问题转化为 Claude 方案 | Translate business problems into Claude-based AI solutions | ✓ | q039, q040, q041, q042, q043, q044 | 6 |
| 1.2 | 端到端架构：输入→处理→输出→反馈闭环 | Design end-to-end architectures (input → processing → output → feedback loops) | ✓ | q045, q046, q047, q048, q049 | 5 |
| 1.3 | 选择架构模式：workflow / agentic / augmented LLM | Select appropriate architectural patterns (workflow, agentic, augmented LLM) | ✓ | q050, q051, q052, q053, q054, q055 | 6 |
| 1.4 | 多 Agent 系统与编排策略 | Design multi-agent systems and orchestration strategies | ✓ | q056, q057, q058, q059, q060 | 5 |
| 1.5 | 复杂问题的分解技术 | Apply decomposition techniques for complex problem solving | ✓ | q061, q062, q063, q064, q065 | 5 |
| 1.6 | 对齐业务价值支柱 | Align solutions to business value pillars (efficiency, transformation, productivity, cost, performance SLAs) | ✓ | q066, q067, q068, q069, q070 | 5 |

## d2 Claude 模型、提示与上下文工程 / Claude Models, Prompting & Context Engineering

| Objective | 中文标题 | 官方英文原文 | 笔记状态 | 题号列表 | 题数 |
| --- | --- | --- | --- | --- | --- |
| 2.1 | 按取舍选择 Claude 模型 | Select appropriate Claude models based on trade-offs | ✓ | q154, q155, q156, q157, q158 | 5 |
| 2.2 | System prompt、模板与护栏 | Design system prompts, templates, and guardrails | ✓ | q159, q160, q161, q162, q163 | 5 |
| 2.3 | 提示技术：zero-shot / few-shot / CoT | Apply prompt engineering techniques (zero-shot, few-shot, chain-of-thought) | ✓ | q164, q165, q166, q167, q168 | 5 |
| 2.4 | 上下文窗口与 token 管理 | Optimize context windows and manage token usage | ✓ | q169, q170, q171, q172, q173 | 5 |
| 2.5 | 提示复用：缓存、模块化提示、Skills | Implement prompt reuse strategies (caching, modular prompts, Skills) | ✓ | q002, q174, q175, q176, q177 | 5 |

## d3 集成 / Integration

| Objective | 中文标题 | 官方英文原文 | 笔记状态 | 题号列表 | 题数 |
| --- | --- | --- | --- | --- | --- |
| 3.1 | 工具/Agent 配置的能力膨胀 | Evaluate tool/agent configuration for capability bloat | ✓ | q001, q004, q005, q006 | 4 |
| 3.2 | 认证授权与安全缺口 | Analyze authentication and authorization requirements to identify security gaps | ✓ | q007, q008, q009, q010, q011 | 5 |
| 3.3 | 准确率与延迟的取舍 | Evaluate accuracy-latency trade-offs and justify configuration decisions | ✓ | q012, q013, q014, q015 | 4 |
| 3.4 | 大规模可观测性与监控策略 | Analyze observability challenges and select monitoring strategies at scale | ✓ | q016, q017, q018, q019 | 4 |
| 3.5 | RAG 管道：分块与索引 | Design a RAG pipeline with appropriate chunking and indexing strategies | ✓ | q020, q021, q022, q023, q024 | 5 |
| 3.6 | 按数据形态与查询模式选检索策略 | Apply retrieval strategies matched to data shape and query pattern | ✓ | q025, q026, q027, q028 | 4 |
| 3.7 | 集成机制：MCP / API·CLI / agent-to-agent | Evaluate connection protocols and select the appropriate integration mechanism (MCP, API/CLI, agent-to-agent) | ✓ | q029, q030, q031, q032, q033 | 5 |
| 3.8 | 渐进式发现 vs 一次性全量上下文 | Evaluate progressive discovery vs. monolithic context strategy | ✓ | q034, q035, q036, q037, q038 | 5 |

## d4 评估、测试与优化 / Evaluation, Testing & Optimization

| Objective | 中文标题 | 官方英文原文 | 笔记状态 | 题号列表 | 题数 |
| --- | --- | --- | --- | --- | --- |
| 4.1 | 定义评估指标 | Define evaluation metrics (accuracy, latency, cost, safety, security) | ✓ | q071, q072, q073, q074, q075 | 5 |
| 4.2 | 评估数据集与混合方法测试框架 | Design evaluation datasets and test frameworks using mixed methodologies | ✓ | q076, q077, q078, q079, q080 | 5 |
| 4.3 | A/B 测试与迭代改进 | Conduct A/B testing and iterative improvements | ✓ | q081, q082, q083, q084, q085 | 5 |
| 4.4 | 诊断系统问题：提示失效、幻觉、模型不匹配 | Diagnose system issues (prompt failure, hallucinations, model mismatch) | ✓ | q003, q086, q087, q088, q089 | 5 |
| 4.5 | 优化 token、延迟与性价比 | Optimize token usage, latency, and cost-performance trade-offs | ✓ | q090, q091, q092, q093, q094 | 5 |
| 4.6 | 日志与可观测性监控 | Monitor system performance using logging and observability tools | ✓ | q095, q096, q097, q098, q099 | 5 |

## d5 治理、安全与风险管理 / Governance, Safety & Risk Management

| Objective | 中文标题 | 官方英文原文 | 笔记状态 | 题号列表 | 题数 |
| --- | --- | --- | --- | --- | --- |
| 5.1 | 护栏与安全控制 | Implement guardrails and safety controls | ✓ | q100, q101, q102, q103, q104, q105 | 6 |
| 5.2 | LLM 系统的风险、局限与失效模式 | Identify risks, limitations, and failure modes of LLM systems | ✓ | q106, q107, q108, q109, q110 | 5 |
| 5.3 | 人在回路验证策略 | Apply human-in-the-loop validation strategies | ✓ | q111, q112, q113, q114, q115 | 5 |
| 5.4 | 合规：GDPR / HIPAA / FedRAMP | Ensure compliance with regulations (e.g., GDPR, HIPAA, FedRAMP) | ✓ | q116, q117, q118, q119, q120, q121 | 6 |
| 5.5 | 伦理：偏见、公平、透明 | Address ethical AI considerations (bias, fairness, transparency) | ✓ | q122, q123, q124, q125, q126 | 5 |

## d6 干系人沟通与生命周期管理 / Stakeholder Communication & Lifecycle Management

| Objective | 中文标题 | 官方英文原文 | 笔记状态 | 题号列表 | 题数 |
| --- | --- | --- | --- | --- | --- |
| 6.1 | 结构化需求发现 | Conduct structured discovery and requirement gathering | ✓ | q127, q128, q129, q130, q131, q132 | 6 |
| 6.2 | 沟通架构决策与取舍 | Communicate architectural decisions and trade-offs | ✓ | q133, q134, q135, q136, q137 | 5 |
| 6.3 | 反馈闭环与预期对齐（含 SLA） | Manage stakeholder feedback loops and expectation alignment (including SLAs) | ✓ | q138, q139, q140, q141, q142, q143 | 6 |
| 6.4 | 架构文档与实施指导 | Document architectures and provide implementation guidance | ✓ | q144, q145, q146, q147, q148 | 5 |
| 6.5 | 支撑生命周期各阶段 | Support lifecycle phases (discovery, design, handoff, monitoring, iteration) | ✓ | q149, q150, q151, q152, q153 | 5 |

## d7 开发者生产力与运维赋能 / Developer Productivity & Operational Enablement

| Objective | 中文标题 | 官方英文原文 | 笔记状态 | 题号列表 | 题数 |
| --- | --- | --- | --- | --- | --- |
| 7.1 | 为团队配置 Claude 工具与环境（如 Claude Code） | Configure Claude tools and environments for teams (e.g., Claude Code) | ✓ | q178, q179, q180, q181, q182 | 5 |
| 7.2 | 用 AI 工具改进开发流程 | Improve developer workflows using AI-assisted tooling | ✓ | q183, q184, q185, q186 | 4 |
| 7.3 | 支持调试与运维问题排查 | Support debugging and operational issue resolution | ✓ | q187, q188, q189, q190 | 4 |
