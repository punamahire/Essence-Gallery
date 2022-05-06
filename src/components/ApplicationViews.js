import React from "react"
import { Routes, Route, Outlet, Navigate } from "react-router-dom"
import { Login } from "./auth/Login"
import { Register } from "./auth/Register"
import { GalleryList } from "./gallery/GalleryList"
import { GalleryAddForm } from "./gallery/GalleryAddForm"
import { GalleryEditForm } from "./gallery/GalleryEditForm"
import { GalleryPreview } from "./galleryPreview/GalleryPreview"
import { PhotoList } from "./photo/PhotoList"

export const ApplicationViews = ({setAuthUser, isAuthenticated, setIsAuthenticated}) => {
    const PrivateOutlet = () => {
		return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
	}
  
  return (
    <>
    <Routes>
      <Route path="/" element={<PrivateOutlet/>} >
        
        <Route path="/galleries" element={<GalleryList />} />
        <Route path="/galleries/create" element={<GalleryAddForm />} />
        <Route path="/galleries/:galleryId/edit" element={<GalleryEditForm />} /> 
        <Route exact path="/galleries/:galleryId/photos" element={<PhotoList />} />
        
      </Route>
      <Route path="/gallery-preview/:galleryId" element={<GalleryPreview />} />
      <Route path="/login" element={<Login setAuthUser={setAuthUser}/> }/>
      <Route path="/register" element={<Register/>}/>
    </Routes>
    </>
  )
}