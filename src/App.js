// src/App.js
import ClientStats from "./components/ClientStats/ClientStats";
import ErrorBoundary from "./components/Shared/ErrorBoundary"; // Import ErrorBoundary
import GlobalStyle from "./styles/GlobalStyles";

function App() {
  return (
    <>
      <GlobalStyle />
      <ErrorBoundary>
        {" "}
        {/* Wrap the main component with ErrorBoundary */}
        <ClientStats />
      </ErrorBoundary>
    </>
  );
}

export default App;
