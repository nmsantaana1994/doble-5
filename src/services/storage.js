import {storage} from "./firebase.js";
import {getDownloadURL, ref, uploadString} from "firebase/storage";

/**
 * 
 * @param {string} path 
 * @param {string} file 
 * @param {string} format 
 * @returns {Promise<UploadResult>}
 */
export async function uploadFileUsingString(path, file, format = "data_url") {
    return uploadString(
        ref(storage, path),
        file,
        format,
    );
}

/**
 * 
 * @param {string|null} path 
 * @returns {Promise<string>}
 */
export async function getFileURL(path) {
    if (path == null) return null;
    return getDownloadURL(ref(storage, path));
}