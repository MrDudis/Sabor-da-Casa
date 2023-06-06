export async function get(id) {

    try {

        const response = await fetch(`/api/devices/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();
        return data

    } catch (error) {
        return {
            status: 400,
            message: "Falha ao enviar requisição.",
            code: "FETCH_ERROR"
        };
    };

};

export async function getAll() {

    try {

        const response = await fetch("/api/devices/all", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();
        return data

    } catch (error) {
        return {
            status: 400,
            message: "Falha ao buscar informações.",
            code: "FETCH_ERROR"
        };
    };

};

export async function update(id, userId) {

    try {

        const response = await fetch(`/api/devices/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ userId })
        });

        const data = await response.json();
        return data

    } catch (error) {
        return {
            status: 400,
            message: "Falha ao enviar requisição.",
            code: "FETCH_ERROR"
        };
    };

};

export async function disconnect(id) {

    try {

        const response = await fetch(`/api/devices/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();
        return data

    } catch (error) {
        return {
            status: 400,
            message: "Falha ao enviar requisição.",
            code: "FETCH_ERROR"
        };
    };

};