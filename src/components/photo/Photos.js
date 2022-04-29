import React from 'react';
import "./Photos.css"

export const Photos = ({ singlePhoto, handleDeletePhoto }) => {   

  return (
      <div>
        <div className='photo-div'>
          <img style={{width: 300}} className="photo-img" src={singlePhoto.imageUrl} alt="my photo"></img>
          <button className="btn btn-danger photo-close-btn" type="button" onClick={() => handleDeletePhoto(singlePhoto.id)}>X</button>
        </div>
      </div>
  );
} 