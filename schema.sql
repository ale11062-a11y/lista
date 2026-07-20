CREATE TABLE IF NOT EXISTS dados (
  id TEXT PRIMARY KEY,
  usuario_id TEXT,
  conteudo TEXT,
  criado_em TEXT DEFAULT (datetime('now')),
  atualizado_em TEXT DEFAULT (datetime('now'))
);
