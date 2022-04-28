import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getGalleryById, updateGallery } from '../../modules/GalleryManager'
import { getAllLayouts } from "../../modules/LayoutManager";
import { getPhotosByGalleryId, deletePhoto } from "../../modules/PhotoManager";
import { ImageUploader } from "../ui/ImageUploader";
import { Photos } from "../photo/Photos";
import "./GalleryAddEditForm.css"


export const GalleryEditForm = () => {
  const [photos, setPhotos] = useState([]);
  const [gallery, setGallery] = useState({});
  const [layouts, setLayouts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { galleryId } = useParams();
  const navigate = useNavigate();

  const getPhotosFromGallery = () => {
    console.log('Getting photos from gallery');
    // After the data comes back from the API, we
    // use the setPhotos function to update state
    return getPhotosByGalleryId(galleryId).then(photosFromAPI => {
      setPhotos(photosFromAPI)
    });
  };

  const handleFieldChange = evt => {
    const stateToChange = { ...gallery };
    stateToChange[evt.target.id] = evt.target.value;
    setGallery(stateToChange);
  };

  const handleDeletePhoto = id => {
    deletePhoto(id)
      .then(() => getPhotosFromGallery());
  };

  const updateExistingGallery = evt => {
    evt.preventDefault()
    setIsLoading(true);

    // default values for locationId and customerId
    // if you already have these components/modules in place, you will need to include the correct information

    const activeUser = JSON.parse(sessionStorage.getItem("gallery_user"))

    const editedGallery = {
      id: galleryId,
      name: gallery.name,
      date: gallery.date,
      userId: activeUser.id,
      layoutId: gallery.layoutId
    };

    //pass the editedGallery object to the database
    updateGallery(editedGallery)
      .then(() => navigate("/galleries"))
  }

  useEffect(() => {

    console.log("inside Edit form useEffect")
    //load layout data and setState
    getAllLayouts().then(layoutsFromAPI => {
      setLayouts(layoutsFromAPI)
    });
    setIsLoading(false);

    getGalleryById(galleryId)
      .then(gallery => {
        setGallery(gallery);
        setIsLoading(false);
      });

    getPhotosFromGallery();

  }, []);

  return (
    <>
      <form className="col-md-6 edit-form">
        <fieldset>
          <div className="form-group">
            <label htmlFor="name">Gallery name</label>
            <input
              type="text"
              required
              className="form-control"
              onChange={handleFieldChange}
              id="name"
              value={gallery.name}
            />
          </div>
        </fieldset>

        <fieldset>
          <div className="form-group">
            <label htmlFor="date">Gallery date</label>
            <input
              type="date"
              required
              className="form-control"
              onChange={handleFieldChange}
              id="date"
              value={gallery.date}
            />
          </div>
        </fieldset>

        <fieldset>
          <div>
            <label htmlFor="layout">Select a layout </label>
            <select value={gallery.layoutId} name="layout" id="layoutId" onChange={handleFieldChange} className="form-control" >
              <option>Select a layout</option>
              {layouts.map(l => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>
        </fieldset>

        <fieldset>
          <ImageUploader
            key={gallery.id}
            gallery={gallery}
            updatePhotos={getPhotosFromGallery}
          />
        </fieldset>

        <fieldset>
          <div className="photos-div">

            {photos.map(photo =>
              <Photos
                key={photo.id}
                singlePhoto={photo}
                handleDeletePhoto={handleDeletePhoto}
              />
            )}

          </div>
        </fieldset>

        {/* Be sure to include userId. Get it from sessionStorage */}

        <div className="buttons-div">
          <button
            type="button" disabled={isLoading}
            onClick={updateExistingGallery}
            className="btn btn-primary"
          >Submit</button>
        
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => { navigate("/galleries") }}>
            Cancel
          </button>
        </div>

      </form>
    </>
  );
}
