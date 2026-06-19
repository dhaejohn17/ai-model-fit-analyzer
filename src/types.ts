export interface SystemSpecs {
  cpu: string;
  cpuCores: number;
  hardwareConcurrency: number;
  gpuName: string;
  vram: string;
  ram: string;
  storage: "SSD" | "NVMe" | "HDD";
  os: "Windows" | "macOS" | "Linux";
  useCase: string;
  ioType: string;
  contextWindow: string;
  preferredStack: string;
  offlineRequired: boolean;
  budget: string;
}

export interface SteerableSettings {
  maxRecommendations: number;
  scoreDisplay: boolean;
  includeCloudFallback: boolean;
  quantizationScope: string;
  tone: "technical-professional" | "beginner-friendly";
  followUpEnabled: boolean;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: Date;
}

export interface RecommendationMetadata {
  rank: number;
  modelName: string;
  quantization: string;
  vramRequired: string;
  qualityStars: number;
  overallScore: number;
  deployCommand: string;
  reasoning: string;
}
