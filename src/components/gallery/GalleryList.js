import React, { useState, useEffect } from 'react';
import { Container, Row, Col} from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import { getAllGalleries, deleteGallery } from '../../modules/GalleryManager';
import { deletePhoto, getPhotosByGalleryId } from '../../modules/PhotoManager';
import { GalleryCard } from './GallerCard';

export const GalleryList = () => {   

  const [galleries, setGalleries] = useState([]);
  const navigate = useNavigate();

  const getGalleries = () => {
    // After the data comes back from the API, we
    // use the setGalleries function to update state
    return getAllGalleries().then(galleriesFromAPI => {
      setGalleries(galleriesFromAPI)
    });
  };

  const handleDeleteGallery = id => {

    // first, delete all the photos in the gallery
    getPhotosByGalleryId(id).then(photosFromAPI => {

      photosFromAPI.map(photo => {
        deletePhoto(photo.id)
        .then(() => {
          console.log("deleted photo upon gallery delete")
        });
      })
      
    });

    // Next, delete the gallery
    deleteGallery(id)
    .then(() => getAllGalleries().then(setGalleries));
  };

  // got the galleries from the API on the component's first render
  useEffect(() => {
    getGalleries();
  }, []);


  // Use .map() to "loop over" the Galleries array to show a list of Gallery 
  return (
  <>
   <Container>
      <section className="section-content">
          <h1>Your galleries</h1>
          <button type="button" className="btn btn-primary"
              onClick={() => {navigate("/galleries/create")}}>
              Add New Gallery
          </button>
      </section>
      <div className="container-cards">
        {galleries.map(gallery => 
          <GalleryCard 
            key={gallery.id} 
            singleGallery={gallery} 
            handleDeleteGallery={handleDeleteGallery} />
        )}
      </div>
    </Container>
  </>

  );
}