import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Cookies from "js-cookie";
import { Login, Logout, Register } from "../routes/auth";
import Home from "../routes/home";
import Profs from "../routes/profs";
import "../assets/nav.css";
import AddProf from "../components/AddProf";

const NavBar = ({ auth }) => {
  useEffect(() => {
    let btnNav = document.getElementById("hi");
    let nav = document.getElementById("nav");
    btnNav.addEventListener("click", (e) => {
      e.stopPropagation();
      if (btnNav.checked) {
        //nav.style.display = "flex";
        nav.classList.add("navlist-active");
      } else {
        //nav.style.display = "none";
        nav.classList.remove("navlist-active");
      }
    });
    nav.addEventListener("click", (e) => {
      if (e.target != btnNav && nav.style.top == 0) {
        nav.classList.remove("navlist-active");
        btnNav.checked = false;
      }
    });
  }, []);
  return (
    <>
      <AddProf />
      <div className="mobile-nav hidden" id="mobile-nav">
        <div className="btn-nav" width="20px">
          <input type="checkbox" id="hi" />
          <label className="menu" htmlFor="hi">
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </label>
        </div>
      </div>
      <nav className="nav" id="nav">
        {auth.isLogged ? (
          <div className="right-nav">
            <Link to="/logout" className="logout">
              logout
            </Link>
            {auth.type === "user" ? (
              <Link to="/account" className="account">
                account
              </Link>
            ) : (
              <Link to="/admin" className="account">
                panel
              </Link>
            )}
          </div>
        ) : (
          <div className="right-nav">
            <Link to="/register" className="register">
              register
            </Link>
            <Link to="/login" className="login">
              login
            </Link>
          </div>
        )}
        <div className="left-nav">
          <Link to="/about">about</Link>
          <Link
            to=""
            onClick={() => {
              document.getElementById("add-prof-box").style.display = "block";
              document.getElementById("overlay-prof").style.display = "block";
            }}
          >
            request
          </Link>
          <Link to="/">Home</Link>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
