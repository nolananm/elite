export async function onRequest(context) {
    const apiToken = '3c123cf5b05642dc97a5df41179ed1ef';
    const url = 'https://api.football-data.org/v4/competitions/FL1/standings';

    try {
        const response = await fetch(url, {
            headers: {
                'X-Auth-Token': apiToken
            }
        });
        
        const data = await response.json();

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
