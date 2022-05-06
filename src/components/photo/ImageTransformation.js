import React, { useState, useEffect } from "react"
import { getRandomPhoto } from "../../modules/PhotoManager";

export const ImageTransformation = () => {

  const ART_FILTERS = [
    'al_dente',
    'athena',
    'audrey',
    'aurora',
    'daguerre',
    'eucalyptus',
    'fes',
    'frost',
    'hairspray',
    'hokusai',
    'incognito',
    'linen',
    'peacock',
    'primavera',
    'quartz',
    'red_rock',
    'refresh',
    'sizzle',
    'sonnet',
    'ukulele',
    'zorro'
  ];

  const [filteredImage, setFilteredImage] = useState();
  const [photo, setPhoto] = useState([]);

  const getAPhoto = () => {
    getRandomPhoto().then(photoFromAPI => {
      console.log('photo', photoFromAPI)
      if (photoFromAPI) {
        setPhoto(photoFromAPI);
      }
    });
  };

  const applyFilter = (filter) => {
    console.log('src filter', photo.imageUrl.replace('/upload/', `/upload/e_art:${filter}/`));
    setFilteredImage(photo.imageUrl.replace('/upload/', `/upload/e_art:${filter}/`));
  }

  // got the photo from the API on the component's first render
  useEffect(() => {
    getAPhoto();
  }, []);

  return (
    <>
      <div>
      Original : <img width="100" height="100" src={photo.imageUrl} alt='original ' /><br></br>
      Filtered: <img width="100" height="100" src={filteredImage} alt='filtered' />
        <h2>Filters</h2>
        <ul>
          {ART_FILTERS.map(filter => {
            return (
              <li key={filter} data-is-active-filter={false}>
                <button onClick={() => applyFilter(filter)}><span>{filter}</span></button>                  
              </li>
            )
          })}
        </ul>

        {/* <Image publicId={publicId} format="jpg" signUrl="false">
          <Transformation effect="art:al_dente" />
        </Image> */}
      </div>

    </>
  );
}