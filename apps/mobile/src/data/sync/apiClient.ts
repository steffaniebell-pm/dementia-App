import { redactPushPayload } from '../../utils/security';

type ApiResponse<T> = {
  ok: boolean;
  data?: T;
  error?: string;
};

export const apiClient = {
  async push<T>(payload: T): Promise<ApiResponse<T>> {
    const safePayload = Array.isArray(payload)
      ? (payload.map((item) => {
          if (typeof item !== 'object' || item === null) {
            return item;
          }
          return {
            ...(item as Record<string, unknown>),
            payload: redactPushPayload(((item as Record<string, unknown>).payload ?? {}) as Record<string, unknown>),
          };
        }) as unknown as T)
      : payload;

    return { ok: true, data: safePayload };
  },
  async pull<T>(): Promise<ApiResponse<T[]>> {
    return { ok: true, data: [] };
  },
};