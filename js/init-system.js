// Inicializar Sistema com Usuário Admin Padrão

// Criar admin padrão na primeira vez
function inicializarSistema() {
    const usuarios = localStorage.getItem('usuarios_sistema');
    
    if (!usuarios) {
        // Primeira vez - criar admin padrão
        const adminPadrao = {
            id: 'admin_' + Date.now(),
            nome: 'Desenvolvedor',
            email: 'dev@castservicos.com',
            senha: 'Dev@2024!Seguro',
            papel: 'admin',
            ativo: true,
            senhaAlterada: true,
            dataCriacao: new Date().toLocaleString('pt-BR'),
            dataUltimaAlteracao: null
        };
        
        localStorage.setItem('usuarios_sistema', JSON.stringify([adminPadrao]));
        console.log('✅ Sistema inicializado!');
        console.log('📧 Email: dev@castservicos.com');
        console.log('🔐 Senha: Dev@2024!Seguro');
        console.log('📍 Acesse: /admin.html');
    }
}

// Executar ao carregar a página
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarSistema);
} else {
    inicializarSistema();
}
