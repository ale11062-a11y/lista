const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5500',
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Inicializar Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Middleware de autenticação
const verificarToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ erro: 'Token não fornecido' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuarioId = decoded.usuarioId;
    next();
  } catch (erro) {
    res.status(401).json({ erro: 'Token inválido' });
  }
};

// ===== AUTENTICAÇÃO =====

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { usuario, senha } = req.body;

    if (!usuario || !senha) {
      return res.status(400).json({ erro: 'Usuário e senha são obrigatórios' });
    }

    // Buscar usuário no banco
    const { data: usuarios, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('usuario', usuario);

    if (error || !usuarios || usuarios.length === 0) {
      return res.status(401).json({ erro: 'Usuário ou senha inválidos' });
    }

    const usuarioDb = usuarios[0];

    // Verificar senha
    const senhaValida = await bcrypt.compare(senha, usuarioDb.senha);

    if (!senhaValida) {
      return res.status(401).json({ erro: 'Usuário ou senha inválidos' });
    }

    // Gerar token
    const token = jwt.sign(
      { usuarioId: usuarioDb.id, usuario: usuarioDb.usuario },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      sucesso: true,
      token,
      usuario: usuarioDb.usuario
    });
  } catch (erro) {
    console.error('Erro no login:', erro);
    res.status(500).json({ erro: 'Erro ao fazer login' });
  }
});

// ===== CLIENTES =====

// Listar clientes do usuário
app.get('/api/clientes', verificarToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('usuario_id', req.usuarioId)
      .order('criado_em', { ascending: false });

    if (error) throw error;

    res.json({ sucesso: true, dados: data });
  } catch (erro) {
    console.error('Erro ao listar clientes:', erro);
    res.status(500).json({ erro: 'Erro ao listar clientes' });
  }
});

// Criar cliente
app.post('/api/clientes', verificarToken, async (req, res) => {
  try {
    const { nome, email, telefone, endereco, cidade } = req.body;

    if (!nome || !email || !telefone) {
      return res.status(400).json({ erro: 'Nome, email e telefone são obrigatórios' });
    }

    const { data, error } = await supabase
      .from('clientes')
      .insert([
        {
          usuario_id: req.usuarioId,
          nome,
          email,
          telefone,
          endereco,
          cidade
        }
      ])
      .select();

    if (error) throw error;

    res.status(201).json({ sucesso: true, dados: data[0] });
  } catch (erro) {
    console.error('Erro ao criar cliente:', erro);
    res.status(500).json({ erro: 'Erro ao criar cliente' });
  }
});

// Atualizar cliente
app.put('/api/clientes/:id', verificarToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, telefone, endereco, cidade } = req.body;

    const { data, error } = await supabase
      .from('clientes')
      .update({
        nome,
        email,
        telefone,
        endereco,
        cidade
      })
      .eq('id', id)
      .eq('usuario_id', req.usuarioId)
      .select();

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).json({ erro: 'Cliente não encontrado' });
    }

    res.json({ sucesso: true, dados: data[0] });
  } catch (erro) {
    console.error('Erro ao atualizar cliente:', erro);
    res.status(500).json({ erro: 'Erro ao atualizar cliente' });
  }
});

// Deletar cliente
app.delete('/api/clientes/:id', verificarToken, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('clientes')
      .delete()
      .eq('id', id)
      .eq('usuario_id', req.usuarioId);

    if (error) throw error;

    res.json({ sucesso: true, mensagem: 'Cliente deletado com sucesso' });
  } catch (erro) {
    console.error('Erro ao deletar cliente:', erro);
    res.status(500).json({ erro: 'Erro ao deletar cliente' });
  }
});

// ===== ORÇAMENTOS =====

// Listar orçamentos do usuário
app.get('/api/orcamentos', verificarToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orcamentos')
      .select('*, cliente:cliente_id(id,nome,email,telefone,endereco,cidade), itens:orcamento_itens(id,quantidade,descricao,valor,subtotal)')
      .eq('usuario_id', req.usuarioId)
      .order('criado_em', { ascending: false });

    if (error) throw error;

    res.json({ sucesso: true, dados: data });
  } catch (erro) {
    console.error('Erro ao listar orçamentos:', erro);
    res.status(500).json({ erro: 'Erro ao listar orçamentos' });
  }
});

// Obter orçamento específico
app.get('/api/orcamentos/:id', verificarToken, async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('orcamentos')
      .select('*, cliente:cliente_id(id,nome,email,telefone,endereco,cidade), itens:orcamento_itens(id,quantidade,descricao,valor,subtotal)')
      .eq('id', id)
      .eq('usuario_id', req.usuarioId)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ erro: 'Orçamento não encontrado' });
    }

    res.json({ sucesso: true, dados: data });
  } catch (erro) {
    console.error('Erro ao obter orçamento:', erro);
    res.status(500).json({ erro: 'Erro ao obter orçamento' });
  }
});

// Criar orçamento
app.post('/api/orcamentos', verificarToken, async (req, res) => {
  try {
    const { cliente_id, data_orcamento, itens, total, midias } = req.body;

    if (!cliente_id || !itens || itens.length === 0) {
      return res.status(400).json({ erro: 'Cliente e itens são obrigatórios' });
    }

    // Criar orçamento
    const { data: orcamento, error: erroOrcamento } = await supabase
      .from('orcamentos')
      .insert([
        {
          usuario_id: req.usuarioId,
          cliente_id,
          data_orcamento,
          total,
          status: 'pendente'
        }
      ])
      .select()
      .single();

    if (erroOrcamento) throw erroOrcamento;

    // Inserir itens
    const itensComOrcamento = itens.map(item => ({
      orcamento_id: orcamento.id,
      quantidade: item.quantidade,
      descricao: item.descricao,
      valor: item.valor,
      subtotal: item.subtotal
    }));

    const { error: erroItens } = await supabase
      .from('orcamento_itens')
      .insert(itensComOrcamento);

    if (erroItens) throw erroItens;

    // Salvar mídias se houver
    if (midias && midias.length > 0) {
      const midiasComOrcamento = midias.map(midia => ({
        orcamento_id: orcamento.id,
        tipo: midia.tipo,
        nome: midia.nome,
        url: midia.dados // Base64 ou URL
      }));

      await supabase
        .from('orcamento_midias')
        .insert(midiasComOrcamento);
    }

    res.status(201).json({
      sucesso: true,
      mensagem: 'Orçamento criado com sucesso',
      dados: orcamento
    });
  } catch (erro) {
    console.error('Erro ao criar orçamento:', erro);
    res.status(500).json({ erro: 'Erro ao criar orçamento' });
  }
});

// Atualizar orçamento
app.put('/api/orcamentos/:id', verificarToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const { data, error } = await supabase
      .from('orcamentos')
      .update({ status })
      .eq('id', id)
      .eq('usuario_id', req.usuarioId)
      .select()
      .single();

    if (error) throw error;

    res.json({ sucesso: true, dados: data });
  } catch (erro) {
    console.error('Erro ao atualizar orçamento:', erro);
    res.status(500).json({ erro: 'Erro ao atualizar orçamento' });
  }
});

// Deletar orçamento
app.delete('/api/orcamentos/:id', verificarToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Deletar itens
    await supabase
      .from('orcamento_itens')
      .delete()
      .eq('orcamento_id', id);

    // Deletar mídias
    await supabase
      .from('orcamento_midias')
      .delete()
      .eq('orcamento_id', id);

    // Deletar orçamento
    const { error } = await supabase
      .from('orcamentos')
      .delete()
      .eq('id', id)
      .eq('usuario_id', req.usuarioId);

    if (error) throw error;

    res.json({ sucesso: true, mensagem: 'Orçamento deletado com sucesso' });
  } catch (erro) {
    console.error('Erro ao deletar orçamento:', erro);
    res.status(500).json({ erro: 'Erro ao deletar orçamento' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', mensagem: 'Backend rodando' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
