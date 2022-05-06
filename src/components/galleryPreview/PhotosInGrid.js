import React from 'react';
import { Row } from 'react-bootstrap';

export const PhotosInGrid = ({ columns, photosInGallery }) => {

    return (
        <>
            {/* To display 3-col-grid layout use col-sm-4, and for 4-col-grid layout use col-sm-3 in each Row */}
            <div className="container">
                {columns === 3 ?
                    <Row>
                        {photosInGallery.map(photo => {
                            return (<div className="col-sm-4" key={photo.id}>
                                <img style={{ width: 300 }} className="card-img" src={photo.imageUrl} alt="3 column grid"></img>
                            </div>)
                        })
                        }
                    </Row>
                    :
                    <div className="row">
                        {photosInGallery.map(photo => {
                            return (<div className="col-sm-3" key={photo.id}>
                                <img style={{ width: 300 }} className="card-img" src={photo.imageUrl} alt='4 column grid' />
                            </div>)
                        })
                        }
                    </div>
                }
            </div>
        </>
    );
}