// Sistema de Autenticação

// Credenciais pré-configuradas
const USUARIOS_VALIDOS = [
    { usuario: 'admin', senha: '123456' },
    { usuario: 'operador', senha: 'senha123' }
];

// Função para fazer login
function fazerLogin(usuario, senha) {
    const usuarioValido = USUARIOS_VALIDOS.find(u => u.usuario === usuario && u.senha === senha);
    
    if (usuarioValido) {
        // Salvar dados do usuário na sessão
        sessionStorage.setItem('usuarioAutenticado', usuario);
        sessionStorage.setItem('timestampLogin', new Date().getTime());
        return true;
    }
    return false;
}

// Função para verificar se o usuário está autenticado
function verificarAutenticacao() {
    const usuarioAutenticado = sessionStorage.getItem('usuarioAutenticado');
    return usuarioAutenticado !== null;
}

// Função para obter o usuário autenticado
function obterUsuarioAutenticado() {
    return sessionStorage.getItem('usuarioAutenticado');
}

// Função para fazer logout
function fazerLogout() {
    sessionStorage.removeItem('usuarioAutenticado');
    sessionStorage.removeItem('timestampLogin');
    window.location.href = 'index.html';
}

// Evento de submit do formulário de login
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const usuario = document.getElementById('usuario').value;
        const senha = document.getElementById('senha').value;
        const mensagemErro = document.getElementById('mensagemErro');
        
        if (fazerLogin(usuario, senha)) {
            window.location.href = 'dashboard.html';
        } else {
            mensagemErro.textContent = 'Usuário ou senha inválidos!';
            mensagemErro.classList.add('visible');
            document.getElementById('senha').value = '';
        }
    });
}

// Verificar autenticação no dashboard
if (document.getElementById('btnSair')) {
    if (!verificarAutenticacao()) {
        window.location.href = 'index.html';
    } else {
        document.getElementById('usuarioNome').textContent = 'Usuário: ' + obterUsuarioAutenticado();
        document.getElementById('btnSair').addEventListener('click', fazerLogout);
    }
}