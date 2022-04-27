import { useEffect, useRef, useState } from "react";
import { addPhoto } from "../../modules/PhotoManager";
import { settings } from "../../Settings";

export function ImageUploader({ gallery, updatePhotos }) {

  console.log("gallery object", gallery)

  const dropbox = useRef(null);
  const fileSelect = useRef(null);
  const [image, setImage] = useState('');
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
    const url = `${settings.apiBaseURL}/upload`; 
    const xhr = new XMLHttpRequest();
    const fd = new FormData();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

    // Update progress (can be used to show progress indicator)
    xhr.upload.addEventListener("progress", (e) => {
      setProgress(Math.round((e.loaded * 100.0) / e.total));
      console.log(Math.round((e.loaded * 100.0) / e.total));
    });

    xhr.onreadystatechange = (e) => {
      if (xhr.readyState == 4 && xhr.status == 200) {
        const response = JSON.parse(xhr.responseText);
      
        setImage(response.secure_url);
        console.log(response.secure_url);

        const activeUser = JSON.parse(sessionStorage.getItem("gallery_user"))
        // add photo to database
        console.log("galleryId", gallery.id)
        const photo = {
                        imageUrl: response.secure_url,
                        galleryId: gallery.id,
                        userId: activeUser.id
                      };       
                    
        addPhoto(photo).then(addedPhoto => {
          console.log("added photo to database", addedPhoto);
          updatePhotos();
        })

      }
    };

    fd.append("upload_preset", settings.uploadPreset);
    fd.append("tags", "browser_upload");
    fd.append("file", file);
    fd.append("folder", "nature");
    xhr.send(fd);
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
        <div
          className="bg-gray-200 border-4 border-dashed border-gray-400 rounded-lg"
          style={{ height: 400, width: 600 }}
          >
          <section className="flex justify-center items-center h-full">
            {progress === 0 ? (
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