type ParsedResponse = {
  statusCode: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jsonPayload: any | null;
  text: string | null;
};

type BackendClient = {
  get: (path: string) => Promise<ParsedResponse>;
  post: (path: string, body?: unknown) => Promise<ParsedResponse>;
  put: (path: string, body?: unknown) => Promise<ParsedResponse>;
  delete: (path: string, body?: unknown) => Promise<ParsedResponse>;
};

export const createBackendClient = (): BackendClient => {
  const baseUrl = import.meta.env.DEV ? "http://localhost:5000" : "";
  const authHeaders: HeadersInit = import.meta.env.DEV
    ? { "X-Kiwi-User-Id": "1", "X-Kiwi-Username": "Dev User" }
    : {};

  const request = async (
    path: string,
    method: string,
    body?: unknown,
  ): Promise<ParsedResponse> => {
    const response = await fetch(`${baseUrl}${path}`, {
      method,
      body: body ? JSON.stringify(body) : undefined,
      headers: { ...authHeaders, "Content-Type": "application/json" },
    });

    let jsonPayload, text;
    try {
      jsonPayload = await response.clone().json();
    } catch {
      jsonPayload = null;
    }
    try {
      text = await response.text();
    } catch {
      text = null;
    }

    return {
      statusCode: response.status,
      jsonPayload,
      text,
    };
  };

  return {
    get: async (path) => await request(path, "GET"),
    post: async (path, body) => await request(path, "POST", body),
    put: async (path, body) => await request(path, "PUT", body),
    delete: async (path, body) => await request(path, "DELETE", body),
  };
};
