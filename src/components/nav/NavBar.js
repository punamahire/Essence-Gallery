import React from "react"
import { useLocation } from 'react-router-dom'
import { Navbar, Container, Nav } from "react-bootstrap"
import "./NavBar.css"

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
          <Navbar.Brand className="brittany">Essence Gallery</Navbar.Brand>

          {/* for gallery-preview, login and register page the galleries
              link should not show up in the nav-bar */}

          {props.isAuthenticated &&
            <Nav className="me-auto">
              {/* React conditional class aplication */}
              <Nav.Link href="/galleries" className={`${location.pathname.includes('galleries') ? "active" : ''}`} >Galleries</Nav.Link>
  
              <Nav.Link href="/login" onClick={props.clearUser}>Logout</Nav.Link>
            </Nav>
          }

          {props.isAuthenticated &&
            <Navbar.Collapse className="justify-content-end">
              <Navbar.Text>
                {currentUserName && <span>Hello, {currentUserName}</span>}
              </Navbar.Text>
            </Navbar.Collapse>
          }
        </Container>
      </Navbar>
    </>
  )
}


