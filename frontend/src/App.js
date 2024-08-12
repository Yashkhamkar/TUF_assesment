import { Route, Routes } from "react-router-dom";
import "./App.css";
import Banner from "./components/Banner/Banner";
import Dashboard from "./components/Dashboard/Dashboard";
import SignIn from "./Auth/SignIn";
import SignUp from "./Auth/SignUp";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Banner />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
      </Routes>
    </div>
  );
}

export default App;
