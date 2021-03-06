import React from 'react';
import Masonry from 'react-masonry-css'
import "./PhotosInMasonry.css"

export const PhotosInMasonry = ({ galleryId, photosInGallery }) => {
  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  };

  return (
    <div className="vh-100 overflow-auto">
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column">
        {photosInGallery.map((photo) => {
          return (
            <div key={photo.id}>
              <img src={photo.imageUrl} style={{ width: 300 }}/>
            </div>
          );
        })}
      </Masonry>
    </div>
  );

}
