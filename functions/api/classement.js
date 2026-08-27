export async function onRequest(context) {
    const apiToken = '3c123cf5b05642dc97a5df41179ed1ef';
    const url = 'https://api.football-data.org/v4/competitions/FL1/standings';

    try {
        // C'est Cloudflare qui fait la requête, donc aucun blocage CORS !
        const response = await fetch(url, {
            headers: {
                'X-Auth-Token': apiToken
            }
        });
        
        const data = await response.json();

        // On renvoie les données à ton site web
        return new Response(JSON.stringify(data), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
