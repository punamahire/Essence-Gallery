import React, {useState} from "react"
import { ApplicationViews } from "./ApplicationViews"
import { NavBar } from "./nav/NavBar"
import { Container } from "react-bootstrap"
import "./EssenceGallery.css"

export const EssenceGallery = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(sessionStorage.getItem("gallery_user") !== null)

    const setAuthUser = (user) => {
        sessionStorage.setItem("gallery_user", JSON.stringify(user))
        setIsAuthenticated(sessionStorage.getItem("gallery_user") !== null)
    }
    
    const clearUser = () => {
        sessionStorage.clear();
        setIsAuthenticated(sessionStorage.getItem("gallery_user") !== null)
      }
    
return (
  <>
  <NavBar clearUser={clearUser} isAuthenticated={isAuthenticated}/>
  <Container>
    <ApplicationViews setAuthUser={setAuthUser}
                isAuthenticated={isAuthenticated}
                setIsAuthenticated={setIsAuthenticated}/>
  </Container>
  </>
)}