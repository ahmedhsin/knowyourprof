import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Cookies from "js-cookie";
import { Login, Logout, Register } from "./routes/auth";
import Home from "./routes/home";
import Profs from "./routes/profs";
import Admin from "./routes/admin";
import Search from "./routes/search";
import Account from "./routes/account"
import NavBar from './components/Nav'
import Review from './components/Review'
import AddProf from './components/AddProf'
import About from './routes/about'
import {logged, getType} from './func/logged'

const NotFound = ()=>{
  return(
    <div className="error">NOT FOUND 404!</div>

    )
}
const NotAuth = ()=>{
  return(
    <div className="error">NOT AUTHORIZED!</div>

    )
}

function App() {
  const [auth, setAuth] = useState({isLogged:logged(), type:getType()})
  return (
    <BrowserRouter>
      <NavBar auth={auth}/>
      <div className="" id="bd">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="login" element={!auth.isLogged ? <Login setAuth={setAuth} /> : <NotAuth/>} />
          <Route path="logout" element={auth.isLogged ? <Logout setAuth={setAuth}/> : <NotAuth/>} />
          <Route path="register" element={!auth.isLogged ? <Register/> : <NotAuth />} />
          <Route path="profs/:id" element={<Profs />} />
          <Route path="admin" element={auth.type==='admin' ? <Admin /> : <NotAuth/>} />
          <Route path="search/:prof/:facility" element={<Search />} />
          <Route path="account" element={auth.type==='user' ? <Account /> : <NotAuth />} />
          <Route path="about" element={<About/>} />
          <Route path="*" element={<NotFound/>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
