// src/components/Shared/ErrorBoundary.js
import React from "react";
import styled from "styled-components";

const ErrorBoundaryContainer = styled.div`
  padding: 30px;
  margin: 40px auto;
  background-color: #ffebeb; /* Lighter red */
  border: 2px solid #e00; /* More prominent red */
  border-radius: 10px;
  color: #cc0000;
  text-align: center;
  max-width: 700px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
`;

const ErrorBoundaryTitle = styled.h2`
  color: #b30000;
  margin-bottom: 15px;
  font-size: 1.8em;
`;

const ErrorDetails = styled.details`
  text-align: left;
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #ffaa;
  font-size: 0.9em;
  color: #990000;

  summary {
    font-weight: bold;
    cursor: pointer;
    margin-bottom: 10px;
  }

  pre {
    white-space: pre-wrap; /* Preserve whitespace and wrap text */
    word-break: break-all; /* Break long words */
    background-color: #fdd;
    padding: 10px;
    border-radius: 5px;
    font-family: monospace;
    max-height: 200px; /* Limit height to prevent excessive scrolling */
    overflow-y: auto; /* Enable scrolling for long stack traces */
  }
`;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI.
    return { hasError: true, error: error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error in ErrorBoundary:", error, errorInfo);
    this.setState({
      errorInfo: errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <ErrorBoundaryContainer>
          <ErrorBoundaryTitle>Oops! Something went wrong.</ErrorBoundaryTitle>
          <p>
            We're sorry, but there was an unexpected error displaying this
            component.
          </p>
          <p>
            Please try refreshing the page or contact support if the issue
            persists.
          </p>
          {this.state.errorInfo && (
            <ErrorDetails>
              <summary>View error details</summary>
              <pre>
                {this.state.error && this.state.error.toString()}
                <br />
                {this.state.errorInfo.componentStack}
              </pre>
            </ErrorDetails>
          )}
        </ErrorBoundaryContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
