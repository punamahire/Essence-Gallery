import React, { useState, useEffect } from "react"
import { getPhotosByGalleryId } from "../../modules/PhotoManager";
import { getGalleryById } from '../../modules/GalleryManager'
import { PhotosInGrid } from "./PhotosInGrid";
import { useParams } from "react-router-dom";
import { PhotosInMasonry } from "./PhotosInMasonry";

export const GalleryPreview = () => {
  const { galleryId } = useParams();
  const [gallery, setGallery] = useState({});
  const [photos, setPhotos] = useState([]);
  const [numOfColumns, setNumOfColumns] = useState(0)

  const getPhotosFromGallery = () => {
    // After the data comes back from the API, we
    // use the setPhotos function to update state
    return getPhotosByGalleryId(galleryId).then(photosFromAPI => {
      setPhotos(photosFromAPI)
    });
  };

  // got the photos from the API on the component's first render
  useEffect(() => {
    getGalleryById(galleryId)
      .then(gallery => {
        setGallery(gallery);
        getPhotosFromGallery(gallery.id);
        if (parseInt(gallery.layoutId) === 1) {
          setNumOfColumns(3);
        } else if (parseInt(gallery.layoutId) === 2) {
          setNumOfColumns(4);
        }
      });
  }, []);

  return (
    <div className="container">
      <div style={{padding: '10px'}}>
        <h3>Gallery: 
          <span className="card-galleryname">
            {` ${gallery.name}`}
          </span>
        </h3>
        <h5>Date: {gallery.date}</h5>
      </div>
    
      {(numOfColumns === 3 || numOfColumns === 4) &&
        <div>
          <PhotosInGrid
            columns={numOfColumns}
            photosInGallery={photos}
          />
        </div>
      }
      {parseInt(gallery.layoutId) === 3 && 
        <div>
          <PhotosInMasonry
            galleryId={gallery.id}
            photosInGallery={photos}
          />
        </div>
      }

    </div>
  );
}