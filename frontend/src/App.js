import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Cookies from "js-cookie";
import { Login, Logout, Register } from "./routes/auth";
import Home from "./routes/home";
import Profs from "./routes/profs";
import Admin from "./routes/admin";

/*random component from codepen*/

function App() {

  return (
    <BrowserRouter>
      <div className="" id="bd">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="login" element={<Login/>} />
          <Route path="logout" element={<Logout/>} />
          <Route path="register" element={<Register/>} />
          <Route path="profs/:id" element={<Profs />} />
          <Route path="admin" element={<Admin />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
