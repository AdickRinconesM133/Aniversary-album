interface R2Object {
  key: string;
  version: string;
  size: number;
  etag: string;
  httpEtag: string;
  httpMetadata?: Record<string, string>;
  customMetadata?: Record<string, string>;
  body: ReadableStream;
  writeHttpMetadata(headers: Headers): void;
}

interface R2ObjectList {
  objects: R2Object[];
  truncated: boolean;
  cursor?: string;
}

interface R2Bucket {
  get(key: string): Promise<R2Object | null>;
  list(options?: { prefix?: string; limit?: number; cursor?: string }): Promise<R2ObjectList>;
}

interface CloudflareEnv {
  PHOTOS_BUCKET: R2Bucket;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends CloudflareEnv {}
  }
}

export {};
