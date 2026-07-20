export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // GET /api/dados?usuario_id=xxx — puxar dados do D1
    if (url.pathname === '/api/dados' && request.method === 'GET') {
      const usuarioId = url.searchParams.get('usuario_id');
      const result = await env.DB.prepare(
        'SELECT * FROM dados WHERE usuario_id = ? ORDER BY atualizado_em DESC'
      ).bind(usuarioId).all();
      return Response.json(result.results, { headers: corsHeaders });
    }

    // POST /api/dados — salvar backup no D1
    if (url.pathname === '/api/dados' && request.method === 'POST') {
      const { id, usuario_id, conteudo } = await request.json();
      await env.DB.prepare(
        `INSERT INTO dados (id, usuario_id, conteudo)
         VALUES (?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET conteudo = ?, atualizado_em = datetime('now')`
      ).bind(id, usuario_id, conteudo, conteudo).run();
      return Response.json({ ok: true }, { headers: corsHeaders });
    }

    // Servir ficheiros estáticos (frontend)
    return env.ASSETS.fetch(request);
  }
}
