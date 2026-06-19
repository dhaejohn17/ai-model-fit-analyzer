export interface GPUInfo {
  name: string;
  vram: string;
  brand: "NVIDIA" | "AMD" | "Intel" | "Apple" | "Generic";
}

export const GPU_DATABASE: GPUInfo[] = [
  // NVIDIA 50-series Desktop (Blackwell)
  { name: "NVIDIA GeForce RTX 5090", vram: "32GB", brand: "NVIDIA" },
  { name: "NVIDIA GeForce RTX 5080", vram: "16GB", brand: "NVIDIA" },
  { name: "NVIDIA GeForce RTX 5070 Ti", vram: "16GB", brand: "NVIDIA" },
  { name: "NVIDIA GeForce RTX 5070", vram: "12GB", brand: "NVIDIA" },
  { name: "NVIDIA GeForce RTX 5060 Ti (16GB)", vram: "16GB", brand: "NVIDIA" },
  { name: "NVIDIA GeForce RTX 5060 Ti (8GB)", vram: "8GB", brand: "NVIDIA" },
  { name: "NVIDIA GeForce RTX 5060", vram: "8GB", brand: "NVIDIA" },
  { name: "NVIDIA GeForce RTX 5050", vram: "8GB", brand: "NVIDIA" },

  // NVIDIA 40-series Desktop
  { name: "NVIDIA GeForce RTX 4090", vram: "24GB", brand: "NVIDIA" },
  { name: "NVIDIA GeForce RTX 4080 Super", vram: "16GB", brand: "NVIDIA" },
  { name: "NVIDIA GeForce RTX 4080", vram: "16GB", brand: "NVIDIA" },
  { name: "NVIDIA GeForce RTX 4070 Ti Super", vram: "16GB", brand: "NVIDIA" },
  { name: "NVIDIA GeForce RTX 4070 Ti", vram: "12GB", brand: "NVIDIA" },
  { name: "NVIDIA GeForce RTX 4070 Super", vram: "12GB", brand: "NVIDIA" },
  { name: "NVIDIA GeForce RTX 4070", vram: "12GB", brand: "NVIDIA" },
  { name: "NVIDIA GeForce RTX 4060 Ti (16GB)", vram: "16GB", brand: "NVIDIA" },
  { name: "NVIDIA GeForce RTX 4060 Ti (8GB)", vram: "8GB", brand: "NVIDIA" },
  { name: "NVIDIA GeForce RTX 4060", vram: "8GB", brand: "NVIDIA" },
  
  // NVIDIA 30-series Desktop
  { name: "NVIDIA GeForce RTX 3090 Ti", vram: "24GB", brand: "NVIDIA" },
  { name: "NVIDIA GeForce RTX 3090", vram: "24GB", brand: "NVIDIA" },
  { name: "NVIDIA GeForce RTX 3080 Ti", vram: "12GB", brand: "NVIDIA" },
  { name: "NVIDIA GeForce RTX 3080 (12GB)", vram: "12GB", brand: "NVIDIA" },
  { name: "NVIDIA GeForce RTX 3080 (10GB)", vram: "10GB", brand: "NVIDIA" },
  { name: "NVIDIA GeForce RTX 3070 Ti", vram: "8GB", brand: "NVIDIA" },
  { name: "NVIDIA GeForce RTX 3070", vram: "8GB", brand: "NVIDIA" },
  { name: "NVIDIA GeForce RTX 3060 Ti", vram: "8GB", brand: "NVIDIA" },
  { name: "NVIDIA GeForce RTX 3060 (12GB)", vram: "12GB", brand: "NVIDIA" },
  { name: "NVIDIA GeForce RTX 3050 (8GB)", vram: "8GB", brand: "NVIDIA" },

  // NVIDIA 20-series Desktop
  { name: "NVIDIA GeForce RTX 2080 Ti", vram: "11GB", brand: "NVIDIA" },
  { name: "NVIDIA GeForce RTX 2080 Super", vram: "8GB", brand: "NVIDIA" },
  { name: "NVIDIA GeForce RTX 2080", vram: "8GB", brand: "NVIDIA" },
  { name: "NVIDIA GeForce RTX 2075 Super", vram: "8GB", brand: "NVIDIA" },
  { name: "NVIDIA GeForce RTX 2070", vram: "8GB", brand: "NVIDIA" },
  { name: "NVIDIA GeForce RTX 2060 Super", vram: "8GB", brand: "NVIDIA" },
  { name: "NVIDIA GeForce RTX 2060 (6GB)", vram: "6GB", brand: "NVIDIA" },

  // NVIDIA GTX series
  { name: "NVIDIA GeForce GTX 1080 Ti", vram: "11GB", brand: "NVIDIA" },
  { name: "NVIDIA GeForce GTX 1080", vram: "8GB", brand: "NVIDIA" },
  { name: "NVIDIA GeForce GTX 1070 Ti", vram: "8GB", brand: "NVIDIA" },
  { name: "NVIDIA GeForce GTX 1070", vram: "8GB", brand: "NVIDIA" },
  { name: "NVIDIA GeForce GTX 1660 Ti", vram: "6GB", brand: "NVIDIA" },
  { name: "NVIDIA GeForce GTX 1660 Super", vram: "6GB", brand: "NVIDIA" },
  { name: "NVIDIA GeForce GTX 1060 (6GB)", vram: "6GB", brand: "NVIDIA" },

  // NVIDIA Workstation & Enterprise
  { name: "NVIDIA RTX 6000 Ada Generation", vram: "48GB", brand: "NVIDIA" },
  { name: "NVIDIA RTX A6000", vram: "48GB", brand: "NVIDIA" },
  { name: "NVIDIA RTX A5000", vram: "24GB", brand: "NVIDIA" },
  { name: "NVIDIA RTX A4000", vram: "16GB", brand: "NVIDIA" },
  { name: "NVIDIA L40S", vram: "48GB", brand: "NVIDIA" },
  { name: "NVIDIA L4", vram: "24GB", brand: "NVIDIA" },
  { name: "NVIDIA H100 GPU", vram: "80GB+", brand: "NVIDIA" },
  { name: "NVIDIA A100 PCIe (80GB)", vram: "80GB+", brand: "NVIDIA" },
  { name: "NVIDIA A100 PCIe (40GB)", vram: "40GB", brand: "NVIDIA" },
  { name: "NVIDIA A10G", vram: "24GB", brand: "NVIDIA" },
  { name: "NVIDIA T4", vram: "16GB", brand: "NVIDIA" },

  // AMD Radeon RX 7000-series
  { name: "AMD Radeon RX 7900 XTX", vram: "24GB", brand: "AMD" },
  { name: "AMD Radeon RX 7900 XT", vram: "20GB", brand: "AMD" },
  { name: "AMD Radeon RX 7900 GRE", vram: "16GB", brand: "AMD" },
  { name: "AMD Radeon RX 7800 XT", vram: "16GB", brand: "AMD" },
  { name: "AMD Radeon RX 7700 XT", vram: "12GB", brand: "AMD" },
  { name: "AMD Radeon RX 7650 XT", vram: "16GB", brand: "AMD" },
  { name: "AMD Radeon RX 7600 XT", vram: "16GB", brand: "AMD" },
  { name: "AMD Radeon RX 7600", vram: "8GB", brand: "AMD" },

  // AMD Radeon RX 6000-series
  { name: "AMD Radeon RX 6950 XT", vram: "16GB", brand: "AMD" },
  { name: "AMD Radeon RX 6900 XT", vram: "16GB", brand: "AMD" },
  { name: "AMD Radeon RX 6800 XT", vram: "16GB", brand: "AMD" },
  { name: "AMD Radeon RX 6800", vram: "16GB", brand: "AMD" },
  { name: "AMD Radeon RX 6750 XT", vram: "12GB", brand: "AMD" },
  { name: "AMD Radeon RX 6700 XT", vram: "12GB", brand: "AMD" },
  { name: "AMD Radeon RX 6650 XT", vram: "8GB", brand: "AMD" },
  { name: "AMD Radeon RX 6605 XT", vram: "8GB", brand: "AMD" },
  { name: "AMD Radeon RX 6600 xt", vram: "8GB", brand: "AMD" },
  { name: "AMD Radeon RX 6600", vram: "8GB", brand: "AMD" },

  // AMD Radeon Pro / Enterprise
  { name: "AMD Radeon Pro W7900", vram: "48GB", brand: "AMD" },
  { name: "AMD Radeon Pro W7800", vram: "32GB", brand: "AMD" },
  { name: "AMD Radeon Pro W6800", vram: "32GB", brand: "AMD" },
  { name: "AMD Instinct MI300X", vram: "80GB+", brand: "AMD" },

  // Intel Arc Graphics
  { name: "Intel Arc A770 Limited Edition (16GB)", vram: "16GB", brand: "Intel" },
  { name: "Intel Arc A770 (8GB)", vram: "8GB", brand: "Intel" },
  { name: "Intel Arc A750", vram: "8GB", brand: "Intel" },
  { name: "Intel Arc A580", vram: "8GB", brand: "Intel" },
  { name: "Intel Arc A380", vram: "6GB", brand: "Intel" },

  // Apple Apple Silicon Macs (Unified architectures represent VRAM up to system scale)
  { name: "Apple M4 Max (Unified)", vram: "Shared System VRAM", brand: "Apple" },
  { name: "Apple M4 Pro (Unified)", vram: "Shared System VRAM", brand: "Apple" },
  { name: "Apple M4 (Unified)", vram: "Shared System VRAM", brand: "Apple" },
  { name: "Apple M3 Max (Unified)", vram: "Shared System VRAM", brand: "Apple" },
  { name: "Apple M3 Pro (Unified)", vram: "Shared System VRAM", brand: "Apple" },
  { name: "Apple M3 (Unified)", vram: "Shared System VRAM", brand: "Apple" },
  { name: "Apple M2 Ultra (Unified)", vram: "Shared System VRAM", brand: "Apple" },
  { name: "Apple M2 Max (Unified)", vram: "Shared System VRAM", brand: "Apple" },
  { name: "Apple M2 Pro (Unified)", vram: "Shared System VRAM", brand: "Apple" },
  { name: "Apple M2 (Unified)", vram: "Shared System VRAM", brand: "Apple" },
  { name: "Apple M1 Ultra (Unified)", vram: "Shared System VRAM", brand: "Apple" },
  { name: "Apple M1 Max (Unified)", vram: "Shared System VRAM", brand: "Apple" },
  { name: "Apple M1 Pro (Unified)", vram: "Shared System VRAM", brand: "Apple" },
  { name: "Apple M1 (Unified)", vram: "Shared System VRAM", brand: "Apple" },
];
