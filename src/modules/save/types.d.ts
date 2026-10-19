export interface SaveEnvelope<T = unknown> { schemaVersion: number; createdAt: number; updatedAt: number; checksum?: string; data: T; }
export interface SaveProvider { load(): Promise<SaveEnvelope | null>; save(envelope: SaveEnvelope): Promise<void>; clear(): Promise<void>; }
