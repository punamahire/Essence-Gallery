import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addGallery } from '../../modules/GalleryManager';
import { getAllLayouts } from '../../modules/LayoutManager';
import './GalleryAddEditForm.css';

export const GalleryAddForm = () => {

  const [galleryObj, setGallery] = useState({
    name: "",
    date: "",
    userId: 0,
    layoutId: 0
  });

  const [layouts, setLayouts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleControlledInputChange = (event) => {

    const newGallery = { ...galleryObj }
    let selectedVal = event.target.value

    newGallery[event.target.id] = selectedVal
    // update state
    setGallery(newGallery)
  }

  useEffect(() => {
    //load layout data and setState

    getAllLayouts().then(layoutsFromAPI => {
      setLayouts(layoutsFromAPI)
    });
    setIsLoading(false);
  }, []);

  const handleClickSaveGallery = (event) => {
    event.preventDefault()

    const activeUser = JSON.parse(sessionStorage.getItem("gallery_user"))
    galleryObj.userId = activeUser.id;

    if (galleryObj.name === "" || galleryObj.date === "" || galleryObj.layoutId === 0) {
      window.alert("Please enter name, date and layout for the gallery")
    } else {
      //add new gallery object to the database.
      //once complete, change the url and display the edit gallery view
      //for the user to add photos to the newly-added-gallery.
      setIsLoading(true);
      addGallery(galleryObj)
        .then(addedGallery => {
          navigate(`/galleries/${addedGallery.id}/edit`)
        });
    }
  }

  return (
    <section>
      <div className="mask d-flex align-items-center h-100">
        <div className="container vh-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-12 col-md-9 col-lg-7 col-xl-10">
              <div className="card" style={{ borderRadius: 15 }}>
                <div className="card-body p-5">
                  <h2 className="text-center mb-5">Create new Gallery</h2>
                  <form className="form--login">
                    <div className="form-outline mb-4">
                      <label className="form-label label-font-size" htmlFor="name">Gallery Name</label>

                      <input type="text" id="name" onChange={handleControlledInputChange} required autoFocus className="form-control" placeholder="Enter gallery name" value={galleryObj.name} />
                    </div>

                    <div className="form-outline mb-4">
                      <label className="form-label label-font-size" htmlFor="date">Gallery date</label>
                      <input type="date" id="date" onChange={handleControlledInputChange} required autoFocus className="form-control" placeholder="Enter gallery date" value={galleryObj.date} />
                    </div>

                    <div className="form-outline mb-4">
                      <div className="form-group">
                        <label className="form-label label-font-size" htmlFor="layout">Layout </label>
                        <select value={galleryObj.layoutId} name="layoutId" id="layoutId" onChange={handleControlledInputChange} className="form-select" >
                          <option value="0">Select a layout</option>
                          {layouts.map(l => (
                            <option key={l.id} value={l.id}>
                              {l.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="d-flex justify-content-center">
                      <button type="button" className="btn btn-primary"
                        disabled={isLoading}
                        onClick={handleClickSaveGallery}>
                        Create Gallery
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
  )
};
