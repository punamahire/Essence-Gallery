import React from "react"
import { Link, useLocation } from "react-router-dom"
import { Navbar, Container, Nav } from "react-bootstrap"

export const NavBar = (props) => {
  const location = useLocation();

  let tmp = JSON.parse(sessionStorage.getItem("gallery_user"));
  let currentUserName = null
  if (tmp) {
    currentUserName = tmp.name;
  }
    
  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand>Essence Gallery</Navbar.Brand>
          
          <Nav className="me-auto">
            {/* for gallery-preview page do not show the galleries link in the nav-bar */}
            {!(location.pathname.includes('gallery-preview')) &&
              <Nav.Link href="/galleries">Galleries</Nav.Link>
            }
            {props.isAuthenticated && <Nav.Link href="#" onClick={props.clearUser}>Logout</Nav.Link>}
          </Nav>

          {props.isAuthenticated && 
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              { currentUserName && <p>Hello, {currentUserName}</p> }
            </Navbar.Text>
          </Navbar.Collapse>}
        </Container>
      </Navbar>
      
      {/* <nav className="navbar bg-dark text-white flex-md-nowrap p-0 shadow">

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
      </nav> */}
    </>
  )
}


