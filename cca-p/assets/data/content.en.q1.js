/* 三道种子题的英文内容；答案下标沿用 questions.js。 */
Object.assign(CONTENT_EN.questions, {
  "q001": {
    "q": "A retailer’s support agent only handles ticket lookups and composes responses, but its configuration also includes refund and account-deletion tools. What should you do first to apply least privilege?",
    "o": [
      "Add detailed call logs while retaining refund and account-deletion tools",
      "Require confirmation before refunds and account deletion, keeping the tool configuration",
      "Remove refund and deletion tools; retain ticket lookup and response drafting",
      "Use a larger model so it can better judge which tools it should avoid"
    ],
    "e": "Refunds and account deletion are outside this agent’s responsibilities. Removing those tools eliminates the unnecessary capabilities from its configuration. See notes 3.1.",
    "w": {
      "0": "[Audit as prevention] Logs help investigate past actions, but do not prevent the agent from calling tools outside its responsibilities.",
      "1": "[Guarding excess capability] A confirmation dialog adds an approval step but retains capabilities the task does not need. Remove those tools instead.",
      "3": "[Model substitution] A larger model does not have fewer permissions. Model judgement cannot replace restrictions in the tool configuration."
    }
  },
  q002: {
    q: 'A finance advisory bot includes roughly 8k tokens of fixed instructions and compliance text in each call. The customer query varies, but this reference material stays identical. Which two changes reduce repeated-input costs without omitting any rules? Select 2 options.',
    o: ["Cut the compliance text down to its first few sections", "Move the unchanging instructions and policy text ahead of the per-request input", "Adopt a minimum-size model without evaluating its suitability", "Enable prompt caching to reuse the repeated static prefix", "Move the full policy into few-shot examples and continue sending it with every request"],
    e: 'Putting static content first creates a consistent prefix across requests. Prompt caching can reuse that prefix, reducing repeated input processing costs while retaining the full policy.',
    w: {
      0: "Truncating the policy removes constraints and violates the requirement to preserve it. It also fails to reuse repeated content.",
      2: "Selecting a minimum-size model without evaluation may reduce answer quality and does not eliminate repeated processing of static content.",
      4: "Reformatting policies as examples still sends the same content repeatedly. Changing its presentation alone does not enable caching.",
    },
  },
  "q003": {
    "q": "After a healthcare team reloads its knowledge base, the retrieval-assisted bot begins making factual errors while expressing high certainty. The team has kept the model release fixed, and measured response times are steady. Where should troubleshooting begin?",
    "o": [
      "Switch to a model stronger at factual answers, keeping the reloaded knowledge base",
      "Check document ingestion and indexing, then inspect retrieval of updated content",
      "Raise temperature to generate more varied answers from the same retrieved material",
      "Shorten user questions to make room for retrieved content"
    ],
    "e": "The errors began after the document refresh. Check ingestion, chunking, indexing and retrieval to verify that the model receives relevant, current evidence, then investigate other components as the evidence warrants. See notes 4.4.",
    "w": {
      "0": "[Model substitution] The model version is unchanged. The document update is the first relevant lead; replacing the model skips that investigation.",
      "2": "[Wrong-layer diagnosis] Raising temperature does not repair ingestion or retrieval problems introduced by the document refresh.",
      "3": "[Wrong-layer diagnosis] The evidence points to the document refresh; shortening questions does not repair indexing or retrieval."
    }
  },
});
