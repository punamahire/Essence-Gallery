import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './GalleryList.css' 

export const GalleryList = () => {

  const navigate = useNavigate();
  // Use .map() to "loop over" the Galleries array to show a list of Gallery 
  return (
  <>
   <main>
    <section className="section-content">
        <h1>Your galleries</h1>
        <button type="button" className="btn btn-primary"
            onClick={() => {navigate("/galleries/create")}}>
            Add New Gallery
        </button>
    </section>
    <div className="container-cards">
      <p>Rendering GalleryList</p>
      {/* {events.map(event => 
        <EventCard 
          key={event.id} 
          singleEvent={event} 
          handleDeleteEvent={handleDeleteEvent}
          />
      )} */}
    </div>
    </main>
  </>

  );
}