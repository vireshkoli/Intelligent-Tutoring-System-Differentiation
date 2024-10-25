import React from "react";
import "./Nav.css";
import logo from "../Navbar/logo.png";

function Nav() {
  return (
    <nav className="navbar navbar-container navbar-expand-lg bg-info-subtle bg-gradient py-2">
      <div className="d-flex container-fluid align-items-center">
        <img src={logo} alt="logo" className="logo" />
        <a
          className=" d-flex navbar-brand fs-3 fw-bold text-primary align-items-center"
          href="#"
        >
          CalcBuddy
        </a>
        <button
          className="navbar-toggler mx-2"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-5 flex gap-3 fw-semibold">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="/">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/">
                Courses
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/">
                About
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/">
                Blog
              </a>
            </li>
          </ul>
          <div className="container d-flex justify-content-end gap-3">
            <button type="button" className="btn btn-dark">
              Sign Up
            </button>
            <button type="button" className="btn btn-outline-dark">
              Login
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
