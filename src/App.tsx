import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Cpu,
  Layers,
  HardDrive,
  Settings,
  Sparkles,
  ArrowRight,
  Terminal,
  Copy,
  Check,
  RefreshCw,
  Info,
  AlertTriangle,
  Send,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  User,
  Monitor,
  CheckCircle,
  CheckCircle2,
  TrendingUp,
  Sliders,
  Database,
  Search,
  MessageSquare,
  BookOpen,
  Zap,
  Gauge,
  Activity,
  History,
  CornerDownRight,
  ShieldCheck,
  ShieldAlert,
  Download,
  Sun,
  Moon,
  Globe
} from "lucide-react";
import { SystemSpecs, SteerableSettings, ChatMessage } from "./types";
import { GPU_DATABASE } from "./data/gpuDatabase";
import { CPU_DATABASE } from "./data/cpuDatabase";
import CompatibilityMatrix from "./components/CompatibilityMatrix";
import IntegrationPortal from "./components/IntegrationPortal";

// Deep analysis presets for workload matching
const WORKLOAD_PRESETS = [
  {
    id: "coder",
    name: "💻 Coding Assistant",
    description: "Code generation, multi-file refactoring, script writing & debugging.",
    useCase: "Full-scale coding assistant, boilerplate generation, refactoring, and logic validation.",
    ioType: "Highly structured multi-turn conversation, extensive code blocks, JSON/Markdown output.",
    contextWindow: "32K (Medium source codebase)"
  },
  {
    id: "rag",
    name: "📂 Offline Knowledge Base (RAG)",
    description: "Semantic search and Q&A over local folders, PDFs, and documentation.",
    useCase: "Local Document Search, PDF/CSV parsing, answering queries scoped to offline documents.",
    ioType: "Long context queries with short, referenced summary answers.",
    contextWindow: "64K - 128K (Very long documents)"
  },
  {
    id: "reasoning",
    name: "🧠 Logical Reasoning (Deep Thinking)",
    description: "Complex math, multi-agent math analysis, logic puzzles, step-by-step thinking.",
    useCase: "Multi-step analytical reasoning, chain-of-thought analysis, mathematical constraints.",
    ioType: "Detailed logic, nested reasoning code, and progressive intermediate thought trees.",
    contextWindow: "16K - 32K"
  },
  {
    id: "assistant",
    name: "⚡ Everyday Agile Assistant",
    description: "Short emails, summarizing text, brainstorming, translations.",
    useCase: "General conversational support, content summaries, translating, everyday lookups.",
    ioType: "Fast multi-turn chat, conversational, concise free-text.",
    contextWindow: "8K (Light context)"
  }
];

export default function App() {
  // Page state setup
  useEffect(() => {
    document.title = "AI Model Fit Analyzer — Local & Cloud Optimizer";
  }, []);

  // Detect initial specifications
  const getInitialSpecs = (): SystemSpecs => {
    let detectedOS: "Windows" | "macOS" | "Linux" = "Windows";
    const userAgent = navigator.userAgent;
    if (/Mac/i.test(userAgent)) {
      detectedOS = "macOS";
    } else if (/Linux/i.test(userAgent)) {
      detectedOS = "Linux";
    }

    // navigator.hardwareConcurrency reports logical processors (threads).
    const threads = navigator.hardwareConcurrency || 8;
    const cpuStr = `${threads}-Thread CPU (auto-detected)`;

    // Attempt to read navigator.deviceMemory which chrome sets (capped at 8GB for privacy)
    let memoryStr = "16GB";
    const deviceMemory = (navigator as any).deviceMemory;
    if (deviceMemory) {
      memoryStr = deviceMemory >= 8 ? "16GB (Est. overrides 8GB browser limitation)" : `${deviceMemory}GB`;
    }

    let gpuName = "Generic Graphics Processor";
    let vramEstimate = "8GB";

    try {
      const canvas = document.createElement("canvas");
      const gl = (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")) as any;
      if (gl) {
        const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
        if (debugInfo) {
          const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
          if (renderer) {
            gpuName = renderer;
            const nameLower = renderer.toLowerCase();

            // Intel integrated vs NVIDIA vs AMD
            if (nameLower.includes("rtx 5090")) {
              vramEstimate = "32GB";
            } else if (nameLower.includes("rtx 5080")) {
              vramEstimate = "16GB";
            } else if (nameLower.includes("rtx 5070 ti") || nameLower.includes("5070ti")) {
              vramEstimate = "16GB";
            } else if (nameLower.includes("rtx 5070")) {
              vramEstimate = "12GB";
            } else if (nameLower.includes("rtx 5060 ti") || nameLower.includes("5060ti")) {
              vramEstimate = "16GB";
            } else if (nameLower.includes("rtx 5060") || nameLower.includes("rtx 5050")) {
              vramEstimate = "8GB";
            } else if (nameLower.includes("rtx 4090")) {
              vramEstimate = "24GB";
            } else if (nameLower.includes("rtx 4080")) {
              vramEstimate = "16GB";
            } else if (nameLower.includes("rtx 4070 ti") || nameLower.includes("4070ti")) {
              vramEstimate = "12GB";
            } else if (nameLower.includes("rtx 4070") || nameLower.includes("rtx 3080") || nameLower.includes("3080")) {
              vramEstimate = "12GB";
            } else if (nameLower.includes("rtx 3070") || nameLower.includes("rtx 4060") || nameLower.includes("3060 ti")) {
              vramEstimate = "8GB";
            } else if (nameLower.includes("rtx 3060")) {
              vramEstimate = "12GB";
            } else if (nameLower.includes("gtx 1080") || nameLower.includes("rtx 2070")) {
              vramEstimate = "8GB";
            } else if (nameLower.includes("gtx 1660") || nameLower.includes("rx 580")) {
              vramEstimate = "6GB";
            } else if (nameLower.includes("rx 7900 xtx")) {
              vramEstimate = "24GB";
            } else if (nameLower.includes("rx 7900 xt")) {
              vramEstimate = "20GB";
            } else if (nameLower.includes("rx 7800 xt") || nameLower.includes("rx 6800")) {
              vramEstimate = "16GB";
            } else if (nameLower.includes("rx 6700") || nameLower.includes("rx 7700")) {
              vramEstimate = "12GB";
            } else if (nameLower.includes("m1") || nameLower.includes("m2") || nameLower.includes("m3") || nameLower.includes("apple") || nameLower.includes("metal")) {
              vramEstimate = memoryStr;
              gpuName = "Apple Silicon Native (Unified Architecture)";
            } else if (nameLower.includes("intel") || nameLower.includes("iris") || nameLower.includes("uhd")) {
              vramEstimate = "Shared System VRAM";
              gpuName = "Intel Integrated Graphics";
            }
          }
        }
      }
    } catch (e) {
      console.warn("Could not query GPU via WebGL browser interface", e);
    }

    // Clean browser ANGLE prefix if present
    if (gpuName.includes("ANGLE (")) {
      const match = gpuName.match(/ANGLE \([^,]+,\s*([^,)]+)/);
      if (match && match[1]) {
        gpuName = match[1].trim();
      }
    }

    // Strip trailing PCI device id some drivers append, e.g. " (0x00002D04)"
    gpuName = gpuName.replace(/\s*\(0x[0-9a-fA-F].*$/i, "").trim();
    // Drop a trailing " Direct3D11..." / vendor suffix if present
    gpuName = gpuName.replace(/\s+Direct3D.*$/i, "").trim();

    return {
      cpu: cpuStr,
      cpuCores: 0, // unknown from the browser; set when a CPU model is picked
      hardwareConcurrency: threads,
      gpuName: gpuName,
      vram: vramEstimate,
      ram: memoryStr,
      storage: "SSD",
      os: detectedOS,
      useCase: WORKLOAD_PRESETS[0].useCase,
      ioType: WORKLOAD_PRESETS[0].ioType,
      contextWindow: WORKLOAD_PRESETS[0].contextWindow,
      preferredStack: "Ollama",
      offlineRequired: false,
      budget: "under $10/month"
    };
  };

  // State Management
  const [specs, setSpecs] = useState<SystemSpecs>(getInitialSpecs());
  const [activePreset, setActivePreset] = useState<string>("coder");
  const [isRefreshingSpecs, setIsRefreshingSpecs] = useState<boolean>(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [showGpuDropdown, setShowGpuDropdown] = useState<boolean>(false);
  const [showCpuDropdown, setShowCpuDropdown] = useState<boolean>(false);

  // Settings Panel State
  const [settings, setSettings] = useState<SteerableSettings>({
    maxRecommendations: 3,
    scoreDisplay: true,
    includeCloudFallback: true,
    quantizationScope: "GGUF, GPTQ/AWQ, BitsAndBytes",
    tone: "technical-professional",
    followUpEnabled: true,
  });

  // Analysis Result State
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisCompleted, setAnalysisCompleted] = useState<boolean>(false);
  const [analysisMarkdown, setAnalysisMarkdown] = useState<string>("");
  const [previousStructuredInput, setPreviousStructuredInput] = useState<string>("");
  const [currentStepText, setCurrentStepText] = useState<string>("");

  // Chats State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState<string>("");
  const [isWaitingOnChat, setIsWaitingOnChat] = useState<boolean>(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Stats / History tab
  const [tab, setTab] = useState<"advisor" | "tuner" | "integration">("advisor");
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    return (localStorage.getItem("fit_analyzer_theme") as "dark" | "light") || "dark";
  });
  const [showMatrix, setShowMatrix] = useState<boolean>(() => {
    const saved = localStorage.getItem("fit_analyzer_show_matrix");
    return saved === null ? true : saved === "true";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.add("light");
    } else {
      root.classList.remove("light");
    }
    localStorage.setItem("fit_analyzer_theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("fit_analyzer_show_matrix", String(showMatrix));
  }, [showMatrix]);

  const [historyList, setHistoryList] = useState<{ id: string; time: string; verdict: string; specs: SystemSpecs }[]>([]);

  // Auto scroll chat to bottom when message arrives
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  // Load history from localStorage
  useEffect(() => {
    const list = localStorage.getItem("ai_analyzer_history");
    if (list) {
      try {
        setHistoryList(JSON.parse(list));
      } catch (e) {
        console.error("Failed to load history list", e);
      }
    }
  }, []);

  // Save to history helper
  const saveToHistory = (markdownText: string, specState: SystemSpecs) => {
    // Try to parse a quick summary name from markdown
    let verdict = "Optimized Report";
    const titleMatch = markdownText.match(/\*\*Model:\*\*\s*(.+)/i);
    if (titleMatch && titleMatch[1]) {
      verdict = titleMatch[1].split("\n")[0].replace(/[\[\]]/g, "").trim();
    }

    const newHistory = [
      {
        id: Math.random().toString(36).substring(7),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        verdict: verdict,
        specs: { ...specState },
      },
      ...historyList
    ].slice(0, 5); // Keep last 5

    setHistoryList(newHistory);
    localStorage.setItem("ai_analyzer_history", JSON.stringify(newHistory));
  };

  // Re-detect/reset specs
  const handleRefreshSpecs = () => {
    setIsRefreshingSpecs(true);
    setTimeout(() => {
      setSpecs(getInitialSpecs());
      setIsRefreshingSpecs(false);
    }, 900);
  };

  // Handle Preset Change
  const applyWorkloadPreset = (presetId: string) => {
    setActivePreset(presetId);
    const preset = WORKLOAD_PRESETS.find(p => p.id === presetId);
    if (preset) {
      setSpecs(prev => ({
        ...prev,
        useCase: preset.useCase,
        ioType: preset.ioType,
        contextWindow: preset.contextWindow
      }));
    }
  };

  // Launch analysis
  const handleAnalyzeSpecs = async () => {
    setIsAnalyzing(true);
    setAnalysisCompleted(false);
    setAnalysisMarkdown("");
    setChatMessages([]);

    const steps = [
      "Gathering hardware specifications & browser telemetry...",
      "Matching processor concurrency tables...",
      "Mapping VRAM headroom and bandwidth constraints...",
      "Querying local quantization feasibility model database...",
      "Determining GGUF, GPTQ & AWQ performance bottlenecks...",
      "Ranking top Candidates with the AI reasoning engine...",
      "Preparing structured deployment blueprint cards..."
    ];

    let currentStep = 0;
    setCurrentStepText(steps[0]);

    // Simple ticker effect
    const ticker = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setCurrentStepText(steps[currentStep]);
      } else {
        clearInterval(ticker);
      }
    }, 450);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          specs,
          settings,
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      clearInterval(ticker);

      if (data.success) {
        setAnalysisMarkdown(data.analysis);
        setPreviousStructuredInput(data.structuredInput);
        setAnalysisCompleted(true);
        saveToHistory(data.analysis, specs);
      } else {
        throw new Error(data.error || "Analysis failed.");
      }
    } catch (error: any) {
      console.error(error);
      setAnalysisMarkdown(`### ⚠️ Connection or API Error\nFailed to establish connection to the backend advisor. Details:\n\n\`\`\`\n${error.message || error}\n\`\`\`\n\n**To resolve:**\n1. Confirm the backend dev server is active (\`npm run dev\`).\n2. Make sure your AI provider is running. For local use, start Ollama with \`ollama serve\` and pull a model (e.g. \`ollama pull llama3.1\`).\n3. Check \`AI_BASE_URL\`, \`AI_MODEL\`, and \`AI_API_KEY\` in your \`.env\` file.`);
      setAnalysisCompleted(true);
    } finally {
      clearInterval(ticker);
      setIsAnalyzing(false);
    }
  };

  // Chat message send
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isWaitingOnChat) return;

    const userText = chatInput.trim();
    const newUserMessage: ChatMessage = {
      id: Math.random().toString(),
      role: "user",
      text: userText,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, newUserMessage]);
    setChatInput("");
    setIsWaitingOnChat(true);

    try {
      // Re-map actual state list to plain backend array
      const previousHistoryList = chatMessages.map(msg => ({
        role: msg.role === "user" ? "user" : "assistant",
        text: msg.text
      }));

      // Append the initial analysis so the model knows what it recommended!
      previousHistoryList.unshift({
        role: "assistant",
        text: analysisMarkdown
      });

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          previousMessages: previousHistoryList,
          specs,
          settings,
        })
      });

      if (!response.ok) {
        throw new Error("Chat connection failed.");
      }

      const data = await response.json();
      if (data.success) {
        const assistantMsg: ChatMessage = {
          id: Math.random().toString(),
          role: "assistant",
          text: data.reply,
          timestamp: new Date()
        };
        setChatMessages(prev => [...prev, assistantMsg]);
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      console.error("Chat Error:", error);
      const errorMsg: ChatMessage = {
        id: Math.random().toString(),
        role: "assistant",
        text: `Error contacting the AI Advisor: ${error.message || "Please check your network connection."}`,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsWaitingOnChat(false);
    }
  };

  // Helper to copy strings to clipboard
  const handleCopyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Export diagnostic configuration profile as JSON
  const handleExportConfigJSON = () => {
    const profileData = {
      profileName: `AI-Fit-Profile-${specs.gpuName.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase() || "cpu-only"}`,
      timestamp: new Date().toISOString(),
      metadata: {
        toolName: "AI Model Fit Analyzer",
        version: "1.0.4",
      },
      hardwareSpecs: {
        cpu: specs.cpu,
        cpuCores: specs.cpuCores,
        hardwareConcurrency: specs.hardwareConcurrency,
        gpuName: specs.gpuName,
        vram: specs.vram,
        ram: specs.ram,
        os: specs.os,
        storage: specs.storage
      },
      workloadProfile: {
        useCase: specs.useCase,
        ioType: specs.ioType,
        contextWindow: specs.contextWindow,
        offlineRequired: specs.offlineRequired,
        budget: specs.budget
      },
      steerableSettings: {
        maxRecommendations: settings.maxRecommendations,
        scoreDisplay: settings.scoreDisplay,
        includeCloudFallback: settings.includeCloudFallback,
        quantizationScope: settings.quantizationScope,
        tone: settings.tone
      },
      scoresEvaluated: parsedScores || [],
      advisorReportMarkdown: analysisMarkdown
    };

    const blob = new Blob([JSON.stringify(profileData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ai-model-fit-profile-${specs.gpuName.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase() || "cpu"}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Quick Parser for Score Cards in Markdown
  // Searches for structures like "Quality Score | 85/100" or similar
  const extractScoreMap = () => {
    if (!analysisMarkdown) return null;
    const scores: { name: string; quality: number; hardware: number; cost: number; overall: number }[] = [];
    
    // We can parse blocks starting with "## 🏆 Model Fit Score Cards"
    const scoreSection = analysisMarkdown.split("## 🏆 Model Fit Score Cards");
    if (scoreSection.length > 1) {
      const cardsText = scoreSection[1].split("## ")[0]; // Get everything up to next section
      // Match something like "### #1 — DeepSeek-R1-8B"
      const modelBlocks = cardsText.split("### ");
      for (let i = 1; i < modelBlocks.length; i++) {
        const block = modelBlocks[i];
        const lines = block.split("\n");
        const name = lines[0].trim();
        
        // Find numbers with regex
        let quality = 80;
        let hardware = 80;
        let cost = 80;
        let overall = 80;

        lines.forEach(line => {
          if (/Quality/i.test(line)) {
            const num = line.match(/(\d+)\/100/);
            if (num) quality = parseInt(num[1]);
          }
          if (/Hardware/i.test(line)) {
            const num = line.match(/(\d+)\/100/);
            if (num) hardware = parseInt(num[1]);
          }
          if (/Cost/i.test(line)) {
            const num = line.match(/(\d+)\/100/);
            if (num) cost = parseInt(num[1]);
          }
          if (/Overall/i.test(line)) {
            const num = line.match(/(\d+)\/100/);
            if (num) overall = parseInt(num[1]);
          }
        });

        scores.push({ name, quality, hardware, cost, overall });
      }
    }
    return scores.length > 0 ? scores : null;
  };

  // Extract primary recommendation command
  const extractQuickDeployCommand = () => {
    if (!analysisMarkdown) return null;
    const deploySection = analysisMarkdown.match(/```\s*([\s\S]*?)```/);
    if (deploySection && deploySection[1]) {
      return deploySection[1].trim();
    }
    return "ollama run qwen2.5-coder:7b-instruct";
  };

  const parsedScores = extractScoreMap();
  const rawDeployCommand = extractQuickDeployCommand();

  return (
    <div id="app-root" className="min-h-screen bg-zinc-950 text-zinc-300 font-sans antialiased flex flex-col selection:bg-cyan-500 selection:text-black">
      
      {/* Top Navigation Bar */}
      <header className="border-b border-zinc-800 bg-zinc-900/95 backdrop-blur sticky top-0 z-50 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-cyan-950 text-cyan-400 rounded border border-cyan-800 flex items-center justify-center">
            <Activity className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white uppercase flex items-center space-x-2">
              <span>AI Model Fit Analyzer</span>
              <span className="text-cyan-500 text-xs font-mono tracking-normal ml-2">v1.0.4</span>
            </h1>
            <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest font-semibold">Hardware-to-LLM Alignment Interface</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 font-mono">
          <button 
            type="button"
            onClick={() => setTab("advisor")}
            className={`px-2.5 py-1.5 rounded text-[11px] font-bold uppercase tracking-tight transition flex items-center space-x-1 border ${
              tab === "advisor" 
                ? "bg-cyan-600 border-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.25)] text-white" 
                : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white"
            }`}
          >
            <Activity className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Advisor report</span>
          </button>

          <button 
            type="button"
            onClick={() => setTab("integration")}
            className={`px-2.5 py-1.5 rounded text-[11px] font-bold uppercase tracking-tight transition flex items-center space-x-1 border ${
              tab === "integration" 
                ? "bg-cyan-600 border-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.25)] text-white" 
                : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white"
            }`}
          >
            <Globe className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Local & Paid Cloud</span>
          </button>

          <button 
            type="button"
            onClick={() => setTab("tuner")}
            className={`px-2.5 py-1.5 rounded text-[11px] font-bold uppercase tracking-tight transition flex items-center space-x-1 border ${
              tab === "tuner" 
                ? "bg-cyan-600 border-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.25)] text-white" 
                : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white"
            }`}
          >
            <Sliders className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Steerable Tuner</span>
          </button>

          {/* Theme Switcher Button */}
          <button
            type="button"
            onClick={() => setTheme(p => p === "dark" ? "light" : "dark")}
            className="p-1 px-2.5 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition flex items-center justify-center cursor-pointer"
            title={theme === "dark" ? "Toggle Light Mode" : "Toggle Dark Mode"}
          >
            {theme === "dark" ? (
              <Sun className="h-3.5 w-3.5" />
            ) : (
              <Moon className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Specs Detector and Settings (5 cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          
          {/* Diagnostic Auto-Detect Panel */}
          <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 w-40 h-40 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-center justify-between mb-3 border-b border-zinc-800 pb-3">
              <div className="flex items-center space-x-2">
                <h2 className="text-xs font-bold text-zinc-400 uppercase border-l-2 border-cyan-500 pl-2">1. Hardware Diagnostics</h2>
              </div>
              <button 
                onClick={handleRefreshSpecs} 
                disabled={isRefreshingSpecs}
                className="text-cyan-400 hover:text-cyan-300 flex items-center text-[10px] font-mono space-x-1 px-2 py-0.5 rounded bg-cyan-950/40 border border-cyan-800/50 transition disabled:opacity-50 uppercase tracking-tighter"
              >
                <RefreshCw className={`h-3 w-3 ${isRefreshingSpecs ? 'animate-spin' : ''}`} />
                <span>{isRefreshingSpecs ? 'Probing...' : 'Re-probe'}</span>
              </button>
            </div>

            {/* Quick Warning about browser limitation */}
            <div className="mb-3 text-[11px] bg-amber-950/20 border border-amber-800/30 text-amber-200 p-3 rounded flex items-start space-x-2">
              <Info className="h-3.5 w-3.5 shrink-0 text-amber-400 mt-0.5" />
              <span>
                <strong>System Buffer Notice:</strong> Browser privacy constraints cap reported RAM memory. Adjust detected fields below to sync with actual specs.
              </span>
            </div>

            {/* Editing / Customizing Hardware fields */}
            <div className="space-y-3 font-sans text-xs">
              
              {/* CPU Model Search lookup */}
              <div className="grid grid-cols-3 items-center gap-2 relative">
                <label className="text-zinc-500 font-bold text-[10px] uppercase tracking-wider font-mono">CPU Model</label>
                <div className="col-span-2 relative">
                  <div className="relative">
                    <input
                      type="text"
                      value={specs.cpu}
                      onChange={(e) => {
                        setSpecs(p => ({ ...p, cpu: e.target.value }));
                        setShowCpuDropdown(true);
                      }}
                      onFocus={() => setShowCpuDropdown(true)}
                      onBlur={() => setTimeout(() => setShowCpuDropdown(false), 250)}
                      className="w-full bg-zinc-950 border border-zinc-850 rounded pl-7 pr-2.5 py-1 text-white font-mono text-xs focus:border-cyan-500 focus:outline-none"
                      placeholder="e.g. Search Ryzen 5 5600X..."
                    />
                    <Search className="absolute left-2 top-1.5 h-3.5 w-3.5 text-zinc-500" />
                  </div>
                  {/* Dropdown popup overlay */}
                  {showCpuDropdown && specs.cpu.trim().length > 0 && (
                    <div className="absolute left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-zinc-950 border border-zinc-800 rounded z-50 shadow-2xl font-mono text-[11px] divide-y divide-zinc-900">
                      {CPU_DATABASE.filter(chip => chip.name.toLowerCase().includes(specs.cpu.toLowerCase()))
                        .slice(0, 6)
                        .map((chip, cIdx) => (
                          <button
                            key={cIdx}
                            type="button"
                            onClick={() => {
                              setSpecs(p => ({
                                ...p,
                                cpu: chip.name,
                                cpuCores: chip.cores,
                                hardwareConcurrency: chip.threads
                              }));
                              setShowCpuDropdown(false);
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-zinc-900 text-zinc-350 hover:text-white transition flex justify-between items-center"
                          >
                            <span className="truncate">{chip.name}</span>
                            <span className="text-[10px] text-cyan-400 font-bold shrink-0">{chip.cores}C / {chip.threads}T</span>
                          </button>
                        ))}
                      {CPU_DATABASE.filter(chip => chip.name.toLowerCase().includes(specs.cpu.toLowerCase())).length === 0 && (
                        <div className="px-3 py-2 text-zinc-650 italic">No matching CPU found — typed value is still used</div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Cores / Threads readout (follows the selected CPU model) */}
              <div className="grid grid-cols-3 items-center gap-2">
                <label className="text-zinc-500 font-bold text-[10px] uppercase tracking-wider font-mono">Cores / Threads</label>
                <div className="col-span-2 flex items-center space-x-2">
                  <div className="flex-1 bg-zinc-950 border border-zinc-850 rounded px-2.5 py-1 flex items-center space-x-3 font-mono">
                    <span className="flex items-center space-x-1">
                      <Cpu className="h-3 w-3 text-emerald-400" />
                      <span className="text-cyan-400 font-bold">{specs.cpuCores > 0 ? specs.cpuCores : "—"}</span>
                      <span className="text-zinc-500 text-[10px] uppercase">Cores</span>
                    </span>
                    <span className="text-zinc-700">|</span>
                    <span className="flex items-center space-x-1">
                      <Activity className="h-3 w-3 text-cyan-400" />
                      <span className="text-cyan-400 font-bold">{specs.hardwareConcurrency}</span>
                      <span className="text-zinc-500 text-[10px] uppercase">Threads</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* RAM Dropdown Selector */}
              <div className="grid grid-cols-3 items-center gap-2">
                <label className="text-zinc-500 font-bold text-[10px] uppercase tracking-wider font-mono">System RAM</label>
                <div className="col-span-2 relative">
                  <select
                    value={specs.ram}
                    onChange={(e) => setSpecs(p => ({ ...p, ram: e.target.value }))}
                    className="w-full bg-zinc-950 border border-zinc-850 rounded px-2.5 py-1 text-white text-xs font-mono appearance-none focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="4GB">4 GB DDR4/DDR5</option>
                    <option value="8GB">8 GB DDR4/DDR5</option>
                    <option value="12GB">12 GB DDR4/DDR5</option>
                    <option value="16GB">16 GB DDR4/DDR5 (Recommended Min)</option>
                    <option value="24GB">24 GB DDR4/DDR5</option>
                    <option value="32GB">32 GB DDR4/DDR5</option>
                    <option value="64GB">64 GB DDR4/DDR5</option>
                    <option value="96GB">96 GB DDR4/DDR5</option>
                    <option value="128GB">128 GB DDR4/DDR5 (High-End Lab)</option>
                    <option value="192GB+">192+ GB Enterprise Workstation</option>
                    <option value="18GB Unified">18 GB Unified (Apple M Pro)</option>
                    <option value="36GB Unified">36 GB Unified (Apple M Pro/Max)</option>
                    <option value="48GB Unified">48 GB Unified (Apple M Max)</option>
                    <option value="64GB Unified">64 GB Unified (Apple M Max/Ultra)</option>
                    <option value="96GB Unified">96 GB Unified (Apple M Max)</option>
                    <option value="128GB Unified">128 GB Unified (Apple M Max/Ultra)</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1.5 h-3.5 w-3.5 pointer-events-none text-zinc-505" />
                </div>
              </div>

              {/* GPU Name Search lookup */}
              <div className="grid grid-cols-3 items-center gap-2 relative">
                <label className="text-zinc-500 font-bold text-[10px] uppercase tracking-wider font-mono flex items-center">
                  <span>GPU Card</span>
                </label>
                <div className="col-span-2 relative">
                  <div className="relative">
                    <input
                      type="text"
                      value={specs.gpuName}
                      onChange={(e) => {
                        setSpecs(p => ({ ...p, gpuName: e.target.value }));
                        setShowGpuDropdown(true);
                      }}
                      onFocus={() => setShowGpuDropdown(true)}
                      onBlur={() => setTimeout(() => setShowGpuDropdown(false), 250)}
                      className="w-full bg-zinc-950 border border-zinc-850 rounded pl-7 pr-2.5 py-1 text-white font-mono text-xs focus:border-cyan-500 focus:outline-none"
                      placeholder="e.g. Search RTX 4080..."
                    />
                    <Search className="absolute left-2 top-1.5 h-3.5 w-3.5 text-zinc-500" />
                  </div>
                  {/* Dropdown popup overlay */}
                  {showGpuDropdown && specs.gpuName.trim().length > 0 && (
                    <div className="absolute left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-zinc-950 border border-zinc-800 rounded z-50 shadow-2xl font-mono text-[11px] divide-y divide-zinc-900">
                      {GPU_DATABASE.filter(gpu => gpu.name.toLowerCase().includes(specs.gpuName.toLowerCase()))
                        .slice(0, 5)
                        .map((card, cIdx) => (
                          <button
                            key={cIdx}
                            type="button"
                            onClick={() => {
                              let finalVram = card.vram;
                              if (card.brand === "Apple") {
                                finalVram = specs.ram; // Apple silicon unified memory default
                              }
                              setSpecs(p => ({
                                ...p,
                                gpuName: card.name,
                                vram: finalVram
                              }));
                              setShowGpuDropdown(false);
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-zinc-900 text-zinc-350 hover:text-white transition flex justify-between items-center"
                          >
                            <span className="truncate">{card.name}</span>
                            <span className="text-[10px] text-cyan-400 font-bold shrink-0">{card.vram === "Shared System VRAM" ? "Unified" : card.vram}</span>
                          </button>
                        ))}
                      {GPU_DATABASE.filter(gpu => gpu.name.toLowerCase().includes(specs.gpuName.toLowerCase())).length === 0 && (
                        <div className="px-3 py-2 text-zinc-650 italic">No matching card found</div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* VRAM Dropdown Selection */}
              <div className="grid grid-cols-3 items-center gap-2">
                <label className="text-zinc-500 font-bold text-[10px] uppercase tracking-wider font-mono">GPU VRAM</label>
                <div className="col-span-2 relative">
                  <select
                    value={specs.vram}
                    onChange={(e) => setSpecs(p => ({ ...p, vram: e.target.value }))}
                    className="w-full bg-zinc-950 border border-zinc-850 rounded px-2.5 py-1 text-white text-xs font-mono appearance-none focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="none">No GPU (CPU-Only Inference)</option>
                    <option value="Shared System VRAM">Shared Memory (Intel Core HD/Iris)</option>
                    <option value="2GB">2 GB VRAM</option>
                    <option value="4GB">4 GB VRAM (Lightweight)</option>
                    <option value="6GB">6 GB VRAM</option>
                    <option value="8GB">8 GB VRAM (Standard GTX/RTX)</option>
                    <option value="10GB">10 GB VRAM</option>
                    <option value="12GB">12 GB VRAM (Excellent Local Fit)</option>
                    <option value="16GB">16 GB VRAM (Generous Mid-range)</option>
                    <option value="20GB">20 GB VRAM</option>
                    <option value="24GB">24 GB VRAM (RTX 3090/4090/Studio)</option>
                    <option value="48GB">48 GB VRAM (Dual GPU / RTX A6000)</option>
                    <option value="80GB+">80+ GB VRAM (H100 / Enterprise cluster)</option>
                    <option value={specs.ram}>Shared Unified Architecture ({specs.ram})</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1.5 h-3.5 w-3.5 pointer-events-none text-zinc-505" />
                </div>
              </div>

              {/* OS / Storage Row */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-zinc-500 text-[10px] font-bold uppercase mb-1 font-mono">Platform OS</label>
                  <div className="relative">
                    <select
                      value={specs.os}
                      onChange={(e) => setSpecs(p => ({ ...p, os: e.target.value as any }))}
                      className="w-full bg-zinc-950 border border-zinc-850 rounded px-2 py-1 text-white text-xs font-mono appearance-none focus:border-cyan-500 focus:outline-none"
                    >
                      <option value="Windows">Windows</option>
                      <option value="macOS">macOS</option>
                      <option value="Linux">Linux</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1.5 h-3.5 w-3.5 pointer-events-none text-zinc-505" />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-500 text-[10px] font-bold uppercase mb-1 font-mono">Storage Type</label>
                  <div className="relative">
                    <select
                      value={specs.storage}
                      onChange={(e) => setSpecs(p => ({ ...p, storage: e.target.value as any }))}
                      className="w-full bg-zinc-950 border border-zinc-850 rounded px-2 py-1 text-white text-xs font-mono appearance-none focus:border-cyan-500 focus:outline-none"
                    >
                      <option value="NVMe">NVMe SSD (Optimal)</option>
                      <option value="SSD">SATA SSD (Standard)</option>
                      <option value="HDD">HDD Mech (Extremely Slow)</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1.5 h-3.5 w-3.5 pointer-events-none text-zinc-505" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* User Workload Presets Panel */}
          <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded flex flex-col space-y-3">
            <div className="flex items-center space-x-2 border-b border-zinc-800 pb-3">
              <h2 className="text-xs font-bold text-zinc-400 uppercase border-l-2 border-emerald-500 pl-2">2. LLM Workload Profile</h2>
            </div>

            {/* Grid selector of workload presets */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {WORKLOAD_PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => applyWorkloadPreset(p.id)}
                  className={`p-2.5 text-left rounded transition border text-xs flex flex-col space-y-0.5 ${
                    activePreset === p.id
                      ? "bg-zinc-900 border-cyan-500 text-white shadow-[0_0_10px_rgba(6,182,212,0.15)]"
                      : "bg-zinc-950/40 border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                  }`}
                >
                  <span className="font-semibold text-[11px]">{p.name}</span>
                  <span className="text-[10px] text-zinc-500 line-clamp-1 leading-normal">{p.description}</span>
                </button>
              ))}
            </div>

            {/* Display / edit workload parameters */}
            <div className="bg-zinc-950 p-3 rounded border border-zinc-850 space-y-2.5 text-xs">
              <div>
                <label className="text-[10px] text-zinc-500 uppercase font-mono font-bold block mb-1">Target AI Primary Objective</label>
                <textarea
                  rows={2}
                  value={specs.useCase}
                  onChange={(e) => setSpecs(p => ({ ...p, useCase: e.target.value }))}
                  className="w-full bg-zinc-950 border border-zinc-850 rounded p-2 text-white font-sans text-xs focus:border-cyan-500 focus:outline-none resize-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-zinc-500 uppercase font-mono font-bold block mb-0.5">Prompt Length Format</label>
                  <input
                    type="text"
                    value={specs.ioType}
                    onChange={(e) => setSpecs(p => ({ ...p, ioType: e.target.value }))}
                    className="w-full bg-zinc-950 border border-zinc-850 rounded p-1.5 text-white font-sans text-xs focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-500 uppercase font-mono font-bold block mb-0.5">Required Context Size</label>
                  <select
                    value={specs.contextWindow}
                    onChange={(e) => setSpecs(p => ({ ...p, contextWindow: e.target.value }))}
                    className="w-full bg-zinc-950 border border-zinc-850 rounded p-1.5 text-white font-sans text-xs"
                  >
                    <option value="8K">8K (Standard short task)</option>
                    <option value="16K">16K (Covers multi-turn chat)</option>
                    <option value="32K">32K (Large files, refactoring)</option>
                    <option value="64K">64K (Entire folders, tiny DBs)</option>
                    <option value="128K">128K (Very complex codebase RAG)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Offline and Budget Settings */}
            <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
              <div className="flex items-center space-x-2 border border-zinc-800 p-2.5 rounded bg-zinc-950/50">
                <input
                  type="checkbox"
                  id="offline-checkbox"
                  checked={specs.offlineRequired}
                  onChange={(e) => setSpecs(p => ({ ...p, offlineRequired: e.target.checked }))}
                  className="h-3.5 w-3.5 bg-zinc-950 border border-zinc-800 rounded accent-cyan-500 cursor-pointer"
                />
                <label htmlFor="offline-checkbox" className="font-semibold text-zinc-400 text-[11px] select-none cursor-pointer">
                  Strict Local Offline
                </label>
              </div>

              <div className="space-y-1">
                <select
                  value={specs.budget}
                  onChange={(e) => setSpecs(p => ({ ...p, budget: e.target.value }))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1.5 text-zinc-300 font-mono text-xs"
                >
                  <option value="none">Strictly $0 (FOSS Only)</option>
                  <option value="under $10/month">Under $10 / month</option>
                  <option value="$10-$30/month">$10 – $30 / month</option>
                  <option value="open budget">Paid Unlimited API Keys</option>
                </select>
              </div>
            </div>
          </div>

          {/* Matrix visibility checkbox */}
          <div className="flex items-center space-x-2 border border-zinc-800 p-2.5 rounded bg-zinc-950/40 text-xs font-mono">
            <input
              type="checkbox"
              id="show-compat-matrix"
              checked={showMatrix}
              onChange={(e) => setShowMatrix(e.target.checked)}
              className="h-3.5 w-3.5 bg-zinc-950 border border-zinc-800 rounded accent-cyan-500 cursor-pointer"
            />
            <label htmlFor="show-compat-matrix" className="font-semibold text-zinc-350 select-none cursor-pointer">
              Show Local VRAM / RAM Compatibility Matrix
            </label>
          </div>

          {/* VRAM / RAM Real-time Compatibility Matrix */}
          {showMatrix && (
            <CompatibilityMatrix vramStr={specs.vram} ramStr={specs.ram} />
          )}

          {/* Trigger Scan Button */}
          <button
            onClick={handleAnalyzeSpecs}
            disabled={isAnalyzing}
            className="w-full py-3.5 px-6 rounded font-bold uppercase tracking-wider text-xs text-white shadow-[0_0_15px_rgba(34,211,238,0.15)] bg-cyan-600 hover:bg-cyan-500 border border-cyan-400 transition-all duration-200 transform active:scale-[0.98] disabled:opacity-85 disabled:pointer-events-none flex items-center justify-center space-x-2 cursor-pointer"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin text-white" />
                <span className="font-mono tracking-wider">Processing Diagnostics...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-cyan-200 animate-pulse" />
                <span>Run Hardware Fit AI Engine</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Dynamic Analysis Outcomes and interactive dialog area (7 cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          
          <AnimatePresence mode="wait">
            
            {/* Show Integration Gateway Portal */}
            {tab === "integration" ? (
              <motion.div
                key="integration-panel"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="bg-zinc-900/50 border border-zinc-800 p-4 rounded flex-1 flex flex-col space-y-4"
              >
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <div className="flex items-center space-x-2.5">
                    <div>
                      <h3 className="font-bold text-zinc-200 text-xs uppercase font-mono tracking-wider flex items-center space-x-1.5">
                        <Globe className="h-4 w-4 text-cyan-400" />
                        <span>Workplace Integration Gateway / Sandbox</span>
                      </h3>
                      <p className="text-[10px] text-zinc-500 font-mono">Connect and test real local models or compute cloud-spent API subscriptions</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setTab("advisor")}
                    className="text-[10px] font-bold font-mono uppercase tracking-wider px-2.5 py-1 bg-zinc-950 text-zinc-400 hover:text-white rounded border border-zinc-805"
                  >
                    Back to Report
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto max-h-[75vh] pr-1">
                  <IntegrationPortal systemVram={specs.vram} systemRam={specs.ram} />
                </div>
              </motion.div>
            ) : tab === "tuner" ? (
              <motion.div
                key="tuner-panel"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="bg-zinc-900/50 border border-zinc-800 p-4 rounded flex-1 flex flex-col space-y-4"
              >
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <div className="flex items-center space-x-2.5">
                    <div>
                      <h3 className="font-bold text-zinc-200 text-xs uppercase font-mono tracking-wider">AI Steerable Tuner Variables</h3>
                      <p className="text-[10px] text-zinc-500 font-mono">Steering properties for matching reasoning patterns</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setTab("advisor")}
                    className="text-[10px] font-bold font-mono uppercase tracking-wider px-2.5 py-1 bg-zinc-950 text-zinc-400 hover:text-white rounded border border-zinc-805"
                  >
                    Back to Report
                  </button>
                </div>

                <div className="space-y-4 flex-1 select-none font-sans text-xs">
                  
                  {/* Recommendations count slider */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-zinc-400 uppercase font-mono text-[10px] tracking-wider flex items-center space-x-1">
                        <span>Max Recommendations Count</span>
                      </span>
                      <span className="font-mono text-cyan-400 font-bold">{settings.maxRecommendations} models</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={settings.maxRecommendations}
                      onChange={(e) => setSettings(p => ({ ...p, maxRecommendations: parseInt(e.target.value) }))}
                      className="w-full accent-cyan-500 h-1 bg-zinc-800 rounded"
                    />
                  </div>

                  {/* Local VRAM / RAM Compatibility Matrix optional checkbox */}
                  <div className="flex items-center justify-between border-t border-zinc-800 pt-3 font-mono">
                    <div>
                      <span className="font-bold text-zinc-300 text-[10px] uppercase block tracking-wider">Display VRAM / RAM Fit Matrix</span>
                      <span className="text-[10px] text-zinc-500">Enable or disable real-time compatibility matrix in Left Panel</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={showMatrix}
                      onChange={(e) => setShowMatrix(e.target.checked)}
                      className="h-4 w-4 bg-zinc-950 accent-cyan-500 rounded cursor-pointer"
                    />
                  </div>

                  {/* Score Display Card Switches */}
                  <div className="flex items-center justify-between border-t border-zinc-800 pt-3">
                    <div>
                      <span className="font-bold text-zinc-400 text-[10px] uppercase font-mono block tracking-wider">Show Model Fit Score Cards</span>
                      <span className="text-[10px] text-zinc-500 font-mono">Evaluates composite metrics based on your VRAM limits</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.scoreDisplay}
                      onChange={(e) => setSettings(p => ({ ...p, scoreDisplay: e.target.checked }))}
                      className="h-4 w-4 bg-zinc-950 accent-cyan-500 rounded cursor-pointer"
                    />
                  </div>

                  {/* Cloud fallback toggle */}
                  <div className="flex items-center justify-between border-t border-zinc-800 pt-3">
                    <div>
                      <span className="font-bold text-zinc-400 text-[10px] uppercase font-mono block tracking-wider">Include Cloud LLM Fallbacks</span>
                      <span className="text-[10px] text-zinc-500 font-mono">Adds low-latency fallback APIs if your hardware bottlenecks</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.includeCloudFallback}
                      onChange={(e) => setSettings(p => ({ ...p, includeCloudFallback: e.target.checked }))}
                      className="h-4 w-4 bg-zinc-950 accent-cyan-500 rounded cursor-pointer"
                    />
                  </div>

                  {/* Quantization Targets */}
                  <div className="space-y-1 border-t border-zinc-800 pt-3">
                    <label className="font-bold text-zinc-400 text-[10px] uppercase font-mono block tracking-wider">Quantization Formats Scoped</label>
                    <input
                      type="text"
                      value={settings.quantizationScope}
                      onChange={(e) => setSettings(p => ({ ...p, quantizationScope: e.target.value }))}
                      className="w-full bg-zinc-950 border border-zinc-850 rounded px-2.5 py-1 text-white font-mono text-xs focus:border-cyan-500"
                    />
                    <p className="text-[9px] text-zinc-500 font-mono">Defaults GGUF (Ollama/LM Studio), GPTQ/AWQ (vLLM), BitsAndBytes</p>
                  </div>

                  {/* Tone of Analyzer */}
                  <div className="space-y-1 border-t border-zinc-800 pt-3">
                    <span className="font-bold text-zinc-400 text-[10px] uppercase font-mono block tracking-wider">Advice Output Tone</span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setSettings(p => ({ ...p, tone: "technical-professional" }))}
                        className={`py-1.5 px-2 rounded border font-mono text-[10px] uppercase tracking-tighter transition ${
                          settings.tone === "technical-professional"
                            ? "bg-zinc-900 border-cyan-500 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.1)]"
                            : "bg-zinc-950/40 border-zinc-850 text-zinc-500"
                        }`}
                      >
                        Technical-Professional
                      </button>
                      <button
                        onClick={() => setSettings(p => ({ ...p, tone: "beginner-friendly" as any }))}
                        className={`py-1.5 px-2 rounded border font-mono text-[10px] uppercase tracking-tighter transition ${
                          settings.tone === "beginner-friendly"
                            ? "bg-zinc-900 border-cyan-500 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.1)]"
                            : "bg-zinc-950/40 border-zinc-855 text-zinc-500"
                        }`}
                      >
                        Beginner-Friendly
                      </button>
                    </div>
                  </div>

                  {/* Save Settings confirmation */}
                  <div className="bg-emerald-950/20 border border-emerald-900/30 p-2.5 rounded text-emerald-400 text-[11px] flex items-center space-x-2">
                    <Info className="h-3.5 w-3.5 shrink-0" />
                    <span>Your steering configurations have been loaded. Any run will now obey these custom variables.</span>
                  </div>

                </div>

                <button 
                  onClick={() => setTab("advisor")}
                  className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 border border-cyan-400 text-white font-mono uppercase tracking-wider font-bold text-xs rounded transition cursor-pointer"
                >
                  Done, Go to Hardware Fit Engine
                </button>
              </motion.div>
            ) : isAnalyzing ? (
              
              /* Processing Telemetry Loader State */
              <motion.div
                key="loading-panel"
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.99 }}
                className="bg-zinc-900/50 border border-zinc-800 p-6 rounded flex-1 flex flex-col items-center justify-center min-h-[400px]"
              >
                <div className="relative flex items-center justify-center p-6 mb-4">
                  <div className="absolute w-16 h-16 border-2 border-t-cyan-500 border-r-transparent border-dashed rounded-full animate-spin" />
                  <div className="relative bg-zinc-950 p-3 rounded border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
                    <Terminal className="h-6 w-6 animate-pulse" />
                  </div>
                </div>

                <h3 className="text-white text-sm font-bold font-mono tracking-wider uppercase mb-1 flex items-center space-x-2">
                  <span>Advising Fit Matrix</span>
                  <span className="inline-block w-1.5 h-3 bg-cyan-400 animate-pulse" />
                </h3>
                <p className="text-cyan-400 font-mono text-[11px] mb-4 min-h-[16px] text-center max-w-sm leading-relaxed px-4">
                  {currentStepText}
                </p>

                {/* Simulated Diagnostic Loading graph component */}
                <div className="w-full max-w-md bg-zinc-950 h-1.5 rounded overflow-hidden border border-zinc-800">
                  <motion.div 
                    initial={{ width: "5%" }}
                    animate={{ width: "95%" }}
                    transition={{ duration: 3.5, ease: "easeInOut" }}
                    className="h-full bg-cyan-500 rounded"
                  />
                </div>
              </motion.div>
            ) : !analysisCompleted ? (
              
              /* Idle Empty State */
              <motion.div
                key="idle-panel"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-zinc-900/50 border border-zinc-800 p-6 rounded flex-1 flex flex-col items-center justify-center min-h-[400px] text-center relative overflow-hidden"
              >
                <div className="absolute w-60 h-60 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
                
                {/* SVG Visual Chip */}
                <div className="bg-zinc-950 p-4 rounded border border-zinc-800 mb-4 text-cyan-400">
                  <Cpu className="h-10 w-10 animate-pulse" />
                </div>

                <h3 className="text-zinc-200 font-bold font-mono text-xs uppercase mb-1.5 tracking-wider">No Model Fit Report Rendered</h3>
                <p className="text-zinc-400 text-xs max-w-md leading-relaxed mb-4 font-sans">
                  Configure your hardware parameters in Section 1, choose your target workload type in Section 2, then click <strong>Run Hardware Fit AI Engine</strong> to initiate full recommendations.
                </p>

                {/* History list panel if present */}
                {historyList.length > 0 && (
                  <div className="w-full max-w-md bg-zinc-950 p-3 rounded border border-zinc-850 text-left">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider font-mono text-zinc-500 mb-2 flex items-center space-x-1.5">
                      <History className="h-3 w-3" />
                      <span>Recent Scan History Logs</span>
                    </h4>
                    <div className="space-y-1 font-mono text-[11px]">
                      {historyList.map((h, i) => (
                        <div 
                          key={h.id || i}
                          onClick={() => {
                            setSpecs(h.specs);
                            applyWorkloadPreset("custom"); // trigger custom to avoid preset overriding specs on render
                          }}
                          className="p-1.5 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 rounded flex items-center justify-between cursor-pointer group transition duration-150"
                        >
                          <div className="flex items-center space-x-1.5">
                            <CornerDownRight className="h-3 w-3 text-zinc-600" />
                            <span className="text-zinc-400 group-hover:text-cyan-400 truncate max-w-[170px]">{h.specs.cpu}</span>
                            <span className="text-zinc-600">|</span>
                            <span className="text-cyan-400 font-semibold">{h.specs.ram}</span>
                          </div>
                          <span className="text-[10px] text-zinc-600">{h.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              
              /* Active Analysis Presentation Dashboard */
              <motion.div
                key="result-panel"
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.99 }}
                className="flex-1 flex flex-col space-y-4"
              >
                {/* Visual Header Summary Banner Card */}
                <div className="bg-zinc-900 border border-zinc-805 p-4 rounded relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-3 bg-emerald-500/10 text-emerald-400 font-mono text-[9px] uppercase font-bold rounded-bl border-l border-b border-zinc-800 flex items-center space-x-1">
                    <span className="w-1 h-1 rounded-full bg-emerald-500 mr-1 animate-pulse"></span>
                    <span>Advisor Ready</span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-2.5 border-b border-zinc-800 pb-2.5">
                    <h3 className="text-zinc-200 text-xs uppercase font-mono tracking-wider font-bold">Model Optimization Blueprint</h3>
                    <button
                      onClick={handleExportConfigJSON}
                      className="self-start sm:self-auto px-2 py-0.5 bg-zinc-950 hover:bg-zinc-850 text-cyan-400 hover:text-cyan-350 border border-zinc-800 rounded font-mono text-[9px] uppercase font-bold tracking-tighter flex items-center space-x-1 transition cursor-pointer"
                    >
                      <Download className="h-3 w-3 shrink-0" />
                      <span>Export Profile JSON</span>
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 text-[11px] font-mono">
                    <span className="bg-zinc-950 text-zinc-350 px-2.5 py-0.5 rounded border border-zinc-850 flex items-center space-x-1">
                      <Cpu className="h-3 w-3 text-cyan-400" />
                      <span>{specs.cpu}</span>
                    </span>
                    <span className="bg-zinc-950 text-zinc-350 px-2.5 py-0.5 rounded border border-zinc-850 flex items-center space-x-1">
                      <Layers className="h-3 w-3 text-emerald-400" />
                      <span>{specs.ram} RAM</span>
                    </span>
                    {!specs.gpuName.includes("none") && specs.vram !== "none" && (
                      <span className="bg-zinc-950 text-zinc-350 px-2.5 py-0.5 rounded border border-zinc-850 flex items-center space-x-1">
                        <Zap className="h-3 w-3 text-amber-500 shrink-0" />
                        <span className="truncate max-w-[125px]">{specs.gpuName} ({specs.vram})</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Bento Score cards display (Optional based on toggle) */}
                {settings.scoreDisplay && parsedScores && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {parsedScores.slice(0, 1).map((s, idx) => (
                      <React.Fragment key={idx}>
                        {/* Overall Card */}
                        <div className="bg-zinc-900/50 border border-zinc-800 p-3 rounded flex flex-col items-center justify-center text-center relative overflow-hidden">
                          <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider font-mono mb-2">Overall Fit</span>
                          <div className="relative flex items-center justify-center mb-1">
                            {/* Visual Progress Doughnut Ring using inline svg */}
                            <svg className="w-14 h-14 transform -rotate-90">
                              <circle cx="28" cy="28" r="24" stroke="#27272a" strokeWidth="3.5" fill="transparent" />
                              <circle cx="28" cy="28" r="24" stroke="#06b6d4" strokeWidth="3.5" fill="transparent" 
                                      strokeDasharray={151} strokeDashoffset={151 - (151 * s.overall) / 100} />
                            </svg>
                            <span className="absolute text-xs font-bold font-mono text-zinc-200">{s.overall}%</span>
                          </div>
                          <span className="text-[10px] text-zinc-400 font-semibold truncate w-full px-1">{s.name.replace(/^[#\d\-\s—]+/, '')}</span>
                        </div>

                        {/* Quality Card */}
                        <div className="bg-zinc-900/50 border border-zinc-800 p-3 rounded flex flex-col items-center justify-center text-center">
                          <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider font-mono mb-2">Quality Grade</span>
                          <div className="relative flex items-center justify-center mb-1">
                            <svg className="w-14 h-14 transform -rotate-90">
                              <circle cx="28" cy="28" r="24" stroke="#27272a" strokeWidth="3.5" fill="transparent" />
                              <circle cx="28" cy="28" r="24" stroke="#10b981" strokeWidth="3.5" fill="transparent" 
                                      strokeDasharray={151} strokeDashoffset={151 - (151 * s.quality) / 100} />
                            </svg>
                            <span className="absolute text-xs font-bold font-mono text-zinc-200">{s.quality}</span>
                          </div>
                          <span className="text-[9px] text-emerald-400 font-bold flex items-center space-x-1 uppercase tracking-tighter">
                            <ShieldCheck className="h-3 w-3" />
                            <span>Precision Fit</span>
                          </span>
                        </div>

                        {/* Hardware Efficiency */}
                        <div className="bg-zinc-900/50 border border-zinc-800 p-3 rounded flex flex-col items-center justify-center text-center">
                          <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider font-mono mb-2">VRAM Buffer</span>
                          <div className="relative flex items-center justify-center mb-1">
                            <svg className="w-14 h-14 transform -rotate-90">
                              <circle cx="28" cy="28" r="24" stroke="#27272a" strokeWidth="3.5" fill="transparent" />
                              <circle cx="28" cy="28" r="24" stroke="#f59e0b" strokeWidth="3.5" fill="transparent" 
                                      strokeDasharray={151} strokeDashoffset={151 - (151 * s.hardware) / 100} />
                            </svg>
                            <span className="absolute text-xs font-bold font-mono text-zinc-200">{s.hardware}</span>
                          </div>
                          <span className="text-[9px] text-zinc-505 uppercase font-mono font-semibold">Allocated</span>
                        </div>

                        {/* Cost Score */}
                        <div className="bg-zinc-900/50 border border-zinc-800 p-3 rounded flex flex-col items-center justify-center text-center">
                          <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider font-mono mb-2">Resource Cost</span>
                          <div className="relative flex items-center justify-center mb-1">
                            <svg className="w-14 h-14 transform -rotate-90">
                              <circle cx="28" cy="28" r="24" stroke="#27272a" strokeWidth="3.5" fill="transparent" />
                              <circle cx="28" cy="28" r="24" stroke="#a855f7" strokeWidth="3.5" fill="transparent" 
                                      strokeDasharray={151} strokeDashoffset={151 - (151 * s.cost) / 100} />
                            </svg>
                            <span className="absolute text-xs font-bold font-mono text-zinc-200">{s.cost}</span>
                          </div>
                          <span className="text-[9px] text-cyan-405 font-bold font-mono uppercase tracking-tighter">100% Free FOSS</span>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                )}

                {/* Primary Report Viewer containing formatted markdown */}
                <div className="bg-zinc-900/50 border border-zinc-804 p-4 rounded leading-relaxed text-xs font-sans select-text scrollbar-thin overflow-y-auto max-h-[480px]">
                  
                  <div className="flex items-center space-x-2 border-b border-zinc-800 pb-2.5 mb-4">
                    <BookOpen className="text-cyan-400 h-4 w-4" />
                    <h4 className="font-bold text-zinc-300 tracking-wider uppercase font-mono text-xs">Structured Allocation Report</h4>
                  </div>

                  {/* Line-aware markdown renderer: tolerates missing blank lines
                      between headings/tables and strips --- horizontal rules. */}
                  <div className="space-y-3.5 text-zinc-350">
                    {(() => {
                      const lines = analysisMarkdown.split("\n");
                      const out: React.ReactNode[] = [];
                      let i = 0;
                      let key = 0;

                      // Render inline **bold** spans within a line of text.
                      const renderInline = (text: string) =>
                        text.split("**").map((frag, fIdx) =>
                          fIdx % 2 === 1
                            ? <strong key={fIdx} className="text-zinc-200 font-bold">{frag}</strong>
                            : <React.Fragment key={fIdx}>{frag}</React.Fragment>
                        );

                      const splitRow = (l: string) =>
                        l.replace(/^\s*\|/, "").replace(/\|\s*$/, "").split("|").map(c => c.trim());
                      const isSeparatorRow = (l: string) => /^\s*\|?[\s:|-]+\|?\s*$/.test(l) && l.includes("-");

                      while (i < lines.length) {
                        const line = lines[i].trim();

                        // Blank lines and --- horizontal rules: skip.
                        if (!line || /^-{3,}$/.test(line) || /^\*{3,}$/.test(line)) { i++; continue; }

                        // Headings (#### / ### / ## / #)
                        const heading = line.match(/^(#{1,4})\s+(.*)$/);
                        if (heading) {
                          const level = heading[1].length;
                          const text = heading[2];
                          if (level <= 2) {
                            out.push(
                              <h2 key={key++} className="text-xs font-bold text-zinc-200 border-b border-zinc-805 pb-1 pt-3 flex items-center uppercase tracking-wide font-mono">
                                {renderInline(text)}
                              </h2>
                            );
                          } else {
                            out.push(
                              <h3 key={key++} className="text-[11px] font-bold text-cyan-400 pt-1.5 flex items-center uppercase font-mono tracking-tight">
                                {renderInline(text)}
                              </h3>
                            );
                          }
                          i++;
                          continue;
                        }

                        // Fenced code block
                        if (line.startsWith("```")) {
                          i++; // skip opening fence
                          const codeLines: string[] = [];
                          while (i < lines.length && !lines[i].trim().startsWith("```")) {
                            codeLines.push(lines[i]);
                            i++;
                          }
                          i++; // skip closing fence
                          const code = codeLines.join("\n");
                          const codeId = `code_${key}`;
                          out.push(
                            <div key={key++} className="relative group my-2">
                              <div className="absolute right-2 top-2 z-10 flex space-x-1 opacity-0 group-hover:opacity-100 transition duration-150">
                                <button
                                  onClick={() => handleCopyToClipboard(code, codeId)}
                                  className="p-0.5 px-2 rounded bg-zinc-900 hover:bg-zinc-850 text-zinc-350 hover:text-white border border-zinc-800 text-[9px] transition flex items-center space-x-1 font-mono uppercase font-bold tracking-tighter"
                                >
                                  {copiedText === codeId ? (
                                    <><Check className="h-3 w-3 text-emerald-400" /><span>Copied!</span></>
                                  ) : (
                                    <><Copy className="h-3 w-3" /><span>Copy</span></>
                                  )}
                                </button>
                              </div>
                              <pre className="bg-zinc-950 border border-zinc-850 rounded p-3 overflow-x-auto text-emerald-400 text-xs font-mono select-text leading-relaxed">
                                <code>{code}</code>
                              </pre>
                            </div>
                          );
                          continue;
                        }

                        // Table: consecutive lines starting with |
                        if (line.startsWith("|")) {
                          const tableLines: string[] = [];
                          while (i < lines.length && lines[i].trim().startsWith("|")) {
                            tableLines.push(lines[i].trim());
                            i++;
                          }
                          const headers = splitRow(tableLines[0]);
                          const contentRows = tableLines
                            .slice(1)
                            .filter(l => !isSeparatorRow(l))
                            .map(splitRow);

                          out.push(
                            <div key={key++} className="overflow-x-auto my-3 border border-zinc-850 rounded bg-zinc-950">
                              <table className="w-full text-left text-[11px] font-mono border-collapse">
                                <thead>
                                  <tr className="bg-zinc-900 border-b border-zinc-850 text-zinc-400">
                                    {headers.map((header, hIdx) => (
                                      <th key={hIdx} className="p-2 font-semibold font-mono text-[9px] uppercase tracking-wider">{header}</th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-850">
                                  {contentRows.map((row, rIdx) => (
                                    <tr key={rIdx} className="hover:bg-zinc-900/40 text-zinc-300">
                                      {row.map((cell, cIdx) => (
                                        <td key={cIdx} className="p-2">
                                          {cell.includes("★★★") ? (
                                            <span className="text-amber-500 font-bold">{cell}</span>
                                          ) : cell.toLowerCase() === "local" ? (
                                            <span className="px-1.5 py-0.5 rounded bg-emerald-950/30 text-emerald-400 border border-emerald-900/30 text-[9px] font-bold uppercase tracking-tighter">Local</span>
                                          ) : cell.toLowerCase() === "cloud / hybrid" || cell.toLowerCase() === "cloud" ? (
                                            <span className="px-1.5 py-0.5 rounded bg-cyan-950/35 text-cyan-400 border border-cyan-855 text-[9px] font-bold uppercase tracking-tighter">Cloud</span>
                                          ) : (
                                            renderInline(cell)
                                          )}
                                        </td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          );
                          continue;
                        }

                        // Bullet list: consecutive - / * lines
                        if (/^[-*]\s+/.test(line)) {
                          const items: string[] = [];
                          while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
                            items.push(lines[i].trim().replace(/^[-*]\s+/, ""));
                            i++;
                          }
                          out.push(
                            <ul key={key++} className="list-disc pl-4 space-y-1 text-xs text-zinc-400">
                              {items.map((item, lIdx) => <li key={lIdx}>{renderInline(item)}</li>)}
                            </ul>
                          );
                          continue;
                        }

                        // Paragraph: gather consecutive plain lines
                        const paraLines: string[] = [];
                        while (i < lines.length) {
                          const l = lines[i].trim();
                          if (!l || /^-{3,}$/.test(l) || /^#{1,4}\s/.test(l) || l.startsWith("|") || l.startsWith("```") || /^[-*]\s+/.test(l)) break;
                          paraLines.push(l);
                          i++;
                        }
                        out.push(
                          <p key={key++} className="text-zinc-400 font-sans text-xs leading-relaxed">
                            {renderInline(paraLines.join(" "))}
                          </p>
                        );
                      }

                      return out;
                    })()}
                  </div>
                </div>
                               {/* Integration Command Snippet Card */}
                {rawDeployCommand && (
                  <div className="bg-zinc-950 border border-zinc-850 p-3 rounded flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-center space-x-2.5">
                      <div className="p-1.5 bg-cyan-950/40 text-cyan-400 rounded shrink-0 border border-cyan-900/40">
                        <Terminal className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider font-mono block">Direct Terminal Boot</span>
                        <code className="text-xs font-mono text-emerald-400">{rawDeployCommand.slice(0, 50)}{rawDeployCommand.length > 50 ? "..." : ""}</code>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopyToClipboard(rawDeployCommand, "quickboot")}
                      className="px-3 py-1 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded text-[10px] font-mono text-zinc-300 transition flex items-center justify-center space-x-1.5 shrink-0 cursor-pointer uppercase font-bold tracking-tight"
                    >
                      {copiedText === "quickboot" ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-400 animate-pulse" />
                          <span>Copied command!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3 text-zinc-505" />
                          <span>Copy CLI command</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Follow-up / Tuning Interactive Chat Panel (Optional) */}
                {settings.followUpEnabled && (
                  <div className="bg-zinc-900/50 border border-zinc-805 rounded flex flex-col overflow-hidden min-h-[350px]">
                    <div className="bg-zinc-950 border-b border-zinc-850 px-4 py-2 flex items-center space-x-2">
                      <MessageSquare className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
                      <h4 className="font-bold text-zinc-400 tracking-wider text-[10px] uppercase font-mono">3. Deploy Optimization Advisor</h4>
                    </div>

                    {/* Chat Messages Log */}
                    <div className="flex-1 p-3 overflow-y-auto max-h-[260px] space-y-3">
                      {chatMessages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-center text-xs text-zinc-550 py-10">
                          <HelpCircle className="h-6 w-6 text-zinc-650/50 mb-2 animate-bounce" />
                          <p className="max-w-xs font-sans text-xs text-zinc-400">
                            Ask clarifying questions: <br />
                            <span className="text-cyan-400 italic">"How can I set up GPU layers in Ollama?"</span> or <br />
                            <span className="text-cyan-400 italic">"What is the expected RAM upgrade performance gain?"</span>
                          </p>
                        </div>
                      ) : (
                        chatMessages.map(msg => (
                          <div
                            key={msg.id}
                            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                          >
                            <div className={`max-w-[85%] rounded p-2.5 text-xs leading-relaxed ${
                              msg.role === "user"
                                ? "bg-zinc-950 border border-zinc-850 text-zinc-200"
                                : "bg-zinc-950 border border-zinc-850 text-zinc-350"
                            }`}>
                              <span className="block font-bold text-[9px] uppercase tracking-wider text-cyan-500 mb-1 font-mono">
                                {msg.role === "user" ? "Your spec revision query" : "AI Optimizer Reply"}
                              </span>
                              
                              {/* Simple paragraph parser for chatbot */}
                              <div className="space-y-2 whitespace-pre-line font-sans text-xs leading-relaxed">
                                {msg.text.includes("```") ? (
                                  msg.text.split("```").map((chunk, cIdx) => {
                                    if (cIdx % 2 === 1) {
                                      // Render inline code
                                      return (
                                        <pre key={cIdx} className="bg-zinc-950 p-2 rounded border border-zinc-850 overflow-x-auto text-emerald-400 font-mono text-xs my-1">
                                          <code>{chunk.replace(/^\w+\n/, "")}</code>
                                        </pre>
                                      );
                                    }
                                    return <span key={cIdx}>{chunk}</span>;
                                  })
                                ) : (
                                  <span>{msg.text}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      )}

                      {isWaitingOnChat && (
                        <div className="flex justify-start">
                          <div className="bg-zinc-950 border border-zinc-850 rounded p-2 flex items-center space-x-2 max-w-sm">
                            <span className="text-[10px] text-cyan-400 font-mono font-bold uppercase tracking-tight">Tuning optimizer</span>
                            <div className="flex space-x-1">
                              <span className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce delay-75" />
                              <span className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce delay-150" />
                              <span className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce delay-300" />
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={chatBottomRef} />
                    </div>

                    {/* Chat Input Bar */}
                    <form onSubmit={handleSendMessage} className="border-t border-zinc-850 p-2 bg-zinc-950 flex items-center space-x-2">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        disabled={isWaitingOnChat}
                        placeholder="Type clarifying query (e.g. GPU configurations, run stats...)"
                        className="flex-1 bg-zinc-900 border border-zinc-850 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 placeholder-zinc-705"
                      />
                      <button
                        type="submit"
                        disabled={!chatInput.trim() || isWaitingOnChat}
                        className="bg-cyan-600 hover:bg-cyan-500 border border-cyan-400 text-white p-1.5 rounded transition flex items-center justify-center shrink-0 cursor-pointer"
                      >
                        <Send className="h-4.5 w-4.5" />
                      </button>
                    </form>
                  </div>
                )}

              </motion.div>
            )}

          </AnimatePresence>

        </div>

      </main>

      {/* Footer System labels */}
      <footer className="border-t border-zinc-850 bg-zinc-955 px-6 py-3 flex flex-col md:flex-row items-center justify-between text-[10px] font-mono text-zinc-550 space-y-2 md:space-y-0 select-none">
        <div className="flex items-center space-x-1.5">
          <BookOpen className="h-3.5 w-3.5 text-zinc-650" />
          <span>Ollama, LM Studio & HuggingFace Parameter Matrix V1.0</span>
        </div>
        <div>
          <span>Crafted for Offline-First developer setups</span>
        </div>
      </footer>

    </div>
  );
}
