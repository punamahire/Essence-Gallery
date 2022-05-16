import { useEffect, useRef, useState } from "react";
import { addPhoto } from "../../modules/PhotoManager";
import { settings } from "../../Settings";
import './ImageUploader.css'

export const ImageUploader = ({ gallery, updatePhotos }) => {

  const dropbox = useRef(null);
  const fileSelect = useRef(null);
  let recentAddedPhotos = [];

  async function handleImageUpload() {
    if (fileSelect) {
      fileSelect.current.click();
    }
  }

  const handleFiles = (files) => {

    for (let i = 0; i < files.length; i++) {
      uploadFile(files[i]);
    }
  }

  // upload selected photo to cloudinary
  const uploadFile = (file) => {

    const url = `${settings.apiBaseURL}/image/upload`;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", settings.uploadPreset);

    fetch(url, {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        if (data.secure_url !== '') {

          const activeUser = JSON.parse(sessionStorage.getItem("gallery_user"))
          // create a new photo object and add it to the database
          // the imageUrl will point to the remote url from cloudinary
          const photo = {
            imageUrl: data.secure_url,
            galleryId: gallery.id,
            userId: activeUser.id
          };

          addPhoto(photo).then(addedPhoto => {

            // save the ids of photos that we are adding to the gallery.
            // If user presses cancel instead of save gallery,
            // we need to delete these photos from gallery.
            recentAddedPhotos.push(addedPhoto.id);
            updatePhotos(recentAddedPhotos);
          })

        }
      })
      .catch(err => console.error(err));

  }

  useEffect(() => {
    const dragEnter = (e) => {
      e.stopPropagation();
      e.preventDefault();
    }

    const dragOver = (e) => {
      e.stopPropagation();
      e.preventDefault();
    }

    const drop = (e) => {
      e.stopPropagation();
      e.preventDefault();

      const dt = e.dataTransfer;
      const files = dt.files;

      handleFiles(files);
    }

    //Add event listeners for drag-dropping the images into the dropbox area.
    dropbox.current.addEventListener("dragenter", dragEnter, false);
    dropbox.current.addEventListener("dragover", dragOver, false);
    dropbox.current.addEventListener("drop", drop, false);

    //Reasons to cleanup or remove event listener in useEffect:
    //1. Keeping event listeners running isn't free. It takes memory
    //   and processing power.
    //2. Since, React components re-render, the addEventListener() 
    //   would run multiple times and we could have multiple listeners 
    //   instead of a single listener run per event occurrence.
    //3. React based Single-page-app exist within long-lived browser sessions.
    //   This can cause memory leaks.
    return () => {
      dropbox.current?.removeEventListener("dragenter", dragEnter);
      dropbox.current?.removeEventListener("dragover", dragOver);
      dropbox.current?.removeEventListener("drop", drop);
    };
  }, []);


  return (
    <div ref={dropbox}>
      <div
        className="dropbox-div"
        style={{ height: 200, width: '99.5%' }}
      >
        <section className="flex justify-center items-center h-full">

          <div className="text-secondary text-center">
            <div>Drag and drop images here</div>
            <div>or</div>
            <button
              className="btn btn-info"
              onClick={handleImageUpload}
              type="button"
            >
              Browse
            </button>
          </div>

          <input
            ref={fileSelect}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => handleFiles(e.target.files)}
          />

        </section>
      </div>

    </div>
  );
}