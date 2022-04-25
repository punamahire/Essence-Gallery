import React from "react"
import { Routes, Route, Outlet, Navigate } from "react-router-dom"
import { Login } from "./auth/Login"
import { Register } from "./auth/Register"
import { GalleryList } from "./gallery/GalleryList"
import { GalleryAddForm } from "./gallery/GalleryAddForm"

export const ApplicationViews = ({setAuthUser, isAuthenticated, setIsAuthenticated}) => {
    const PrivateOutlet = () => {
		return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
	}
  
  return (
    <>
    <Routes>
      <Route path="/" element={<PrivateOutlet/>} >
        
        <Route path="/galleries" element={<GalleryList/>} />
        <Route path="/galleries/create" element={<GalleryAddForm />} />
        {/* <Route path="/articles" element={<ArticleList />} />
        <Route path="/articles/add" element={<ArticleForm />} />
        <Route path="/articles/:articleId/edit" element={<ArticleEditForm />} />

        <Route path="/messages" element={<Messages />} />

        <Route path="/friends" element={<Friends/>} />
        <Route path="/friends/add" element={<FriendForm/>} />

        <Route path="/tasks" element={<Tasks/>} />
        <Route path="/tasks/completed" element={<CompletedTasks/>} />
        <Route path="/tasks/add" element={<TaskForm/>} />
        <Route path="/tasks/:taskId/edit" element={<TaskEditForm/>} />

        <Route path="/events" element={<EventList/>} />
        <Route path="/events/create" element={<EventAddForm/>} />
        <Route path="/events/:eventId/edit" element={<EventEditForm/>} /> */}
      </Route>
      <Route path="/login" element={<Login setAuthUser={setAuthUser}/> }/>
      <Route path="/register" element={<Register/>}/>
    </Routes>
    </>
  )
}