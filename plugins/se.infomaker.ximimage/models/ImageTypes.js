import {api} from 'writer'

const defaultExtensions = ['.jpg', '.jpeg', '.png', '.gif']

/**
 * @return {string[]} a list of accepted file extensions
 */
export function getExtensions() {
    return api.getConfigValue('se.infomaker.ximimage', 'imageFileExtension', defaultExtensions)
}

/**
 * Check if the file matches the allowed extensions
 * @param {string} filename
 * @return {bool}
 */
export function containsExtension(filename) {
    return getExtensions().some((extension) => {
        return filename.indexOf(extension) > 0
    })
}

/**
 * Returns a list of allowed MIME types
 * @return {string[]}
 */
export function getMIMETypes() {
    const mimes = []
    getExtensions().forEach(ext => {
        const mime = `image/${ext.toLowerCase().replace('.', '')}`
        if (!mimes.includes(mime)) {
            mimes.push(mime)
        }
    })
    return mimes
}

/**
 * Checks if the provided MIME type is allowed
 * @param {string} MIMEType the MIME type to compare
 */
export function containsMIMEType(MIMEType) {
    return getMIMETypes().indexOf(MIMEType) > 0
}