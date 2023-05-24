export default async function update(newUser) {

    try {

        const response = await fetch("/api/auth/me", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ user: newUser })
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