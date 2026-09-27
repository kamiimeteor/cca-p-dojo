# 内容来源

查阅日期：2026-09-27。仅列实际查阅的官方文档；正文为原创归纳，不收录官方样题。

MCP 授权与传输条目按 2025-11-25 版核对，latest（2026-07-28）中上述断言仍然成立；这里只对正文涉及的授权、传输种类及 SSE 断言作此说明，不表示两个版本的全部行为相同。Claude Platform 文档使用 platform.claude.com。模型支持、批处理折扣及工具规模建议均按查阅日期记录；Contextual Retrieval 的数字仅代表原文实验。

各节标为「经验法则」的选型、控制设计与维护策略是工程判断，不是 Anthropic 的统一强制规定。

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
