import React from "react";
import { Link } from "react-router-dom";
import ApiService from "../service/ApiService";

const logout = () => {
  ApiService.logout();
};

const Sidebar = () => {
  const isAuth = ApiService.isAuthenticated();
  const isAdmin = ApiService.isAdmin();
  const isManager = ApiService.isManager();

  return (
    <div className="sidebar">
      <h1 className="ims">Inventix</h1>
      <ul className="nav-links">
        {isAuth && (
          <li>
            <Link to="/dashboard">Dashboaard</Link>
          </li>
        )}

        {isAuth && (
          <li>
            <Link to="/transaction">Transactions</Link>
          </li>
        )}

        {isAdmin && (
          <li>
            <Link to="/category">Category</Link>
          </li>
        )}

        {(isAdmin || isManager) && (
          <li>
            <Link to="/product">Product</Link>
          </li>
        )}

        {(isAdmin || isManager) && (
          <li>
            <Link to="/supplier">Supplier</Link>
          </li>
        )}

        {isManager && (
          <li>
            <Link to="/purchase">Purchase</Link>
          </li>
        )}

        {isManager && (
          <li>
            <Link to="/sell">Sell</Link>
          </li>
        )}

        {isAuth && (
          <li>
            <Link to="/profile">Profile</Link>
          </li>
        )}

        {isAuth && (
          <li>
            <Link onClick={logout} to="/login">
              Logout
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
