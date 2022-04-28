import { settings } from "../Settings"

const remoteURL = "http://localhost:8088"

export const addGallery = newGallery => {
    return fetch(`${remoteURL}/galleries`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newGallery)
    }).then(response => response.json())
}

export const getAllGalleries = () => {
    return fetch(`${remoteURL}/galleries`)
    .then(res => res.json())
}

export const deleteGallery = id => {
    return fetch(`${remoteURL}/galleries/${id}`, {
      method: "DELETE"
    }).then(result => result.json())
}

export const updateGallery  = (editedGallery) => {
	return fetch(`${remoteURL}/galleries/${editedGallery.id}`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(editedGallery)
	}).then(data => data.json());
}

export const getGalleryById = (galleryId) => {
    return fetch(`${remoteURL}/galleries/${galleryId}`)
    .then(res => res.json())
}