/* 英文内容按 id 覆盖中文骨架。 */
const CONTENT_EN = {
  "domains": {
    "d1": {
      "zh": "Solution Design & Architecture",
      "blurb": ""
    },
    "d2": {
      "zh": "Claude Models, Prompting & Context Engineering",
      "blurb": ""
    },
    "d3": {
      "zh": "Integration",
      "blurb": ""
    },
    "d4": {
      "zh": "Evaluation, Testing & Optimization",
      "blurb": ""
    },
    "d5": {
      "zh": "Governance, Safety & Risk Management",
      "blurb": ""
    },
    "d6": {
      "zh": "Stakeholder Communication & Lifecycle Management",
      "blurb": ""
    },
    "d7": {
      "zh": "Developer Productivity & Operational Enablement",
      "blurb": ""
    },
    "ref": {
      "zh": "Appendix",
      "blurb": ""
    }
  },
  "sections": {
    "1.1": {
      "title": "Translate business problems into Claude-based AI solutions",
      "blocks": [
        {
          "v": "Decide whether an LLM is needed, then define a task with acceptance criteria, constraints, and a failure path.",
          "title": "What this objective tests"
        },
        {
          "head": [
            "Requirement (engineering heuristics)",
            "Design and acceptance"
          ],
          "rows": [
            [
              "Rules fully describe the task",
              "Use ordinary code for tax calculations and fixed field validation. Claude can explain the result while code remains responsible for arithmetic."
            ],
            [
              "Unstructured language needs interpretation",
              "Turn “improve support efficiency” into ticket classification, evidence lookup, and response drafting. Check classification accuracy, supporting evidence, and editing effort separately."
            ],
            [
              "Success criteria",
              "Specify the input distribution, expected outcome, evaluation set, quality floor, completion deadline, and cost per successful task. Compare with the existing process."
            ]
          ]
        },
        {
          "v": "Constraint checklist (engineering heuristics): check data access and freshness, sensitive-data minimization, storage location and retention, latency and cost budgets, consequences of errors, and ownership of exceptions and required approvals. Test representative inputs alongside missing, ambiguous, and out-of-scope inputs. Resolve missing evidence or acceptance criteria before expanding the design."
        },
        {
          "v": "Anthropic recommends starting with the simplest viable design; for many applications, optimizing a single call with retrieval and examples in context is usually sufficient. Architectural simplicity does not require the smallest model. The model-selection guide offers both efficiency-first and capability-first starting points, to be tested on actual tasks."
        },
        {
          "v": [
            "If deterministic software already meets the need → keep it, because generated output adds no necessary capability.",
            "If the task requires grounded language interpretation or generation → start with one call to establish quality and cost baselines.",
            "If enterprise knowledge is missing → evaluate context provision or retrieval, because autonomous loops cannot substitute for evidence.",
            "If errors have serious consequences and acceptance is unreliable → limit the system to drafts for human review, because unverified results should not trigger execution."
          ],
          "title": "Decision rules (engineering heuristics)"
        },
        {
          "v": [
            "Choose an agent framework before defining the need: there is no demonstrated benefit for the complexity.",
            "Ask for “better answers” without a rubric: nobody can determine whether the result passes.",
            "Treat one polished demo as an evaluation: it does not cover production inputs or failure paths."
          ],
          "title": "Common traps"
        },
        {
          "head": [
            "Scenario signal",
            "Preferred direction"
          ],
          "rows": [
            [
              "Exact calculation or fixed rules",
              "Conventional software"
            ],
            [
              "Classification, summaries, drafts",
              "Evaluate a single call first"
            ],
            [
              "Missing internal knowledge",
              "Provide authorized data and evidence"
            ],
            [
              "High cost of errors",
              "Limit automated execution"
            ],
            [
              "Only “improve efficiency” is specified",
              "Define tasks and baseline metrics"
            ]
          ]
        }
      ]
    },
    "1.2": {
      "title": "Design end-to-end architectures (input → processing → output → feedback loops)",
      "blocks": [
        {
          "v": "Define interfaces, checks, and failure paths for input, processing, output, and feedback so a local error does not propagate into business execution.",
          "title": "What this objective tests"
        },
        {
          "head": [
            "Layer",
            "Responsibilities and failure isolation (engineering heuristics)"
          ],
          "rows": [
            [
              "Input",
              "Validate format, clean corrupted text, redact sensitive data, and assemble authorized context. Return incomplete inputs for clarification; quarantine external material containing injected instructions."
            ],
            [
              "Processing",
              "Select the model, retrieve evidence, and call tools. Missing evidence triggers further lookup or human review. Bound timeouts and retries; check execution state before retrying writes."
            ],
            [
              "Output",
              "Pass structured results to application checks for factual support, business rules, and authorization. Block invalid results and require approval for high-risk actions according to policy."
            ],
            [
              "Feedback",
              "Link user feedback to task outcomes, latency, and cost. Review and redact failures before adding them to evaluations; run regression checks before release and consider rollback if quality declines."
            ]
          ]
        },
        {
          "v": "Tool execution has explicit boundaries: client tools run in the application, while server tools run at Anthropic. A requested call is not proof of completion; custom business tools still need authorization at execution. Retrieved text and tool results are untrusted input, and prompt instructions do not replace access control."
        },
        {
          "v": "Structured outputs provides JSON outputs for response formatting and strict tool use for tool names and inputs. Handle `refusal`, `max_tokens`, and the documented casing exception for string `enum` / `const` values. A format constraint does not establish factual correctness. Source: Anthropic Structured outputs, checked 2026-09-27."
        },
        {
          "v": [
            "If source material is missing or stale → fix ingestion and retrieval, because changing models cannot repair the source.",
            "If downstream code requires stable fields → combine structured outputs with business validation, because parsing and authorizing execution are separate checks.",
            "If a tool fails → isolate the step and report its state, because guessing silently can fabricate success.",
            "If production feedback worsens → review examples and run regression evaluations, because votes and complaints are not ground-truth labels."
          ],
          "title": "Decision rules (engineering heuristics)"
        },
        {
          "v": [
            "Check only HTTP success: the response may contain a refusal or incomplete output.",
            "Restart the entire chain after failure: completed writes may run twice.",
            "Feed raw feedback into training or reference answers: noise and sensitive information remain unchecked."
          ],
          "title": "Common traps"
        },
        {
          "head": [
            "Scenario signal",
            "Preferred direction"
          ],
          "rows": [
            [
              "Corrupted text or missing fields",
              "Validate and repair input"
            ],
            [
              "An answer without supporting evidence",
              "Inspect retrieval and avoid guessing"
            ],
            [
              "Valid JSON, incorrect amount",
              "Validate business semantics"
            ],
            [
              "Tool timeout with unknown write status",
              "Check state before retrying"
            ],
            [
              "Complaints rise after release",
              "Review feedback → regressions → fix or rollback"
            ]
          ]
        }
      ]
    },
    "1.3": {
      "title": "Select appropriate architectural patterns (workflow, agentic, augmented LLM)",
      "blocks": [
        {
          "v": "Choose by control flow: use a workflow for paths prescribed in code; consider an agent when the model must choose subsequent actions from feedback.",
          "title": "What this objective tests"
        },
        {
          "v": "An augmented LLM adds capabilities such as retrieval, tools, and memory. It is a building block for both workflows and agents, not a mutually exclusive architecture tier. One tool call does not establish that the whole system is autonomous. The taxonomy below follows Anthropic’s Building effective agents."
        },
        {
          "head": [
            "Workflow pattern",
            "Mechanism and fit"
          ],
          "rows": [
            [
              "Prompt chaining",
              "Pass output through successive steps, with optional programmatic gates. Fits tasks that break cleanly into fixed subtasks, trading latency for higher accuracy."
            ],
            [
              "Routing",
              "Classify input and dispatch to a specialized path. Works well when categories are distinct, benefit from separate handling, and can be classified accurately."
            ],
            [
              "Parallelization",
              "Sectioning runs independent subtasks concurrently; voting aggregates repeated attempts at the same task."
            ],
            [
              "Orchestrator-workers",
              "A central LLM assigns subtasks and combines results. Unlike fixed parallelization, the subtasks depend on the input."
            ],
            [
              "Evaluator-optimizer",
              "Alternate generation and evaluation feedback. Particularly effective when criteria are clear and revision provides measurable value."
            ]
          ]
        },
        {
          "v": "Agents suit open-ended tasks whose steps cannot be specified in advance. Anthropic notes that agentic systems often exchange latency and cost for better performance; autonomy adds cost and can compound errors, so it recommends extensive sandbox testing and suitable guardrails. Engineering heuristic: evaluate a simple design first; set budgets, stopping conditions, and human handoff. Dynamic delegation can sit within a prescribed workflow, so an LLM planner does not make all control flow autonomous."
        },
        {
          "v": [
            "If steps are stable and must run consistently → choose a workflow with explicit stage checks.",
            "If the only gap is knowledge or tools → an augmented LLM with retrieval, tools, or memory may suffice without adding a workflow or agent, because a capability gap alone does not establish a need for additional orchestration.",
            "If discoveries keep changing the task → consider an agent, because a fixed path may not cover the required actions.",
            "If subtasks become clear only after input arrives → consider orchestrator-workers, because fixed partitions may omit needed work."
          ],
          "title": "Decision rules (engineering heuristics)"
        },
        {
          "v": [
            "Call every sequence of model calls an agent: this ignores who controls execution.",
            "Confuse voting with sectioning: one repeats the task; the other divides the work.",
            "Revise repeatedly without evaluation criteria: rewrites may add no quality."
          ],
          "title": "Common traps"
        },
        {
          "head": [
            "Scenario signal",
            "Preferred direction"
          ],
          "rows": [
            [
              "Fixed stages with acceptance gates",
              "Prompt chaining"
            ],
            [
              "Request categories need specialized paths",
              "Routing"
            ],
            [
              "Independent partitions / repeated judgments",
              "Sectioning / voting"
            ],
            [
              "Subtasks depend on the input",
              "Orchestrator-workers"
            ],
            [
              "Clear criteria and useful revision feedback",
              "Evaluator-optimizer"
            ],
            [
              "Discoveries determine the next action",
              "Agent with budgets and stopping conditions"
            ]
          ]
        }
      ]
    },
    "1.4": {
      "title": "Design multi-agent systems and orchestration strategies",
      "blocks": [
        {
          "v": "Multiple agents suit independent exploration and separate contexts when the benefits justify token and coordination costs.",
          "title": "What this objective tests"
        },
        {
          "head": [
            "Orchestration element",
            "Design boundary"
          ],
          "rows": [
            [
              "Orchestrator-worker",
              "A lead agent plans, delegates, and synthesizes results. Subagents explore in separate contexts and return summaries with evidence."
            ],
            [
              "Delegation guidance (Anthropic)",
              "Define the objective, output format, tool and source guidance, and task boundaries. Engineering heuristics: also assign acceptance checks, ownership, deadlines, and budgets."
            ],
            [
              "Coordination (engineering heuristics)",
              "Let the lead track assignments and resolve conflicting evidence. Identify and version shared artifacts; avoid concurrent changes to the same state where possible."
            ]
          ]
        },
        {
          "v": "Anthropic’s 2025 research-system blog reported a 90.2% improvement over a single Opus 4 on its internal research evaluation using an Opus 4 lead and Sonnet 4 subagents. In its BrowseComp analysis, token usage alone explained 80% of the performance variance. Agents used roughly 4× chat tokens and multi-agent systems roughly 15×; parallelization reduced research time by up to 90% on complex queries. These are historical findings, not current model recommendations, universal cost multipliers, or SLAs."
        },
        {
          "v": "Failure handling (engineering heuristics): preserve checkpoints and completed results; bound retries for failed subtasks and inspect side effects before reassigning work. Flag missing required evidence or escalate. Synchronous aggregation can wait for the slowest worker; asynchronous execution can reduce waiting but needs handling for late results, state consistency, and error propagation. Separate contexts do not enforce separate permissions."
        },
        {
          "v": [
            "If valuable research has independent directions → evaluate multiple agents for parallel exploration and separate contexts.",
            "If agents need extensive shared context or tasks have tight dependencies → prefer one agent or a sequential workflow, because handoffs require repeated synchronization; the source’s assessment of poor fit was a 2025 observation.",
            "If the work is fixed independent queries → try parallel tools or calls first; autonomous subagents may add no value.",
            "If one subtask fails → retain accepted results and recover locally, because restarting everything repeats costs and possible side effects."
          ],
          "title": "Decision rules (engineering heuristics)"
        },
        {
          "v": [
            "Assume more agents are always better: delegation and synthesis also consume tokens.",
            "Give every subagent the full history: this undermines the context split.",
            "Present partial successes as a complete answer: required branches may still lack evidence."
          ],
          "title": "Common traps"
        },
        {
          "head": [
            "Scenario signal",
            "Preferred direction"
          ],
          "rows": [
            [
              "Valuable, independent research directions",
              "Evaluate parallel subagents"
            ],
            [
              "Shared state and tight dependencies",
              "Prefer one agent or a sequential workflow, based on the 2025 observations"
            ],
            [
              "Duplicate searches or missing scope",
              "Clarify delegation contracts"
            ],
            [
              "One failure restarts everything",
              "Checkpoints and local recovery"
            ],
            [
              "Stragglers and late results",
              "Weigh synchronous and asynchronous coordination"
            ]
          ]
        }
      ]
    },
    "1.5": {
      "title": "Apply decomposition techniques for complex problem solving",
      "blocks": [
        {
          "v": "Decompose around dependencies, require a verifiable result from each subtask, and check that the combined result meets the original objective.",
          "title": "What this objective tests"
        },
        {
          "head": [
            "Decomposition method (engineering heuristics)",
            "Fit and acceptance"
          ],
          "rows": [
            [
              "By step",
              "An earlier result feeds the next stage, such as requirements → proposal → validation. Add gates so invalid input does not propagate."
            ],
            [
              "By data partition",
              "Assign independent records by document or entity. Use a common output schema; verify coverage, duplicates, and aggregation while preserving links across partitions."
            ],
            [
              "By expertise",
              "Assign security, data, or performance analysis. Each result includes evidence and impact; a synthesizer resolves conflicts and constraints spanning specialties."
            ]
          ]
        },
        {
          "v": "Subtask contract (engineering heuristics): define inputs, outputs, dependencies, sources, completion checks, and failure states. Check summaries for required facts, extraction against source fields, and code with behavioral tests. Passing subtasks still need an integration check for objective coverage, compatible results, and the final business state. An agent’s completion claim is insufficient."
        },
        {
          "v": "Granularity trade-offs (engineering heuristics): small subtasks make failures easier to locate but add calls, repeated context, and merge costs. Sequential stages add waiting; parallel branches still need required results and aggregation. Larger tasks reduce handoffs but may combine unrelated requirements. Map dependencies and measure quality, completion latency, and total cost. Keep work together when it requires repeated sharing of the full context, has no meaningful subtask checks, or already passes in one call."
        },
        {
          "v": [
            "If a later stage needs an earlier conclusion → decompose sequentially with gates, because early parallel execution lacks settled inputs.",
            "If records are independent and aggregation is defined → partition the data, because coverage remains verifiable after parallel work.",
            "If one object needs several specialist reviews → divide by expertise, because each perspective has distinct checks.",
            "If partitioning loses relationships or costs exceed benefits → use fewer parts, because locally correct results may not combine correctly."
          ],
          "title": "Decision rules (engineering heuristics)"
        },
        {
          "v": [
            "Split every task by fixed text length: this may sever entity and constraint relationships.",
            "Create an agent for every small step: ordinary calls can perform decomposition without autonomous planning.",
            "Release once every subtask passes: integration failures and merge conflicts remain unchecked."
          ],
          "title": "Common traps"
        },
        {
          "head": [
            "Scenario signal",
            "Preferred direction"
          ],
          "rows": [
            [
              "Explicit ordering dependencies",
              "Sequential decomposition with gates"
            ],
            [
              "Many independent records",
              "Partition data and verify coverage"
            ],
            [
              "Different security and performance perspectives",
              "Specialist decomposition and conflict resolution"
            ],
            [
              "Relationships repeatedly lost across partitions",
              "Revise boundaries or keep the task whole"
            ],
            [
              "Calls grow without quality gains",
              "Merge overly small subtasks"
            ]
          ]
        }
      ]
    },
    "1.6": {
      "title": "Align solutions to business value pillars (efficiency, transformation, productivity, cost, performance SLAs)",
      "blocks": [
        {
          "v": "Connect architecture choices to business outcomes and demonstrate gains within quality floors and service commitments. Communication methods belong in D6.",
          "title": "What this objective tests"
        },
        {
          "head": [
            "Value pillar",
            "Metric → design (engineering heuristics)"
          ],
          "rows": [
            [
              "Efficiency",
              "Cycle time, waiting, and rework → classification, extraction, and fixed workflows; verify that process time actually falls."
            ],
            [
              "Transformation",
              "Coverage, adoption, and successful delivery of previously impractical services → pilot a new service; evaluate agents only if it needs dynamic exploration."
            ],
            [
              "Productivity",
              "Accepted output per person per unit of time and review effort → drafting and coding assistance; subtract correction effort rather than count generated volume."
            ],
            [
              "Cost",
              "Total cost per successful task → routing, input reuse, and batches; include tools, retries, human work, and operations. Where effort is supported, tuning it is often a better way to manage the trade-off than changing models, according to Anthropic’s model-selection guide."
            ],
            [
              "Performance SLAs",
              "End-to-end latency percentiles, availability, and a quality floor → bound the call chain, configure timeouts and fallback, provision capacity, and validate under load."
            ]
          ]
        },
        {
          "v": "SLA measurement convention (engineering heuristic): p95 and p99 are the 95th and 99th latency percentiles. Define the window, traffic population, and treatment of failures. Availability can use the fraction of eligible requests served successfully; check the quality floor separately. These are application metrics, not claimed Anthropic contract terms. Measure first-token latency separately from task completion; streaming can improve visible responsiveness without proving the completion deadline is met."
        },
        {
          "v": "Cost mechanism: Message Batches charges 50% of standard API prices. Most batches finish within an hour, but that is not guaranteed; requests still unfinished at 24 hours expire. This fits deferrable offline work, not an immediate-response SLA. Source: Anthropic Batch processing, checked 2026-09-27."
        },
        {
          "v": [
            "If the goal is a shorter process → locate waiting and rework first, because a faster model may not shorten the whole process.",
            "If the goal is lower unit cost → compare total cost per successful task, because retries and review can cancel a lower API price.",
            "If faster delivery must preserve a quality floor → test both, because removing required checks creates misleading gains.",
            "If the goal is a new business capability → pilot adoption and delivery, because agent count is not a transformation metric."
          ],
          "title": "Decision rules (engineering heuristics)"
        },
        {
          "v": [
            "Use average latency alone: it cannot establish compliance for slow requests.",
            "Count HTTP 200 as accepted delivery: the task may be incomplete or the content unacceptable.",
            "Treat fewer tokens as the same reduction in total cost: this omits human work, tools, and failures."
          ],
          "title": "Common traps"
        },
        {
          "head": [
            "Scenario signal",
            "Preferred direction"
          ],
          "rows": [
            [
              "Shorter ticket handling cycle",
              "Efficiency: cycle time and rework"
            ],
            [
              "A previously impractical new service",
              "Transformation: adoption and successful delivery"
            ],
            [
              "More accepted output per person",
              "Productivity: output after review effort"
            ],
            [
              "Large offline volume with flexible timing",
              "Cost: evaluate batching"
            ],
            [
              "Slow requests time out or service is unstable",
              "SLA: assess percentiles, availability, and quality together"
            ]
          ]
        }
      ]
    },
    "2.1": {
      "title": "Select appropriate Claude models based on trade-offs",
      "blocks": [
        {
          "v": "(TODO)"
        }
      ]
    },
    "2.2": {
      "title": "Design system prompts, templates, and guardrails",
      "blocks": [
        {
          "v": "(TODO)"
        }
      ]
    },
    "2.3": {
      "title": "Apply prompt engineering techniques (zero-shot, few-shot, chain-of-thought)",
      "blocks": [
        {
          "v": "(TODO)"
        }
      ]
    },
    "2.4": {
      "title": "Optimize context windows and manage token usage",
      "blocks": [
        {
          "v": "(TODO)"
        }
      ]
    },
    "2.5": {
      "title": "Implement prompt reuse strategies (caching, modular prompts, Skills)",
      "blocks": [
        {
          "v": "(TODO)"
        }
      ]
    },
    "3.1": {
      "title": "Evaluate tool/agent configuration for capability bloat",
      "blocks": [
        {
          "v": "Choose the smallest capability set that serves the task, remove unnecessary tools and permissions, and control the capabilities that remain.",
          "title": "What this objective tests"
        },
        {
          "head": [
            "Concept",
            "Purpose and limit"
          ],
          "rows": [
            [
              "Capability bloat",
              "Tool count itself can reduce selection accuracy: Anthropic’s Tool search documentation reports a decline beyond 30–50 available tools. Overlap and vague descriptions add confusion. This range does not guarantee safety below it."
            ],
            [
              "Least privilege",
              "Expose only the actions and data the task needs. Hiding a tool name does not enforce access control."
            ],
            [
              "Prevention and compensation",
              "Removing an unnecessary write permission blocks that write path. Logs detect problems; approval can gate execution, but leaves the excess capability available."
            ]
          ]
        },
        {
          "v": "User-defined client tools specify `name`, `description`, and `input_schema`; the model requests calls and the application runs them. Anthropic-defined client tools use Anthropic’s schema and also run in the application. Server tools run at Anthropic. Describe custom tools’ conditions, inputs, and side effects. As a heuristic, consolidate overlapping roles and assign tools and permissions by role."
        },
        {
          "v": "Anthropic recommends evaluating tool search when any condition applies: 10+ tools, definitions exceeding 10,000 tokens, declining selection accuracy as tools increase, multiple MCP servers with 200+ tools, or a growing catalog. These are adoption guidelines, not mandatory cutoffs. Source: Anthropic Tool search, checked 2026-09-27."
        },
        {
          "v": [
            "If support only reads orders → expose a read-only order tool, because cancellation and refunds are outside the task.",
            "If tools are frequently confused → remove redundant entry points and clarify descriptions, because extra approvals do not resolve ambiguity.",
            "If roles need different actions → assign separate toolsets and permissions, because shared admin access broadens the damage a mistake can cause.",
            "If a necessary operation is high risk → validate and gate execution, because the remaining capability still carries risk."
          ],
          "title": "Decision rules (engineering heuristics)"
        },
        {
          "v": [
            "Give every agent every tool and add monitoring: the unnecessary capability remains available.",
            "Rename tools without clarifying them: ambiguous inputs and overlapping responsibilities remain.",
            "Replace permission removal with approval prompts: a prompt may block one action, but does not remove capability bloat."
          ],
          "title": "Common traps"
        },
        {
          "head": [
            "Scenario signal",
            "Preferred direction"
          ],
          "rows": [
            [
              "A read-only task can delete data",
              "Remove write tools and underlying write access"
            ],
            [
              "Several tools perform the same action",
              "Consolidate and clarify"
            ],
            [
              "Roles require different permissions",
              "Separate toolsets by role"
            ],
            [
              "The proposal only adds alerts or reviews",
              "Check whether excess capability remains"
            ]
          ]
        }
      ]
    },
    "3.2": {
      "title": "Analyze authentication and authorization requirements to identify security gaps",
      "blocks": [
        {
          "v": "Check identity and permissions at every boundary between the user, agent, MCP server, and downstream service.",
          "title": "What this objective tests"
        },
        {
          "head": [
            "Identity model",
            "Boundary"
          ],
          "rows": [
            [
              "User delegation",
              "Act for the current user, subject to application policy and resource permissions."
            ],
            [
              "Service account",
              "Act for an application in background work. Limit its role; do not treat it as permission to access every user’s data."
            ],
            [
              "Credential handling",
              "Keep credentials in a trusted execution layer that attaches them to requests. Exclude them from prompts, tool results, model context, and unredacted logs."
            ]
          ]
        },
        {
          "v": "Under MCP’s 2025-11-25 authorization specification, a protected HTTP server is an OAuth 2.1 resource server. Clients discover its authorization server through Protected Resource Metadata and use PKCE for the authorization code flow. Servers validate token audience and must not pass the incoming token through to downstream services. This authorization flow does not apply to stdio."
        },
        {
          "v": [
            "If a request acts for a user → use delegation and check the operation, resource, and tenant on every call, because login does not grant universal access.",
            "If work runs unattended → use a restricted service account, because permissions should match the application’s job.",
            "If a tool result contains instructions to exceed permissions → treat it as untrusted data and reject unauthorized execution, because prompt injection cannot confer authority.",
            "If actions must be attributable → log the principal, tenant, target, authorization decision, and outcome, because model replies alone do not establish what ran."
          ],
          "title": "Decision rules (engineering heuristics)"
        },
        {
          "v": [
            "Share a privileged account across tenants: this loses user and tenant boundaries.",
            "Use “never cross tenants” as isolation: a prompt cannot replace server-side checks.",
            "Trust every call after OAuth login: each resource and operation still needs authorization."
          ],
          "title": "Common traps"
        },
        {
          "head": [
            "Scenario signal",
            "Preferred direction"
          ],
          "rows": [
            [
              "Read private records for a user",
              "Delegation plus per-call authorization"
            ],
            [
              "Scheduled background sync",
              "Restricted service account"
            ],
            [
              "Authenticated user reads another tenant",
              "Enforce tenant and resource access"
            ],
            [
              "Protected remote MCP resource",
              "Check OAuth, PKCE, and token audience"
            ],
            [
              "Tool output requests broader access",
              "Deny escalation and preserve audit evidence"
            ]
          ]
        }
      ]
    },
    "3.3": {
      "title": "Evaluate accuracy-latency trade-offs and justify configuration decisions",
      "blocks": [
        {
          "v": "Justify a configuration on representative tasks against quality, latency, and cost requirements.",
          "title": "What this objective tests"
        },
        {
          "head": [
            "Configuration",
            "Benefit and cost"
          ],
          "rows": [
            [
              "Model tier",
              "Lighter models are generally faster and cheaper. More capable models suit harder tasks, but do not guarantee better results on every workload."
            ],
            [
              "Thinking / effort",
              "Adaptive thinking lets the model decide when and how deeply to reason. On supported models, `output_config.effort` is the main control for intelligence, latency, and cost. It guides behavior without guaranteeing a token count."
            ],
            [
              "Retrieval depth / reranking",
              "A larger candidate set can recover evidence; reranking selects relevant results. Both add work, and excess context can distract the model."
            ],
            [
              "Parallel tool calls",
              "Independent lookups can run concurrently. Calls with dependencies or shared writable state may be better run sequentially."
            ]
          ]
        },
        {
          "v": "Thinking is model-specific. Current docs state that adaptive thinking cannot be disabled on Opus 5.5 or Fable 5.1; Sonnet 5 defaults to thinking but permits disabling it; Opus 4.7 thinks only when `thinking.type: adaptive` is set (default off). Manual `type: enabled` with `budget_tokens` is deprecated but accepted on Opus / Sonnet 4.6; Opus 4.7 onward rejects it with 400. Haiku 4.5 supports only manual extended thinking. Sources: Anthropic Thinking, Extended thinking, and Effort, checked 2026-09-27. Recheck model support when switching."
        },
        {
          "v": "Streaming improves visible responsiveness without guaranteeing faster completion or better accuracy. Message Batches processes independent requests asynchronously at 50% of standard API prices (a 50% saving). Most batches finish within one hour, without a one-hour guarantee. Processing ends when all requests finish or after 24 hours; unfinished requests then expire. Use it for work that can wait. Parallel calls do not reduce total call count. Source: Anthropic Batch processing, checked 2026-09-27."
        },
        {
          "v": "Use a fixed dataset and rubric to compare task success, time to first useful content, end-to-end p95 latency, and cost per successful task. Repeat trials and inspect difficult cases and failures separately. p95 is the 95th percentile. Business requirements set the thresholds; the exam does not prescribe universal values."
        },
        {
          "v": [
            "If simple requests meet the quality target → evaluate lower effort on a supported model or a faster model, because extra reasoning may add little value.",
            "If complex reasoning fails and time permits → check the thinking mode and test higher effort or model capability, because compatibility and quality gains both need validation.",
            "If independent external lookups dominate latency → run them concurrently, because changing models does not remove serial waits.",
            "If offline work can wait → use Message Batches for its discount, and handle requests that remain unfinished after 24 hours."
          ],
          "title": "Decision rules (engineering heuristics)"
        },
        {
          "v": [
            "Compare mean latency only: slow requests disappear in the average.",
            "Choose a cheaper model by price per call alone: retries can increase cost per successful task.",
            "Treat streaming or batching as an accuracy improvement: delivery mode alone does not guarantee better answers."
          ],
          "title": "Common traps"
        },
        {
          "head": [
            "Scenario signal",
            "Preferred direction"
          ],
          "rows": [
            [
              "Users wait for initial text",
              "Stream; measure completion time separately"
            ],
            [
              "Offline throughput and cost matter",
              "Asynchronous batching"
            ],
            [
              "Lookups are independent",
              "Parallel tool calls"
            ],
            [
              "Failures in complex reasoning",
              "Check thinking mode; evaluate effort and model tier"
            ],
            [
              "Evidence of SLA compliance required",
              "Measure quality, tail latency, and cost"
            ]
          ]
        }
      ]
    },
    "3.4": {
      "title": "Analyze observability challenges and select monitoring strategies at scale",
      "blocks": [
        {
          "v": "Connect execution traces, resource use, and answer quality to diagnose tasks that fail even while the service stays healthy.",
          "title": "What this objective tests"
        },
        {
          "head": [
            "Observation target",
            "Recommended telemetry (heuristic)"
          ],
          "rows": [
            [
              "Task traces / step spans",
              "Connect model calls, retrieval, tools, and retries with a trace. Give each step a span with duration, errors, and parent relationships."
            ],
            [
              "Model calls",
              "Record model and configuration versions, input/output tokens, cache usage, initial and completion latency, and stop_reason."
            ],
            [
              "Tools and data",
              "Record tool names, redacted arguments, result status, and source versions. Sample inputs and outputs only where permitted, with access and retention limits."
            ],
            [
              "Business outcomes",
              "Track task success, support for cited claims, and human escalation. Segment by scenario so aggregate metrics do not hide regressions."
            ]
          ]
        },
        {
          "v": "LLM outputs vary, so one successful run does not establish reliability. HTTP success does not establish task completion either: `stop_reason: tool_use` requests tool execution, `max_tokens` indicates the generation limit, and `end_turn` means the model finished its response naturally. Interpret each alongside the task outcome. Token use also varies with the trajectory."
        },
        {
          "v": [
            "If users report wrong results while error rates look healthy → link outcomes to traces, because infrastructure metrics miss semantic failures.",
            "If long workflows slow down → inspect spans and retries, because the final answer cannot locate the delay.",
            "If traffic exceeds manual review capacity → use an LLM-as-judge with a rubric and calibrate it against human samples, because automated judges make mistakes.",
            "If logs contain sensitive data → redact and restrict access before risk-based sampling, because observability does not require retaining all raw content."
          ],
          "title": "Decision rules (engineering heuristics)"
        },
        {
          "v": [
            "Monitor HTTP status alone: this misses wrong answers and incomplete work.",
            "Keep only the final reply: this loses retrieval and tool failures along the way.",
            "Use model self-scores as ground truth: uncalibrated judgments can bias quality metrics."
          ],
          "title": "Common traps"
        },
        {
          "head": [
            "Scenario signal",
            "Preferred direction"
          ],
          "rows": [
            [
              "Intermittent failures resist reproduction",
              "Trace the workflow and record versions"
            ],
            [
              "Latency or token usage spikes",
              "Inspect spans, retries, and usage"
            ],
            [
              "Successful requests but unhappy users",
              "Sample outcomes and answer quality"
            ],
            [
              "Many open-ended answers",
              "Rubric, automated judging, and human calibration"
            ],
            [
              "Production data includes personal information",
              "Redaction, sampling, access, and retention controls"
            ]
          ]
        }
      ]
    },
    "3.5": {
      "title": "Design a RAG pipeline with appropriate chunking and indexing strategies",
      "blocks": [
        {
          "v": "Preserve meaning in each retrieval unit and use maintainable, traceable indexes to supply evidence.",
          "title": "What this objective tests"
        },
        {
          "head": [
            "Chunking choice",
            "Trade-off (heuristic)"
          ],
          "rows": [
            [
              "Small / large chunks",
              "Small chunks offer precise matches but can detach definitions. Large chunks preserve context but can include irrelevant text."
            ],
            [
              "Overlap",
              "Overlap can preserve continuity, at the cost of storage and duplicate results. Evaluate the amount."
            ],
            [
              "Structural boundaries",
              "Prefer headings, paragraphs, and function boundaries. Keep table headers and code module context."
            ],
            [
              "Metadata",
              "Keep document ID, section, version, update time, and access scope for filtering, citations, and updates."
            ]
          ]
        },
        {
          "v": "Contextual Retrieval generates a short passage-specific explanation using the full document and prepends it before embedding and BM25 indexing. Vectors retrieve by meaning; BM25 adds lexical matches. Merge and deduplicate candidates before optional reranking. A reranker cannot recover evidence absent from the candidate set and adds runtime work."
        },
        {
          "v": "Anthropic’s Contextual Retrieval experiment measured top-20 retrieval failure (1 − recall@20): Contextual Embeddings reduced 5.7% to 3.7% (35% relative reduction); adding Contextual BM25 reached 2.9% (49%); adding reranking reached 1.9% (67%). All reductions use the same 5.7% baseline and cannot be added. Top-20 beat top-10 and top-5 in this experiment; 20 is not a universal setting. Source: Anthropic Contextual Retrieval; see the article for datasets, embeddings, and reranker configuration."
        },
        {
          "v": "Index maintenance heuristic: update affected chunks, metadata, and both indexes when a source changes, and remove obsolete versions. Query and document vectors need compatible embedding spaces. Rebuild and validate the vector index before switching to an incompatible model; equal dimensions alone do not establish compatibility."
        },
        {
          "v": [
            "If a hit loses its subject or conditions → revise boundaries or add chunk context, because isolated text may not support an answer.",
            "If semantic questions include exact terms → use hybrid retrieval, because lexical and semantic matching complement each other.",
            "If evidence exists in the candidates but ranks poorly → evaluate reranking, because candidate ordering is the problem.",
            "If sources or embedding models change → update or rebuild and rerun retrieval checks, because an old index does not adapt automatically."
          ],
          "title": "Decision rules (engineering heuristics)"
        },
        {
          "v": [
            "Use one fixed chunk length for every document: this can split table or code meaning.",
            "Prepend the same document summary to every chunk: it does not locate each passage within the document.",
            "Change top-k in either direction without evaluation: this can add noise or lose evidence. Test retrieval and answer quality on the actual workload."
          ],
          "title": "Common traps"
        },
        {
          "head": [
            "Scenario signal",
            "Preferred direction"
          ],
          "rows": [
            [
              "Retrieved sentences lack referents",
              "Structural chunks or passage context"
            ],
            [
              "Exact terms and varied wording",
              "Vectors plus BM25"
            ],
            [
              "Evidence is already in the candidates",
              "Rerank and limit selected chunks"
            ],
            [
              "Updated content still yields old citations",
              "Check updates and obsolete-entry removal"
            ],
            [
              "Relevance drops after an embedding change",
              "Check compatibility and rebuild the index"
            ]
          ]
        }
      ]
    },
    "3.6": {
      "title": "Apply retrieval strategies matched to data shape and query pattern",
      "blocks": [
        {
          "v": "Choose retrieval from the data’s shape, the operation requested, and its freshness requirements.",
          "title": "What this objective tests"
        },
        {
          "head": [
            "Data and question",
            "Preferred approach (heuristic)"
          ],
          "rows": [
            [
              "Structured records, sums, joins",
              "Use controlled SQL or APIs for filtering, aggregation, and joins."
            ],
            [
              "Exact identifiers, error codes, terms",
              "Use keyword search / BM25; look up unique record keys directly through an API."
            ],
            [
              "Passages with similar meaning but different wording",
              "Use vectors; consider hybrid retrieval when exact terms also matter."
            ],
            [
              "Live inventory or current state",
              "Use live APIs or tools and check source timestamps."
            ],
            [
              "Small, stable corpus that fits in full",
              "Include it in context and evaluate prompt caching to avoid a separate retrieval pipeline."
            ]
          ]
        },
        {
          "v": "Vector retrieval finds semantic similarity; it does not guarantee identifier matches or replace database computation. In a multi-hop question, one result informs the next lookup. A practical approach is to resolve the entity, fetch related evidence, retain provenance, and bound the search budget. Cross-document questions do not automatically require a graph database."
        },
        {
          "v": "Full-context input must leave room for the question, tool results, and output. Prompt caching reuses processing of matching input prefixes, making stable repeated content a candidate. It neither caches answers nor refreshes sources. Minimum cache lengths and other conditions vary by model and platform, so a small corpus may not qualify; check hits and actual cost."
        },
        {
          "v": [
            "If the answer needs an exact total or joined records → use SQL or an API, because similar passages cannot perform exact computation.",
            "If a query combines a description and a product ID → combine semantic and exact retrieval, because either alone can miss evidence.",
            "If the answer must reflect current state → use a live tool, because offline indexes have update intervals.",
            "If a small, stable corpus fits and meets quality targets → use full context and evaluate caching, because retrieval may add unnecessary maintenance."
          ],
          "title": "Decision rules (engineering heuristics)"
        },
        {
          "v": [
            "Embed table rows and ask the model to estimate a total: this gives up deterministic computation.",
            "Treat a vector neighbor as an exact key match: similarity is not identity.",
            "Expand an offline index to answer live questions: scale does not fix stale data."
          ],
          "title": "Common traps"
        },
        {
          "head": [
            "Scenario signal",
            "Preferred direction"
          ],
          "rows": [
            [
              "Counts, totals, joins",
              "Controlled SQL / API"
            ],
            [
              "Unique identifier or error code",
              "Exact lookup / keyword search"
            ],
            [
              "Paraphrases and concepts",
              "Semantic retrieval"
            ],
            [
              "Resolve an entity before investigating its cause",
              "Bounded multi-hop retrieval"
            ],
            [
              "Repeated questions over a small manual",
              "Full context; check cache suitability"
            ]
          ]
        }
      ]
    },
    "3.7": {
      "title": "Evaluate connection protocols and select the appropriate integration mechanism (MCP, API/CLI, agent-to-agent)",
      "blocks": [
        {
          "v": "Choose an integration boundary according to whether you need reusable interfaces, fixed operations, or delegated tasks.",
          "title": "What this objective tests"
        },
        {
          "head": [
            "Mechanism",
            "Good fit",
            "Cost (heuristic)"
          ],
          "rows": [
            [
              "MCP",
              "Expose tools, resources, and prompts through a standard interface to compatible clients.",
              "Maintain servers, protocol compatibility, and authorization. Clients may support different capabilities."
            ],
            [
              "Direct API / CLI",
              "Use a known call path with few consumers and a stable existing interface.",
              "The application owns adapters, validation, retries, and version handling; a CLI also needs an execution environment."
            ],
            [
              "Agent-to-agent",
              "Delegate work to another team or organization’s agent that plans its own steps and returns a result.",
              "Agree on identity, task state, output format, timeouts, and retries. More exchanges add cost and uncertainty."
            ]
          ]
        },
        {
          "v": "MCP has three server primitives: tools are functions selected by the model; resources supply context under application control; prompts are reusable interaction templates selected by the user. Control describes who initiates use; authorization and user oversight still apply. Source: MCP Server concepts, version 2026-07-28."
        },
        {
          "v": "Its 2025-11-25 transport specification defines stdio and Streamable HTTP. The latter replaces the older HTTP+SSE transport and can use SSE. Here, agent-to-agent means a collaboration pattern, without assuming fields from a particular A2A protocol. Cross-team selection advice and the trade-offs below are engineering heuristics."
        },
        {
          "v": [
            "If several clients need the same tool and data interface → choose MCP, because standardization can reduce repeated adapter work.",
            "If you only need a fixed operation in an existing service → call its API or CLI, because a protocol server may not justify its cost.",
            "If the other party must plan its own work and track progress → consider agent-to-agent coordination, because the unit of delegation is a task outcome.",
            "If a cross-team request only calls a fixed function → API or MCP can still fit, because an organizational boundary does not require another agent."
          ],
          "title": "Decision rules (engineering heuristics)"
        },
        {
          "v": [
            "Wrap every integration in MCP: without reuse needs, it adds maintenance.",
            "Use multiple agents whenever multiple teams are involved: a fixed call becomes a negotiation.",
            "Assume a protocol guarantees safety and reliability: identity, permissions, and recovery still need design."
          ],
          "title": "Common traps"
        },
        {
          "head": [
            "Scenario signal",
            "Preferred direction"
          ],
          "rows": [
            [
              "Several clients share one capability",
              "Standard MCP interface"
            ],
            [
              "Stable interface with fixed inputs and outputs",
              "Direct API / CLI"
            ],
            [
              "Delegate an independently planned task",
              "Agent-to-agent with a task contract"
            ],
            [
              "Local subprocess connection",
              "Check stdio support"
            ],
            [
              "Remote MCP service",
              "Check Streamable HTTP and authorization support"
            ],
            [
              "User selects a reusable interaction template",
              "MCP prompts (user-controlled)"
            ]
          ]
        }
      ]
    },
    "3.8": {
      "title": "Evaluate progressive discovery vs. monolithic context strategy",
      "blocks": [
        {
          "v": "Load context according to task relevance while accounting for discovery overhead and missed information.",
          "title": "What this objective tests"
        },
        {
          "head": [
            "Strategy",
            "Mechanism and fit"
          ],
          "rows": [
            [
              "Load everything up front",
              "Put tools and documents into context before execution. Large sets consume tokens and complicate selection; small stable sets keep the path simple."
            ],
            [
              "Agent Skills",
              "Load name / description metadata first, read the SKILL.md body when relevant, and follow references as needed."
            ],
            [
              "Tool discovery",
              "Tool search discovers and loads definitions on demand; defer_loading controls when a tool enters model context."
            ],
            [
              "Subagent isolation",
              "Each agent works in its own context and returns selected results. This reduces the main context load, but delegation costs time and can lose information."
            ]
          ]
        },
        {
          "v": "Progressive disclosure still needs searchable names and descriptions; a discovery failure can make a capability effectively unavailable. Custom client tools marked `defer_loading: true` still need their full definitions in the request, even though they do not enter model context immediately. A practical default is to preload common entry points, fetch rare material as needed, budget discovery and execution separately, and retain provenance."
        },
        {
          "v": [
            "If a large catalog supplies only a few tools per task → discover on demand, because most definitions would occupy context unnecessarily.",
            "If procedural knowledge separates cleanly by task → use Skills, because metadata can guide when to load details.",
            "If subtasks use independent source material → consider isolated subagents, because the main task only needs their results and evidence.",
            "If material is small, stable, and always needed → preload it and evaluate caching, because discovery round trips may not pay off."
          ],
          "title": "Decision rules (engineering heuristics)"
        },
        {
          "v": [
            "Preload every rarely used document to avoid omissions: this adds cost and can make relevant material harder to select.",
            "Drop authorization checks after adding discovery: loading policy is not access control.",
            "Treat cached context as free: caching does not remove context-window occupancy or distraction during reasoning.",
            "Trust subagent summaries without checking them: conditions or sources can be omitted."
          ],
          "title": "Common traps"
        },
        {
          "head": [
            "Scenario signal",
            "Preferred direction"
          ],
          "rows": [
            [
              "Many tools, few relevant per task",
              "On-demand discovery and clear metadata"
            ],
            [
              "Tasks need different procedure manuals",
              "Progressive disclosure through Skills"
            ],
            [
              "Large independent investigations",
              "Isolate context and return evidence summaries"
            ],
            [
              "Small stable material is reused",
              "Preload and evaluate caching"
            ],
            [
              "An installed capability cannot be found",
              "Check names, descriptions, and discovery paths"
            ]
          ]
        }
      ]
    },
    "4.1": {
      "title": "Define evaluation metrics (accuracy, latency, cost, safety, security)",
      "blocks": [
        {
          "v": "(TODO)"
        }
      ]
    },
    "4.2": {
      "title": "Design evaluation datasets and test frameworks using mixed methodologies",
      "blocks": [
        {
          "v": "(TODO)"
        }
      ]
    },
    "4.3": {
      "title": "Conduct A/B testing and iterative improvements",
      "blocks": [
        {
          "v": "(TODO)"
        }
      ]
    },
    "4.4": {
      "title": "Diagnose system issues (prompt failure, hallucinations, model mismatch)",
      "blocks": [
        {
          "v": "(TODO)"
        }
      ]
    },
    "4.5": {
      "title": "Optimize token usage, latency, and cost-performance trade-offs",
      "blocks": [
        {
          "v": "(TODO)"
        }
      ]
    },
    "4.6": {
      "title": "Monitor system performance using logging and observability tools",
      "blocks": [
        {
          "v": "(TODO)"
        }
      ]
    },
    "5.1": {
      "title": "Implement guardrails and safety controls",
      "blocks": [
        {
          "v": "(TODO)"
        }
      ]
    },
    "5.2": {
      "title": "Identify risks, limitations, and failure modes of LLM systems",
      "blocks": [
        {
          "v": "(TODO)"
        }
      ]
    },
    "5.3": {
      "title": "Apply human-in-the-loop validation strategies",
      "blocks": [
        {
          "v": "(TODO)"
        }
      ]
    },
    "5.4": {
      "title": "Ensure compliance with regulations (e.g., GDPR, HIPAA, FedRAMP)",
      "blocks": [
        {
          "v": "(TODO)"
        }
      ]
    },
    "5.5": {
      "title": "Address ethical AI considerations (bias, fairness, transparency)",
      "blocks": [
        {
          "v": "(TODO)"
        }
      ]
    },
    "6.1": {
      "title": "Conduct structured discovery and requirement gathering",
      "blocks": [
        {
          "v": "(TODO)"
        }
      ]
    },
    "6.2": {
      "title": "Communicate architectural decisions and trade-offs",
      "blocks": [
        {
          "v": "(TODO)"
        }
      ]
    },
    "6.3": {
      "title": "Manage stakeholder feedback loops and expectation alignment (including SLAs)",
      "blocks": [
        {
          "v": "(TODO)"
        }
      ]
    },
    "6.4": {
      "title": "Document architectures and provide implementation guidance",
      "blocks": [
        {
          "v": "(TODO)"
        }
      ]
    },
    "6.5": {
      "title": "Support lifecycle phases (discovery, design, handoff, monitoring, iteration)",
      "blocks": [
        {
          "v": "(TODO)"
        }
      ]
    },
    "7.1": {
      "title": "Configure Claude tools and environments for teams (e.g., Claude Code)",
      "blocks": [
        {
          "v": "(TODO)"
        }
      ]
    },
    "7.2": {
      "title": "Improve developer workflows using AI-assisted tooling",
      "blocks": [
        {
          "v": "(TODO)"
        }
      ]
    },
    "7.3": {
      "title": "Support debugging and operational issue resolution",
      "blocks": [
        {
          "v": "(TODO)"
        }
      ]
    },
    "R.1": {
      "title": "Distractor patterns",
      "blocks": [
        {
          "v": "This original taxonomy labels reasoning errors in distractors. It is not an official exam taxonomy. The Chinese names stay fixed for use in the explanation for each wrong option.",
          "title": "How to use this taxonomy"
        },
        {
          "head": [
            "Type (Chinese / English)",
            "Definition",
            "Recognition cue",
            "Why it looks plausible"
          ],
          "rows": [
            [
              "加防不减 / Guarding excess capability",
              "Retain explicitly unnecessary capabilities and add pre-execution approval; exclude substituting later audits for a gate.",
              "Keep excess permissions; add pre-execution approval",
              "Approvals can block some mistakes, making excess capability easier to overlook."
            ],
            [
              "层级误诊 / Wrong-layer diagnosis",
              "Address an unrelated layer despite a known cause elsewhere; use only when no more specific category fits.",
              "Missing evidence; change tone",
              "Prompt edits are easy and can make an answer look more convincing."
            ],
            [
              "模型迷信 / Model substitution",
              "Treat a model-tier change as a solution without evaluation; exclude increases in context or reasoning within the same model.",
              "Upgrade or downgrade everything",
              "Capability and per-call price are visible, so they can distract from the actual bottleneck."
            ],
            [
              "提示代控 / Prompt as enforcement",
              "Substitute instructions for enforced permission or argument checks; exclude ordinary style edits.",
              "Tell it not to exceed permissions",
              "Prompts influence behavior, which can be mistaken for an enforced permission boundary."
            ],
            [
              "审计代防 / Audit as prevention",
              "Replace a required execution gate with later logs, alerts, or reviews; exclude actual pre-execution approval.",
              "Run first, inspect later",
              "Auditability helps accountability and can look like risk prevention."
            ]
          ]
        },
        {
          "head": [
            "Type (Chinese / English)",
            "Definition",
            "Recognition cue",
            "Why it looks plausible"
          ],
          "rows": [
            [
              "过度工程 / Overengineering",
              "Add protocols, components, or agents without a matching need; exclude merely increasing data or reasoning volume.",
              "Many layers for one step",
              "A feature-rich design can look more appropriate simply because it covers more cases."
            ],
            [
              "形态错配 / Data-shape mismatch",
              "Choose retrieval or computation that cannot meet the query’s data requirements, such as similarity search for exact aggregation.",
              "Sum records through similarity",
              "Vector search is versatile, which encourages using it for exact computation."
            ],
            [
              "合规让步 / Compliance shortcut",
              "Explicitly waive a required data or permission boundary for efficiency; do not apply this label to every control-design mistake.",
              "Export all sensitive data",
              "Removing restrictions can reduce work while violating the stated requirement."
            ],
            [
              "指标偷换 / Metric substitution",
              "Claim the required outcome from a proxy metric; exclude choosing the wrong technical measure for the actual goal.",
              "First token equals completion",
              "The number can be accurate while measuring the wrong outcome."
            ],
            [
              "无据堆量 / Unmeasured expansion",
              "Increase retrieval, context, or reasoning within one model without diagnosis; exclude model changes and added architecture.",
              "Load everything to find it",
              "Extra information can recover evidence, but can also add noise and cost."
            ]
          ]
        },
        {
          "v": "First establish that the option violates the requirements. Approval can be appropriate for necessary high-risk actions; evidence can justify a model change or top-k adjustment. Do not classify an option as wrong from these words alone.",
          "title": "Distinguish neighboring types"
        },
        {
          "v": [
            "Assign one label per wrong option, based first on its specific erroneous measure. Use Wrong-layer diagnosis only when no more specific category fits.",
            "When several definitions still apply, take the first matching label in this project’s order: Compliance shortcut → Prompt as enforcement → Audit as prevention → Guarding excess capability → Data-shape mismatch → Model substitution → Unmeasured expansion → Metric substitution → Overengineering → Wrong-layer diagnosis. This is a local labeling convention, not an official rule.",
            "Boundary 1: Keep an unnecessary delete tool and require approval before each call → Guarding excess capability. The mistake is retaining excess capability. Replacing a gate with logs inspected after execution instead fits Audit as prevention.",
            "Boundary 2: Replace tenant checks with an instruction against cross-tenant access → Prompt as enforcement. This specific control substitution takes precedence over Wrong-layer diagnosis.",
            "Boundary 3: Switch to a larger model and expand context without evaluation → Model substitution, which precedes Unmeasured expansion when both apply. Keeping the same model and blindly adding context instead fits Unmeasured expansion."
          ],
          "title": "Rules for assigning one label"
        }
      ]
    },
    "R.2": {
      "title": "Model selection & cost cheat sheet",
      "blocks": [
        {
          "v": "(TODO)"
        }
      ]
    },
    "R.3": {
      "title": "Glossary",
      "blocks": [
        {
          "v": "(TODO)"
        }
      ]
    },
    "R.4": {
      "title": "Exam-day strategy",
      "blocks": [
        {
          "v": "(TODO)"
        }
      ]
    }
  },
  "questions": {}
};
