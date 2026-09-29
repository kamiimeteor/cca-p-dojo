# 内容来源

查阅日期：2026-09-27。仅列实际查阅的官方文档；正文为原创归纳，不收录官方样题。

MCP 授权与传输条目按 2025-11-25 版核对，latest（2026-07-28）中上述断言仍然成立；这里只对正文涉及的授权、传输种类及 SSE 断言作此说明，不表示两个版本的全部行为相同。Claude Platform 文档使用 platform.claude.com。模型支持、批处理折扣及工具规模建议均按查阅日期记录；Contextual Retrieval 的数字仅代表原文实验。

各节标为「经验法则」的选型、控制设计与维护策略是工程判断，不是 Anthropic 的统一强制规定。

D1 的设计表、决策规则与题目信号是原创教学归纳；其中标注的经验法则不构成官方强制要求。1.4 的旧模型名仅用于还原 2025 年实验；1.6 的 SLA 度量是应用约定，不是 Anthropic 合同承诺。

## 1.1

- [https://www.anthropic.com/engineering/building-effective-agents](https://www.anthropic.com/engineering/building-effective-agents)：核实先采用最简单可行架构，以及单次调用、检索和示例通常已足够；不把建议写成强制流程。
- [https://platform.claude.com/docs/en/test-and-evaluate/develop-tests](https://platform.claude.com/docs/en/test-and-evaluate/develop-tests)：核实具体、可测、可实现、与业务相关的成功标准，代表性输入、边界样本及多维度评估。
- [https://platform.claude.com/docs/en/about-claude/models/choosing-a-model](https://platform.claude.com/docs/en/about-claude/models/choosing-a-model)：核实效率优先与能力优先两种模型选型起点；“架构简单”不推导为“总用最小模型”。
- [https://platform.claude.com/docs/en/models/overview](https://platform.claude.com/docs/en/models/overview)（2026-09-29 重新查阅）：核实当前主比较表为 Fable 5.1、Opus 5.5、Sonnet 5.5、Haiku 4.5，Sonnet 5 已列入旧型号（legacy，仍可用）；D1 不复述模型配置或 thinking 参数，避免越入 D2。
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

## D2 核对口径

D2 写作与查阅日期：2026-09-29。下列 URL 均在当日实际查阅；每条注明核实范围。模型、价格、窗口与 thinking/effort 的来源和日期也附在笔记对应段落或表头，表头出处适用于其每一行。当前主表使用 Sonnet 5.5；Sonnet 5 是不同的旧型号，不作为新型号的配置依据（1.x、3.3 已于 2026-09-29 统一到 Sonnet 5.5）。5.1 尚待写，本次仅添加专题导航。

## 2.1

- [models](https://platform.claude.com/docs/en/about-claude/models/overview)（查阅：2026-09-29）、[pricing](https://platform.claude.com/docs/en/about-claude/pricing)（查阅：2026-09-29）：核实当前主比较表四型号的定位、相对延迟、标准 API 输入／输出单价及窗口；金额为 USD / 百万 token，未外推到云平台、快速模式或总账单。
- [choose](https://platform.claude.com/docs/en/about-claude/models/choosing-a-model)（查阅：2026-09-29）：核实效率优先与能力优先的完整步骤（效率优化为可选）、两类适用情形、大多数工作负载从 Claude Opus 5.5 开始、好的评估集是判断是否升级或更换模型时最重要的一步、实际提示与数据评估，以及调 effort 往往比换模型更合适；该页也是 2.1 对比表定位的来源。
- [effort](https://platform.claude.com/docs/en/build-with-claude/effort)（查阅：2026-09-29）：核实五级 effort、三个支持型号的默认值及软指导性质；不把 max 解释为超越 max_tokens 硬上限。

## 2.2

- [prompt](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)（查阅：2026-09-29）：核实 system 角色、明确任务与输出格式、一致且有意义的 XML 标签及自然嵌套。旧 prompt-templates-and-variables 入口本次重定向到此页；变量替换与版本方案明标应用侧经验法则，示例为原创。
- [structured](https://platform.claude.com/docs/en/build-with-claude/structured-outputs)（查阅：2026-09-29）：核实 schema 约束与自然语言格式指令的区别；完整保留拒绝、max_tokens 截断、字符串 enum / const 大小写三类例外，参见 1.2。
- [contain](https://www.anthropic.com/engineering/how-we-contain-claude)（查阅：2026-09-29）、[engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)（查阅：2026-09-29）：核实模型行为引导与执行环境权限的区别、提示结构与内容分区；XML 及角色不构成授权。3.2 和 R.1 已复核，5.1 仅作安全专题导航，目前仍待写。

## 2.3

- [prompt](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)（查阅：2026-09-29）：核实 few-shot 的相关、多样（含边界）、结构化三项建议，3–5 示例为建议；thinking 下偏好一般推理指引的 often（往往）语气、示例可配合 thinking、手动 CoT 的关闭 thinking 前提。技术适用表为经验法则。
- [thinking](https://platform.claude.com/docs/en/build-with-claude/thinking)（查阅：2026-09-29）、[models](https://platform.claude.com/docs/en/about-claude/models/overview)（查阅：2026-09-29）：核实 Fable 5.1 / Opus 5.5 常开、Sonnet 5.5 的 between_tools 与 low/medium/high 条件、不接受其他 thinking 字段、disabled 返回 400、Haiku 4.5 手动 extended thinking；核实默认隐藏与摘要展示。3.3 已于 2026-09-29 按同一页面改为 Sonnet 5.5，与本节一致。
- [agents](https://www.anthropic.com/engineering/building-effective-agents)（查阅：2026-09-29）：核实 prompt chaining 跨调用传递结果、可加程序检查门、固定可分解任务与延迟取舍；架构展开参见 1.3。

## 2.4

- [context](https://platform.claude.com/docs/en/build-with-claude/context-windows)（查阅：2026-09-29）、[models](https://platform.claude.com/docs/en/about-claude/models/overview)（查阅：2026-09-29）：核实窗口含历史与输出、请求各类输入及本轮 thinking 的占用、缓存仍占窗口；2.1 四型号窗口与普通请求最大输出 128K / 64K 分开叙述。
- [count](https://platform.claude.com/docs/en/build-with-claude/token-counting)（查阅：2026-09-29）：核实 count_tokens 是输入估计；支持 client tools 与 advisor，其他 server tools、MCP connector、URL/file 图像或文档源不接受，base64 图像／PDF 可计数；实际请求 usage 用于核对。
- [prompt](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)（查阅：2026-09-29）：核实 20k+ 长输入中文档置于问题、指令、示例之前，多文档 XML 来源标记及先取引文。末尾查询的 up to 30% 为该页报告的测试上限，页面未给实验年份及完整设计，未当 SLA。
- [compact](https://platform.claude.com/docs/en/build-with-claude/compaction)（查阅：2026-09-29）、[editing](https://platform.claude.com/docs/en/build-with-claude/context-editing)（查阅：2026-09-29）：核实按需与阈值 compaction 均为 beta、可用时优先按需；context editing 的工具结果清除、thinking 清除、客户端 SDK compaction 三类内容，以及 beta header、完整客户端历史、缓存失效与 thinking 前缀校验风险。
- [engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)（查阅：2026-09-29）：核实压缩可能丢失细节，保存决策与未解决工作；具体裁剪清单与核验步骤标为经验法则。与 3.8 的按需加载边界已区分。

## 2.5

- [cache](https://platform.claude.com/docs/en/build-with-claude/prompt-caching)（查阅：2026-09-29）、[pricing](https://platform.claude.com/docs/en/about-claude/pricing)（查阅：2026-09-29）：核实前缀顺序、完全一致条件、自动／显式断点、最多四断点、TTL 从请求开始计时、命中刷新、混合 TTL 顺序、1.25×/2× 写入倍数与读取例外。逐型号核对标准 API 缓存价及最低长度：前三型 512、Haiku 4.5 为 4,096；未外推 Bedrock。
- [cache](https://platform.claude.com/docs/en/build-with-claude/prompt-caching)（查阅：2026-09-29）：核实低于最低长度不缓存且不报错、回溯只能找到此前实际写入的断点、未缓存输入与输出另计；q002 的静态前缀加缓存两项答案仍成立。
- [skills](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)（查阅：2026-09-29）：核实 SKILL.md frontmatter 的 name/description、正文与可选资源、元数据／正文／资源三级渐进加载，以及执行脚本时仅输出进入上下文、代码本身不进入；发现细节参见 3.8。
- [engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)（查阅：2026-09-29）、[context](https://platform.claude.com/docs/en/build-with-claude/context-windows)（查阅：2026-09-29）、[contain](https://www.anthropic.com/engineering/how-we-contain-claude)（查阅：2026-09-29）：支持模块内容分区、缓存不缩小窗口、Skills 不授予权限的边界。模块版本、确定组装顺序、回归及回退版本是本文经验法则；成本优化参见 4.5。

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
- [https://platform.claude.com/docs/en/build-with-claude/thinking](https://platform.claude.com/docs/en/build-with-claude/thinking)（2026-09-29 重新查阅）：按页面的逐模型配置表与正文核实 Opus 5.5、Fable 5.1 不可关闭 thinking；Sonnet 5.5 默认 adaptive thinking，`disabled` 返回 400，最低档 `between_tools` 仅在 effort `high` 及以下（low / medium / high）接受，关闭前置推理，仍返回工具间进度更新；Opus 4.7 默认关闭、设置 `adaptive` 才启用；手动 `enabled` + `budget_tokens` 在 Opus / Sonnet 4.6 为弃用状态、Opus 4.7 起返回 400，Haiku 4.5 仅支持 extended thinking。
- [https://platform.claude.com/docs/en/models/overview](https://platform.claude.com/docs/en/models/overview)（2026-09-29 重新查阅）：核实模型能力、速度与成本的选型维度；当前主表为 Fable 5.1、Opus 5.5、Sonnet 5.5、Haiku 4.5，thinking 行分别为 Adaptive（常开）、Adaptive（常开）、Adaptive、Extended。
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

## 4.1

D4 查阅日期：2026-09-29。以下指标口径、实验设计、诊断流程、监控阈值及题目信号为原创教学归纳，按正文标注区分官方机制与经验法则；不是 Anthropic 统一要求。D4 不新增当前型号表：当天官方选型页已列 Sonnet 5.5；3.3 已于 2026-09-29 同步为 Sonnet 5.5。

- [Define success criteria and build evaluations](https://platform.claude.com/docs/en/test-and-evaluate/develop-tests)：核实具体、可测、可实现、相关四项成功标准与多维评估；SMART 的时间限定、各指标分母和成本公式是本文度量约定，非该页的第五项官方要求。
- [Reducing latency](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-latency)：核实 TTFT 的起止点及它与完整输出的区别；任务总时长另计工具和重试，百分位、窗口按本文约定。
- [Mitigate jailbreaks and prompt injections](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/mitigate-jailbreaks)：核实带注入的文档、邮件、工具结果测试及持续分析；注入成功率公式为本文评估约定。
- [Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)：核实应做 / 不应做行为的双向评估；有害输出、拒答与过度拒答分开统计是据此采用的度量经验法则。

## 4.2

- [Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)：核实代码 / 模型 / 人工三类判分、outcome 与 trajectory、重复 trial、环境隔离、专家校准、线上线下互补；保留“通常更适合评产物”的条件语气。2026-01-09 博客的 20–50 个任务是早期评估起点建议，不是 A/B 显著性样本量或保证。
- [Define success criteria and build evaluations](https://platform.claude.com/docs/en/test-and-evaluate/develop-tests)（2026-09-29 重新查阅原始页面）：核实精确匹配、任务代表性（贴合真实任务分布）与边界输入；「Grade your evaluations」小节的 LLM-based grading 条目写明先测试可靠性再扩展（先验证 judge 可靠性再扩展），其后「Tips for LLM-based grading」写明使用详细、清晰的 rubric。留出测试集和对答案顺序 / 长度的偏差检查为本文评估设计。
- [Mitigate jailbreaks and prompt injections](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/mitigate-jailbreaks)：核实上线前对抗注入测试；常见、边界、对抗三类是本文的数据集分组，不冒充官方穷尽分类。

## 4.3

- [Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)：核实 A/B 测真实用户结果，与离线回归互补；显著性可能用数天或数周并依赖足够流量，不写成固定实验时长。样本量、统计把握度、效应与不确定性、预定停止判据都是通用实验经验法则，无虚构数值。
- [Define success criteria and build evaluations](https://platform.claude.com/docs/en/test-and-evaluate/develop-tests)：核实与基线 / 先前版本比较以及迭代测试。单变量、随机稳定分组、版本记录、有限放量、回滚边界是本文落地方案，不冒充该页规定。

## 4.4

- [Prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)：核实示例的相关性、多样性和结构化边界；指令冲突检查与六层排查表为本文诊断经验法则，未复述完整 prompting 指南。
- [Reduce hallucinations](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations)：核实三条基础策略：允许说「不知道」；用直接引用做事实依据，文档超过 20k tokens 时先抽取逐字引文再执行任务；用引文与来源逐项核验断言。核实这些措施不能完全消除幻觉；未把“缺证据”与所有幻觉原因等同。
- [Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)：核实读轨迹以区分系统与 grader 错误；2026 年博客记录 Opus 4.5 的 CORE-Bench 得分在修判分等问题、放宽 scaffold 后由 42% 到 95%，不是换模型实验，未外推。
- [Choosing the right model](https://platform.claude.com/docs/en/about-claude/models/choosing-a-model)：核实用实际任务、提示和数据评估能力、速度、成本；“模型能力不足 / 过剩”的诊断条件是本文推论，配置细节参见 3.3。
- [Contextual Retrieval](https://www.anthropic.com/engineering/contextual-retrieval)：核实召回候选后重排的顺序；据此区分缺证据、漏召回和候选排序问题，与 3.5 一致。

## 4.5

- [Prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching)：核实完全一致前缀、默认五分钟及命中刷新、按模型 / 平台的最低长度、复用输入而非答案。写入倍数为 1.25× / 2×；读取通常 0.1×，Fable 5.1 / Mythos 5.1 为 0.025×，Opus 5.5 为 0.05×，按 2026-09-29 页面保留例外，未推广成总费用降幅。
- [Thinking](https://platform.claude.com/docs/en/build-with-claude/thinking)、[Effort](https://platform.claude.com/docs/en/build-with-claude/effort) 与 [Choosing the right model](https://platform.claude.com/docs/en/about-claude/models/choosing-a-model)：核实 `output_config.effort`、软指导与硬上限区别及实测选型；沿用 3.3 已有的取舍说法，不新增各型号配置表。
- [Batch processing](https://platform.claude.com/docs/en/build-with-claude/batch-processing)：重查并沿用 3.3 的 50% 标准 API 收费、多数一小时内但不保证、24 小时未完成请求过期；不能当成实时 SLA。
- [Reducing latency](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-latency) 与 [Parallel tool use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/parallel-tool-use)：核实流式改善可见等待、控制句 / 段数、max_tokens 截断；完整保留独立只读“通常”可并行，以及副作用、共享状态、顺序要求“可能更适合”串行的条件。
- [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)：核实精简高信号上下文并保留任务信息，不能把最小上下文理解成越短越好；回归验证与成功任务成本核算为经验法则。

## 4.6

- [官方 Python SDK Usage 字段定义](https://raw.githubusercontent.com/anthropics/anthropic-sdk-python/main/src/anthropic/types/usage.py) 与 [Messages API 响应 usage](https://platform.claude.com/docs/en/api/http/messages/create)：2026-09-29 重新打开核实 `input_tokens`、`cache_creation_input_tokens`、`cache_read_input_tokens`、`output_tokens`；SDK 分别定义普通输入、缓存写入、缓存读取及输出用量，API 响应示例列出四个字段。对应事实 F108，输入总量与流式累计口径另见下列 caching / streaming 来源。
- [Stop reasons and fallback](https://platform.claude.com/docs/en/build-with-claude/handling-stop-reasons)：核实并列全该页七个 stop_reason 值及含义；停止原因不等于业务成功，截断与工具执行分别处置，正文未扩写 fallback 的型号限制。
- [Prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching)：核实总输入由普通输入、缓存写入、缓存读取三个用量字段相加，输出另计，不能只用 input_tokens 估算完整输入量。
- [Streaming messages](https://platform.claude.com/docs/en/build-with-claude/streaming)：核实 message_delta.usage 的 token 数是累计值；不能把每次累计数再次求和。
- [Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)：核实线上分布漂移监测、抽样轨迹复核、人工校准与离线回归互补；仪表盘分组、阈值 / 窗口 / 样本量 / 负责人、脱敏限权、样本回流均为本文执行经验法则，策略参见 3.4。

## R.1

干扰项名称、收紧后的定义及单标签优先级为本项目原创标注约定，不是官方分类。事实背景沿用 3.1–3.8 的对应来源；跨组织 agent-to-agent 的任务契约是本文经验法则，不声称某个 A2A 协议的字段或原生支持。

## D5 核实说明

查阅日期：2026-09-29。以下按 5.1–5.5 列出实际读取的官方来源与支持范围。所有发现／缓解流程、决策规则和题目信号均按正文区分官方条件与工程经验法则。

## 5.1

- [https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations)：核实允许不确定、>20k tokens 长文档先抽原文、逐项引用核验、四种进阶方法，以及无法彻底消除幻觉。
- [https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/increase-consistency](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/increase-consistency)：核实格式、预填充、示例、检索、复杂任务串联提示与保持角色六种一致性方法，以及严格 schema 的结构化输出建议；完整保留原页 Claude 4.6 及以后型号、Claude Mythos Preview 不支持预填充的条件，并在正文附 URL 和查阅日期。
- [https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/mitigate-jailbreaks](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/mitigate-jailbreaks)：核实直接与间接注入区分、直接攻击四类控制（含 system prompt 的伦理与法律边界及明确拒答方式）、间接攻击八项措施（自身指令放 tool_result 后的 user turn，支持的模型也可用对话中途 system 消息）、监控与组合防护；执行分层为经验法则。
- [https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-prompt-leak](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-prompt-leak)：核实优先筛查与后处理、上下文分离、最少机密、定期审计，复杂防漏提示的性能代价与无绝对保证。
- [https://www.anthropic.com/engineering/building-effective-agents](https://www.anthropic.com/engineering/building-effective-agents)：核实沙箱、护栏与人工检查点；执行前审批安排为经验法则。

## 5.2

- [https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations)：核实幻觉及残余风险；发现与缓解表是原创工程归纳。
- [https://platform.claude.com/docs/en/models/overview](https://platform.claude.com/docs/en/models/overview)：核实存在 reliable knowledge cutoff 与 training data cutoff；正文不新增型号、日期或配置对照表。
- [https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)：核实非确定性、重复 trial、轨迹与结果区分、人工校准；自报置信度不直接当校准概率为工程判断。
- [https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/mitigate-jailbreaks](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/mitigate-jailbreaks)：核实恶意用户输入及第三方文档、邮件、工具结果的注入风险与权限限制。
- [https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-prompt-leak](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-prompt-leak)：核实敏感提示泄露与输出筛查。
- [https://www.anthropic.com/engineering/building-effective-agents](https://www.anthropic.com/engineering/building-effective-agents)：核实自主 agent 的成本与错误累积、检查点及停止条件；预算和恢复流程明确标为经验法则。

## 5.3

- [https://www.anthropic.com/legal/aup](https://www.anthropic.com/legal/aup)：核实全部七类高风险用途（保留医疗中一般 wellness 例外）、直接影响个人的建议／推荐／主观决策的专业人工事前审核，以及直接展示输出时每会话披露条件。
- [https://www.anthropic.com/engineering/building-effective-agents](https://www.anthropic.com/engineering/building-effective-agents)：核实 agent 可在检查点或阻塞时请求人工反馈、设置停止条件；四类线上介入形式与审批版本绑定为经验法则。
- [https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)：核实人工评估成本与线上复核；风险分层、等待和改判度量是工程方案，与 4.2 评估用途区分。

## 5.4

- [https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng](https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng)：通过 Firecrawl 读取 EUR-Lex 原文：第5条全部原则、第12–22条主体权利、第25与32条按风险的假名化／必要数据／保存及访问控制、第44条跨境及后续转移；不添加法律实施细节。
- [https://commission.europa.eu/law/law-topic/data-protection/data-protection-explained_en](https://commission.europa.eu/law/law-topic/data-protection/data-protection-explained_en)：核实可重新识别的假名化数据仍为个人数据，不能把脱敏当作自动脱离 GDPR。
- [https://www.hhs.gov/hipaa/for-professionals/special-topics/health-information-technology/cloud-computing/index.html](https://www.hhs.gov/hipaa/for-professionals/special-topics/health-information-technology/cloud-computing/index.html)：核实 ePHI 云处理的业务伙伴身份、BAA 及客户自身适用义务。
- [https://www.hhs.gov/hipaa/for-professionals/security/laws-regulations/index.html](https://www.hhs.gov/hipaa/for-professionals/security/laws-regulations/index.html)：核实访问控制与记录／检查 ePHI 系统活动的审计控制。
- [https://platform.claude.com/docs/en/manage-claude/api-and-data-retention](https://platform.claude.com/docs/en/manage-claude/api-and-data-retention)：核实签 BAA + HIPAA-enabled 组织 + 合格功能；HIPAA readiness 不另要求 ZDR。ZDR 由客户申请、Anthropic 账户团队按组织开启，受功能、模型、违规标记及依法留存（legal hold）例外限制；正文不扩写其他平台覆盖。
- [https://platform.claude.com/docs/en/manage-claude/data-residency](https://platform.claude.com/docs/en/manage-claude/data-residency)：核实独立 inference geo / workspace geo；inference_geo 适用于 Claude API 和 Claude Platform on AWS 上的 Claude 4.6 及以上模型，值为 us 或 global；Bedrock 和 Google Cloud 由端点 URL 或 inference profile 决定推理区域，该参数不适用。workspace geo 当前仅 us，涉及静态存储和端点处理。
- [https://www.fedramp.gov/brand/fedramp-marketplace/marketplace-designations/](https://www.fedramp.gov/brand/fedramp-marketplace/marketplace-designations/)：核实现行 A/B/C/D 与旧 Ready/Low/Moderate/High 对照，以及 Class 表示评估材料深度而非产品安全等级。
- [https://www.fedramp.gov/notices/0008/](https://www.fedramp.gov/notices/0008/)：核实 FedRAMP certification 与机构 ATO 不同，机构仍评估材料并作运行授权。
- [https://support.claude.com/en/articles/13756069](https://support.claude.com/en/articles/13756069)：2026-09-29 打开 Public Sector FAQ，核实 FedRAMP High 的三条路径：Claude for Government、Amazon Bedrock in AWS GovCloud、Google Vertex AI with Assured Workloads。FedRAMP 与 DoD Impact Levels 认证云服务（IaaS／PaaS／SaaS）；模型是部署在获授权环境中的软件组件，客户通过托管平台维持合规状态。此条替换旧 Bedrock 公告来源。

## 5.5

- [https://www.nist.gov/news-events/news/2022/03/theres-more-ai-bias-biased-data-nist-report-highlights](https://www.nist.gov/news-events/news/2022/03/theres-more-ai-bias-biased-data-nist-report-highlights)：核实数据以外还存在人及制度偏见；数据／提示／评估三行是本笔记的排查视角，不冒充 NIST 官方分类。
- [https://www.anthropic.com/news/evaluating-and-mitigating-discrimination-in-language-model-decisions](https://www.anthropic.com/news/evaluating-and-mitigating-discrimination-in-language-model-decisions)：核实 2023 年 70 场景、系统改变人口属性、Claude 2.0 在部分条件下的正负歧视、提示缓解及不认可高风险自动决策的研究边界。
- [https://www.anthropic.com/legal/aup](https://www.anthropic.com/legal/aup)：核实面向消费者的聊天机器人与外部交互 agent 至少每次会话开始披露 AI 身份；高风险披露和审核参见 5.3。
- [https://airc.nist.gov/airmf-resources/airmf/3-sec-characteristics/](https://airc.nist.gov/airmf-resources/airmf/3-sec-characteristics/)：核实透明、解释、局限与公平性治理；展示来源、申诉及更正入口为工程经验法则。
- [https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)：核实判分校准与复核；分群指标、样本量和配对回归的具体安排为本文经验法则。
## 7.1

D7 查阅日期：2026-09-29。Claude Code 配置与行为以 code.claude.com 官方文档为准；正文以日期标注出处，完整 URL 见本文件。决策规则、题目信号、生产审批方案为经验法则。未引入模型型号、价格、thinking 或 effort 配置。

- [Settings files and precedence](https://code.claude.com/docs/en/settings)：核实用户、项目、本地、托管作用域与文件位置，加入命令行后的完整五层优先级；保留较低层严格安全值及环境变量逐键判断的例外，不把所有键概括为整文件覆盖。
- [Configure permissions](https://code.claude.com/docs/en/permissions)：核实权限列表默认合并，deny → ask → allow 的判定顺序、跨层 deny 的效力；未声称所有场景都合并，allowManagedPermissionRulesOnly 等托管限制另见官方页面。7.3 补充整工具 Bash ask 的沙箱例外。
- [How Claude remembers your project](https://code.claude.com/docs/en/memory)：核实组织、用户、项目、个人四层 CLAUDE.md 类文件、版本共享、祖先启动加载与子目录按需加载；上下文指令不强制授权，冲突指令不等于 settings 覆盖。
- [Connect Claude Code to tools via MCP](https://code.claude.com/docs/en/mcp)：核实三种安装作用域、local 默认、local/user 的 ~/.claude.json 与 project 的 .mcp.json；交互通常提示批准，-p/SDK/云会话不显示该提示。保留“通常”，因为页面还列出 bypassPermissions 加 skipDangerousModePermissionPrompt 的跳过条件。未扩写服务器来源去重优先级。
- [Deploy managed settings](https://code.claude.com/docs/en/managed-settings)：核实可统一分发 managed-settings.json 并用 /status 检查来源；这是文档提供的一种分发方式，不冒充全部托管机制枚举。

## 7.2

- [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices)：核实探索后计划再实现、明确小改可跳过计划、复现缺陷的失败测试、验证证据。笔记“探索 → 计划 → 实现 → 验证”为教学流程；官方四阶段为 Explore / Plan / Implement / Commit，验证位于实现阶段，正文已明确区分。
- [Common workflows](https://code.claude.com/docs/en/common-workflows)：核实检查生成的 PR、识别风险、测试目标行为与边界；合并/发布前人工门槛及断言复核为本文经验法则，5.3 是主题交叉引用。
- [Automate actions with hooks](https://code.claude.com/docs/en/hooks-guide)：核实命令型 hook 调用脚本，PostToolUse 的 Edit|Write matcher 可触发格式化，以及事后 hook 无法撤销既有动作；没有把 prompt/agent hooks 也称为确定性脚本。
- [Hooks reference](https://code.claude.com/docs/en/hooks)：核实 PreToolUse 的 hookSpecificOutput.permissionDecision: deny 可在工具运行前阻止调用，命令型 hooks 以用户完整权限执行。只讲 deny 这一用法，不把它冒充全部 decision 值清单。
- [Create custom subagents](https://code.claude.com/docs/en/sub-agents)：核实独立上下文与结果摘要、普通 subagent 新上下文、fork 继承对话的例外；工具访问另配，未声称上下文隔离就是安全沙箱。
- [Run Claude Code programmatically](https://code.claude.com/docs/en/headless)：核实 -p、--output-format json、--allowedTools 的自动批准语义；普通 -p 仍加载项目 hooks/MCP 且没有工作区信任或服务器批准提示。无人值守权限与凭证边界为本文经验法则。
- [CLI reference](https://code.claude.com/docs/en/cli-reference)：核实 `--allowedTools` 只自动批准匹配的工具调用，不构成完整工具白名单；限制可用工具应使用 `--tools`。
- [Agent SDK overview](https://code.claude.com/docs/en/agent-sdk/overview)：仅核实可在 Python / TypeScript 程序中使用 Agent SDK；未把 CLI 参数直接当作 SDK 字段。

## 7.3

- [Common workflows](https://code.claude.com/docs/en/common-workflows)：核实调试输入包括报错、复现命令、堆栈、复现步骤、偶发/稳定信息；证据表、一次一变量、回滚条件均为本文排障经验法则。
- [Run Claude Code programmatically](https://code.claude.com/docs/en/headless)：核实 stdin 管道输入日志并请求构建失败原因解释；没有声称模型解释已证实根因。
- [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices)：核实失败测试复现与测试输出验证，支持本文非生产复现和回归的教学流程。
- [Configure permissions](https://code.claude.com/docs/en/permissions)：核实执行端强制权限、CLAUDE.md 不改变授权、沙箱的操作系统边界；核实启用沙箱且 autoAllowBashIfSandboxed 默认为 true 时整工具 Bash ask 的替代机制、Plan 模式例外、内容限定 ask 与显式 deny 仍生效；针对关键路径的 `rm` / `rmdir` 仍走常规权限流程，不在沙箱内运行的命令（如 excluded commands）照常遵守整工具 `Bash` ask 规则。
- [Security](https://code.claude.com/docs/en/security)：核实手动模式的只读起点、显式授权和审查建议；生产只读凭证、脱敏、必要写操作人工审批与回滚方案为本文经验法则，不声称 Claude Code 自动识别生产环境或自带组织审批流程。4.4、4.6 与 5.3 的分工按本项目章节定义。
## 6.1

D6 查阅日期：2026-09-29。下列 URL 为本次实际查阅来源。发现问题、ADR 模板、受众沟通、服务约定、文档清单、阶段门禁及所有决策规则均为原创经验法则，不是 Anthropic 的统一流程或强制要求；本域不涉及具体模型型号或定价。

- [Prompt engineering overview](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview)：核实该指南的三项前提：明确成功标准、实测方法、待改进的初稿提示；缺少时建议先建立。不将指南前提扩张为所有项目的强制流程。
- [Define success criteria and build evaluations](https://platform.claude.com/docs/en/test-and-evaluate/develop-tests)：核实成功标准的四项特征：具体、可测、可实现、相关；也核实评估反映实际任务分布并考虑边界样本。问题陈述、约束和风险清单是本文的经验法则。

## 6.2

- [Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)：核实可在固定任务集上跟踪延迟、token、每任务成本、错误率。本文把成功任务成本、人工复核成本、受众分工和 ADR 的背景／选项／决策／后果结构标为经验法则；原文不规定该 ADR 模板。
- [Define success criteria and build evaluations](https://platform.claude.com/docs/en/test-and-evaluate/develop-tests)：核实任务相关的多维成功标准及质量、延迟、价格等考量；不把单一指标改善外推为整体达标。

## 6.3

- [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)：核实 SLI 为明确定义的量化指标、SLO 为由指标衡量的目标值或范围、SLA 包含目标达成或未达成的后果；后果不限于金钱。本节只引用术语定义，不声称 Google 为 LLM 规定质量条款。
- [Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)：核实输出在运行间变化，以及自动化评估（Automated evals）、生产监控、用户反馈、A/B、人工轨迹复核、系统化人工研究（Systematic human studies）的互补性；Step 1 支持把真实用户报告的失败转为测试用例。脱敏、优先级、渐进放量与 SLA 同时覆盖质量下限、延迟、可用性是本文经验法则，不是供应商合同承诺。

## 6.4

- [Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)：核实 Step 2：好的任务应让两位领域专家独立判断时得出相同的通过／失败结论；为每个任务准备参考解法有助于证明任务可解，并验证评分器配置正确。任务说明含糊带来指标噪声，评分准则含糊导致判定不一致；不把这些建议写成官方文档交付模板。
- [How we contain Claude across products](https://www.anthropic.com/engineering/how-we-contain-claude)：核实模型层控制影响行为倾向，环境访问边界约束可执行能力；支持“提示限制不能代替执行控制”。架构图、数据流、提示版本、工具权限、评估、运维手册和实施指导清单均为经验法则。

## 6.5

- [Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)：核实 Step 8 中评估集的持续维护与明确归属，以及发布前评估、上线后监控的互补作用。五阶段及各阶段产出、门禁、交接包、回滚演练与重新发现条件是本文经验法则；不声称官方规定了固定生命周期流程。
