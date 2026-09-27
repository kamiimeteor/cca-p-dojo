# 内容来源

查阅日期：2026-09-27。仅列实际查阅的官方文档；正文为原创归纳，不收录官方样题。

MCP 授权与传输条目按 2025-11-25 版核对，latest（2026-07-28）中上述断言仍然成立；这里只对正文涉及的授权、传输种类及 SSE 断言作此说明，不表示两个版本的全部行为相同。Claude Platform 文档使用 platform.claude.com。模型支持、批处理折扣及工具规模建议均按查阅日期记录；Contextual Retrieval 的数字仅代表原文实验。

各节标为「经验法则」的选型、控制设计与维护策略是工程判断，不是 Anthropic 的统一强制规定。

D1 的设计表、决策规则与题目信号是原创教学归纳；其中标注的经验法则不构成官方强制要求。1.4 的旧模型名仅用于还原 2025 年实验；1.6 的 SLA 度量是应用约定，不是 Anthropic 合同承诺。

## 1.1

- [https://www.anthropic.com/engineering/building-effective-agents](https://www.anthropic.com/engineering/building-effective-agents)：核实先采用最简单可行架构，以及单次调用、检索和示例通常已足够；不把建议写成强制流程。
- [https://platform.claude.com/docs/en/test-and-evaluate/develop-tests](https://platform.claude.com/docs/en/test-and-evaluate/develop-tests)：核实具体、可测、可实现、与业务相关的成功标准，代表性输入、边界样本及多维度评估。
- [https://platform.claude.com/docs/en/about-claude/models/choosing-a-model](https://platform.claude.com/docs/en/about-claude/models/choosing-a-model)：核实效率优先与能力优先两种模型选型起点；“架构简单”不推导为“总用最小模型”。
- [https://platform.claude.com/docs/en/models/overview](https://platform.claude.com/docs/en/models/overview)：核实当前主比较表为 Fable 5.1、Opus 5.5、Sonnet 5、Haiku 4.5；D1 不复述模型配置或 thinking 参数，避免越入 D2。
- [https://www.anthropic.com/engineering/how-we-contain-claude](https://www.anthropic.com/engineering/how-we-contain-claude)：核实模型指令与执行环境权限的边界；数据与人工复核的具体方案标为经验法则。

## 1.2

- [https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)：核实 client tools 由应用执行、server tools 由 Anthropic 执行，以及模型发出调用与实际执行的区别。
- [https://platform.claude.com/docs/en/build-with-claude/structured-outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs)：核实 JSON outputs / strict tool use 两种功能及拒绝、max_tokens、字符串 enum / const 大小写例外；网页抓取超时后实际读取同路径 .md 官方版本。
- [https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/mitigate-jailbreaks](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/mitigate-jailbreaks)：核实外部材料与工具结果的注入风险、输入检查和持续监控；不声称模型提示可替代权限控制。
- [https://www.anthropic.com/engineering/how-we-contain-claude](https://www.anthropic.com/engineering/how-we-contain-claude)：核实模型行为控制不能代替环境访问边界。
- [https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)：核实线上监控、用户反馈、人工复核与离线评估互补；样本回流、局部重试与回滚方案为经验法则。

## 1.3

- [https://www.anthropic.com/engineering/building-effective-agents](https://www.anthropic.com/engineering/building-effective-agents)：核实 augmented LLM 基础构件、workflow / agent 的控制流区别；完整列出五种 workflow 与 sectioning / voting 两种并行变体，保留固定子任务、延迟换准确率及条件性适用建议；核实 agent 的成本、错误累积与沙箱测试建议。
- [https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)：核实工具调用机制，辅助区分一次工具调用与整体自主控制流。

## 1.4

- [https://www.anthropic.com/engineering/multi-agent-research-system](https://www.anthropic.com/engineering/multi-agent-research-system)：核实 orchestrator-worker、委托边界、同步瓶颈、异步一致性与局部恢复；90.2%、4× / 15×、最多 90% 均注明历史实验背景，不当成 SLA；补充 BrowseComp 分析中 token 用量解释 80% 性能方差，以及不适用情形的 2025 年“目前”限定；官方委托建议包括目标、输出格式、工具与来源指引、任务边界。
- [https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)：核实独立上下文与摘要返回；上下文分工不是权限隔离。
- [https://www.anthropic.com/engineering/how-we-contain-claude](https://www.anthropic.com/engineering/how-we-contain-claude)：核实工具与环境权限须单独约束；共享产物版本与重派前查副作用为经验法则。

## 1.5

- [https://www.anthropic.com/engineering/building-effective-agents](https://www.anthropic.com/engineering/building-effective-agents)：核实链式步骤的程序检查门、独立并行、分工及增加复杂度需有收益的原则；三种分解维度是本文教学归纳。
- [https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)：核实 outcome 是环境最终状态、agent 自称完成不等于任务完成；分步验收须配合整体验收。
- [https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)：核实上下文容量与子任务隔离取舍；分片覆盖、契约与粒度选择均标为经验法则。

## 1.6

- [https://platform.claude.com/docs/en/test-and-evaluate/develop-tests](https://platform.claude.com/docs/en/test-and-evaluate/develop-tests)：核实多维业务成功标准，质量、价格、响应时间与 uptime 指标及延迟分布示例；正文 p95 / p99 为百分位定义，窗口和可用性口径为本文度量约定，非供应商合同。
- [https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-latency](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-latency)：核实 TTFT 与完整响应的区别、流式交付改善可见等待，不推导为完成 SLA 保证。
- [https://platform.claude.com/docs/en/build-with-claude/batch-processing](https://platform.claude.com/docs/en/build-with-claude/batch-processing)：核实按标准 API 价格 50% 收费、多数批次一小时内完成但不保证，以及 24 小时未完成请求过期。
- [https://platform.claude.com/docs/en/about-claude/models/choosing-a-model](https://platform.claude.com/docs/en/about-claude/models/choosing-a-model)：核实按任务能力、速度、成本选模型，以及多模型策略；该页明确建议调节 effort 往往比换模型更利于取舍。具体价值支柱到架构的对应为经验法则。
- [https://platform.claude.com/docs/en/build-with-claude/effort](https://platform.claude.com/docs/en/build-with-claude/effort)：核实支持该参数的模型可在模型内权衡能力、延迟和 token 成本，并应按任务评估；“往往比换模型更好”的直接出处是上方选型页，不冒充本页原句。
- [https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)：核实业务结果、延迟、token、成本及错误率应通过评估和生产反馈验证；不以 HTTP 成功或模型自述替代任务验收。

## 3.1

- [https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-search-tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-search-tool)：核实超过 30–50 个工具后选择准确率下降，以及 10+ 工具、定义超过 10,000 tokens 等建议使用条件。
- [https://www.anthropic.com/engineering/writing-tools-for-agents](https://www.anthropic.com/engineering/writing-tools-for-agents)：核实工具职责、描述质量、输入输出定义与评估驱动的工具设计。
- [https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)：核实工具膨胀、有限上下文、按需获取资料与子 agent 上下文分工。
- [https://www.anthropic.com/engineering/how-we-contain-claude](https://www.anthropic.com/engineering/how-we-contain-claude)：核实能力边界、最小权限、prompt injection、凭证隔离与租户防护。
- [https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools](https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools)：核实用户自定义 client tools 的 name、description、input_schema 字段。
- [https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)：核实用户自定义与 Anthropic 定义的 client tools 均由应用执行，server tools 由 Anthropic 执行，以及 tool_use / tool_result 交互。

## 3.2

- [https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization](https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization)：核实该版本受保护 HTTP MCP 的 OAuth 2.1、发现、PKCE、受众验证及禁止 token 透传；stdio 不适用此流程。按 2025-11-25 版核对，latest（2026-07-28）中上述断言仍然成立。
- [https://www.anthropic.com/engineering/how-we-contain-claude](https://www.anthropic.com/engineering/how-we-contain-claude)：核实能力边界、最小权限、prompt injection、凭证隔离与租户防护。
- [https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)：核实客户端工具由应用执行及 tool_use / tool_result 交互。
- [https://modelcontextprotocol.io/specification/latest/basic/authorization](https://modelcontextprotocol.io/specification/latest/basic/authorization)：实际解析到 2026-07-28；复核 HTTP / stdio 区分、OAuth 2.1、发现、目标受众和禁止 token 透传。
- [https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization/security-considerations](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization/security-considerations)：复核 latest 授权码保护中的 PKCE 要求。

## 3.3

- [https://platform.claude.com/docs/en/build-with-claude/effort](https://platform.claude.com/docs/en/build-with-claude/effort)：核实 output_config.effort 是质量、延迟与成本取舍的主要控制；支持的级别依模型而异。
- [https://platform.claude.com/docs/en/build-with-claude/adaptive-thinking](https://platform.claude.com/docs/en/build-with-claude/adaptive-thinking)：该官方入口重定向至 thinking-steering-and-cost；核实 adaptive thinking 由模型决定推理，effort 是软指导。
- [https://platform.claude.com/docs/en/build-with-claude/thinking-steering-and-cost](https://platform.claude.com/docs/en/build-with-claude/thinking-steering-and-cost)：核实 effort 不保证固定 token 数量；按任务评估推理投入。
- [https://platform.claude.com/docs/en/build-with-claude/thinking](https://platform.claude.com/docs/en/build-with-claude/thinking)：核实 Opus 5.5、Fable 5.1 不可关闭 thinking，Sonnet 5 可关闭，以及 Opus 4.7 的 adaptive 配置。
- [https://platform.claude.com/docs/en/models/overview](https://platform.claude.com/docs/en/models/overview)：核实模型能力、速度与成本的选型维度。
- [https://platform.claude.com/docs/en/build-with-claude/extended-thinking](https://platform.claude.com/docs/en/build-with-claude/extended-thinking)：核实手动 budget_tokens 模式在 4.6 的弃用、4.7 起的限制，以及 Haiku 4.5 仅支持 extended thinking。
- [https://platform.claude.com/docs/en/agents-and-tools/tool-use/parallel-tool-use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/parallel-tool-use)：核实多个工具调用的执行顺序由应用控制，独立读取可并行；依赖或共享写状态可能更适合串行，而非无条件强制。
- [https://platform.claude.com/docs/en/build-with-claude/streaming](https://platform.claude.com/docs/en/build-with-claude/streaming)：核实Messages API 流式增量交付；不将首响应等同任务完成。
- [https://platform.claude.com/docs/en/build-with-claude/batch-processing](https://platform.claude.com/docs/en/build-with-claude/batch-processing)：核实 Message Batches 的 50% 折扣、多数批次一小时内完成，以及 24 小时后未完成请求过期；一小时不是保证。
- [https://www.anthropic.com/engineering/contextual-retrieval](https://www.anthropic.com/engineering/contextual-retrieval)：核实块级上下文在 embedding 和 BM25 建索引前添加、混合召回、重排与分块取舍。
- [https://platform.claude.com/docs/en/test-and-evaluate/develop-tests](https://platform.claude.com/docs/en/test-and-evaluate/develop-tests)：核实代表性评估集、质量与延迟等成功标准，以及程序、人工和模型评分。
- [https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)：核实多次试验、执行轨迹和业务结果的区别，线上监控与人工校准。

## 3.4

- [https://www.anthropic.com/engineering/multi-agent-research-system](https://www.anthropic.com/engineering/multi-agent-research-system)：核实多 agent 委托开销、非确定性、生产 tracing 与隐私约束下的行为观测。
- [https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)：核实多次试验、执行轨迹和业务结果的区别，线上监控与人工校准。
- [https://platform.claude.com/docs/en/build-with-claude/handling-stop-reasons](https://platform.claude.com/docs/en/build-with-claude/handling-stop-reasons)：核实end_turn、max_tokens、tool_use 的含义及 HTTP 成功与任务完成的区别。
- [https://platform.claude.com/docs/en/build-with-claude/streaming](https://platform.claude.com/docs/en/build-with-claude/streaming)：核实Messages API 流式增量交付；不将首响应等同任务完成。
- [https://platform.claude.com/docs/en/test-and-evaluate/develop-tests](https://platform.claude.com/docs/en/test-and-evaluate/develop-tests)：核实代表性评估集、质量与延迟等成功标准，以及程序、人工和模型评分。

## 3.5

- [https://www.anthropic.com/engineering/contextual-retrieval](https://www.anthropic.com/engineering/contextual-retrieval)：核实各组合检索失败率相对下降 35% / 49% / 67%（共同基线 5.7%），以及原文实验 top-20 优于 top-10 / top-5；不外推为通用 top-k。
- [https://platform.claude.com/docs/en/build-with-claude/embeddings](https://platform.claude.com/docs/en/build-with-claude/embeddings)：核实文档与查询向量及相似度检索流程；兼容性与索引迁移建议注明为经验法则。
- [https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)：核实工具膨胀、有限上下文、按需获取资料与子 agent 上下文分工。

## 3.6

- [https://www.anthropic.com/engineering/contextual-retrieval](https://www.anthropic.com/engineering/contextual-retrieval)：核实块级上下文在 embedding 和 BM25 建索引前添加、混合召回、重排与分块取舍。
- [https://platform.claude.com/docs/en/build-with-claude/embeddings](https://platform.claude.com/docs/en/build-with-claude/embeddings)：核实文档与查询向量及相似度检索流程；兼容性与索引迁移建议注明为经验法则。
- [https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)：核实工具膨胀、有限上下文、按需获取资料与子 agent 上下文分工。
- [https://platform.claude.com/docs/en/build-with-claude/prompt-caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching)：核实稳定前缀匹配、输入处理复用、输出生成不变与缓存最低长度等适用条件。
- [https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)：核实客户端工具由应用执行及 tool_use / tool_result 交互。

## 3.7

- [https://modelcontextprotocol.io/docs/2026-07-28/learn/server-concepts](https://modelcontextprotocol.io/docs/2026-07-28/learn/server-concepts)：核实 tools / resources / prompts 的功能及模型 / 应用 / 用户控制划分；控制方不免除授权与监督。
- [https://modelcontextprotocol.io/docs/2026-07-28/learn/architecture](https://modelcontextprotocol.io/docs/2026-07-28/learn/architecture)：核实工具与资源的标准接口及客户端能力支持；不据此扩写新版本握手行为。
- [https://modelcontextprotocol.io/specification/2025-11-25/basic/transports](https://modelcontextprotocol.io/specification/2025-11-25/basic/transports)：核实该版本 stdio、Streamable HTTP，以及后者替代旧 HTTP+SSE 且可使用 SSE。按 2025-11-25 版核对，latest（2026-07-28）中上述断言仍然成立。
- [https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization](https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization)：核实该版本受保护 HTTP MCP 的 OAuth 2.1、发现、PKCE、受众验证及禁止 token 透传；stdio 不适用此流程。按 2025-11-25 版核对，latest（2026-07-28）中上述断言仍然成立。
- [https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)：核实客户端工具由应用执行及 tool_use / tool_result 交互。
- [https://www.anthropic.com/engineering/multi-agent-research-system](https://www.anthropic.com/engineering/multi-agent-research-system)：核实多 agent 委托开销、非确定性、生产 tracing 与隐私约束下的行为观测。
- [https://modelcontextprotocol.io/specification/latest/basic/authorization](https://modelcontextprotocol.io/specification/latest/basic/authorization)：实际解析到 2026-07-28；复核 HTTP / stdio 区分、OAuth 2.1、发现、目标受众和禁止 token 透传。
- [https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization/security-considerations](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization/security-considerations)：复核 latest 授权码保护中的 PKCE 要求。
- [https://modelcontextprotocol.io/specification/latest/basic/transports](https://modelcontextprotocol.io/specification/latest/basic/transports)：实际解析到 2026-07-28；复核 stdio 与 Streamable HTTP。
- [https://modelcontextprotocol.io/specification/2026-07-28/basic/transports/streamable-http](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports/streamable-http)：复核 SSE 响应及旧 HTTP+SSE 已弃用、应迁移到 Streamable HTTP；未把新版通知或握手机制混入正文。

## 3.8

- [https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)：核实name / description → SKILL.md 正文 → 引用文件的渐进披露。
- [https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-search-tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-search-tool)：核实按需发现与 defer_loading 的上下文行为；客户端自定义工具定义仍随请求提交。
- [https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)：核实工具膨胀、有限上下文、按需获取资料与子 agent 上下文分工。
- [https://platform.claude.com/docs/en/build-with-claude/prompt-caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching)：核实稳定前缀匹配、输入处理复用、输出生成不变与缓存最低长度等适用条件。
- [https://www.anthropic.com/engineering/multi-agent-research-system](https://www.anthropic.com/engineering/multi-agent-research-system)：核实多 agent 委托开销、非确定性、生产 tracing 与隐私约束下的行为观测。

## R.1

干扰项名称、收紧后的定义及单标签优先级为本项目原创标注约定，不是官方分类。事实背景沿用 3.1–3.8 的对应来源；跨组织 agent-to-agent 的任务契约是本文经验法则，不声称某个 A2A 协议的字段或原生支持。
