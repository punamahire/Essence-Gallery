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