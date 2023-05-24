export default async function getAll() {

    try {

        const response = await fetch("/api/products/all", {
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