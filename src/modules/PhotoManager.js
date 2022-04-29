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

export const getPhotosByGalleryId = (galleryId, limit=0) => {

    if (limit !== 0) {
        return fetch(`${remoteURL}/photos?galleryId=${galleryId}${'&_limit='+limit}`)
            .then(res => res.json())    
    } else {
        return fetch(`${remoteURL}/photos?galleryId=${galleryId}`)
            .then(res => res.json())
    }
}

export const deletePhoto = id => {
    return fetch(`${remoteURL}/photos/${id}`, {
      method: "DELETE"
    }).then(result => result.json())
}