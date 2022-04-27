import { useEffect, useRef, useState } from "react";
import { addPhoto } from "../../modules/PhotoManager";
import { settings } from "../../Settings";
import { Axios } from "axios";

export function Temp({ defaultImage, gallery }) {

  console.log("gallery object", gallery)

  const dropbox = useRef(null);
  const fileSelect = useRef(null);
  const [image, setImage] = useState(defaultImage);
//   const [progress, setProgress] = useState(0);

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

  
  function uploadFile(file) {
    const url = `${settings.apiBaseURL}/upload`; 

    // upload photo to cloudinary using Axios
    const formData = new FormData()
    formData.append("file", file);
    formData.append("upload_preset", settings.uploadPreset);
    formData.append("tags", "browser_upload");

    Axios.post(url, formData).then(response => {
        console.log("Response from post method", response)

        Axios.get(url).then(resp => {

            console.log(resp.data);
    
            if (resp.status === 200) {
    
                setImage(resp.secure_url);
    
                const activeUser = JSON.parse(sessionStorage.getItem("gallery_user"))
                // add photo to database
                console.log("galleryId", gallery.id)
                const photo = {
                                imageUrl: resp.secure_url,
                                galleryId: gallery.id,
                                userId: activeUser.id
                            };       
                            
                addPhoto(photo).then(addedPhoto => {
                console.log("added photo to database", addedPhoto);
                })
    
            }
        });
    });
    
  }

  function handleCancel() {
    setImage(null);
  }

  function handleSave() {
    console.log(image);
    alert(image);
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

    // return () => {
    //   // dropbox.current.removeEventListener("dragenter", dragEnter);
    //   // dropbox.current.removeEventListener("dragover", dragOver);
    //   // dropbox.current.removeEventListener("drop", drop);
    // };
  }, []);

  return (
    <div ref={dropbox}>
      {image ? (
        <>
          <img
            className="rounded-lg"
            src={image.replace("upload/", "upload/w_600/")}
            style={{ height: 400, width: 600 }}
          />
          <div className="flex justify-between items-center mt-2">
            <button
              className="text-gray-700 hover:text-gray-500 border-2 border-gray-300 px-4 py-2 rounded w-1/2"
              onClick={handleCancel}
              type="button"
            >
              Cancel
            </button>
            <button
              className="bg-blue-600 hover:bg-blue-800 border-2 border-blue-600 text-white px-4 py-2 rounded ml-2 w-1/2"
              onClick={handleSave}
              type="button"
            >
              Save
            </button>
          </div>
        </>
      ) : (
        <div
          className="bg-gray-200 border-4 border-dashed border-gray-400 rounded-lg"
          style={{ height: 400, width: 600 }}
        >
          <section className="flex justify-center items-center h-full">
            
              <div className="text-gray-700 text-center">
                <div>Drag and Drop assets here</div>
                <div className="my-2">or</div>
                <button
                  className="bg-blue-600 hover:bg-blue-800 text-white font-bold px-4 py-2 rounded block m-auto"
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
      )}
    </div>
  );
}