
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./COMPONETS/Navbar";
import Home from "./COMPONETS/Home";
import Signup from "./COMPONETS/Signup";
import Login from "./COMPONETS/Login";

import "./CSS/login.css";
import "./index.css";

function App() {
  const [users, setUsers] = useState([]);

  function createAccount(user) {
    const existingUser = users.some(
      (item) => item.email === user.email
    );

    if (existingUser) {
      return "An account with this email already exists.";
    }

    setUsers((previousUsers) => [...previousUsers, user]);

    return "success";
  }

  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/signup"
          element={<Signup createAccount={createAccount} />}
        />

        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
