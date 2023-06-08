export function formatTimestamp(timestamp) {

    timestamp = timestamp?.toString();
    if (!timestamp) { return "-- de -- de -- ás --:--"; }

    const monthsLabel = [
        "Janeiro", "Fevereiro", "Março", "Abril",
        "Maio", "Junho", "Julho", "Agosto",
        "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    const UTCDate = new Date(timestamp);
    const localDate = new Date(UTCDate.getTime() - UTCDate.getTimezoneOffset() * 60 * 1000);

    const year = localDate.getFullYear();
    const month = localDate.getMonth();
    const day = localDate.getDate();

    const hour = localDate.getHours();
    const minute = localDate.getMinutes();

    const dateFormatted = `${day} de ${monthsLabel[month]} de ${year} ás ${hour}:${minute}`;
    return dateFormatted;

};

export function formatTimestampRelative(timestamp) {

    timestamp = timestamp?.toString();
    if (!timestamp) { return "--"; }
    
    const timestampMs = new Date(timestamp).getTime();
    const timeMs = Date.now() - timestampMs;
    
    const date = new Date(timeMs);

    const days = Math.floor(date / (1000 * 60 * 60 * 24));

    if (days > 0) {
        return `${days} dia${days > 1 ? "s" : ""}`;
    };

    const hours = Math.floor(date / (1000 * 60 * 60));

    if (hours > 0) {
        return `${hours} hora${hours > 1 ? "s" : ""}`;
    };

    const minutes = Math.floor(date / (1000 * 60));

    if (minutes > 0) {
        return `${minutes} minuto${minutes > 1 ? "s" : ""}`;
    };

    const seconds = Math.floor(date / (1000));

    if (seconds > 0) {
        return `${seconds} segundo${seconds > 1 ? "s" : ""}`;
    };

};