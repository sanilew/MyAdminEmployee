import React from "react";
import { Cookies } from "react-cookie";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const cookies = new Cookies();
  const navigate = useNavigate();

  function handleLogout() {
    cookies.remove("token");
    cookies.remove("role");
    navigate("login");
  }

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary bg-blue-600">
      <div className="container-fluid">
        <Link className="navbar-brand bg-blue-600" to="/">
          Admin Dashboard
        </Link>
        <button
          className="navbar-toggler"
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
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to="/">
                Home
              </Link>
            </li>
          </ul>
        </div>
      </div>
      {!cookies.get("token") && (
        <button className="btn btn-primary me-3">Login</button>
      )}
      {cookies.get("token") && (
        <button className="btn btn-primary me-3" onClick={handleLogout}>
          Logout
        </button>
      )}
    </nav>
  );
}

export default Navbar;
