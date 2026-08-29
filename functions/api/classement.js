export async function onRequest(context) {
    const { request } = context;
    const cacheUrl = new URL(request.url);
    const cacheKey = new Request(cacheUrl.toString(), request);
    const cache = caches.default;

    // 1. On vérifie si on a déjà une réponse en mémoire (Cache)
    let response = await cache.match(cacheKey);

    if (!response) {
        // 2. Si le cache est vide ou expiré, on interroge la vraie API (ça consomme 1 requête)
        const apiToken = '3c123cf5b05642dc97a5df41179ed1ef';
        const url = 'https://api.football-data.org/v4/competitions/FL1/standings';

        try {
            const apiResponse = await fetch(url, {
                headers: {
                    'X-Auth-Token': apiToken
                }
            });
            
            const data = await apiResponse.json();

            // 3. On crée la réponse et on dit à Cloudflare de la garder 15 min (900 secondes)
            response = new Response(JSON.stringify(data), {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Cache-Control': 's-maxage=900, max-age=900' // Le Bouclier Anti-Dépassement
                }
            });
            
            // 4. On sauvegarde dans le cache pour les prochains visiteurs
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
