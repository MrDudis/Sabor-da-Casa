export default function parseDate(date) {
    date = date?.toString();
    
    if (!date) { return "--"; }
    if (!date.includes("-")) { return date; }

    const dateArray = date.split("-");

    const year = dateArray[0];
    const month = dateArray[1];
    const day = dateArray[2];

    const dateFormatted = `${day}/${month}/${year}`;
    return dateFormatted;
    
};