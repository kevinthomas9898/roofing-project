import React, { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn("[Whop Elements caught error]:", error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900">
            <p className="font-semibold">Whop Elements Loading Fallback</p>
            <p className="text-amber-800 mt-1">
              {this.state.error?.message || "Elements container encountered a rendering issue."}
            </p>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
