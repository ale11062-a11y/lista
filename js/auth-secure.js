// Sistema de Autenticação Segura com Isolamento de Dados

// Credenciais padrão (será substituído por banco de dados depois)
const USUARIOS_PADRAO = [
    { 
        id: '1', 
        nome: 'Admin', 
        email: 'admin@test.com', 
        senha: '123456',
        papel: 'admin',
        ativo: true,
        senhaAlterada: true
    },
    { 
        id: '2', 
        nome: 'Operador', 
        email: 'operador@test.com', 
        senha: 'senha123',
        papel: 'user',
        ativo: true,
        senhaAlterada: true
    }
];

// Inicializar usuários no primeiro acesso
function inicializarUsuarios() {
    if (!localStorage.getItem('usuarios_sistema')) {
        localStorage.setItem('usuarios_sistema', JSON.stringify(USUARIOS_PADRAO));
    }
}

inicializarUsuarios();

// Obter todos os usuários do localStorage
function obterTodosUsuarios() {
    const usuarios = localStorage.getItem('usuarios_sistema');
    return usuarios ? JSON.parse(usuarios) : USUARIOS_PADRAO;
}

// Obter usuário por ID
function obterUsuarioPorId(usuarioId) {
    const usuarios = obterTodosUsuarios();
    return usuarios.find(u => u.id === usuarioId);
}

// Verificar autenticação
function verificarAutenticacao() {
    const usuarioAutenticado = sessionStorage.getItem('usuarioAutenticado');
    return usuarioAutenticado !== null;
}

// Obter usuário autenticado
function obterUsuarioAutenticado() {
    const usuarioId = sessionStorage.getItem('usuarioAutenticado');
    if (!usuarioId) return null;
    return obterUsuarioPorId(usuarioId);
}

// Fazer login
function fazerLoginSeguro(email, senha) {
    console.log('Tentando login com:', email);
    const usuarios = obterTodosUsuarios();
    const usuario = usuarios.find(u => u.email === email && u.senha === senha && u.ativo);
    
    if (usuario) {
        sessionStorage.setItem('usuarioAutenticado', usuario.id);
        sessionStorage.setItem('usuarioEmail', usuario.email);
        sessionStorage.setItem('usuarioPapel', usuario.papel);
        console.log('✅ Login bem-sucedido:', usuario.nome);
        return { sucesso: true, usuario };
    }
    console.log('❌ Login falhou - usuário não encontrado');
    return { sucesso: false, erro: 'Email ou senha inválidos!' };
}

// Fazer logout
function fazerLogout() {
    sessionStorage.removeItem('usuarioAutenticado');
    sessionStorage.removeItem('usuarioEmail');
    sessionStorage.removeItem('senhaAlterada');
    sessionStorage.removeItem('usuarioPapel');
    window.location.href = 'index.html';
}

// Alterar senha do usuário
function alterarSenhaUsuario(senhaAtual, novaSenha) {
    const usuario = obterUsuarioAutenticado();
    if (!usuario) {
        return { sucesso: false, erro: 'Usuário não autenticado' };
    }

    if (usuario.senha !== senhaAtual) {
        return { sucesso: false, erro: 'Senha atual incorreta!' };
    }

    const usuarios = obterTodosUsuarios();
    const index = usuarios.findIndex(u => u.id === usuario.id);
    
    if (index !== -1) {
        usuarios[index].senha = novaSenha;
        usuarios[index].senhaAlterada = true;
        usuarios[index].dataUltimaAlteracao = new Date().toLocaleString('pt-BR');
        localStorage.setItem('usuarios_sistema', JSON.stringify(usuarios));
        sessionStorage.setItem('senhaAlterada', 'true');
        
        // Atualizar dados da sessão
        sessionStorage.setItem('usuarioAutenticado', usuario.id);
        
        return { sucesso: true, mensagem: 'Senha alterada com sucesso!' };
    }
    return { sucesso: false, erro: 'Erro ao alterar senha' };
}

// Atualizar dados do usuário no admin
function atualizarUsuario(usuarioId, dadosAtualizacao) {
    const usuarios = obterTodosUsuarios();
    const index = usuarios.findIndex(u => u.id === usuarioId);
    
    if (index !== -1) {
        usuarios[index] = { ...usuarios[index], ...dadosAtualizacao };
        localStorage.setItem('usuarios_sistema', JSON.stringify(usuarios));
        return { sucesso: true, usuario: usuarios[index] };
    }
    return { sucesso: false, erro: 'Usuário não encontrado' };
}

// Criar novo usuário
function criarUsuario(email, nome, papel = 'user') {
    const usuarios = obterTodosUsuarios();
    const idNovo = String(Math.max(...usuarios.map(u => parseInt(u.id) || 0)) + 1);
    const senhaTemporaria = 'temp' + Math.random().toString(36).substr(2, 9);
    
    const novoUsuario = {
        id: idNovo,
        nome,
        email,
        senha: senhaTemporaria,
        papel,
        ativo: true,
        senhaAlterada: false,
        dataCriacao: new Date().toLocaleString('pt-BR')
    };
    
    usuarios.push(novoUsuario);
    localStorage.setItem('usuarios_sistema', JSON.stringify(usuarios));
    
    return { sucesso: true, usuario: novoUsuario, senhaTemporaria };
}

// Deletar usuário
function deletarUsuario(usuarioId) {
    const usuarios = obterTodosUsuarios();
    const filtered = usuarios.filter(u => u.id !== usuarioId);
    localStorage.setItem('usuarios_sistema', JSON.stringify(filtered));
    return { sucesso: true };
}

// Listar todos os usuários
function listarUsuarios() {
    return obterTodosUsuarios();
}

// Evento de submit do formulário de login
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;
        const mensagemErro = document.getElementById('mensagemErro');
        
        console.log('Formulário enviado com email:', email);
        
        const resultado = fazerLoginSeguro(email, senha);
        
        if (resultado.sucesso) {
            if (!resultado.usuario.senhaAlterada) {
                sessionStorage.setItem('primeiroLogin', 'true');
            }
            // Pequeno delay para feedback visual
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 500);
        } else {
            mensagemErro.textContent = resultado.erro;
            mensagemErro.classList.add('visible');
            document.getElementById('senha').value = '';
            console.error('Erro de login:', resultado.erro);
        }
    });
}

// Verificar autenticação no dashboard
if (document.getElementById('btnSair')) {
    if (!verificarAutenticacao()) {
        window.location.href = 'index.html';
    } else {
        const usuario = obterUsuarioAutenticado();
        if (usuario) {
            document.getElementById('usuarioNome').textContent = '👤 ' + usuario.nome;
            document.getElementById('btnSair').addEventListener('click', fazerLogout);
            
            // Mostrar botão admin se for admin
            if (usuario.papel === 'admin' && document.getElementById('btnAdmin')) {
                document.getElementById('btnAdmin').style.display = 'block';
                document.getElementById('btnAdmin').onclick = () => window.location.href = 'admin.html';
            }
        }
    }
}

// Verificar autenticação no admin
if (document.getElementById('abaUsuarios')) {
    if (!verificarAutenticacao()) {
        window.location.href = 'index.html';
    } else {
        const usuario = obterUsuarioAutenticado();
        if (!usuario || usuario.papel !== 'admin') {
            window.location.href = 'dashboard.html';
        }
    }
}
