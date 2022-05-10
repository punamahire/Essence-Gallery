import React, { useState, useEffect } from "react";
import ReactDOM from 'react-dom';
import ReactPaginate from "react-paginate";
import { PhotosPaginateRender } from './PhotosPaginateRender';

export const PhotosPaginate = ({ gallPhotos, photosPerPage }) => {
    console.log("Gallery photos", gallPhotos);
    console.log("photos per page", photosPerPage);

  const [currentPhotos, setCurrentPhotos] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  // Here we use photo offsets; we could also use page offsets
  // following the API or data you're working with.
  const [photoOffset, setPhotoOffset] = useState(0);

  useEffect(() => {
    // Fetch photos from another resources.
    const endOffset = photoOffset + photosPerPage;
    console.log(`Loading photos from ${photoOffset} to ${endOffset}`);
    setCurrentPhotos(gallPhotos.slice(photoOffset, endOffset));
    console.log(gallPhotos.length);
    setPageCount(Math.ceil(gallPhotos.length / photosPerPage));
  }, [photoOffset, photosPerPage]);

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const newOffset = (event.selected * photosPerPage) % gallPhotos.length;
    console.log(
      `User requested page number ${event.selected}, which is offset ${newOffset}`
    );
    setPhotoOffset(newOffset);
  };

  return (
    <>
    {photoOffset} {photosPerPage} {pageCount}
    {currentPhotos && currentPhotos.map(photo =>
                  <img style={{ width: 200, height: 200 }} className="card-img" src={photo.imageUrl} alt="single" key={photo.id}></img>
                )}
      <ReactPaginate
        breakLabel="..."
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        pageCount={pageCount}
        previousLabel="< previous"
        renderOnZeroPageCount={null}
      />
    </>
  );
}
