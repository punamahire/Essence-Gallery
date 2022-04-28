import { settings } from "../Settings"

const remoteURL = "http://localhost:8088"

export const getAllLayouts = () => {
    return fetch(`${remoteURL}/layouts`)
    .then(res => res.json())
}