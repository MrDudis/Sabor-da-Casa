export default async function updatePassword(currentPassword, newPassword) {

    try {

        const response = await fetch("/api/auth/password", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ currentPassword, newPassword })
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