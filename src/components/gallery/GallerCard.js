import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Row, Col } from 'react-bootstrap'
import { getPhotosByGalleryId } from "../../modules/PhotoManager";
import ReactPaginate from "react-paginate";
import './GalleryCard.css'

export const GalleryCard = ({ singleGallery, handleDeleteGallery }) => {

  const [photos, setPhotos] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState(false);

  // --- pagination states initialization ---
  // Here we use photo offsets; we could also use page offsets
  // following the API or data we are working with.
  const [photoOffset, setPhotoOffset] = useState(0);
  const [currentPhotos, setCurrentPhotos] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const photosPerPage = 3; // display 3 photos at a time on gallery card
  // --- pagination state defination ends ---

  let activeUser = JSON.parse(sessionStorage.getItem("gallery_user"));
  let userName = activeUser.name;

  if (userName.includes(' ')) {
    // replace the space with a hyphen so as to prevent showing
    // %20 in the url
    userName = userName.replace(' ', '-');
  }

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const newOffset = (event.selected * photosPerPage) % photos.length;
    setPhotoOffset(newOffset);
  };

  const getPhotosFromGallery = () => {
    // After the data comes back from the API, we
    // use the setPhotos function to update state
     getPhotosByGalleryId(singleGallery.id).then(photosFromAPI => {
      setPhotos(photosFromAPI);

    });
  };

  // got the photos from the API on the component's first render
  useEffect(() => {
    getPhotosFromGallery();
  }, []);

  // pagination: if any of the following dependencies are changed,
  // it would trigger a call to useEffect.
  // photos is required as a dependency to show pagination (pages) 
  // for each gallery.
  useEffect(() => {
    const endOffset = photoOffset + photosPerPage;
    setCurrentPhotos(photos.slice(photoOffset, endOffset));
    setPageCount(Math.ceil(photos.length / photosPerPage));
  }, [photos, photoOffset, photosPerPage]);

  return (
    <>
  
      {(activeUser.id === singleGallery.userId) &&

        <div className="card" style={{ marginTop: '20px', marginBottom: '10px' }}>
          <div className="card-header card-header-footer-color">
            <strong>Gallery Name: {singleGallery.name}</strong>
          </div>
          <div className="card-body card-color">
            <Row>
              <Col className="card-content">
                <p>Date: {new Date(singleGallery.date).toDateString()} </p>
                <div className="input-btn-div">
                  <input value={`http://localhost:3000/gallery-preview/${userName}/${singleGallery.id}`} disabled={true} style={{ width: 400, height: 38 }} />&nbsp;
                </div><br></br>
                <div>
                  <Link to={`/galleries/${singleGallery.id}/photos`} className="btn btn-primary">
                    Show gallery pics
                  </Link> &nbsp;
                  <button className="btn btn-info" type="button"
                    onClick={() => { navigator.clipboard.writeText(`http://localhost:3000/gallery-preview/${userName}/${singleGallery.id}`) }} >Copy link</button>
                </div>
                <br/>

              </Col>
              <Col>
                {currentPhotos && currentPhotos.map(photo =>
                  <img style={{ width: 200, height: 200 }} className="card-img" src={photo.imageUrl} alt="single" key={photo.id}></img>
                )}
                <br/>
                <div className="paginate-div mt-1">
                  <ReactPaginate
                    breakLabel="..."
                    nextLabel="next >"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={3}
                    pageCount={pageCount}
                    previousLabel="< previous"
                    renderOnZeroPageCount={null}
                    breakClassName={'page-item'}
                    breakLinkClassName={'page-link'}
                    containerClassName={'pagination'}
                    pageClassName={'page-item'}
                    pageLinkClassName={'page-link'}
                    previousClassName={'page-item'}
                    previousLinkClassName={'page-link'}
                    nextClassName={'page-item'}
                    nextLinkClassName={'page-link'}
                    activeClassName={'active'}
                  />
                </div>
              </Col>
            </Row>
          </div>
          <dialog className="dialog dialog--auth" style={{ borderRadius: '0.5rem' }} open={confirmDialog}>
            <div>Are you sure you want to remove the gallery?</div> <br></br>
            <button
              className="btn btn-primary"
              onClick={(e) => setConfirmDialog(false)}
            >
              Cancel
            </button>&nbsp;
            <button type="button" onClick={() => handleDeleteGallery(singleGallery.id)} className="btn btn-danger">Confirm</button>
          </dialog>

          <div>
            <div className="card-footer card-header-footer-color footer-btns">
              <Link to={`/galleries/${singleGallery.id}/edit`} className="btn btn-primary">
                Edit Gallery
              </Link>&nbsp;&nbsp;&nbsp;
              <button type="button" onClick={() => setConfirmDialog(true)} className="btn btn-danger">Remove Gallery</button>&nbsp;&nbsp;&nbsp;
              <a href={`http://localhost:3000/gallery-preview/${userName}/${singleGallery.id}`} target="_blank" className="btn btn-success">Preview</a>
            </div>
          </div>

        </div>
      }
    </>
  );
}