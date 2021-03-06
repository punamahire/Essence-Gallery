import { settings } from "../Settings"

const remoteURL = "http://localhost:8088"

export const addPhoto = newPhoto => {
    return fetch(`${remoteURL}/photos`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newPhoto)
    }).then(response => response.json())
}

export const getAllPhotos = () => {
    return fetch(`${remoteURL}/photos`)
        .then(res => res.json())
}

export const getPhotosByGalleryId = (galleryId, limit = 0) => {

    // on each GalleryCard, display only 3 images from that gallery.
    // Else, when getPhotosByGalleryId() is called with NO limit 
    // parameter, fetch all the photos from that gallery.  
    if (limit !== 0) {
        return fetch(`${remoteURL}/photos?galleryId=${galleryId}${'&_limit=' + limit}`)
            .then(res => res.json())
    } else {
        return fetch(`${remoteURL}/photos?galleryId=${galleryId}`)
            .then(res => res.json())
    }
}

export const getPhotoById = (photoId) => {
    return fetch(`${remoteURL}/photos/${photoId}`)
    .then(res => res.json())
}

export const deletePhoto = id => {
    return fetch(`${remoteURL}/photos/${id}`, {
        method: "DELETE"
    }).then(result => result.json())
}

export const getPhotosWithKeywords = (galleryId, keywords) => {
    return fetch(`${remoteURL}/photos?galleryId=${galleryId}&q=${keywords}`)
        .then(res => res.json())
}

export const getRandomPhoto = () => {
    return fetch(`${remoteURL}/photos`)
        .then(result => result.json())
        .then(photos => {
            const randomIndex = Math.floor(Math.random() * photos.length);
            const randomPhoto = photos[randomIndex];
            return randomPhoto;
        });
}

export const updatePhoto = (editedPhoto) => {
    return fetch(`${remoteURL}/photos/${editedPhoto.id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(editedPhoto)
    }).then(data => data.json());
}
