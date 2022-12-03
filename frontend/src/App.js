import logo from "./logo.svg";
import "./App.css";
import Dashboard from "./Screens/Dashboard";
import { BrowserRouter as Router, Link, Routes, Route } from "react-router-dom";
import Login from "./Screens/Login";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/dashboard" element={<Dashboard></Dashboard>}></Route>
          <Route path="/" element={<Login></Login>}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
