
const handleDeletePhoto = id => {
    deletePhoto(id)
      .then(() => {

        const url = `${settings.apiBaseURL}/image/upload`;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", settings.uploadPreset);

        fetch(url, {
        method: 'DELETE',
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

        getPhotosFromGallery() 
      }
      );
  };

  