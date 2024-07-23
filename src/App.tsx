import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from "./Home";
import Writing from "./Writing";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/writing" element={<Writing />} />
      </Routes>
    </Router>
  );
};

export default App;
