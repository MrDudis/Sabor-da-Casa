export async function register(user) {

    try {

        const response = await fetch("/api/users/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ user })
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

        const response = await fetch(`/api/users/${id}`, {
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

        const response = await fetch("/api/users/all", {
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

export async function update(id, user) {

    try {

        const response = await fetch(`/api/users/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ user })
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

export async function deleteUser(id) {

    try {

        const response = await fetch(`/api/users/${id}`, {
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