export default async function me() {

    try {

        const response = await fetch("/api/auth/me", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
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