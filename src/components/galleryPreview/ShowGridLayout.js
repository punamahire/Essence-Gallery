import React, { useState, useEffect } from "react"
import { getPhotosByGalleryId } from "../../modules/PhotoManager";
import { PhotosInGrid } from "./PhotosInGrid";

export const ShowGridLayout = ({ gallery }) => {

    const [photos, setPhotos] = useState([]);
    const [numOfColumns, setNumOfColumns] = useState(0)
    
    const getPhotosFromGallery = () => {
        // After the data comes back from the API, we
        // use the setPhotos function to update state
        return getPhotosByGalleryId(gallery.id).then(photosFromAPI => {
            setPhotos(photosFromAPI)
        });
    };

    const getGridColumns = () => {

        if (gallery.layoutId === 1) {
            setNumOfColumns(3);
        } else if (gallery.layoutId === 2) {
            setNumOfColumns(4);
        }
        return numOfColumns;
    }

    // got the photos from the API on the component's first render
    useEffect(() => {
        getPhotosFromGallery();
        getGridColumns();
    }, []);

    return (
      <div className="card">
        <div className="card-content">
          <h3>Gallery Name: <span className="card-galleryname">
            {gallery.name}
          </span></h3>
          <p>Date: {gallery.date}</p>

          <div>
            
                <PhotosInGrid 
                    columns={numOfColumns}
                    photosInGallery={photos} 
                />
          </div>          

        </div>
      </div>
    );
}