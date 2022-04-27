import React, { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom";
import { Container, Row, Col } from 'react-bootstrap'
import { getPhotosByGalleryId, deletePhoto } from "../../modules/PhotoManager";
import { ShowGridLayout } from "../galleryPreview/ShowGridLayout";
import { Photos } from "../photo/Photos"

export const GalleryCard = ({ singleGallery, handleDeleteGallery }) => {

    const [photos, setPhotos] = useState([]);
    const {galleryId} = useParams();
    
    const getPhotosFromGallery = () => {
        // After the data comes back from the API, we
        // use the setPhotos function to update state
        return getPhotosByGalleryId(singleGallery.id).then(photosFromAPI => {
        setPhotos(photosFromAPI)
        });
    };

    const handleDeletePhoto = id => {
        deletePhoto(id)
        .then(() => getPhotosFromGallery());
    };

    // got the photos from the API on the component's first render
    useEffect(() => {
        getPhotosFromGallery();
    }, []);

    return (
      <>
        <Container>
          <Row>
            <Col>
              <h3>Gallery Name: 
                <span className="card-galleryname">
                  {singleGallery.name}
                </span>
              </h3>
              <p>Date: {new Date(singleGallery.date).toDateString()} </p>
              {/* <p>public url to view the gallery: {singleGallery.publicUrl}</p>
              <button type="button" onClick={() => copyGalleryUrl(singleGallery.publicUrl)}>Copy</button> */}

              <Link to={`/galleries/${singleGallery.id}/edit`}>
                <button>Edit Gallery</button>
              </Link>
              <button type="button" onClick={() => handleDeleteGallery(singleGallery.id)}>Remove Gallery</button>
            </Col>
            <Col>
              {photos.map(photo => 
                  <col4>
                    <img style={{width: 200, height: 200}} className="card-img" src={photo.imageUrl} alt="my photo"></img>
                  </col4>

              )}
            </Col>  
            <hr></hr>        
          </Row>
        </Container>
    </>
    );
}