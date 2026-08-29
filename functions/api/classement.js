export async function onRequest(context) {
    const { request } = context;
    const url = new URL(request.url);
    
    const action = url.searchParams.get('action') || 'fixtures';
    const matchId = url.searchParams.get('id');
    
    const apiKey = '4736f4d750eb0ade21db88f57eca9978';
    const saison = '2023'; // Saison riche en données pour les tests
    let apiUrl = '';

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

        return new Response(JSON.stringify(data), {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store, no-cache, must-revalidate'
            }
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
