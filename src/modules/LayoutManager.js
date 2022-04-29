import { settings } from "../Settings"

const remoteURL = "http://localhost:8088"

export const getAllLayouts = () => {
    
    return fetch(`${remoteURL}/layouts`)
    .then(res => res.json())
}

export const addLayout = newLayout => {
    return fetch(`${remoteURL}/layouts`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newLayout)
    }).then(response => response.json())
}