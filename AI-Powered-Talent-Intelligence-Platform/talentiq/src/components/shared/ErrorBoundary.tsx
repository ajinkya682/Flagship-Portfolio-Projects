'use client'

import React, { Component, ReactNode } from 'react'
import { ErrorState } from './ErrorState'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorState 
          title="Component Error" 
          description={this.state.error?.message || 'An unexpected error occurred in this section.'}
          onRetry={() => this.setState({ hasError: false, error: null })}
        />
      )
    }

    return this.props.children
  }
}
