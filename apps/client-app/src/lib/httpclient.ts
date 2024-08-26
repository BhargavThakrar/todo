export class HttpClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(method: string, url: string, body?: unknown, headers: Record<string, string> = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${url}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      // Optionally, handle different status codes here
      const error = await response.json();
      throw new Error(error.message || 'Something went wrong');
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return response.json();
    }

    return {} as T;
  }

  public get<T>(url: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>('GET', url, undefined, headers);
  }

  public post<T>(url: string, body: unknown, headers?: Record<string, string>): Promise<T> {
    return this.request<T>('POST', url, body, headers);
  }

  public patch<T>(url: string, body: unknown, headers?: Record<string, string>): Promise<T> {
    return this.request<T>('PATCH', url, body, headers);
  }

  public put<T>(url: string, body: unknown, headers?: Record<string, string>): Promise<T> {
    return this.request<T>('PUT', url, body, headers);
  }

  public delete<T>(url: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>('DELETE', url, undefined, headers);
  }
}

export default HttpClient;
