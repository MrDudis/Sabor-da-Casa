export async function register(card) {

    try {

        const response = await fetch("/api/cards/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ card })
        });
    
        let data = await response.json();
        return data;

    } catch (error) {
        return {
            status: 400,
            message: "Falha ao buscar informações.",
            code: "FETCH_ERROR"
        };
    };

};

export async function get(id) {

    try {

        const response = await fetch(`/api/cards/${id}`, {
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

export async function getAll() {

    try {

        const response = await fetch("/api/cards/all", {
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

export async function update(cardId, newUserId) {

    try {

        const response = await fetch(`/api/cards/${cardId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ userId: newUserId })
        });
    
        let data = await response.json();
        return data;

    } catch (error) {
        return {
            status: 400,
            message: "Falha ao buscar informações.",
            code: "FETCH_ERROR"
        };
    };

};

export async function deleteCard(id) {

    try {

        const response = await fetch(`/api/cards/${id}`, {
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