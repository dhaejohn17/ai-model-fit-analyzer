export interface CPUInfo {
  name: string;
  cores: number;
  threads: number;
  brand: "AMD" | "Intel" | "Apple";
}

// Cross-brand desktop/laptop CPU reference. `threads` drives Ollama/llama.cpp
// thread budgeting; `cores` is shown for context. Apple Silicon has no SMT,
// so threads == performance+efficiency core count.
export const CPU_DATABASE: CPUInfo[] = [
  // ---- AMD Ryzen 9000 (Zen 5, AM5) ----
  { name: "AMD Ryzen 9 9950X3D", cores: 16, threads: 32, brand: "AMD" },
  { name: "AMD Ryzen 9 9950X", cores: 16, threads: 32, brand: "AMD" },
  { name: "AMD Ryzen 9 9900X", cores: 12, threads: 24, brand: "AMD" },
  { name: "AMD Ryzen 7 9800X3D", cores: 8, threads: 16, brand: "AMD" },
  { name: "AMD Ryzen 7 9700X", cores: 8, threads: 16, brand: "AMD" },
  { name: "AMD Ryzen 5 9600X", cores: 6, threads: 12, brand: "AMD" },

  // ---- AMD Ryzen 7000 (Zen 4, AM5) ----
  { name: "AMD Ryzen 9 7950X3D", cores: 16, threads: 32, brand: "AMD" },
  { name: "AMD Ryzen 9 7950X", cores: 16, threads: 32, brand: "AMD" },
  { name: "AMD Ryzen 9 7900X", cores: 12, threads: 24, brand: "AMD" },
  { name: "AMD Ryzen 9 7900", cores: 12, threads: 24, brand: "AMD" },
  { name: "AMD Ryzen 7 7800X3D", cores: 8, threads: 16, brand: "AMD" },
  { name: "AMD Ryzen 7 7700X", cores: 8, threads: 16, brand: "AMD" },
  { name: "AMD Ryzen 7 7700", cores: 8, threads: 16, brand: "AMD" },
  { name: "AMD Ryzen 5 7600X", cores: 6, threads: 12, brand: "AMD" },
  { name: "AMD Ryzen 5 7600", cores: 6, threads: 12, brand: "AMD" },

  // ---- AMD Ryzen 5000 (Zen 3, AM4) ----
  { name: "AMD Ryzen 9 5950X", cores: 16, threads: 32, brand: "AMD" },
  { name: "AMD Ryzen 9 5900X", cores: 12, threads: 24, brand: "AMD" },
  { name: "AMD Ryzen 7 5800X3D", cores: 8, threads: 16, brand: "AMD" },
  { name: "AMD Ryzen 7 5800X", cores: 8, threads: 16, brand: "AMD" },
  { name: "AMD Ryzen 7 5700X", cores: 8, threads: 16, brand: "AMD" },
  { name: "AMD Ryzen 7 5700G", cores: 8, threads: 16, brand: "AMD" },
  { name: "AMD Ryzen 5 5600X", cores: 6, threads: 12, brand: "AMD" },
  { name: "AMD Ryzen 5 5600", cores: 6, threads: 12, brand: "AMD" },
  { name: "AMD Ryzen 5 5600G", cores: 6, threads: 12, brand: "AMD" },
  { name: "AMD Ryzen 5 5500", cores: 6, threads: 12, brand: "AMD" },

  // ---- AMD Ryzen 3000 (Zen 2, AM4) ----
  { name: "AMD Ryzen 9 3950X", cores: 16, threads: 32, brand: "AMD" },
  { name: "AMD Ryzen 9 3900X", cores: 12, threads: 24, brand: "AMD" },
  { name: "AMD Ryzen 7 3700X", cores: 8, threads: 16, brand: "AMD" },
  { name: "AMD Ryzen 5 3600X", cores: 6, threads: 12, brand: "AMD" },
  { name: "AMD Ryzen 5 3600", cores: 6, threads: 12, brand: "AMD" },

  // ---- AMD Threadripper (HEDT) ----
  { name: "AMD Ryzen Threadripper 7980X", cores: 64, threads: 128, brand: "AMD" },
  { name: "AMD Ryzen Threadripper 7970X", cores: 32, threads: 64, brand: "AMD" },
  { name: "AMD Ryzen Threadripper 3990X", cores: 64, threads: 128, brand: "AMD" },

  // ---- Intel Core Ultra (Arrow Lake, LGA1851) ----
  { name: "Intel Core Ultra 9 285K", cores: 24, threads: 24, brand: "Intel" },
  { name: "Intel Core Ultra 7 265K", cores: 20, threads: 20, brand: "Intel" },
  { name: "Intel Core Ultra 5 245K", cores: 14, threads: 14, brand: "Intel" },

  // ---- Intel 14th gen (Raptor Lake Refresh) ----
  { name: "Intel Core i9-14900K", cores: 24, threads: 32, brand: "Intel" },
  { name: "Intel Core i7-14700K", cores: 20, threads: 28, brand: "Intel" },
  { name: "Intel Core i5-14600K", cores: 14, threads: 20, brand: "Intel" },
  { name: "Intel Core i5-14400", cores: 10, threads: 16, brand: "Intel" },

  // ---- Intel 13th gen (Raptor Lake) ----
  { name: "Intel Core i9-13900K", cores: 24, threads: 32, brand: "Intel" },
  { name: "Intel Core i7-13700K", cores: 16, threads: 24, brand: "Intel" },
  { name: "Intel Core i5-13600K", cores: 14, threads: 20, brand: "Intel" },
  { name: "Intel Core i5-13400", cores: 10, threads: 16, brand: "Intel" },

  // ---- Intel 12th gen (Alder Lake) ----
  { name: "Intel Core i9-12900K", cores: 16, threads: 24, brand: "Intel" },
  { name: "Intel Core i7-12700K", cores: 12, threads: 20, brand: "Intel" },
  { name: "Intel Core i5-12600K", cores: 10, threads: 16, brand: "Intel" },
  { name: "Intel Core i5-12400", cores: 6, threads: 12, brand: "Intel" },

  // ---- Intel 10th/11th gen (Comet/Rocket Lake) ----
  { name: "Intel Core i9-11900K", cores: 8, threads: 16, brand: "Intel" },
  { name: "Intel Core i7-11700K", cores: 8, threads: 16, brand: "Intel" },
  { name: "Intel Core i7-10700K", cores: 8, threads: 16, brand: "Intel" },
  { name: "Intel Core i5-10400", cores: 6, threads: 12, brand: "Intel" },

  // ---- Apple Silicon (no SMT: threads == cores) ----
  { name: "Apple M4 Max", cores: 16, threads: 16, brand: "Apple" },
  { name: "Apple M4 Pro", cores: 14, threads: 14, brand: "Apple" },
  { name: "Apple M4", cores: 10, threads: 10, brand: "Apple" },
  { name: "Apple M3 Max", cores: 16, threads: 16, brand: "Apple" },
  { name: "Apple M3 Pro", cores: 12, threads: 12, brand: "Apple" },
  { name: "Apple M3", cores: 8, threads: 8, brand: "Apple" },
  { name: "Apple M2 Ultra", cores: 24, threads: 24, brand: "Apple" },
  { name: "Apple M2 Max", cores: 12, threads: 12, brand: "Apple" },
  { name: "Apple M2 Pro", cores: 12, threads: 12, brand: "Apple" },
  { name: "Apple M2", cores: 8, threads: 8, brand: "Apple" },
  { name: "Apple M1 Ultra", cores: 20, threads: 20, brand: "Apple" },
  { name: "Apple M1 Max", cores: 10, threads: 10, brand: "Apple" },
  { name: "Apple M1 Pro", cores: 10, threads: 10, brand: "Apple" },
  { name: "Apple M1", cores: 8, threads: 8, brand: "Apple" },
];
