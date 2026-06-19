# AI Model Fit Analyzer

A hardware-to-LLM matching tool. Describe your machine (CPU, GPU/VRAM, RAM, OS) and
your workload (coding, RAG, reasoning, general chat), and it recommends the **optimal**
AI model for your setup — not just the biggest one — with quantization, deployment
stack, VRAM budgeting, and a ready-to-run deploy command.

It runs against **any OpenAI-compatible Chat Completions API**, so you can power it with
a local runtime or a hosted provider. It's built local-first and works fully offline with
**[Ollama](https://ollama.com)**.

## Features

- **Hardware auto-detection** — probes CPU threads, RAM, and GPU via the browser, all editable.
- **Workload presets** — coding assistant, offline RAG, deep reasoning, everyday assistant.
- **Ranked recommendations** with Model Fit Score cards (quality / hardware fit / cost).
- **VRAM ↔ RAM compatibility matrix** for local quantized models.
- **Follow-up chat** to ask deployment and optimization questions.
- **Integration portal** to test a live connection to your local Ollama / LM Studio / vLLM endpoint.
- **Steerable tuner** — control recommendation count, scoring, cloud fallback, quantization scope, and tone.

## Provider support

Works with any endpoint that speaks the OpenAI Chat Completions format:

| Provider  | `AI_BASE_URL`                       | API key |
|-----------|-------------------------------------|---------|
| Ollama    | `http://localhost:11434/v1`         | not needed |
| LM Studio | `http://localhost:1234/v1`          | not needed |
| vLLM      | `http://localhost:8000/v1`          | not needed |
| OpenAI    | `https://api.openai.com/v1`         | required |
| Groq      | `https://api.groq.com/openai/v1`    | required |
| Together / OpenRouter / Mistral / … | provider's base URL | required |

## Run locally

**Prerequisites:** [Node.js](https://nodejs.org) 18+, and (for local inference) [Ollama](https://ollama.com).

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure your provider — copy `.env.example` to `.env` and edit if needed:
   ```bash
   cp .env.example .env
   ```
   The defaults target a local Ollama install:
   ```ini
   AI_BASE_URL="http://localhost:11434/v1"
   AI_MODEL="llama3.1"
   AI_API_KEY=""
   ```

3. (Local / Ollama only) Make sure Ollama is running and the model is pulled:
   ```bash
   ollama serve
   ollama pull llama3.1
   ```

4. Start the app:
   ```bash
   npm run dev
   ```
   Then open http://localhost:3000.

## Build for production

```bash
npm run build
npm start
```

## Configuration

All AI configuration is via environment variables (see `.env.example`):

- `AI_BASE_URL` — base URL of the OpenAI-compatible endpoint.
- `AI_MODEL` — the model name/tag to run (must be available on your provider).
- `AI_API_KEY` — bearer token; leave empty for local runtimes, required for hosted providers.

## Tech stack

React 19 · Vite · Express · TypeScript · Tailwind CSS · Motion · Lucide icons.
