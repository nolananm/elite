export async function onRequest(context) {
    const { request } = context;
    const url = new URL(request.url);
    
    const action = url.searchParams.get('action') || 'fixtures';
    const matchId = url.searchParams.get('id');
    
    const cache = caches.default;
    const cacheKey = new Request(request.url, request);
    let response = await cache.match(cacheKey);

    if (!response) {
        const apiKey = '4736f4d750eb0ade21db88f57eca9978';
        let apiUrl = '';

        // On cible une saison riche en données (2023 ou 2024) pour tester toutes tes statistiques Premium
        const saison = '2023'; 

        if (action === 'standings') {
            apiUrl = `https://v3.football.api-sports.io/standings?league=61&season=${saison}`;
        } else if (action === 'match' && matchId) {
            apiUrl = `https://v3.football.api-sports.io/fixtures?id=${matchId}`;
        } else {
            apiUrl = `https://v3.football.api-sports.io/fixtures?league=61&season=${saison}`;
        }

        try {
            const apiResponse = await fetch(apiUrl, {
                headers: {
                    'x-apisports-key': apiKey
                }
            });
            
            const data = await apiResponse.json();

            // SÉCURITÉ : Si l'API renvoie une erreur ou une liste vide, on ne met PAS en cache.
            // Cela permet de rafraîchir et tester instantanément sans attendre 5 minutes.
            if ((data.errors && Object.keys(data.errors).length > 0) || (data.response && data.response.length === 0)) {
                return new Response(JSON.stringify(data), {
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    }
                });
            }

            // Si tout va bien, on met en cache pendant 5 minutes
            response = new Response(JSON.stringify(data), {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Cache-Control': 's-maxage=300, max-age=300'
                }
            });
            
            context.waitUntil(cache.put(cacheKey, response.clone()));

        } catch (error) {
            return new Response(JSON.stringify({ error: error.message }), { 
                status: 500,
                headers: { 'Access-Control-Allow-Origin': '*' }
            });
        }
    }

    return response;
}
