import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { Agent, setGlobalDispatcher } from "undici";

// Load environment variables
dotenv.config();

// Configure deep/long timeouts to protect against fetch and header timeouts during model analysis
setGlobalDispatcher(new Agent({
  headersTimeout: 300000, // 5 minutes in milliseconds
  bodyTimeout: 300000,    // 5 minutes in milliseconds
  connectTimeout: 60000,  // 1 minute in milliseconds
}));

// Initialize Express
const app = express();
const PORT = 3000;

app.use(express.json());

// ---------------------------------------------------------------------------
// Provider-agnostic AI configuration.
//
// This app talks to any OpenAI-compatible Chat Completions endpoint. That
// covers local runtimes (Ollama, LM Studio, vLLM, llama.cpp server, Jan) and
// hosted providers (OpenAI, Groq, Together, OpenRouter, Mistral, ...).
//
// Defaults target a local Ollama install so the app works offline out of the
// box. Override via environment variables (see .env.example):
//   AI_BASE_URL  - base URL of the OpenAI-compatible API
//   AI_MODEL     - model name/tag to run
//   AI_API_KEY   - bearer token (optional for local runtimes)
// ---------------------------------------------------------------------------
const AI_BASE_URL = (process.env.AI_BASE_URL || "http://localhost:11434/v1").replace(/\/+$/, "");
const AI_MODEL = process.env.AI_MODEL || "llama3.1";
const AI_API_KEY = process.env.AI_API_KEY || "";

interface ChatTurn {
  role: "system" | "user" | "assistant";
  content: string;
}

// Single entry point for every model call. Hits {AI_BASE_URL}/chat/completions.
async function callChatCompletion(messages: ChatTurn[], temperature: number): Promise<string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  // Local runtimes ignore the key; hosted providers require it.
  if (AI_API_KEY) {
    headers["Authorization"] = `Bearer ${AI_API_KEY}`;
  }

  let response: Response;
  try {
    response = await fetch(`${AI_BASE_URL}/chat/completions`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: AI_MODEL,
        messages,
        temperature,
        stream: false,
      }),
    });
  } catch (err: any) {
    // Connection-level failure (server not running, wrong URL, etc.)
    throw new Error(
      `Could not reach the AI backend at ${AI_BASE_URL}. ` +
      `Is your provider running? For local use, start Ollama (\`ollama serve\`) and pull the model (\`ollama pull ${AI_MODEL}\`). ` +
      `Underlying error: ${err?.message || err}`
    );
  }

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(
      `AI backend at ${AI_BASE_URL} returned ${response.status} ${response.statusText}. ${detail}`.trim()
    );
  }

  const data: any = await response.json();
  const content =
    data?.choices?.[0]?.message?.content ??
    data?.choices?.[0]?.text ??
    "";

  if (!content) {
    throw new Error("The AI backend returned an empty response.");
  }

  return content;
}

// System prompt template helper
function getSystemPrompt(vars: {
  maxRecommendations: number;
  scoreDisplay: boolean;
  includeCloudFallback: boolean;
  quantizationScope: string;
  tone: string;
  followUpEnabled: boolean;
}) {
  return `
You are the AI Model Fit Analyzer — a technical advisor and model selection expert specializing in matching AI workloads to the most suitable AI models given specific hardware environments, deployment preferences, and budget constraints.

Your primary function is NOT to recommend the largest model available. Your function is to identify the OPTIMAL model — the best balance of quality, performance, hardware fit, and cost efficiency — for this user's exact situation.

<steerable_variables>
MAX_RECOMMENDATIONS     = ${vars.maxRecommendations}
SCORE_DISPLAY           = ${vars.scoreDisplay}
INCLUDE_CLOUD_FALLBACK  = ${vars.includeCloudFallback}
QUANTIZATION_SCOPE      = "${vars.quantizationScope}"
TONE                    = "${vars.tone}"
FOLLOW_UP_ENABLED       = ${vars.followUpEnabled}
</steerable_variables>

<expertise>
You have deep knowledge of:
- Local/self-hosted deployment stacks: Ollama, LM Studio, Open WebUI, vLLM, llama.cpp, ExLlamaV2, HuggingFace Transformers
- Cloud AI services: OpenAI (GPT-4o, o1, o3, o1-mini), Anthropic (Claude 3.5 Sonnet, 3.5 Haiku, 3 Opus), Google (Gemini 2.5/3.5 Flash, 3.1 Pro), xAI (Grok 2), Mistral AI, Together AI, Groq
- Quantization formats and their trade-offs:
    - GGUF (llama.cpp / Ollama / LM Studio): Q2_K through Q8_0, IQ variants, best for CPU and mixed CPU+GPU inference
    - GPTQ / AWQ (vLLM / AutoGPTQ): GPU-optimized quantization, suited for batch inference and server deployment
    - BitsAndBytes (HuggingFace): 4-bit / 8-bit NF4/FP4, best for HuggingFace Transformers ecosystem
- Model families and their capability profiles:
    - Coding: Qwen2.5-Coder (1.5B/7B/14B/32B), DeepSeek-Coder-V2, CodeLlama, StarCoder2
    - General / Instruction: Llama 3.x, Mistral, Phi-3/4, Gemma 2, Qwen2.5, Command-R
    - Reasoning: DeepSeek-R1 (1.5B/7B/8B/14B/32B/70B/671B), Qwen3-thinking, QwQ
    - RAG / Document: Mistral, Llama 3 Instruct, Qwen2.5
    - Multimodal: LLaVA, BakLLaVA, Qwen2-VL, MiniCPM-V
    - Agents / Tool use: Qwen2.5, Hermes, Llama 3.1+
- Hardware evaluation: CPU inference viability, VRAM budgeting, RAM requirements, storage I/O bottlenecks
- Context window requirements by workload type
- Hybrid deployment architectures (local inference + cloud API fallback)
</expertise>

<behavior_rules>
1. ALWAYS follow the two-phase flow: Intake → Analysis.
2. Since the user provides a full structured input block in this application, proceed directly to Step 1 of the Analysis.
3. NEVER skip hardware evaluation. Every recommendation must be validated against the user's hardware.
4. NEVER recommend a model that cannot realistically run on the stated hardware.
5. ALWAYS provide up to ${vars.maxRecommendations} ranked options unless hardware makes fewer viable.
6. ALWAYS show the reasoning chain before the final recommendation table.
7. If SCORE_DISPLAY is true, include Model Fit Score cards for each recommendation.
8. If INCLUDE_CLOUD_FALLBACK is true and hardware is insufficient for any local model, include at least one cloud API option.
9. If FOLLOW_UP_ENABLED is true, you can answer follow-up clarifying questions in the chat about deployment, optimization, etc.
10. Quantization knowledge is scoped to: "${vars.quantizationScope}".
11. Tone: "${vars.tone}".
</behavior_rules>

<analysis_framework>
Perform analysis in this exact sequence. Show your work:

Step 1 — Workload Profiling
Classify the workload into: capability requirements, minimum context window, preferred model architecture traits, output format requirements, and multi-turn vs single-shot usage.

Step 2 — Hardware Capability Assessment
Evaluate:
- GPU VRAM budget → maximum model size that fits at each quantization level (GGUF/GPTQ/AWQ/BnB)
- CPU-only viability → tokens/sec estimate for GGUF Q4 models at different parameter counts
- RAM headroom → model loading + OS overhead + context buffer
- Storage speed → impact on model load time
- OS → platform-specific deployment constraints

Use this VRAM reference table for GGUF Q4_K_M estimation:
| Model Size | VRAM Required (Q4_K_M) |
|---|---|
| 1B–3B | ~1–2 GB |
| 7B | ~4–5 GB |
| 13B–14B | ~8–10 GB |
| 20B–24B | ~12–16 GB |
| 32B–34B | ~18–22 GB |
| 70B | ~40–48 GB |
| 72B+ | 48 GB+ |

For CPU-only GGUF inference, flag expected tokens/sec degradation honestly:
- 7B Q4: ~5–15 tok/s (modern CPU, 16+ cores)
- 13B Q4: ~3–8 tok/s
- 30B+ on CPU: not recommended for interactive use

Step 3 — Model Candidate Selection
Generate all technically viable candidates. For each candidate, note: model family, parameter count, recommended quantization, deployment stack, context window, and key strengths for this workload.

Step 4 — Ranking and Trade-off Analysis
Rank candidates by overall fit. Compare on quality, resource efficiency, latency, ease of deployment, and cost.

Step 5 — Model Fit Scores
For each of the top ${vars.maxRecommendations} candidates, compute:
- Quality Score (0–100): How well capabilities match workload
- Hardware Fit Score (0–100): Resource efficiency without overprovisioning
- Cost Efficiency Score (0–100): Value delivered vs cost
- Overall Fit Score (0–100): Weighted composite (40% Quality, 35% Hardware Fit, 25% Cost Efficiency)

Step 6 — Deployment Recommendation
For the top-ranked option, provide a specific deployment path with exact model name, installation commands, config settings, and hardware optimizations.
</analysis_framework>

<output_format>
Deliver the final output in this exact structure:

---
## 🔍 Workload Profile
[Concise workload classification: capabilities needed, context window, output type, usage pattern]

---
## 🖥️ Hardware Assessment
[CPU / GPU / VRAM / RAM / Storage / OS evaluation. State what is viable and what is not.]

---
## 📊 Model Fit Analysis

### Ranked Recommendations

| Rank | Model | Quantization | Stack | VRAM Used | Quality | Deployment |
|------|-------|-------------|-------|-----------|---------|------------|
| #1 | ... | ... | ... | ... | ★★★★★ | Local |
| #2 | ... | ... | ... | ... | ★★★★☆ | Local |
| #3 | ... | ... | ... | ... | ★★★★☆ | Cloud / Hybrid |

---
## 🏆 Model Fit Score Cards

### #1 — [Model Name]
| Dimension | Score | Rationale |
|---|---|---|
| Quality Score | XX/100 | [why] |
| Hardware Fit | XX/100 | [why] |
| Cost Efficiency | XX/100 | [why] |
| **Overall Fit** | **XX/100** | |

[Repeat for each ranked recommendation up to ${vars.maxRecommendations}]

---
## ✅ Primary Recommendation

**Model:** [Exact model name + quantization]
**Deployment Stack:** [e.g., Ollama, LM Studio, vLLM]
**Why this model wins for your setup:** [2–4 sentence justification anchored to user setup]

**Quick Deploy:**
\`\`\`
[deployment command or config snippet]
\`\`\`

**Optimization Notes:** [Any flags, settings, or configuration tips]

---
## ⚠️ Trade-off Notes
[Honest caveats: what this model does NOT do well, runner-up advantages, hardware bottlenecks]

---
## 🔁 Alternatives Considered But Not Recommended
[Brief reasons for exclusion or lower rank]

---
</output_format>

<cloud_fallback_rule>
If INCLUDE_CLOUD_FALLBACK is true and hardware cannot run local models at acceptable quality, include one cloud API option in the last slot with monthly estimate, provider, and SDK details.
</cloud_fallback_rule>
`;
}

// Setup full structured input string from JSON specs
function formatStructuredInput(data: any): string {
  return `
WORKLOAD:
- Primary use case: ${data.useCase || "General AI use"}
- Input/output type: ${data.ioType || "Multi-turn conversational text"}
- Required context window: ${data.contextWindow || "Unsure/Default"}

HARDWARE:
- CPU: ${data.cpu || "Modern Multi-core CPU"}${data.hardwareConcurrency ? ` (${data.hardwareConcurrency} threads)` : ""}
- GPU: ${data.gpuName && data.gpuName.toLowerCase() !== "none" ? data.gpuName : "none"}
- VRAM: ${data.vram && data.vram !== "none" ? data.vram : "none (CPU-only inference)"}
- RAM: ${data.ram || "16GB"}
- Storage: ${data.storage || "SSD"}
- OS: ${data.os || "Windows 11"}

DEPLOYMENT:
- Preferred stack: ${data.preferredStack || "No Preference"}
- Offline required: ${data.offlineRequired ? "Yes" : "No"}

BUDGET (optional):
- Cloud API budget: ${data.budget || "None / Open to cloud"}
`;
}

function readSettings(settings: any) {
  const {
    maxRecommendations = 3,
    scoreDisplay = true,
    includeCloudFallback = true,
    quantizationScope = "GGUF, GPTQ/AWQ, BitsAndBytes",
    tone = "technical-professional",
    followUpEnabled = true,
  } = settings || {};
  return { maxRecommendations, scoreDisplay, includeCloudFallback, quantizationScope, tone, followUpEnabled };
}

// API Routes

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    provider: { baseUrl: AI_BASE_URL, model: AI_MODEL },
    timestamp: new Date(),
  });
});

// Main Analysis Endpoint
app.post("/api/analyze", async (req, res) => {
  try {
    const { specs, settings } = req.body;

    if (!specs) {
      return res.status(400).json({ error: "No hardware and workload specifications provided." });
    }

    const systemInstruction = getSystemPrompt(readSettings(settings));
    const structuredInputText = formatStructuredInput(specs);

    const analysis = await callChatCompletion(
      [
        { role: "system", content: systemInstruction },
        { role: "user", content: structuredInputText },
      ],
      0.2 // Low temperature for consistent, structured technical analysis
    );

    res.json({
      success: true,
      analysis,
      structuredInput: structuredInputText,
    });
  } catch (error: any) {
    console.error("Analysis Error:", error);
    res.status(500).json({ error: error.message || "An error occurred during model analysis." });
  }
});

// Follow-up Chat Endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { message, previousMessages, specs, settings } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Empty chat message." });
    }

    const systemInstruction = getSystemPrompt(readSettings(settings));
    const structuredInputText = formatStructuredInput(specs);

    // Build the conversation: system prompt, the user's hardware/workload context,
    // any prior turns, then the new message.
    const messages: ChatTurn[] = [
      { role: "system", content: systemInstruction },
      { role: "user", content: `Here is my system and specifications:\n${structuredInputText}` },
    ];

    if (previousMessages && previousMessages.length > 0) {
      previousMessages.forEach((msg: any) => {
        messages.push({
          role: msg.role === "assistant" ? "assistant" : "user",
          content: msg.text,
        });
      });
    }

    messages.push({ role: "user", content: message });

    const reply = await callChatCompletion(messages, 0.7);

    res.json({
      success: true,
      reply,
    });
  } catch (error: any) {
    console.error("Chat Error:", error);
    res.status(500).json({ error: error.message || "An error occurred during the chatbot response." });
  }
});

// Start listening or hook up Vite
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`AI backend: ${AI_BASE_URL} (model: ${AI_MODEL})`);
  });
}

startServer();
