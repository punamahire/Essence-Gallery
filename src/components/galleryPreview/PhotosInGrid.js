import React from 'react';
import { Row } from 'react-bootstrap';

export const PhotosInGrid = ({ columns, photosInGallery }) => {   

  return (
    <>
        <div className="container">
            {columns === 3 ?
                <Row>
                    <h1 className="text-center">3-Column Grid</h1>
                    {photosInGallery.map(photo => {
                        return (<div className="col-sm-4">
                            <img style={{width: 300}} className="card-img" src={photo.imageUrl} alt="3 column grid"></img>
                        </div>)
                        })
                    }
                </Row>
            :
                <div className="row">
                    <h1 className="text-center">4-Column Grid</h1>
                    {photosInGallery.map(photo => {
                        return (<div className="col-sm-3" key={photo.id}>
                            <img style={{width: 300}} className="card-img" src={photo.imageUrl} alt='4 column grid' />
                        </div>)
                        })
                    }
                </div>
            }
        </div>
    </>
  );
}