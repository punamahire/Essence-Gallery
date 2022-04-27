import React from "react"
import { Link } from "react-router-dom"
//import "bootstrap/dist/css/bootstrap.min.css"


export const NavBar = (props) => {
  let tmp = JSON.parse(sessionStorage.getItem("gallery_user"));
  let currentUserName = null
  if (tmp) {
    currentUserName = tmp.name;
  }
    
  return (
    <nav className="navbar bg-dark text-white flex-md-nowrap p-0 shadow">

      <ul className="nav nav-pills nav-fill">
        <li className="nav-item">
          <Link className="nav-link" to="/galleries">Galleries</Link>
        </li>
        
        {props.isAuthenticated && <li className="nav-item">
          <Link className="nav-link" onClick={props.clearUser} to="/">Logout</Link>
        </li>}
        </ul>
        <div>
          { currentUserName && <p>Hello, {currentUserName}</p> }         
        </div>
    </nav>
  )
}


