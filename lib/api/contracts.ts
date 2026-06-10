import type { ProcessingMode } from "../tools/registry";

export type UploadResponse = {
  uploadId: string;
  expiresInSeconds: number;
};

export type JobRequest = {
  toolRoute: string;
  uploadId?: string;
  input?: unknown;
  processing: ProcessingMode;
};

export type JobResponse = {
  jobId: string;
  status: "queued" | "processing" | "done" | "failed";
};

export type AiRequest = {
  toolRoute: string;
  input: string;
  language?: string;
};
