import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getGalleryById, updateGallery } from '../../modules/GalleryManager'
import { getAllLayouts } from "../../modules/LayoutManager";
import { getPhotosByGalleryId, deletePhoto } from "../../modules/PhotoManager";
import { ImageUploader } from "../ui/ImageUploader"
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
    // After the data comes back from the API, we
    // use the setPhotos function to update state
    getPhotosByGalleryId(galleryId).then(photosFromAPI => {
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

    //load layout data and setState. We need the layouts state
    //to display options in the dropdown.
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
    <section className="vh-100">
      <div className="mask d-flex align-items-center h-100">
        <div className="container h-100 overflow-auto edit-form">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-12 col-md-9 col-lg-7 col-xl-10">
              <div className="card" style={{ borderRadius: 15 }}>
                <div className="card-body p-5">
                  <h2 className="text-center mb-5">Update {gallery.name}</h2>
                  <form >
                    <div className="form-outline mb-4">
                      <label className="form-label label-font-size" htmlFor="name">Gallery Name</label>

                      <input type="text" id="name" onChange={handleFieldChange} required autoFocus className="form-control" placeholder="Enter gallery name" defaultValue={gallery.name} />
                    </div>

                    <div className="form-outline mb-4">
                      <label className="form-label label-font-size" htmlFor="date">Gallery date</label>
                      <input type="date" id="date" onChange={handleFieldChange} required autoFocus className="form-control" placeholder="Enter gallery date" defaultValue={gallery.date} />
                    </div>

                    <div className="form-outline mb-4">
                      <div className="form-group">
                        <label className="form-label label-font-size" htmlFor="layout">Layout </label>
                        <select value={gallery.layoutId} name="layout" id="layoutId" onChange={handleFieldChange} className="form-select" >
                          <option>Select a layout</option>
                          {layouts.map(l => (
                            <option key={l.id} value={l.id}>
                              {l.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="form-outline mb-4">
                      <ImageUploader
                        key={gallery.id}
                        gallery={gallery}
                        updatePhotos={getPhotosFromGallery}
                      />
                    </div>

                    <div>
                      <div className="photos-div form-outline mb-4">
                        {photos.map(photo =>
                          <Photos
                            key={photo.id}
                            singlePhoto={photo}
                            handleDeletePhoto={handleDeletePhoto}
                          />
                        )}
                      </div>
                    </div>

                    <div className="d-flex justify-content-center">
                      <button type="button" className="btn btn-primary"
                        disabled={isLoading}
                        onClick={updateExistingGallery}>
                        Save Gallery
                      </button> &nbsp;&nbsp;&nbsp;
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => { navigate("/galleries") }}>
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
