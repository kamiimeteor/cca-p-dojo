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
          "v": "Define repeatable measures of quality, speed, cost, and risk. See 1.6 for mapping them to business value.",
          "title": "What this objective tests"
        },
        {
          "v": "Official guidance describes success criteria as specific, measurable, achievable, and relevant. This note adds the time-bound part of SMART as an engineering heuristic: specify the evaluation window, population, denominator, grading rules, and target. These are application acceptance criteria, not universal official thresholds."
        },
        {
          "head": [
            "Metric",
            "Measurement convention (engineering heuristics)"
          ],
          "rows": [
            [
              "Accuracy",
              "Correct cases / graded cases. Also report the ungraded share and break results down by task and difficulty."
            ],
            [
              "Latency",
              "TTFT runs from request submission to the first token. Task duration runs through completion, including tools and retries. Report p50 / p95 / p99 separately: the 50th / 95th / 99th percentiles."
            ],
            [
              "Cost",
              "All model, tool, retry, human, and operating costs in the window / successful tasks. With zero successes, report failure spending separately."
            ],
            [
              "Safety",
              "Harmful outputs / reviewed outputs; refusals / requests; inappropriate refusals / answerable requests. Define harmful and answerable labels first."
            ],
            [
              "Security",
              "Achieved attack objectives / valid injection trials. Fix the attack set, permission environment, and success criteria."
            ]
          ]
        },
        {
          "v": "Trade-off heuristic: choose a primary metric in advance, with quality, safety, and completion deadlines as constraints. More refusals may also block legitimate tasks; lower per-call prices may lead to more retries. Keep separate measures so a combined score cannot conceal risk."
        },
        {
          "v": [
            "If correct delivery matters → measure success rate and cost per successful task, because cheaper calls may not reduce total spending.",
            "If users report slow responses → separate TTFT from task duration, because visible text does not establish completion.",
            "If stricter filtering lowers harmful output rates → also check inappropriate refusals, because legitimate requests may be blocked.",
            "If comparing versions → keep the window and sampling definitions consistent, because changing denominators can create apparent gains."
          ],
          "title": "Decision rules (engineering heuristics)"
        },
        {
          "v": [
            "Report mean latency alone: slow requests can disappear in the average.",
            "Count every refusal as a safety success: this misses the loss of legitimate task completion.",
            "Measure only toxic text: this does not test whether injection caused an unauthorized action."
          ],
          "title": "Common traps (engineering heuristics)"
        },
        {
          "head": [
            "Scenario signal (engineering heuristics)",
            "Preferred direction"
          ],
          "rows": [
            [
              "Better accuracy but many more retries",
              "Check total cost per successful task"
            ],
            [
              "Fast initial text but missed deadlines",
              "Separate TTFT and completion percentiles"
            ],
            [
              "Harmless requests rejected",
              "Measure inappropriate refusals"
            ],
            [
              "Malicious tool results change behavior",
              "Measure attack objective success"
            ],
            [
              "Only “faster and safer” is specified",
              "Define samples, grading, targets, and a window"
            ]
          ]
        }
      ]
    },
    "4.2": {
      "title": "Design evaluation datasets and test frameworks using mixed methodologies",
      "blocks": [
        {
          "v": "Combine code, model, and human graders according to what is being assessed; inspect both the agent outcome and its trajectory.",
          "title": "What this objective tests"
        },
        {
          "head": [
            "Grader",
            "Use and limits"
          ],
          "rows": [
            [
              "Code",
              "Exact matching, unit tests, and structural validation fit explicitly verifiable conditions. Rigid rules can reject valid variations."
            ],
            [
              "LLM-as-judge",
              "Use a rubric for open answers, with criteria per dimension, reference answers, and an “unknown” option. Official guidance recommends calibration against human experts."
            ],
            [
              "Human",
              "Assess subjective quality, resolve disagreements, and calibrate judges. Review is detailed but slow and expensive; reviewers can also disagree."
            ]
          ]
        },
        {
          "v": "Dataset heuristics: include routine, boundary, and adversarial cases, with paired cases where a behavior is appropriate or inappropriate. Keep the test set separate from tuning examples. Inspect judge errors against human labels; swap answer order and compare lengths to test for bias. Freeze the rubric version before comparing systems."
        },
        {
          "v": "The outcome is the final environment state; trajectories help explain tool selection and intermediate errors. Official guidance often favors grading the artifact, avoiding a fixed valid path. The 2026 eval blog suggests starting early with 20 to 50 simple tasks from real failures. Mature systems may use larger, harder sets to detect smaller changes; this is not a statistical significance sample size."
        },
        {
          "v": "Offline tests support regression checks before release. Production monitoring, user feedback, A/B testing, manual trajectory review, and systematic human assessment complement them. Heuristics: repeat trials for each task and reset the environment between trials; review new production failures before adding them to offline tests."
        },
        {
          "v": [
            "If rules can verify the result → prefer code graders, because the checks are reproducible.",
            "If several answers are valid → use a rubric with human calibration, because identical wording is not the only measure of correctness.",
            "If an agent claims success → verify the final state, because a statement does not prove execution.",
            "If offline scores are high but production degrades → inspect distributions and trajectories, because the test set may miss real usage."
          ],
          "title": "Decision rules (engineering heuristics)"
        },
        {
          "v": [
            "Treat judge scores as truth: human agreement and bias have not been checked.",
            "Test only tasks that call for tools: this may reward unnecessary calls.",
            "Enforce a single tool sequence: this can penalize other valid solutions."
          ],
          "title": "Common traps (engineering heuristics)"
        },
        {
          "head": [
            "Scenario signal (engineering heuristics)",
            "Preferred direction"
          ],
          "rows": [
            [
              "Fixed fields or runnable programs",
              "Structural validation or unit tests"
            ],
            [
              "Open summaries and analysis",
              "Rubric with human calibration"
            ],
            [
              "Completion claimed but state unchanged",
              "Verify the outcome"
            ],
            [
              "Repeated runs vary",
              "Multiple trials with isolated environments"
            ],
            [
              "New production failure",
              "Review it and add a regression case"
            ]
          ]
        }
      ]
    },
    "4.3": {
      "title": "Conduct A/B testing and iterative improvements",
      "blocks": [
        {
          "v": "Validate a change with a reproducible comparison that supports attribution, then use production outcomes to decide whether to expand or roll back.",
          "title": "What this objective tests"
        },
        {
          "head": [
            "Stage",
            "Execution convention (engineering heuristics)"
          ],
          "rows": [
            [
              "Hypothesis",
              "Predefine the primary metric, quality and safety constraints, observation window, and stopping and rollback conditions. Change one variable at a time."
            ],
            [
              "Offline comparison",
              "Use the old version as the baseline; change only the prompt or one setting. Fix tasks, graders, and environment, repeat trials, and run regression checks."
            ],
            [
              "Production A/B",
              "Randomly assign eligible traffic to control and treatment. Keep assignment stable per user or session so a task does not mix versions."
            ],
            [
              "Version record",
              "Save the prompt template and variables, model / settings, tool / retrieval versions, dataset, rubric, experiment ID, and results. Retain a version for rollback."
            ]
          ]
        },
        {
          "v": "Statistical heuristics: sample size depends on baseline variability, the smallest difference worth detecting, and statistical power. Agree on significance criteria in advance and report effect size and uncertainty. If evidence is insufficient, keep observing or report an unresolved result. No significant difference does not establish equivalence; a temporary lead is not a reason to stop."
        },
        {
          "v": "The official eval blog treats offline evaluation and A/B tests on real traffic as complementary. Offline checks can detect regressions before release; A/B measures actual user outcomes. Reaching significance can take days or weeks, depending on traffic. Heuristics: begin with limited exposure after offline checks pass. Stop or roll back for safety incidents or predefined quality, latency, or cost breaches, without waiting for a win on the primary metric."
        },
        {
          "v": [
            "If the aim is to identify an effective change → vary one factor, because changing both model and prompt obscures attribution.",
            "If a new prompt improves the average score → also inspect regressions and difficult cases, because averages may hide localized losses.",
            "If offline checks pass and traffic is sufficient → run production A/B, because real task completion remains to be tested.",
            "If a rollback condition is met → restore a validated version, because experimental gains do not cancel agreed risk limits."
          ],
          "title": "Decision rules (engineering heuristics)"
        },
        {
          "v": [
            "Compare this week’s new version with last week’s old one: timing and audience changes can confound the result.",
            "Keep checking and declare victory at the first lead: this increases the risk of a chance finding.",
            "Save only the final prompt text: missing variables and dependency versions make reproduction harder."
          ],
          "title": "Common traps (engineering heuristics)"
        },
        {
          "head": [
            "Scenario signal (engineering heuristics)",
            "Preferred direction"
          ],
          "rows": [
            [
              "Prompt, model, and retrieval changed together",
              "Separate experiments for attribution"
            ],
            [
              "High offline scores but unknown user completion",
              "A/B on limited traffic"
            ],
            [
              "Few samples and unstable differences",
              "Continue under predefined criteria"
            ],
            [
              "Quality or safety limit breached",
              "Stop or roll back"
            ],
            [
              "Historical results cannot be reproduced",
              "Record prompt and dependency versions"
            ]
          ]
        }
      ]
    },
    "4.4": {
      "title": "Diagnose system issues (prompt failure, hallucinations, model mismatch)",
      "blocks": [
        {
          "v": "Use failed cases and trajectories to identify the failing layer before changing a component. See R.1, “Wrong-layer diagnosis.”",
          "title": "What this objective tests"
        },
        {
          "head": [
            "Layer",
            "Evidence → repair direction (engineering heuristics)"
          ],
          "rows": [
            [
              "Input",
              "Missing fields, garbled text, or ambiguous tasks → inspect the original request and preprocessing; complete the input."
            ],
            [
              "Retrieval",
              "Evidence exists in the source but is absent from candidates, or the index is stale → inspect recall and versions. Consider reranking when candidates already contain the evidence."
            ],
            [
              "Prompt",
              "Conflicting instructions or examples skewed toward one class → compare the assembled prompt and examples; resolve conflicts and add representative examples."
            ],
            [
              "Model",
              "Reasoning fails despite adequate evidence and prompts → compare capability. Simple tasks already pass but cost too much → test lower effort or a faster model (see 3.3)."
            ],
            [
              "Output",
              "Parseable output has false claims or unsupported citations → separately check schema, business rules, and citation support."
            ],
            [
              "Tool",
              "Bad arguments, denied access, timeouts, or failed execution → compare arguments, return values, and actual side effects; repair the tool or its calling contract."
            ]
          ]
        },
        {
          "v": "Official guidance gives three basic strategies for reducing hallucinations: allow Claude to say it does not know; ground facts in direct quotations, extracting verbatim passages before doing the task when documents exceed 20k tokens; and check each claim against cited passages and sources. These techniques can reduce hallucinations but do not eliminate them. Diagnostic heuristic: distinguish missing source information, retrieval misses, and misinterpretation in the answer. Retrieve more evidence or escalate when support is absent; a firmer tone does not make a claim more reliable."
        },
        {
          "v": "Inspect the evaluator too (official page, 2026-09-29). The 2026 eval blog reports that Opus 4.5 initially scored 42% on CORE-Bench, reaching 95% after grading and other bugs were fixed and scaffold constraints were relaxed. This compares evaluation conditions before and after repairs, not a model upgrade; it does not predict production accuracy."
        },
        {
          "v": [
            "If sources are missing → repair data or retrieval, because prompt changes cannot supply absent evidence.",
            "If rules conflict or examples are skewed → revise the assembled prompt, because it may elicit unintended patterns.",
            "If complex reasoning still fails with the same adequate evidence → compare models and effort, because a capability gap supports a configuration change.",
            "If scores are low but artifacts are valid → inspect tasks and graders, because grading code can be wrong."
          ],
          "title": "Decision rules (engineering heuristics)"
        },
        {
          "v": [
            "Upgrade the model after any error: without diagnosis, a stale index may go unnoticed.",
            "Repeat “do not hallucinate” instead of checking evidence: an instruction does not verify an answer.",
            "Claim completion after a tool error: this conceals execution failure."
          ],
          "title": "Common traps (engineering heuristics)"
        },
        {
          "head": [
            "Scenario signal (engineering heuristics)",
            "Preferred direction"
          ],
          "rows": [
            [
              "Old documents or missed evidence",
              "Inspect retrieval and data versions"
            ],
            [
              "Conflicting rules for identical input",
              "Inspect prompt conflicts"
            ],
            [
              "Reasoning fails with adequate evidence",
              "Compare capability and effort"
            ],
            [
              "Citations do not support the claims",
              "Verify each claim against evidence"
            ],
            [
              "Valid artifact graded as wrong",
              "Inspect grader and environment"
            ]
          ]
        }
      ]
    },
    "4.5": {
      "title": "Optimize token usage, latency, and cost-performance trade-offs",
      "blocks": [
        {
          "v": "Locate token spending and waiting time, then compare cost per successful task among candidates that meet quality targets. See 3.3 for configuration trade-offs.",
          "title": "What this objective tests"
        },
        {
          "head": [
            "Optimization",
            "Mechanism and limits"
          ],
          "rows": [
            [
              "Prompt caching",
              "Matching prefixes let the service reuse input processing; generated answers are not cached. Arrange reusable material before request-specific content. A hit depends on exact prefix matching, a live cache entry, and the model and platform length rules, among other conditions."
            ],
            [
              "Model and effort",
              "Compare model tiers on real tasks. On supported models, adjust `output_config.effort`: it is soft guidance and does not guarantee a fixed token count. See 3.3 for compatibility."
            ],
            [
              "Streaming and parallelism",
              "Streaming improves visible responsiveness without guaranteeing earlier completion. Independent read-only tools are usually suitable for parallel execution; side effects, shared state, or ordering constraints may favor sequential execution."
            ],
            [
              "Context and output",
              "Official guidance recommends trimming context while retaining decisions and evidence, and constraining length by sentences or paragraphs. `max_tokens` is a hard ceiling that can truncate output, not a natural stopping point."
            ]
          ]
        },
        {
          "v": "The cache pricing table (official page, 2026-09-29) lists five-minute / one-hour writes at 1.25× / 2× the base input price. Reads are usually 0.1×, except Fable 5.1 / Mythos 5.1 at 0.025× and Opus 5.5 at 0.05×. The default lifetime is five minutes, refreshed on a hit. Cost heuristic: include writes and misses; a read discount is not the reduction in the entire bill."
        },
        {
          "v": "Batch behavior follows 3.3 (official page, 2026-09-29): Message Batches charges 50% of standard API prices. Most batches finish within one hour, without a guarantee; unfinished requests expire at 24 hours. Heuristics: consider batches for offline evals, measure TTFT and completion deadlines separately for interactive traffic, and use the usage fields in 4.6 to check caching savings."
        },
        {
          "v": [
            "If a large prefix is reused → evaluate caching, because it can reuse input processing.",
            "If responses are verbose → constrain length first, because simply lowering the ceiling may cut off the answer.",
            "If independent read-only queries cause the wait → evaluate parallel execution, because sequential waiting is the bottleneck.",
            "If lowering the model tier or trimming context → rerun quality regressions and account for retries, because fewer tokens do not establish lower cost per successful task."
          ],
          "title": "Decision rules (engineering heuristics)"
        },
        {
          "v": [
            "Insert a fresh timestamp into the prefix every time: the change can prevent cache hits.",
            "Stop trimming context once hits improve: cached content still occupies context.",
            "Use batch discounts to promise immediate responses: one-hour completion is not guaranteed."
          ],
          "title": "Common traps (engineering heuristics)"
        },
        {
          "head": [
            "Scenario signal (engineering heuristics)",
            "Preferred direction"
          ],
          "rows": [
            [
              "Stable prefix reused",
              "Check hits and write costs"
            ],
            [
              "Verbose, expensive output",
              "Limit length and inspect truncation"
            ],
            [
              "Independent read-only tools",
              "Evaluate parallel execution"
            ],
            [
              "Offline tasks can wait",
              "Batch with expiry handling"
            ],
            [
              "Lower prices but more retries",
              "Compare cost per successful task"
            ]
          ]
        }
      ]
    },
    "4.6": {
      "title": "Monitor system performance using logging and observability tools",
      "blocks": [
        {
          "v": "Turn logs into daily checks and responses. See 3.4 for monitoring strategy at scale.",
          "title": "What this objective tests"
        },
        {
          "v": "Logging heuristics: connect tasks, models, prompt / settings, retrieval versions, tool arguments and results, durations, retries, and business outcomes with traces and spans. Sample redacted inputs and outputs with access and retention limits. Group dashboards by version, task, and population; display quality, latency percentiles, cost, and cache usage."
        },
        {
          "head": [
            "stop_reason",
            "Meaning"
          ],
          "rows": [
            [
              "end_turn",
              "The model ended its reply naturally; this does not establish business success."
            ],
            [
              "max_tokens",
              "The request’s generation limit was reached."
            ],
            [
              "stop_sequence",
              "A custom stopping sequence was encountered."
            ],
            [
              "tool_use",
              "The model issued a tool call; execution is not established."
            ],
            [
              "pause_turn",
              "A server tool loop reached its iteration limit and can be continued."
            ],
            [
              "refusal",
              "The model declined to respond."
            ],
            [
              "model_context_window_exceeded",
              "Output reached the model’s context-window boundary."
            ]
          ]
        },
        {
          "v": "Usage accounting: total input = `input_tokens` + `cache_creation_input_tokens` + `cache_read_input_tokens`; output uses `output_tokens`. Streaming `message_delta.usage` values are cumulative, so adding them repeatedly overcounts. Record final usage separately from business outcome."
        },
        {
          "v": "Daily operating heuristics: use baselines and SLAs to define thresholds, windows, minimum sample sizes, and owners; attach failing traces and response steps to alerts. Compare task distributions and quality by group to detect drift. Combine random production sampling with focused failure review, calibrate judges against human labels, and add confirmed failures to the 4.2 regression suite."
        },
        {
          "v": [
            "If quality declines while HTTP status remains normal → inspect samples and trajectories, because status codes miss semantic errors.",
            "If truncation increases → inspect output budgets and context, because the two limits call for different handling.",
            "If cost is anomalous → separate cache reads, writes, output, and retries, because ordinary input alone misses spending.",
            "If one task group degrades → review that group, because traffic proportions can conceal quality drift."
          ],
          "title": "Decision rules (engineering heuristics)"
        },
        {
          "v": [
            "Record success on tool_use: tool execution and business outcome remain unconfirmed.",
            "Estimate overall quality using only error samples: the sample distribution is biased.",
            "Treat refusal as proof of inappropriate rejection: answerability has not been assessed."
          ],
          "title": "Common traps (engineering heuristics)"
        },
        {
          "head": [
            "Scenario signal (engineering heuristics)",
            "Preferred direction"
          ],
          "rows": [
            [
              "Normal HTTP status, more complaints",
              "Quality sampling with traces"
            ],
            [
              "Generation limits reached frequently",
              "Inspect budgets and response length"
            ],
            [
              "Frequent hits but high bills",
              "Separate writes, reads, output, and retries"
            ],
            [
              "One task group degrades after release",
              "Group-level drift alerts and regressions"
            ],
            [
              "Alerts receive no response",
              "Assign owners, windows, and response steps"
            ]
          ]
        }
      ]
    },
    "5.1": {
      "title": "Implement guardrails and safety controls",
      "blocks": [
        {
          "title": "What this objective tests",
          "v": "Protect input, output, and execution, then test whether failures can still cause harm."
        },
        {
          "head": [
            "Control layer (engineering heuristics)",
            "Check and response"
          ],
          "rows": [
            [
              "Input",
              "Screen harmful content and injection attempts. Documents, pages, emails, and tool results can carry indirect injections."
            ],
            [
              "Output",
              "Validate structure and business meaning; detect personal data, secrets, and prompt leaks. Handle refusals and truncation separately; see 1.2."
            ],
            [
              "Execution",
              "Restrict tools, validate arguments, and use sandboxes. See 3.1 for excess capabilities and 3.2 for identity and authorization."
            ]
          ]
        },
        {
          "v": "The injection guide covers harmlessness screening, input validation, system prompts that emphasize ethical and legal boundaries and explicitly tell Claude how to refuse, plus possible throttling or bans for repeat attackers. For indirect attacks: deliver external text in tool_result, identify its source, declare it untrusted, JSON-encode where possible, send your instructions in a user turn after the tool_result block or, on supported models, use a mid-conversation system message, restrict data and actions, screen tool results, and red-team before deployment. Monitor outputs and combine safeguards."
        },
        {
          "head": [
            "Official guardrail topic",
            "Methods and limits"
          ],
          "rows": [
            [
              "Reduce hallucinations",
              "Allow uncertainty; extract quotes first for documents over 20k tokens; check each claim against citations. Advanced options include reasoning checks, repeated comparisons, iterative verification, and limiting external knowledge. None eliminates hallucinations."
            ],
            [
              "Improve consistency",
              "Specify formats, prefill responses, provide examples, use retrieval, chain prompts for complex tasks, and maintain the role. Prefilling is unsupported on Claude 4.6 and later models and Claude Mythos Preview. Prefer structured outputs for strict JSON schema use cases. (official page, 2026-09-29)"
            ],
            [
              "Reduce prompt leaks",
              "Try output screening and post-processing first; separate context from queries, omit unnecessary secrets, and audit regularly. Complex leak-resistant prompts can hurt performance; no method guarantees secrecy."
            ]
          ]
        },
        {
          "title": "Decision rules (engineering heuristics)",
          "v": [
            "If external content contains instructions → isolate and screen it, because its source grants no authority.",
            "If output contains sensitive data → block it before delivery, because logs cannot undo disclosure.",
            "If an action has serious consequences → gate execution on approval, because valid structure can still describe a harmful action."
          ]
        },
        {
          "title": "Common traps (engineering heuristics)",
          "v": [
            "Treat a clean screen as a safety guarantee: execution still needs limits.",
            "Treat the system prompt as a secret vault: it can still leak.",
            "Replace pre-execution checks with logs: see R.1."
          ]
        },
        {
          "head": [
            "Scenario signal (engineering heuristics)",
            "Preferred direction"
          ],
          "rows": [
            [
              "External document redirects the task",
              "Isolate the source and screen content"
            ],
            [
              "Valid JSON, wrong business action",
              "Business validation"
            ],
            [
              "Reply exposes internal content",
              "Output screening and minimal context"
            ],
            [
              "Dangerous tools execute directly",
              "Permissions, sandboxing, and approval"
            ]
          ]
        }
      ]
    },
    "5.2": {
      "title": "Identify risks, limitations, and failure modes of LLM systems",
      "blocks": [
        {
          "title": "What this objective tests",
          "v": "Diagnose failures through evidence, behavior, and resource use before choosing a mitigation."
        },
        {
          "head": [
            "Information risk",
            "Detection → mitigation (engineering heuristics)"
          ],
          "rows": [
            [
              "Hallucination",
              "Compare claims with sources for invented citations or contradictions → retrieve evidence, allow uncertainty, and verify with humans."
            ],
            [
              "Knowledge cutoff",
              "Check source dates and current facts → consult current official material or live tools; see 3.5 for index maintenance."
            ],
            [
              "Nondeterminism",
              "Repeat identical inputs and measure pass rates and disagreement → hold evaluation settings fixed and validate outputs; see 4.2."
            ],
            [
              "Direct / indirect injection",
              "Test hostile user input and instructions embedded in documents or tool results; inspect unauthorized actions → separate trusted instructions from data; see 5.1."
            ]
          ]
        },
        {
          "head": [
            "Behavior and operating risk",
            "Detection → mitigation (engineering heuristics)"
          ],
          "rows": [
            [
              "Overreliance",
              "Sample unsupported acceptance and superficial reviews → show evidence and limitations; route serious decisions to qualified reviewers."
            ],
            [
              "Data leakage",
              "Scan outputs, logs, and tool arguments for sensitive fields → minimize, redact, restrict access, and control retention."
            ],
            [
              "Runaway cost",
              "Inspect unusual tokens, retries, tool calls, and durations → set task budgets, iteration limits, and stopping conditions; see 4.6 for accounting."
            ],
            [
              "Tool misuse",
              "Compare the tool, target, arguments, and actual state → validate at execution; inspect uncertain write status before retrying."
            ],
            [
              "Compounding agent errors",
              "Trace the first error into downstream steps → use stage checks, checkpoints, and local recovery; stop or hand off on failure."
            ]
          ]
        },
        {
          "v": "Official documentation describes residual hallucination risk, model knowledge cutoffs, and the potential for autonomous agents to incur higher costs and compound errors. Heuristic: prioritize risks by consequence, likelihood, and recoverability. One successful run or fluent wording does not establish reliability; a model’s stated confidence is not automatically a calibrated probability."
        },
        {
          "title": "Decision rules (engineering heuristics)",
          "v": [
            "If the answer depends on current state → fetch dated evidence, because model knowledge may be stale.",
            "If identical tasks succeed inconsistently → repeat evaluations and inspect traces, because a single demonstration misses variation.",
            "If a loop spends without progress → stop at the budget, because further calls may not repair the error.",
            "If an upstream result is unverified → pause dependent steps, because the error can affect later actions."
          ]
        },
        {
          "title": "Common traps (engineering heuristics)",
          "v": [
            "Treat RAG as a guarantee against hallucination: citations may not support the claim.",
            "Record success when the model says “done”: inspect the actual business state.",
            "Substitute a larger model for budget and permission controls: see R.1."
          ]
        },
        {
          "head": [
            "Scenario signal (engineering heuristics)",
            "Preferred direction"
          ],
          "rows": [
            [
              "Wrong answer about current policy",
              "Check knowledge dates and live sources"
            ],
            [
              "Identical task, varying outcomes",
              "Repeat trials"
            ],
            [
              "Email instructs data exfiltration",
              "Indirect-injection defenses"
            ],
            [
              "Errors increase down the chain",
              "Stage checks and stopping conditions"
            ],
            [
              "Spending spikes",
              "Inspect retries, calls, and budgets"
            ]
          ]
        }
      ]
    },
    "5.3": {
      "title": "Apply human-in-the-loop validation strategies",
      "blocks": [
        {
          "title": "What this objective tests",
          "v": "Place human judgment before consequential action, with evidence, authority, and a handoff path."
        },
        {
          "head": [
            "Intervention (engineering heuristics)",
            "Trigger and control"
          ],
          "rows": [
            [
              "Approval gate",
              "Serious consequences, irreversible actions, or applicable compliance obligations: show the target, action, evidence, and impact before execution; wait for approval."
            ],
            [
              "Sample review",
              "Low-risk, recoverable work: combine random samples with targeted anomaly review. Sampling does not replace mandated review of each item before release."
            ],
            [
              "Escalation",
              "Conflicting or missing evidence, or low confidence: route to a qualified reviewer with an owner and deadline."
            ],
            [
              "Human takeover",
              "Repeated failure or a capability limit: pause automation and transfer the goal, evidence, completed actions, and pending state."
            ]
          ]
        },
        {
          "v": "The Usage Policy lists legal, healthcare (excluding general wellness advice), insurance, finance, employment and housing, academic testing / accreditation / admissions, and media or professional journalism as high-risk categories. For advice, recommendations, or subjective decisions directly affecting individuals or consumers in these categories, a qualified professional in the field must review before dissemination or finalization. Outputs presented directly also require disclosure of AI involvement at least at the start of each session. Source: (official page, 2026-09-29)."
        },
        {
          "v": "Operating heuristics: bind approval to a specific action and argument version; changes trigger another review, and timeouts remain pending or escalate. Confidence triggers combine evidence gaps, failed checks, and past evaluations instead of relying on self-ratings. Higher automation can reduce review work but may let errors through; review adds queueing delay and labor cost. Tier by risk and measure waiting time, overrides, and missed errors. Excessive prompts can encourage mechanical approval. Section 4.2 evaluates quality; this section controls release in production."
        },
        {
          "title": "Decision rules (engineering heuristics)",
          "v": [
            "If an action is irreversible → obtain approval before execution, because later correction may be ineffective.",
            "If evidence is insufficient → escalate or hand off, because stated confidence adds no evidence.",
            "If low-risk volume is high → sample and review anomalies, because this limits waiting and review cost.",
            "If compliance mandates prior review → retain the gate, because automation targets do not override that constraint."
          ]
        },
        {
          "title": "Common traps (engineering heuristics)",
          "v": [
            "Show only the conclusion: reviewers cannot check evidence or impact.",
            "Approve automatically on timeout: waiting bypasses the gate.",
            "Treat retrospective sampling as prior approval: they act at different points."
          ]
        },
        {
          "head": [
            "Scenario signal (engineering heuristics)",
            "Preferred direction"
          ],
          "rows": [
            [
              "Serious or irreversible consequences",
              "Prior approval"
            ],
            [
              "Missing or conflicting evidence",
              "Expert escalation"
            ],
            [
              "Low risk, high volume",
              "Sample review"
            ],
            [
              "Repeated failures",
              "Pause and hand off"
            ],
            [
              "Human review with no owner",
              "Define authority, deadlines, and handoff"
            ]
          ]
        }
      ]
    },
    "5.4": {
      "title": "Ensure compliance with regulations (e.g., GDPR, HIPAA, FedRAMP)",
      "blocks": [
        {
          "title": "What this objective tests",
          "v": "Check data, configuration, and certification scope; customers retain their compliance obligations."
        },
        {
          "head": [
            "Framework",
            "Official scope (2026-09-29)"
          ],
          "rows": [
            [
              "GDPR",
              "Article 5: lawfulness, fairness and transparency; purpose limitation; minimization; accuracy; storage limitation; integrity and confidentiality; accountability. Articles 12–22 address rights to information, access, rectification, erasure, restriction, portability, objection, and rights concerning automated decisions, subject to applicable conditions. Article 44 governs international and onward transfers."
            ],
            [
              "HIPAA",
              "PHI means protected health information. A cloud provider creating, receiving, maintaining, or transmitting ePHI for a regulated entity is a business associate; the parties must sign a BAA and meet applicable HIPAA obligations."
            ],
            [
              "FedRAMP",
              "Current Classes A / B / C / D map to legacy Ready / Low / Moderate / High. Classes describe assessment-package depth, not a product security rating."
            ]
          ]
        },
        {
          "head": [
            "Claude capability",
            "Official scope and conditions"
          ],
          "rows": [
            [
              "BAA",
              "Claude API: sign a BAA, enable HIPAA readiness for the organization, and use eligible features; ZDR is not an additional requirement."
            ],
            [
              "ZDR",
              "Eligible API prompts and responses are not stored at rest after the response. Customers request ZDR; the Anthropic account team enables it separately for each organization, subject to feature, model, flagged-content, and legal-hold exceptions."
            ],
            [
              "Residency",
              "inference_geo controls inference (us / global) for Claude 4.6 and later models on the Claude API and Claude Platform on AWS. On Bedrock and Google Cloud, the endpoint URL or inference profile determines the inference region; this parameter does not apply. Workspace geo controls storage at rest and endpoint processing, currently us only. (official page, 2026-09-29)"
            ],
            [
              "Cloud FedRAMP",
              "The Public Sector FAQ lists three FedRAMP High paths: Claude for Government, Amazon Bedrock in AWS GovCloud, and Google Vertex AI with Assured Workloads. FedRAMP and DoD Impact Levels certify cloud services (IaaS / PaaS / SaaS); models are software components deployed in authorized environments. Customers maintain compliance through the hosting platform. (official page, 2026-09-29)"
            ]
          ]
        },
        {
          "v": "Architecture controls: GDPR Articles 25 and 32 call for appropriate, risk-based measures such as pseudonymization; default processing limits cover necessary data, storage, and access. The HHS Security Rule includes access controls and mechanisms to record and examine activity in systems using ePHI."
        },
        {
          "title": "Decision rules (engineering heuristics)",
          "v": [
            "If handling PHI → check the BAA and feature eligibility, because coverage is conditional.",
            "If geography is constrained → check inference and storage separately, because the settings are independent.",
            "If adopting a FedRAMP service → check agency ATO separately, because certification does not grant agency authority to operate."
          ]
        },
        {
          "title": "Common traps (engineering heuristics)",
          "v": [
            "Assume pseudonymization removes GDPR scope: re-identifiable data remains personal data.",
            "Assume ZDR covers every feature: the eligibility table includes exclusions.",
            "Treat a signed BAA as completed compliance: customer obligations still apply."
          ]
        },
        {
          "head": [
            "Scenario signal (engineering heuristics)",
            "Preferred direction"
          ],
          "rows": [
            [
              "Minimization and purpose limitation",
              "GDPR Article 5"
            ],
            [
              "PHI in cloud services",
              "Business associate and BAA"
            ],
            [
              "Data location",
              "Separate inference from storage"
            ],
            [
              "High label",
              "Check the FAQ's three paths and cloud-service authorization scope; do not treat it as model certification"
            ]
          ]
        }
      ]
    },
    "5.5": {
      "title": "Address ethical AI considerations (bias, fairness, transparency)",
      "blocks": [
        {
          "title": "What this objective tests",
          "v": "Check differences across groups, disclose AI involvement, the basis for decisions, and limitations, and provide a human appeal path."
        },
        {
          "head": [
            "Bias source (engineering heuristics)",
            "Detection and mitigation"
          ],
          "rows": [
            [
              "Data",
              "Missing groups, biased labels, or historical records → inspect coverage and labeling; add representative examples."
            ],
            [
              "Prompts",
              "Wording, examples, or demographic stereotypes change judgments → compare paired prompts while holding task facts fixed."
            ],
            [
              "Evaluation",
              "Rubrics, judges, or sample distributions favor a group → audit by group, calibrate with experts, and report sample sizes."
            ]
          ]
        },
        {
          "v": "Historical research example: Anthropic’s 2023 study varied demographic attributes across 70 decision scenarios and found positive and negative discrimination in some Claude 2.0 settings. Prompt interventions reduced these differences; the paper did not endorse or permit automated decisions in the high-risk cases studied. This does not establish that current models are unbiased. Source: (official page, checked 2026-09-29)."
        },
        {
          "head": [
            "Fairness check (engineering heuristics)",
            "Method and interpretation"
          ],
          "rows": [
            [
              "Group metrics",
              "Compare accuracy, false rejection, missed errors, and service quality across relevant groups. Report denominators and uncertainty; avoid strong conclusions from small samples."
            ],
            [
              "Controlled comparisons",
              "Hold qualifications, facts, and task fixed; vary only the demographic attribute under examination. Repeat trials and have humans assess whether differences are task-relevant."
            ],
            [
              "Verify mitigation",
              "Inspect data, prompts, and evaluators; rerun affected-group and overall evaluations after changes. A high aggregate score does not establish fairness for each group."
            ]
          ]
        },
        {
          "v": "Transparency: the Usage Policy requires consumer-facing chatbots, including external interactive agents, to disclose AI interaction at least at the start of every chat session. Heuristic: also show verifiable sources, evidence gaps, and capability limits; explain how to correct data, reach a human, and appeal, and record the outcome. Disclosure does not remove bias or replace the review in 5.3."
        },
        {
          "title": "Decision rules (engineering heuristics)",
          "v": [
            "If the aggregate score is high but one group faces more false rejections → diagnose by group, because averages conceal differences.",
            "If changing only a demographic attribute changes the result → review paired cases, because the attribute may be irrelevant.",
            "If a user disputes a result → provide evidence and a human appeal, because explanatory prose does not establish fairness."
          ]
        },
        {
          "title": "Common traps (engineering heuristics)",
          "v": [
            "Declare fairness after removing demographic fields: other fields may retain associations.",
            "Accept the model’s own bias assessment: the evaluator also needs calibration.",
            "Offer only an AI disclaimer: users still lack correction and appeal paths."
          ]
        },
        {
          "head": [
            "Scenario signal (engineering heuristics)",
            "Preferred direction"
          ],
          "rows": [
            [
              "Poor experience for a minority group",
              "Group-level metrics"
            ],
            [
              "Same qualifications, different outcomes",
              "Paired comparisons"
            ],
            [
              "Grader favors a style of expression",
              "Calibrate rubric and judge"
            ],
            [
              "Users unaware of AI involvement",
              "Disclosure at session start"
            ],
            [
              "No owner for disputed decisions",
              "Human appeals and correction"
            ]
          ]
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
