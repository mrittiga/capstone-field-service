import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false, error: null };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '24px', backgroundColor: '#1e1e1e', color: '#f87171', fontFamily: 'monospace', minHeight: '100vh' }}>
          <h2>⚠️ Frontend Render Error</h2>
          <pre style={{ backgroundColor: '#000', padding: '12px', borderRadius: '6px', overflowX: 'auto' }}>
            {this.state.error?.toString()}
          </pre>
          <button 
            onClick={() => window.location.href = '/login'}
            style={{ marginTop: '16px', padding: '8px 16px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px' }}
          >
            Reset to Login
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

