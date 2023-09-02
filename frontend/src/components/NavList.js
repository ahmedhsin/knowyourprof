import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Cookies from "js-cookie";
import { Login, Logout, Register } from "../routes/auth";
import Home from "../routes/home";
import Profs from "../routes/profs";
import '../assets/navlist.css'

const NavList = () => {
  const [logged, setLogged] = useState(false);
  useEffect(() => {
    setLogged(Cookies.get("token") != undefined);
  }, [logged]);
  useEffect(() => {
    let btnNav = document.getElementById("hixxz");
    let nav = document.getElementById("navxxz");
    btnNav.addEventListener("click", (e) => {
      e.stopPropagation();
      if (btnNav.checked) {
        //nav.style.display = "flex";
        nav.classList.add('navlist-active')

      } else {
        //nav.style.display = "none";
        nav.classList.remove('navlist-active')
      }
    });
    nav.addEventListener("click", (e) => {
      if (e.target != btnNav && nav.style.top == 0) {
        //nav.style.display = "none";
        nav.classList.remove('navlist-active')
        btnNav.checked = false;
      }
    });
  }, []);
  return (
    <>
      <div className="mobile-navxxz hidden" id="mobile-navxxz">
          <div className="btn-navxxz" width="20px">
            <input type="checkbox" id="hixxz" />
            <label className="menuxxz" htmlFor="hixxz">
              <div className="barxxz"></div>
              <div className="barxxz"></div>
              <div className="barxxz"></div>
            </label>
          </div>
      </div>
      <nav className="navxxz" id="navxxz">
        {logged ? (
          <div className="right-navxxz">
            <Link to="logout" className="logoutxxz">
              logout
            </Link>
            <Link to="/accout" className="accountxxz">
              account
            </Link>
          </div>
        ) : (
          <div className="right-navxxz">
            <Link to="/register" className="registerxxz">
              register
            </Link>
            <Link to="/login" className="loginxxz">
              login
            </Link>
          </div>
        )}
        <div className="left-navxxz">
          <Link to="/">about</Link>
          <Link to="/">request</Link>
          <Link to="/">Home</Link>
        </div>
      </nav>
    </>
  );
};

export default NavList;
