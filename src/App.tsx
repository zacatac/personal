import { QueryClient, QueryClientProvider } from "react-query";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from "./Home";
import OneBot from "./OneBot";
import Projects from "./Projects";
import Writing from "./Writing";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/writing" element={<Writing />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/onebot" element={<OneBot />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
