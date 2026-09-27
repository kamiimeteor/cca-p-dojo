/* Claude Certified Architect – Professional 笔记骨架：7 个 Domain，38 个 Task Statement，4 个附录小节。 */
const EXAM_META = {
  title: 'Claude Certified Architect – Professional',
  code: 'CCAR-P',
  passScore: 720, fullScore: 1000,
  items: 63, minutes: 120,
  fee: '$175 USD',
  validity: '12 个月（到期前可免费在线续证）',
  taskStatements: 38,
  delivery: 'Pearson VUE 线上远程监考 或 考场',
  resultReporting: '通过/未通过 + 换算分（100–1000），并按 Domain 给出正确率',
  prereq: '无强制前置。建议 3 年以上系统架构经验、6 个月以上 Claude / LLM 生产实践',
  format: '单选 + 多选混合，每题会写明要选几项',
  guessNote: '猜错不扣分 → 不会就猜，别空着',
  scenarios: ['金融', '医疗', '零售', '科技', '教育', '政府'],
  scenarioNote: 'CCAR-P 没有固定场景库，按 Domain 权重抽题；行业标签只标注题目背景',
  mnemonic: '集成 19 架构 17 评估 16 治理 14 沟通 14 模型 13 提效 7（前三个 Domain 占 52%）',
  guideUrl: 'https://anthropic-partners.skilljar.com/claude-certified-architect-professional-certification',
};

const NOTES = [
  {
    "id": "d1",
    "title": "Solution Design & Architecture",
    "zh": "解决方案设计与架构",
    "weight": 17,
    "taskCount": 6,
    "blurb": "",
    "sections": [
      {
        "id": "1.1",
        "title": "把业务问题转化为 Claude 方案",
        "blocks": [
          {
            "t": "p",
            "v": "（待写）"
          }
        ]
      },
      {
        "id": "1.2",
        "title": "端到端架构：输入→处理→输出→反馈闭环",
        "blocks": [
          {
            "t": "p",
            "v": "（待写）"
          }
        ]
      },
      {
        "id": "1.3",
        "title": "选择架构模式：workflow / agentic / augmented LLM",
        "blocks": [
          {
            "t": "p",
            "v": "（待写）"
          }
        ]
      },
      {
        "id": "1.4",
        "title": "多 Agent 系统与编排策略",
        "blocks": [
          {
            "t": "p",
            "v": "（待写）"
          }
        ]
      },
      {
        "id": "1.5",
        "title": "复杂问题的分解技术",
        "blocks": [
          {
            "t": "p",
            "v": "（待写）"
          }
        ]
      },
      {
        "id": "1.6",
        "title": "对齐业务价值支柱",
        "blocks": [
          {
            "t": "p",
            "v": "（待写）"
          }
        ]
      }
    ]
  },
  {
    "id": "d2",
    "title": "Claude Models, Prompting & Context Engineering",
    "zh": "Claude 模型、提示与上下文工程",
    "weight": 13,
    "taskCount": 5,
    "blurb": "",
    "sections": [
      {
        "id": "2.1",
        "title": "按取舍选择 Claude 模型",
        "blocks": [
          {
            "t": "p",
            "v": "（待写）"
          }
        ]
      },
      {
        "id": "2.2",
        "title": "System prompt、模板与护栏",
        "blocks": [
          {
            "t": "p",
            "v": "（待写）"
          }
        ]
      },
      {
        "id": "2.3",
        "title": "提示技术：zero-shot / few-shot / CoT",
        "blocks": [
          {
            "t": "p",
            "v": "（待写）"
          }
        ]
      },
      {
        "id": "2.4",
        "title": "上下文窗口与 token 管理",
        "blocks": [
          {
            "t": "p",
            "v": "（待写）"
          }
        ]
      },
      {
        "id": "2.5",
        "title": "提示复用：缓存、模块化提示、Skills",
        "blocks": [
          {
            "t": "p",
            "v": "（待写）"
          }
        ]
      }
    ]
  },
  {
    "id": "d3",
    "title": "Integration",
    "zh": "集成",
    "weight": 19,
    "taskCount": 8,
    "blurb": "",
    "sections": [
      {
        "id": "3.1",
        "title": "工具/Agent 配置的能力膨胀",
        "blocks": [
          {
            "t": "p",
            "v": "（待写）"
          }
        ]
      },
      {
        "id": "3.2",
        "title": "认证授权与安全缺口",
        "blocks": [
          {
            "t": "p",
            "v": "（待写）"
          }
        ]
      },
      {
        "id": "3.3",
        "title": "准确率与延迟的取舍",
        "blocks": [
          {
            "t": "p",
            "v": "（待写）"
          }
        ]
      },
      {
        "id": "3.4",
        "title": "大规模可观测性与监控策略",
        "blocks": [
          {
            "t": "p",
            "v": "（待写）"
          }
        ]
      },
      {
        "id": "3.5",
        "title": "RAG 管道：分块与索引",
        "blocks": [
          {
            "t": "p",
            "v": "（待写）"
          }
        ]
      },
      {
        "id": "3.6",
        "title": "按数据形态与查询模式选检索策略",
        "blocks": [
          {
            "t": "p",
            "v": "（待写）"
          }
        ]
      },
      {
        "id": "3.7",
        "title": "集成机制：MCP / API·CLI / agent-to-agent",
        "blocks": [
          {
            "t": "p",
            "v": "（待写）"
          }
        ]
      },
      {
        "id": "3.8",
        "title": "渐进式发现 vs 一次性全量上下文",
        "blocks": [
          {
            "t": "p",
            "v": "（待写）"
          }
        ]
      }
    ]
  },
  {
    "id": "d4",
    "title": "Evaluation, Testing & Optimization",
    "zh": "评估、测试与优化",
    "weight": 16,
    "taskCount": 6,
    "blurb": "",
    "sections": [
      {
        "id": "4.1",
        "title": "定义评估指标",
        "blocks": [
          {
            "t": "p",
            "v": "（待写）"
          }
        ]
      },
      {
        "id": "4.2",
        "title": "评估数据集与混合方法测试框架",
        "blocks": [
          {
            "t": "p",
            "v": "（待写）"
          }
        ]
      },
      {
        "id": "4.3",
        "title": "A/B 测试与迭代改进",
        "blocks": [
          {
            "t": "p",
            "v": "（待写）"
          }
        ]
      },
      {
        "id": "4.4",
        "title": "诊断系统问题：提示失效、幻觉、模型不匹配",
        "blocks": [
          {
            "t": "p",
            "v": "（待写）"
          }
        ]
      },
      {
        "id": "4.5",
        "title": "优化 token、延迟与性价比",
        "blocks": [
          {
            "t": "p",
            "v": "（待写）"
          }
        ]
      },
      {
        "id": "4.6",
        "title": "日志与可观测性监控",
        "blocks": [
          {
            "t": "p",
            "v": "（待写）"
          }
        ]
      }
    ]
  },
  {
    "id": "d5",
    "title": "Governance, Safety & Risk Management",
    "zh": "治理、安全与风险管理",
    "weight": 14,
    "taskCount": 5,
    "blurb": "",
    "sections": [
      {
        "id": "5.1",
        "title": "护栏与安全控制",
        "blocks": [
          {
            "t": "p",
            "v": "（待写）"
          }
        ]
      },
      {
        "id": "5.2",
        "title": "LLM 系统的风险、局限与失效模式",
        "blocks": [
          {
            "t": "p",
            "v": "（待写）"
          }
        ]
      },
      {
        "id": "5.3",
        "title": "人在回路验证策略",
        "blocks": [
          {
            "t": "p",
            "v": "（待写）"
          }
        ]
      },
      {
        "id": "5.4",
        "title": "合规：GDPR / HIPAA / FedRAMP",
        "blocks": [
          {
            "t": "p",
            "v": "（待写）"
          }
        ]
      },
      {
        "id": "5.5",
        "title": "伦理：偏见、公平、透明",
        "blocks": [
          {
            "t": "p",
            "v": "（待写）"
          }
        ]
      }
    ]
  },
  {
    "id": "d6",
    "title": "Stakeholder Communication & Lifecycle Management",
    "zh": "干系人沟通与生命周期管理",
    "weight": 14,
    "taskCount": 5,
    "blurb": "",
    "sections": [
      {
        "id": "6.1",
        "title": "结构化需求发现",
        "blocks": [
          {
            "t": "p",
            "v": "（待写）"
          }
        ]
      },
      {
        "id": "6.2",
        "title": "沟通架构决策与取舍",
        "blocks": [
          {
            "t": "p",
            "v": "（待写）"
          }
        ]
      },
      {
        "id": "6.3",
        "title": "反馈闭环与预期对齐（含 SLA）",
        "blocks": [
          {
            "t": "p",
            "v": "（待写）"
          }
        ]
      },
      {
        "id": "6.4",
        "title": "架构文档与实施指导",
        "blocks": [
          {
            "t": "p",
            "v": "（待写）"
          }
        ]
      },
      {
        "id": "6.5",
        "title": "支撑生命周期各阶段",
        "blocks": [
          {
            "t": "p",
            "v": "（待写）"
          }
        ]
      }
    ]
  },
  {
    "id": "d7",
    "title": "Developer Productivity & Operational Enablement",
    "zh": "开发者生产力与运维赋能",
    "weight": 7,
    "taskCount": 3,
    "blurb": "",
    "sections": [
      {
        "id": "7.1",
        "title": "为团队配置 Claude 工具与环境（如 Claude Code）",
        "blocks": [
          {
            "t": "p",
            "v": "（待写）"
          }
        ]
      },
      {
        "id": "7.2",
        "title": "用 AI 工具改进开发流程",
        "blocks": [
          {
            "t": "p",
            "v": "（待写）"
          }
        ]
      },
      {
        "id": "7.3",
        "title": "支持调试与运维问题排查",
        "blocks": [
          {
            "t": "p",
            "v": "（待写）"
          }
        ]
      }
    ]
  },
  {
    "id": "ref",
    "title": "Appendix",
    "zh": "附录",
    "weight": 0,
    "taskCount": 0,
    "blurb": "",
    "sections": [
      {
        "id": "R.1",
        "title": "干扰项类型",
        "blocks": [
          {
            "t": "p",
            "v": "（待写）"
          }
        ]
      },
      {
        "id": "R.2",
        "title": "模型选型与成本速查",
        "blocks": [
          {
            "t": "p",
            "v": "（待写）"
          }
        ]
      },
      {
        "id": "R.3",
        "title": "术语表",
        "blocks": [
          {
            "t": "p",
            "v": "（待写）"
          }
        ]
      },
      {
        "id": "R.4",
        "title": "考场策略",
        "blocks": [
          {
            "t": "p",
            "v": "（待写）"
          }
        ]
      }
    ]
  }
];

/* 扁平索引：sectionId → { domainId, domainTitle, section } */
const SECTION_INDEX = (() => {
  const idx = {};
  NOTES.forEach((d) =>
    d.sections.forEach((s) => {
      idx[s.id] = { domainId: d.id, domainTitle: d.title, weight: d.weight, section: s };
    })
  );
  return idx;
})();
