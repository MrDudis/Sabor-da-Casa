export function validateInputDateChange(value) {

    let newValue = value.replace(/[^0-9\/\.,-]/g, "");
    
    newValue = newValue.replace(/-|\.|,/g, "/");

    newValue = newValue.replace(/^(\d{1})(?:\/)$/, "0$1/");
    newValue = newValue.replace(/^(\d{2})(?:\/)(\d{1})(?:\/)$/, "$1/0$2/");

    newValue = newValue.replace(/[^0-9]/g, "");

    newValue = newValue.slice(0, 8);

    const match = newValue.match(/^(\d{0,2})(?:\/)?(\d{0,2})?(?:\/)?(\d{0,4})?$/);

    if (match) {

        if (match[1] > 31) { match[1] = "31"; };
        if (match[2] > 12) { match[2] = "12"; };
        if (match[3] > 2023) { match[3] = "2023"; };

        const monthsWith30Days = [4, 6, 9, 11];

        if (match[2] && match[2].length === 2) {
            if (monthsWith30Days.includes(parseInt(match[2])) && match[1] > 30) { match[1] = "30"; }
        };

        if (match[3] && match[3].length === 4) {
            if (match[3] < 1900) { match[3] = "1900"; };

            if ((match[3] % 4) == 0) { 
                if (match[2] == 2 && match[1] > 29) { match[1] = "29"; };
            } else {
                if (match[2] == 2 && match[1] > 28) { match[1] = "28"; };
            }
        };

        newValue = `${match[1]}${match[2] ? `/${match[2]}` : ''}${match[3] ? `/${match[3]}` : ''}`;
    };

    newValue = newValue.slice(0, 10);

    return newValue;

};

export function parseInputDate(value) {

    let newValue = value.replace(/\//g, "-");

    newValue = newValue.split("-");
    newValue = newValue.reverse();
    newValue = newValue.join("-");

    return newValue;

};