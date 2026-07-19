function getRawApiUrl(): string {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

  if (!apiUrl) {
    throw new Error('NEXT_PUBLIC_API_URL must be configured.');
  }

  return apiUrl;
}

function normalizeApiBaseUrl(rawUrl: string): string {
  const trimmed = rawUrl.trim().replace(/\/+$/, '');
  if (trimmed.endsWith('/api')) {
    return trimmed;
  }
  return `${trimmed}/api`;
}

export function apiUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizeApiBaseUrl(getRawApiUrl())}${normalizedPath}`;
}
