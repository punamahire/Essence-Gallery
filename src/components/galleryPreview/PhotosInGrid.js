import React from 'react';
import bootstrap from 'bootstrap';
import "./PhotosInGrid.css"

export const PhotosInGrid = ({ coulmns, photosInGallery }) => {   

  return (
    <>
        <div className="container">
            {coulmns === 3 ?
                <div className="row">
                    {photosInGallery.map(photo => {
                        <div className="col-sm-3">
                            <img style={{width: 300}} className="card-img" src={photo.imageUrl} alt="my photo"></img>
                        </div>
                        })
                    }
                    {/* <div className="col-sm-3">
                        <img style={{width: 300}} className="card-img" src={photo.imageUrl} alt="my photo"></img>
                    </div>
                    <div className="col-sm-3">
                        <img style={{width: 300}} className="card-img" src={photo.imageUrl} alt="my photo"></img>
                    </div>
                    <div className="col-sm-3">
                        <img style={{width: 300}} className="card-img" src={photo.imageUrl} alt="my photo"></img>
                    </div> */}
                </div>
            :
                <div className="row">
                    {photosInGallery.map(photo => {
                        <div className="col-sm-4">
                            <img style={{width: 300}} className="card-img" src={photo.imageUrl} alt="my photo"></img>
                        </div>
                        })
                    }
                    {/* <div className="col-sm-4">
                        <img style={{width: 200}} className="card-img" src={photo.imageUrl} alt="my photo"></img>
                    </div>
                    <div className="col-sm-4">
                        <img style={{width: 200}} className="card-img" src={photo.imageUrl} alt="my photo"></img>
                    </div>
                    <div className="col-sm-4">
                        <img style={{width: 200}} className="card-img" src={photo.imageUrl} alt="my photo"></img>
                    </div>
                    <div className="col-sm-4">
                        <img style={{width: 200}} className="card-img" src={photo.imageUrl} alt="my photo"></img>
                    </div> */}
                </div>
            }
        </div>
    </>
  );
}