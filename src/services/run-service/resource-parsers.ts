/**
 * A service to parse Kubernetes resource strings into invariant units.
 */
export namespace ResourceParser {
    /**
     * The valid memory value pattern.
     * @private
     */
    const MEMORY_PATTERN = new RegExp(/^([\d.]+)([KMGTPE]i?B?)$/, 'i');

    /**
     * The values of binary multipliers for memory (Ki, Mi, Gi, etc.).
     * @private
     */
    const BINARY_MULTIPLIERS: Record<string, number> = {
        'Ki': 1024,
        'Mi': 1024 ** 2,
        'Gi': 1024 ** 3,
        'Ti': 1024 ** 4,
        'Pi': 1024 ** 5,
        'Ei': 1024 ** 6,
    };

    /**
     * The values of decimal multipliers for memory (K, M, G, etc.).
     * Note: Kubernetes uses binary for KiB/MiB and decimal for K/M.
     * This library supports both for robustness.
     * @private
     */
    const DECIMAL_MULTIPLIERS: Record<string, number> = {
        'K': 1000,
        'M': 1000 ** 2,
        'G': 1000 ** 3,
        'T': 1000 ** 4,
        'P': 1000 ** 5,
        'E': 1000 ** 6,
    };

    /**
     * Parses a CPU resource string into millicores.
     * @param {string | null | undefined} cpu The CPU value string (e.g., "1", "500m", "0.5").
     * @returns {number | null} The equivalent value in millicores, or null if the input is empty.
     * @throws {Error} If the CPU string is in an invalid format.
     */
    export function parseToMillicores(cpu?: string | null): number | null {
        if (!cpu || !cpu.trim()) {
            return null;
        }

        const trimmedCpu = cpu.trim();
        const lowerCpu = trimmedCpu.toLowerCase();

        // Handle millicores (m)
        if (lowerCpu.endsWith('m')) {
            const millicores = parseInt(trimmedCpu.slice(0, -1), 10);
            if (isNaN(millicores)) {
                throw new Error(`The ${cpu} is not a valid value for CPU.`);
            }
            return millicores;
        }

        // Handle nanocores (n) - from metrics server
        if (lowerCpu.endsWith('n')) {
            const nanocores = parseInt(trimmedCpu.slice(0, -1), 10);
            if (isNaN(nanocores)) {
                throw new Error(`The ${cpu} is not a valid value for CPU.`);
            }
            return Math.round(nanocores / 1_000_000);
        }

        // Handle microseconds (u) - sometimes used in metrics
        if (lowerCpu.endsWith('u')) {
            const microseconds = parseInt(trimmedCpu.slice(0, -1), 10);
            if (isNaN(microseconds)) {
                throw new Error(`The ${cpu} is not a valid value for CPU.`);
            }
            // 1 core = 1,000,000 microseconds, so 1 millicore = 1,000 microseconds
            return Math.round(microseconds / 1000);
        }

        // Handle whole or fractional cores
        const cores = parseFloat(trimmedCpu);
        if (!isNaN(cores)) {
            return Math.round(cores * 1000);
        }

        throw new Error(`The ${cpu} is not a valid value for CPU.`);
    }

    /**
     * Parses a memory resource string into bytes.
     * @param {string | null | undefined} memory The memory value string (e.g., "129Mi", "1Gi", "500K").
     * @returns {number | null} The equivalent value in bytes, or null if the input is empty.
     * @throws {Error} If the memory string is in an invalid format.
     */
    export function parseToBytes(memory?: string | null): number | null {
        if (!memory || !memory.trim()) {
            return null;
        }
        
        const trimmedMemory = memory.trim();
        
        // Check if memory is already given as a plain number (bytes)
        // Ensure the entire string is a number to avoid parsing "123Mi" as 123.
        const plainBytes = parseInt(trimmedMemory, 10);
        if (!isNaN(plainBytes) && String(plainBytes) === trimmedMemory) {
            return plainBytes;
        }

        const match = trimmedMemory.match(MEMORY_PATTERN);

        if (!match) {
            // If pattern fails, try to parse as a float one last time
            const floatBytes = parseFloat(trimmedMemory);
            if(!isNaN(floatBytes)) {
                 return Math.round(floatBytes);
            }
            throw new Error(`The ${memory} is not a valid value for Memory.`);
        }

        const value = parseFloat(match[1]);
        const suffix = match[2];

        // Handle binary suffixes (Ki, Mi, Gi, etc.)
        // Note: Kubernetes treats "Ki" as binary, we are extending this to suffixes ending in 'i'.
        if (suffix.endsWith('i')) {
             const multiplier = BINARY_MULTIPLIERS[suffix];
             if(multiplier) {
                return Math.round(value * multiplier);
             }
        }
        
        // Handle decimal suffixes (K, M, G, etc.) and their B variants (KB, MB)
        const decimalSuffix = suffix.replace('B', '');
        if (DECIMAL_MULTIPLIERS[decimalSuffix]) {
             const multiplier = DECIMAL_MULTIPLIERS[decimalSuffix];
             return Math.round(value * multiplier);
        }

        throw new Error(`The ${memory} has an unknown suffix.`);
    }

    /**
     * Parses a GPU resource string into whole units.
     * @param {string | null | undefined} gpu The GPU value string (e.g., "1", "2").
     * @returns {number | null} The number of GPU units, or null if the input is empty.
     * @throws {Error} If the GPU string is not a valid integer.
     */
    export function parseToGpu(gpu?: string | null): number | null {
        if (!gpu || !gpu.trim()) {
            return null;
        }

        const trimmedGpu = gpu.trim();
        const gpuUnits = parseInt(trimmedGpu, 10);

        // Ensure the parsed value is a valid integer and that the original string wasn't something like "1.5" or "1a"
        if (!isNaN(gpuUnits) && String(gpuUnits) === trimmedGpu) {
            return gpuUnits;
        }

        throw new Error(`The ${gpu} is not a valid value for GPU.`);
    }
}