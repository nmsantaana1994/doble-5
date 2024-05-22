/**
 * Transforma un objeto Date a un string de fecha con formato: dd-MM-AAAA HH:mm:ss
 * 
 * @param { Date } date
 * @return { string } 
 */
export function dateToString(date) {
    if(date == null) return "xxxx-xx-xx- xx:xx:xx";

    const formatedDate = new Intl.DateTimeFormat('es-AR', {
        day: "2-digit", month: "2-digit", year: "numeric",
    }).format(date);
    const formatedTime = new Intl.DateTimeFormat('es-AR', {
        hour: "2-digit", minute: "2-digit", second: "2-digit"
    }).format(date);

    return `${formatedDate} ${formatedTime}`;
}