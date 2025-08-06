/**
 * Transforma un objeto Date a un string de fecha con formato: dd-MM-AAAA HH:mm:ss
 *
 * @param { Date } date
 * @return { string }
 */
export function dateToString(date) {
  if (date == null) return "xxxx-xx-xx xx:xx:xx";

  // Si es un Timestamp de Firebase, convertir a Date
  if (typeof date.toDate === "function") {
    date = date.toDate();
  }

  const formatedDate = new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
  const formatedTime = new Intl.DateTimeFormat("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);

  // console.log(`${formatedDate} ${formatedTime}`);

  return `${formatedDate} ${formatedTime}`;
}

export function convertirFecha(fecha) {
  // Separar la fecha en año, mes y día
  const [year, month, day] = fecha.split("-");

  // Devolver la fecha en el nuevo formato
  return `${day}-${month}-${year}`;
}

export function formatTime(date) {
  const options = { hour: "2-digit", minute: "2-digit", hour12: false };
  return new Intl.DateTimeFormat("es-AR", options).format(new Date(date));
}
