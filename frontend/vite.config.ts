import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

const DEFAULT_API_BASE_PATH = '/api';

const normalizeBasePath = (basePath: string): string => {
  const trimmedBasePath = basePath.trim();

  if (trimmedBasePath.length === 0) {
    return DEFAULT_API_BASE_PATH;
  }

  return trimmedBasePath.endsWith('/') ? trimmedBasePath.slice(0, -1) : trimmedBasePath;
};

const escapeForRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const apiBasePath = normalizeBasePath(env.VITE_API_URL || DEFAULT_API_BASE_PATH);
  const proxyTarget = env.VITE_API_PROXY_TARGET || 'http://localhost:8000';
  const shouldProxyApiRequests = apiBasePath.startsWith('/');

  return {
    plugins: [react()],
    server: {
      proxy: shouldProxyApiRequests
        ? {
            [apiBasePath]: {
              target: proxyTarget,
              changeOrigin: true,
              rewrite: (path) => path.replace(new RegExp(`^${escapeForRegExp(apiBasePath)}`), ''),
            },
          }
        : undefined,
    },
    test: {
      environment: 'jsdom',
      setupFiles: './vitest.setup.ts',
    },
  };
});
