import React from 'react';
import "./Photos.css"

export const Photos = ({ singlePhoto, handleDeletePhoto }) => {   

  return (
    <div className='image-area'>
      <img style={{width: 200}} className="photo-img" src={singlePhoto.imageUrl} alt="my photo"></img>
      <a className="remove-image" href="#" onClick={() => handleDeletePhoto(singlePhoto.id)} style={{display: 'inline'}}>&#215;</a>
    </div>
  );
} 