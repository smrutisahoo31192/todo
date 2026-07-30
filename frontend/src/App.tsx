import { useEffect, useState } from 'react';
import { ApiError, getApiBaseUrl, healthApi } from './lib/api';
import './App.css';

type HealthState =
  | { kind: 'loading' }
  | { kind: 'success'; status: string }
  | { kind: 'error'; message: string };

const roadmapItems = [
  'Connect Todo list and mutations through the shared API client.',
  'Add forms, loading states, and optimistic UI for task updates.',
  'Choose a design system and component structure for feature work.',
];

function App() {
  const [healthState, setHealthState] = useState<HealthState>({ kind: 'loading' });

  useEffect(() => {
    const controller = new AbortController();

    async function loadHealth(): Promise<void> {
      try {
        const response = await healthApi.check(controller.signal);

        if (!controller.signal.aborted) {
          setHealthState({ kind: 'success', status: response.status });
        }
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        const message =
          error instanceof ApiError
            ? `Backend request failed (${error.status}). Start the FastAPI app and verify VITE_API_URL points at the backend.`
            : 'Unable to reach the backend. Start the FastAPI app and verify the frontend environment configuration.';

        setHealthState({ kind: 'error', message });
      }
    }

    void loadHealth();

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <main className="app-shell">
      <section className="hero-card">
        <p className="eyebrow">Todo frontend bootstrap</p>
        <h1>React + Vite workspace ready for Todo UI work</h1>
        <p className="lead">
          This starter shell confirms the frontend toolchain is wired up and ready to
          grow into the full Todo experience.
        </p>

        <div className="status-grid">
          <article className="status-card">
            <h2>Frontend</h2>
            <p>Vite development server, TypeScript build, and preview scripts are configured.</p>
          </article>
          <article className="status-card">
            <h2>Backend target</h2>
            <p>
              Requests default to <code>{getApiBaseUrl()}</code> and can be changed with
              <code> VITE_API_URL</code>.
            </p>
          </article>
          <article className="status-card">
            <h2>Health check</h2>
            {healthState.kind === 'loading' ? <p>Checking FastAPI backend…</p> : null}
            {healthState.kind === 'success' ? (
              <p>
                Backend responded successfully with status <strong>{healthState.status}</strong>.
              </p>
            ) : null}
            {healthState.kind === 'error' ? <p>{healthState.message}</p> : null}
          </article>
        </div>
      </section>

      <section className="roadmap-card">
        <h2>Suggested next steps</h2>
        <ol>
          {roadmapItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </section>
    </main>
  );
}

export default App;
