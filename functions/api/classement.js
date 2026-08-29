export async function onRequest(context) {
    const { request } = context;
    const url = new URL(request.url);
    
    // Le Worker comprend ce qu'on lui demande (calendrier, classement, ou un match précis)
    const action = url.searchParams.get('action') || 'fixtures';
    const matchId = url.searchParams.get('id');
    
    const cache = caches.default;
    const cacheKey = new Request(request.url, request);
    let response = await cache.match(cacheKey);

    if (!response) {
        // Ta nouvelle clé API-Football (API-Sports)
        const apiKey = '4736f4d750eb0ade21db88f57eca9978';
        let apiUrl = '';

        // 61 = Ligue 1 | L'API utilise l'année de début pour la saison (ex: 2026 pour 2026/2027)
        if (action === 'standings') {
            apiUrl = 'https://v3.football.api-sports.io/standings?league=61&season=2026';
        } else if (action === 'match' && matchId) {
            apiUrl = `https://v3.football.api-sports.io/fixtures?id=${matchId}`;
        } else {
            // Par défaut : tous les matchs de la saison
            apiUrl = 'https://v3.football.api-sports.io/fixtures?league=61&season=2026';
        }

        try {
            const apiResponse = await fetch(apiUrl, {
                headers: {
                    'x-apisports-key': apiKey
                }
            });
            
            const data = await apiResponse.json();

            // Bouclier Cache de 5 minutes (300 secondes) pour économiser les 100 requêtes gratuites
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
