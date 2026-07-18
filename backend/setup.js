// Script para configurar usuários iniciais no Supabase
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function criarUsuariosIniciais() {
  try {
    console.log('🔐 Criando usuários iniciais...');

    // Hash das senhas
    const senhaAdmin = await bcrypt.hash('123456', 10);
    const senhaOperador = await bcrypt.hash('senha123', 10);

    // Verificar se usuários já existem
    const { data: usuariosExistentes } = await supabase
      .from('usuarios')
      .select('usuario')
      .in('usuario', ['admin', 'operador']);

    if (usuariosExistentes && usuariosExistentes.length > 0) {
      console.log('⚠️  Usuários já existem no banco de dados');
      return;
    }

    // Inserir usuários
    const { data, error } = await supabase
      .from('usuarios')
      .insert([
        { usuario: 'admin', senha: senhaAdmin, email: 'admin@cast.com' },
        { usuario: 'operador', senha: senhaOperador, email: 'operador@cast.com' }
      ])
      .select();

    if (error) throw error;

    console.log('✅ Usuários criados com sucesso!');
    console.log('\n📋 Credenciais de acesso:');
    console.log('Usuário: admin | Senha: 123456');
    console.log('Usuário: operador | Senha: senha123');
  } catch (erro) {
    console.error('❌ Erro ao criar usuários:', erro.message);
  }
}

criarUsuariosIniciais();
