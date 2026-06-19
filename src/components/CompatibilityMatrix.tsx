import React, { useState } from "react";
import { Layers, Zap, Info, ShieldCheck, ShieldAlert, CheckCircle2 } from "lucide-react";

interface CompatibilityMatrixProps {
  vramStr: string;
  ramStr: string;
}

interface ModelSizeSpec {
  name: string;
  paramCount: string;
  desc: string;
  q4: number; // GB required
  q8: number;
  fp16: number;
}

const MODEL_SPECS: ModelSizeSpec[] = [
  { name: "Tiny Assistant", paramCount: "3B", desc: "e.g. Qwen2.5-3B, Phi-3-Mini", q4: 2.2, q8: 3.5, fp16: 6.8 },
  { name: "Standard Assistant", paramCount: "7B/8B", desc: "e.g. Llama-3-8B, Mistral-7B", q4: 4.8, q8: 8.5, fp16: 16.0 },
  { name: "Advanced Coder/Reasoner", paramCount: "13B/14B", desc: "e.g. Qwen2.5-Coder-14B, Gemma-2-9B", q4: 9.0, q8: 15.0, fp16: 29.5 },
  { name: "Expert Core", paramCount: "32B", desc: "e.g. Qwen2.5-32B, DeepSeek-Coder-32B", q4: 20.0, q8: 34.0, fp16: 67.0 },
  { name: "Large Reasoning Lab", paramCount: "70B/72B", desc: "e.g. Llama-3-70B, Qwen2.5-72B", q4: 42.0, q8: 73.0, fp16: 145.0 },
];

export default function CompatibilityMatrix({ vramStr, ramStr }: CompatibilityMatrixProps) {
  const [selectedQuant, setSelectedQuant] = useState<"q4" | "q8" | "fp16">("q4");

  // Parse strings to numeric Gigabytes
  const parseVRAM = (v: string, r: string): number => {
    if (!v || v === "none") return 0;
    if (v === "Shared System VRAM" || v.includes("Shared Memory")) return 2.0; // Assume 2GB base shared
    if (v.includes("Shared Unified Architecture") || v.toLowerCase().includes("unified")) {
      // Apple silicon uses unified RAM as VRAM. Usually allocates up to ~75% system memory.
      return parseRAM(r) * 0.75;
    }
    const match = v.match(/(\d+)/);
    return match ? parseInt(match[1]) : 4.0;
  };

  const parseRAM = (r: string): number => {
    if (!r) return 16.0;
    const match = r.match(/(\d+)/);
    return match ? parseInt(match[1]) : 16.0;
  };

  const vramGB = parseVRAM(vramStr, ramStr);
  const ramGB = parseRAM(ramStr);
  const totalSystemHeadroom = vramStr.toLowerCase().includes("unified") ? ramGB : (vramGB + ramGB);

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded flex flex-col space-y-4">
      {/* Component Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
        <div className="flex items-center space-x-2">
          <Layers className="h-4 w-4 text-cyan-400" />
          <div>
            <h3 className="text-xs font-bold text-zinc-200 uppercase font-mono tracking-wider">
              Local VRAM / RAM Compatibility Matrix
            </h3>
            <p className="text-[10px] text-zinc-500 font-mono">
              Theoretical RAM and VRAM offload modeling tool
            </p>
          </div>
        </div>

        {/* Quantization selections */}
        <div className="flex items-center space-x-1.5 self-start sm:self-center">
          <span className="text-[10px] text-zinc-500 font-mono font-bold uppercase mr-1">Quant:</span>
          {(["q4", "q8", "fp16"] as const).map((q) => (
            <button
              key={q}
              onClick={() => setSelectedQuant(q)}
              className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase border transition ${
                selectedQuant === q
                  ? "bg-cyan-950/40 border-cyan-500 text-cyan-400"
                  : "bg-zinc-950/50 border-zinc-850 text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {q === "q4" ? "4-Bit (Q4)" : q === "q8" ? "8-Bit (Q8)" : "FP16 (None)"}
            </button>
          ))}
        </div>
      </div>

      {/* Hardware constraints badge indicator */}
      <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-zinc-950/40 p-2.5 rounded border border-zinc-850">
        <div className="flex items-center justify-between">
          <span className="text-zinc-500">Available Dedicated VRAM:</span>
          <span className="text-cyan-400 font-bold">{vramGB.toFixed(1)} GB</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-zinc-500">Available System RAM:</span>
          <span className="text-emerald-400 font-bold">{ramGB.toFixed(1)} GB</span>
        </div>
      </div>

      {/* Matrix model size listing */}
      <div className="space-y-3 pt-1">
        {MODEL_SPECS.map((model) => {
          const requiredGB = model[selectedQuant];
          let vramUsed = 0;
          let ramUsed = 0;
          let isUnified = vramStr.toLowerCase().includes("unified");

          if (isUnified) {
            // Unified Apple architecture. Use unified ram.
            if (requiredGB <= totalSystemHeadroom) {
              vramUsed = requiredGB;
              ramUsed = 0;
            } else {
              vramUsed = totalSystemHeadroom;
              ramUsed = requiredGB - totalSystemHeadroom; // missing
            }
          } else {
            // Discrete GPU + Host CPU RAM.
            if (requiredGB <= vramGB) {
              vramUsed = requiredGB;
              ramUsed = 0;
            } else {
              vramUsed = vramGB;
              // Check if remainder fits in RAM
              const remainingNeeded = requiredGB - vramGB;
              if (remainingNeeded <= ramGB) {
                ramUsed = remainingNeeded;
              } else {
                ramUsed = ramGB; // takes all of RAM, still not enough
              }
            }
          }

          const fitsFullyInVram = isUnified ? requiredGB <= (ramGB * 0.75) : requiredGB <= vramGB;
          const fitsFullySystem = requiredGB <= totalSystemHeadroom;
          const missingGB = Math.max(0, requiredGB - (isUnified ? totalSystemHeadroom : (vramUsed + ramUsed)));

          // Calculate percentage for progress bars
          const maxScale = Math.max(requiredGB, 16.0); // scale up to at least 16GB so smaller values don't look completely full
          const vramPercentage = (vramUsed / maxScale) * 100;
          const ramPercentage = (ramUsed / maxScale) * 100;
          const missingPercentage = (missingGB / maxScale) * 100;

          // Status & Performance label
          let statusLabel = "";
          let statusColor = "";
          let StatusIcon = CheckCircle2;

          if (missingGB > 0) {
            statusLabel = "Incompatible (Insufficient Memory)";
            statusColor = "text-rose-500 border-rose-950/40 bg-rose-950/10";
            StatusIcon = ShieldAlert;
          } else if (fitsFullyInVram) {
            statusLabel = isUnified ? "Excellent (Fast Unified)" : "Fastest (Full VRAM)";
            statusColor = "text-cyan-400 border-cyan-950/40 bg-cyan-950/10";
            StatusIcon = Zap;
          } else if (fitsFullySystem) {
            statusLabel = "Moderate (VRAM + RAM Hybrid)";
            statusColor = "text-emerald-400 border-emerald-950/40 bg-emerald-950/10";
            StatusIcon = ShieldCheck;
          }

          return (
            <div
              key={model.paramCount}
              className="bg-zinc-950/40 border border-zinc-850 p-2.5 rounded hover:border-zinc-800 transition duration-150 flex flex-col space-y-2"
            >
              {/* Row Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-1.5">
                <div className="flex items-baseline space-x-2">
                  <span className="text-xs font-bold text-zinc-100">{model.paramCount}</span>
                  <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-tight">{model.name}</span>
                  <span className="text-[9px] text-zinc-550 font-mono">({model.desc})</span>
                </div>

                <div className={`text-[9px] font-mono border px-2 py-0.5 rounded flex items-center space-x-1 uppercase font-bold tracking-tighter ${statusColor}`}>
                  <StatusIcon className="h-3 w-3 shrink-0" />
                  <span>{statusLabel}</span>
                </div>
              </div>

              {/* Bar Stack Container */}
              <div className="space-y-1">
                {/* Visual Segment Bar */}
                <div className="h-2 bg-zinc-900 rounded overflow-hidden flex border border-zinc-850">
                  {vramPercentage > 0 && (
                    <div
                      style={{ width: `${vramPercentage}%` }}
                      className="h-full bg-cyan-500 relative group transition-all duration-300"
                      title={`VRAM: ${vramUsed.toFixed(1)} GB`}
                    />
                  )}
                  {ramPercentage > 0 && (
                    <div
                      style={{ width: `${ramPercentage}%` }}
                      className="h-full bg-emerald-500 relative group transition-all duration-300"
                      title={`RAM Offload: ${ramUsed.toFixed(1)} GB`}
                    />
                  )}
                  {missingPercentage > 0 && (
                    <div
                      style={{ width: `${missingPercentage}%` }}
                      className="h-full bg-rose-650 animate-pulse transition-all duration-300"
                      title={`Shortage: ${missingGB.toFixed(1)} GB`}
                    />
                  )}
                </div>

                {/* Legend & Gigabyte metrics */}
                <div className="flex justify-between font-mono text-[9px] text-zinc-500">
                  <div className="flex space-x-3">
                    {vramUsed > 0 && (
                      <span className="flex items-center space-x-1">
                        <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full" />
                        <span>Fits VRAM: <b className="text-zinc-300 font-semibold">{vramUsed.toFixed(1)} GB</b></span>
                      </span>
                    )}
                    {ramUsed > 0 && (
                      <span className="flex items-center space-x-1">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                        <span>RAM Offload: <b className="text-zinc-300 font-semibold">{ramUsed.toFixed(1)} GB</b></span>
                      </span>
                    )}
                    {missingGB > 0 && (
                      <span className="flex items-center space-x-1">
                        <span className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
                        <span>Unfit Shortage: <b className="text-rose-400 font-semibold">{missingGB.toFixed(1)} GB</b></span>
                      </span>
                    )}
                  </div>
                  <div>
                    <span>Total Required: <b className="text-zinc-300 font-semibold">{requiredGB.toFixed(1)} GB</b></span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Compatibility Advisory Footer */}
      <div className="text-[10px] leading-relaxed bg-zinc-950 border border-zinc-850 p-2.5 rounded text-zinc-550 flex items-start space-x-2">
        <Info className="h-3.5 w-3.5 text-cyan-500 shrink-0 mt-0.5" />
        <span>
          GPU VRAM allocation assumes ~1.5 GB background operating system display buffer overhead. Multi-layer CPU offloading utilizes llama.cpp or Ollama core execution threading.
        </span>
      </div>
    </div>
  );
}
