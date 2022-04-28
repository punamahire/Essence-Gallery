import React from 'react';
import { Row, Col } from 'react-bootstrap';

export const Photos = ({ singlePhoto, handleDeletePhoto }) => {   

  return (
      <div>
        <div className='image-div'>
          <img style={{width: 200}} className="gallery-img" src={singlePhoto.imageUrl} alt="my photo"></img>
        </div>
        <div>
          <button type="button" onClick={() => handleDeletePhoto(singlePhoto.id)}>Remove Photo</button>
        </div>
      </div>
  );
} 