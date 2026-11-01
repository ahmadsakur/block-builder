import { env } from "../../env";
import { createLocalStorage } from "./local";
import { createS3Storage } from "./s3";

export type StoredObject = { body: ReadableStream; contentType: string };

export interface Storage {
  init(): Promise<void>;
  put(key: string, body: Uint8Array, contentType: string): Promise<void>;
  get(key: string): Promise<StoredObject | null>;
  delete(key: string): Promise<void>;
}

export const storage: Storage =
  env.STORAGE_DRIVER === "s3"
    ? createS3Storage()
    : createLocalStorage(env.STORAGE_DIR);
