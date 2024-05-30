/**
 * Recorta un string a la cantidad de caracteres especificada.
 * @param {string} str - El string a recortar.
 * @param {number} maxLength - La cantidad máxima de caracteres permitida.
 * @returns {string} - El string recortado.
 */
export function recortarString(str, maxLength) {
    if (str.length <= maxLength) {
        return str;
    } else {
        return str.slice(0, maxLength);
    }
}