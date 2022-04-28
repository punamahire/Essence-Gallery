import { useEffect, useRef, useState } from "react";
import { addPhoto } from "../../modules/PhotoManager";
import { settings } from "../../Settings";
import './ImageUploader.css'

export function ImageUploader({ gallery, updatePhotos }) {

  console.log("gallery object", gallery)

  const dropbox = useRef(null);
  const fileSelect = useRef(null);
  const [progress, setProgress] = useState(0);

  async function handleImageUpload() {
    if (fileSelect) {
      fileSelect.current.click();
    }
  }

  function handleFiles(files) {
    console.log("handleFiles");
    console.log(files);
    for (let i = 0; i < files.length; i++) {
      console.log(files[i]);
      uploadFile(files[i]);
    }
  }

  // upload photo to cloudinary
  function uploadFile(file) {

    console.log("inside uploadImage... file", file)

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
          console.log("data from fetch", data)
          if (data.secure_url !== '') {
            console.log("secure_url", data.secure_url)

            const activeUser = JSON.parse(sessionStorage.getItem("gallery_user"))
            // add photo to database
            console.log("galleryId", gallery.id)
            const photo = {
                            imageUrl: data.secure_url,
                            galleryId: gallery.id,
                            userId: activeUser.id
                          };       
                        
            addPhoto(photo).then(addedPhoto => {
              console.log("added photo to database", addedPhoto);
              updatePhotos();
            })

          }
        })
        .catch(err => console.error(err));  

    // // Update progress (can be used to show progress indicator)
    // xhr.upload.addEventListener("progress", (e) => {
    //   setProgress(Math.round((e.loaded * 100.0) / e.total));
    //   console.log(Math.round((e.loaded * 100.0) / e.total));
    // });

  }

  useEffect(() => {
    function dragEnter(e) {
      e.stopPropagation();
      e.preventDefault();
    }

    function dragOver(e) {
      e.stopPropagation();
      e.preventDefault();
    }

    function drop(e) {
      e.stopPropagation();
      e.preventDefault();

      const dt = e.dataTransfer;
      const files = dt.files;

      handleFiles(files);
    }

    dropbox.current.addEventListener("dragenter", dragEnter, false);
    dropbox.current.addEventListener("dragover", dragOver, false);
    dropbox.current.addEventListener("drop", drop, false);

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
          style={{ height: 200, width: 630 }}
          >
          <section className="flex justify-center items-center h-full">
            {progress === 0 ? (
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
            ) : (
              <span className="text-gray-700">{progress}%</span>
            )}

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