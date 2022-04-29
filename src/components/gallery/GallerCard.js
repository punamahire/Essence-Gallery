import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom";
import { Row, Col } from 'react-bootstrap'
import { getPhotosByGalleryId } from "../../modules/PhotoManager";
import './GalleryCard.css'

export const GalleryCard = ({ singleGallery, handleDeleteGallery }) => {

    const [photos, setPhotos] = useState([]);
    const [existDialog, setExistDialog] = useState(false);
    let activeUser = JSON.parse(sessionStorage.getItem("gallery_user"));
    
    const getPhotosFromGallery = () => {
        // After the data comes back from the API, we
        // use the setPhotos function to update state
        return getPhotosByGalleryId(singleGallery.id, 3).then(photosFromAPI => {
        setPhotos(photosFromAPI)
        });
    };

    // got the photos from the API on the component's first render
    useEffect(() => {
        getPhotosFromGallery();
    }, []);

    return (
      <>
        {(activeUser.id === singleGallery.userId) &&  

          <div className="card" style={{marginTop: '20px'}}>
            <div className="card-header">
              <strong>Gallery Name: {singleGallery.name}</strong>
            </div>
            <div className="card-body">
              <Row>
                <Col className="card-content">
                  <p>Date: {new Date(singleGallery.date).toDateString()} </p>   
                  <div className="input-btn-div">
                    <input value={`http://localhost:3000/gallery-preview/${singleGallery.id}`} disabled={true} style={{width: 300, height: 38}} />&nbsp;
                    <button className="btn btn-info" type="button" 
                      onClick={() => {navigator.clipboard.writeText(`http://localhost:3000/gallery-preview/${singleGallery.id}`)}} >Copy</button>
                    
                  </div><br/><br/><br/><br/>
                      
                </Col>
                <Col>
                  {photos.map(photo => 
                          <img style={{width: 200, height: 200}} className="card-img" src={photo.imageUrl} alt="single" key={photo.id}></img>      
                    )}
                </Col>
              </Row>
            </div>
            <dialog className="dialog dialog--auth" open={existDialog}>
              <div>Are you sure you want to remove the gallery?</div> <br></br>
                <button
                  className="btn btn-primary"
                  onClick={(e) => setExistDialog(false)}
                >
                  Cancel
                </button>&nbsp;
                <button type="button" onClick={() => handleDeleteGallery(singleGallery.id)} className="btn btn-danger">Confirm</button>
            </dialog>
            <div className="card-footer">
                    <Link to={`/galleries/${singleGallery.id}/edit`} className="btn btn-primary">
                      Edit Gallery
                    </Link>&nbsp;&nbsp;&nbsp;
                    <button type="button" onClick={() => setExistDialog(true)} className="btn btn-danger">Remove Gallery</button>&nbsp;&nbsp;&nbsp;
                    <a href={`http://localhost:3000/gallery-preview/${singleGallery.id}`} target="_blank" className="btn btn-success">Preview</a>
            </div>
          </div>
        }
    </>
    );
}