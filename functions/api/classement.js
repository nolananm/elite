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

        if (action === 'standings') {
            apiUrl = 'https://v3.football.api-sports.io/standings?league=61&season=2026';
        } else if (action === 'match' && matchId) {
            apiUrl = `https://v3.football.api-sports.io/fixtures?id=${matchId}`;
        } else {
            apiUrl = 'https://v3.football.api-sports.io/fixtures?league=61&season=2026';
        }

        try {
            const apiResponse = await fetch(apiUrl, {
                headers: {
                    'x-apisports-key': apiKey
                }
            });
            
            const data = await apiResponse.json();

            // 🚨 NOUVEAU : Si l'API renvoie une erreur, on NE MET PAS EN CACHE !
            // Ça permet de retester instantanément sans attendre 5 minutes
            if (data.errors && Object.keys(data.errors).length > 0) {
                return new Response(JSON.stringify(data), {
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    }
                });
            }

            // Si tout va bien, on met en cache pendant 5 minutes (300 secondes)
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
