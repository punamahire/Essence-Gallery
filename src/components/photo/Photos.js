import React from 'react';
import { Row, Col } from 'react-bootstrap';

export const Photos = ({ singlePhoto, handleDeletePhoto }) => {   

  return (
 
      <col4>
        <img style={{width: 200}} className="card-img" src={singlePhoto.imageUrl} alt="my photo"></img>
        <button type="button" onClick={() => handleDeletePhoto(singlePhoto.id)}>Remove Photo</button>
      </col4>
  );
}