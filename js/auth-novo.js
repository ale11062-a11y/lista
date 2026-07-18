// Sistema de Autenticação - Versão com API

// Fazer login via API
async function fazerLogin(usuario, senha) {
    const result = await fazerLoginAPI(usuario, senha);
    
    if (result.sucesso) {
        sessionStorage.setItem('usuarioAutenticado', result.usuario);
        window.location.href = 'dashboard.html';
    } else {
        const mensagemErro = document.getElementById('mensagemErro');
        mensagemErro.textContent = result.erro || 'Erro ao fazer login';
        mensagemErro.classList.add('visible');
        document.getElementById('senha').value = '';
    }
}

// Verificar autenticação
function verificarAutenticacao() {
    const token = obterToken();
    return token !== null;
}

// Fazer logout
function fazerLogout() {
    fazerLogoutAPI();
}

// Evento de submit do formulário de login
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const usuario = document.getElementById('usuario').value;
        const senha = document.getElementById('senha').value;
        
        fazerLogin(usuario, senha);
    });
}

// Verificar autenticação no dashboard
if (document.getElementById('btnSair')) {
    if (!verificarAutenticacao()) {
        window.location.href = 'index.html';
    } else {
        const usuarioInfo = sessionStorage.getItem('usuarioAutenticado') || 'Usuário';
        document.getElementById('usuarioNome').textContent = 'Usuário: ' + usuarioInfo;
        document.getElementById('btnSair').addEventListener('click', fazerLogout);
    }
}
