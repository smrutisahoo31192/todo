const DEFAULT_API_BASE_URL = '/api';

type ResponseParser<T> = (payload: unknown) => T;

export type Todo = Readonly<{
  id: number;
  title: string;
  completed: boolean;
}>;

export type TodoCreateRequest = Readonly<{
  title: string;
}>;

export type TodoUpdateRequest = Readonly<{
  title: string;
  completed: boolean;
}>;

const TODO_COLLECTION_PATH = '/todos';

export class ApiError extends Error {
  readonly status: number;
  readonly body: string;

  constructor(message: string, status: number, body: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

const normalizeBaseUrl = (baseUrl: string): string => {
  const trimmedBaseUrl = baseUrl.trim();

  if (trimmedBaseUrl.length === 0) {
    return DEFAULT_API_BASE_URL;
  }

  return trimmedBaseUrl.replace(/\/$/, '');
};

const joinApiPath = (baseUrl: string, path: string): string => {
  if (/^https?:\/\//.test(path)) {
    return path;
  }

  const normalizedBaseUrl = normalizeBaseUrl(baseUrl);
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  return `${normalizedBaseUrl}${normalizedPath}`;
};

export const getApiBaseUrl = (): string =>
  normalizeBaseUrl(import.meta.env.VITE_API_URL || DEFAULT_API_BASE_URL);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const readString = (value: unknown, fieldName: string): string => {
  if (typeof value !== 'string') {
    throw new Error(`Invalid API response: expected ${fieldName} to be a string.`);
  }

  return value;
};

const readBoolean = (value: unknown, fieldName: string): boolean => {
  if (typeof value !== 'boolean') {
    throw new Error(`Invalid API response: expected ${fieldName} to be a boolean.`);
  }

  return value;
};

const readNumber = (value: unknown, fieldName: string): number => {
  if (typeof value !== 'number' || !Number.isInteger(value)) {
    throw new Error(`Invalid API response: expected ${fieldName} to be an integer.`);
  }

  return value;
};

const parseTodo = (payload: unknown): Todo => {
  if (!isRecord(payload)) {
    throw new Error('Invalid API response: expected a todo object.');
  }

  return {
    id: readNumber(payload.id, 'id'),
    title: readString(payload.title, 'title'),
    completed: readBoolean(payload.completed, 'completed'),
  };
};

const parseTodoList = (payload: unknown): readonly Todo[] => {
  if (!Array.isArray(payload)) {
    throw new Error('Invalid API response: expected a todo list.');
  }

  return payload.map((item) => parseTodo(item));
};

const parseHealthResponse = (payload: unknown): HealthResponse => {
  if (!isRecord(payload)) {
    throw new Error('Invalid API response: expected a health response object.');
  }

  return { status: readString(payload.status, 'status') };
};

const buildJsonRequestInit = (method: 'POST' | 'PUT', body: TodoCreateRequest | TodoUpdateRequest): RequestInit => ({
  method,
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(body),
});

export async function apiRequest<T>(
  path: string,
  parser: ResponseParser<T>,
  init: RequestInit = {},
): Promise<T> {
  const response = await fetch(joinApiPath(getApiBaseUrl(), path), {
    headers: {
      Accept: 'application/json',
      ...init.headers,
    },
    ...init,
  });

  if (!response.ok) {
    throw new ApiError(
      `API request failed with status ${response.status}`,
      response.status,
      await response.text(),
    );
  }

  if (response.status === 204) {
    throw new Error('Invalid API response: expected a response body.');
  }

  return parser(await response.json());
}

export interface HealthResponse {
  status: string;
}

export const healthApi = {
  check: (signal?: AbortSignal): Promise<HealthResponse> =>
    apiRequest('/health', parseHealthResponse, { signal }),
};

export const todoApi = {
  list: (signal?: AbortSignal): Promise<readonly Todo[]> =>
    apiRequest(TODO_COLLECTION_PATH, parseTodoList, { signal }),
  create: (payload: TodoCreateRequest): Promise<Todo> =>
    apiRequest(TODO_COLLECTION_PATH, parseTodo, buildJsonRequestInit('POST', payload)),
  update: (todoId: number, payload: TodoUpdateRequest): Promise<Todo> =>
    apiRequest(`${TODO_COLLECTION_PATH}/${todoId}`, parseTodo, buildJsonRequestInit('PUT', payload)),
  remove: async (todoId: number): Promise<void> => {
    const response = await fetch(joinApiPath(getApiBaseUrl(), `${TODO_COLLECTION_PATH}/${todoId}`), {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new ApiError(
        `API request failed with status ${response.status}`,
        response.status,
        await response.text(),
      );
    }
  },
};
