import React from 'react';

export const Photos = ({ singlePhoto, handleDeletePhoto }) => {   

  return (
 
    <div>
        <img style={{width: 200}} className="card-img" src={singlePhoto.imageUrl} alt="my photo"></img>
        <button type="button" onClick={() => handleDeletePhoto(singlePhoto.id)}>Remove Photo</button>
    </div>
  );
}