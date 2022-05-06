import React, { useEffect } from 'react';
import { getPhotosWithKeywords } from '../../modules/PhotoManager'

export const SearchPhotos = ({ searchString }) => {

    const [searchedPhotos, setSearchedPhotos] = useState([]);

    const getPhotosFromGallery = () => {
        getPhotosWithKeywords(searchString).then(foundPhotos => {

            console.log("found photos", foundPhotos);
            setSearchedPhotos(foundPhotos);
        })
    }

    useEffect(() => {
        getPhotosFromGallery();
    }, []);

    return (
        <div className='container'>
            {searchedPhotos.map(photo =>
                <img style={{ width: 200 }} className="photo-img" src={photo.imageUrl} alt="my photo"
                key={photo.id}
                ></img>
            )}
        </div>
    );
} 