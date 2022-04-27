import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom";
import { getPhotosByGalleryId, deletePhoto } from "../../modules/PhotoManager";
import { Photos } from "../photo/Photos"

export const GalleryCard = ({ singleGallery, handleDeleteGallery }) => {

    const [photos, setPhotos] = useState([]);
    
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
      <div className="card">
        <div className="card-content">
          <h3>Gallery Name: <span className="card-galleryname">
            {singleGallery.name}
          </span></h3>
          <p>Date: {singleGallery.date}</p>
          {/* <p>public url to view the gallery: {singleGallery.publicUrl}</p>
          <button type="button" onClick={() => copyGalleryUrl(singleGallery.publicUrl)}>Copy</button> */}

          <div>
            {photos.map(photo => 
                <Photos 
                    key={photo.id} 
                    singlePhoto={photo} 
                    handleDeletePhoto={handleDeletePhoto} 
                />
            )}
          </div>          

          <Link to={`/galleries/${singleGallery.id}/edit`}>
            <button>Edit Gallery</button>
          </Link>
          <button type="button" onClick={() => handleDeleteGallery(singleGallery.id)}>Remove Gallery</button>
        </div>
      </div>
    );
}