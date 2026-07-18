// Configuração da API
const API_BASE_URL = 'https://app-orcamentos-backend.onrender.com/api';

// Obter token do localStorage
function obterToken() {
    return localStorage.getItem('authToken');
}

// Salvar token no localStorage
function salvarToken(token) {
    localStorage.setItem('authToken', token);
}

// Headers com autenticação
function obterHeaders() {
    const token = obterToken();
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

// ===== AUTENTICAÇÃO =====

async function fazerLoginAPI(usuario, senha) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario, senha })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.erro || 'Erro ao fazer login');
        }

        salvarToken(data.token);
        return { sucesso: true, usuario: data.usuario };
    } catch (erro) {
        console.error('Erro no login:', erro);
        return { sucesso: false, erro: erro.message };
    }
}

function fazerLogoutAPI() {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('usuarioAutenticado');
    window.location.href = 'index.html';
}

// ===== CLIENTES =====

async function listarClientes() {
    try {
        const response = await fetch(`${API_BASE_URL}/clientes`, {
            method: 'GET',
            headers: obterHeaders()
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.erro || 'Erro ao listar clientes');
        }

        return { sucesso: true, dados: data.dados };
    } catch (erro) {
        console.error('Erro ao listar clientes:', erro);
        return { sucesso: false, erro: erro.message };
    }
}

async function criarCliente(nome, email, telefone, endereco, cidade) {
    try {
        const response = await fetch(`${API_BASE_URL}/clientes`, {
            method: 'POST',
            headers: obterHeaders(),
            body: JSON.stringify({ nome, email, telefone, endereco, cidade })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.erro || 'Erro ao criar cliente');
        }

        return { sucesso: true, dados: data.dados };
    } catch (erro) {
        console.error('Erro ao criar cliente:', erro);
        return { sucesso: false, erro: erro.message };
    }
}

async function atualizarCliente(clienteId, nome, email, telefone, endereco, cidade) {
    try {
        const response = await fetch(`${API_BASE_URL}/clientes/${clienteId}`, {
            method: 'PUT',
            headers: obterHeaders(),
            body: JSON.stringify({ nome, email, telefone, endereco, cidade })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.erro || 'Erro ao atualizar cliente');
        }

        return { sucesso: true, dados: data.dados };
    } catch (erro) {
        console.error('Erro ao atualizar cliente:', erro);
        return { sucesso: false, erro: erro.message };
    }
}

async function deletarCliente(clienteId) {
    try {
        const response = await fetch(`${API_BASE_URL}/clientes/${clienteId}`, {
            method: 'DELETE',
            headers: obterHeaders()
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.erro || 'Erro ao deletar cliente');
        }

        return { sucesso: true };
    } catch (erro) {
        console.error('Erro ao deletar cliente:', erro);
        return { sucesso: false, erro: erro.message };
    }
}

// ===== ORÇAMENTOS =====

async function listarOrcamentos() {
    try {
        const response = await fetch(`${API_BASE_URL}/orcamentos`, {
            method: 'GET',
            headers: obterHeaders()
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.erro || 'Erro ao listar orçamentos');
        }

        return { sucesso: true, dados: data.dados };
    } catch (erro) {
        console.error('Erro ao listar orçamentos:', erro);
        return { sucesso: false, erro: erro.message };
    }
}

async function obterOrcamento(orcamentoId) {
    try {
        const response = await fetch(`${API_BASE_URL}/orcamentos/${orcamentoId}`, {
            method: 'GET',
            headers: obterHeaders()
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.erro || 'Erro ao obter orçamento');
        }

        return { sucesso: true, dados: data.dados };
    } catch (erro) {
        console.error('Erro ao obter orçamento:', erro);
        return { sucesso: false, erro: erro.message };
    }
}

async function criarOrcamento(clienteId, dataOrcamento, itens, total, midias) {
    try {
        const response = await fetch(`${API_BASE_URL}/orcamentos`, {
            method: 'POST',
            headers: obterHeaders(),
            body: JSON.stringify({
                cliente_id: clienteId,
                data_orcamento: dataOrcamento,
                itens,
                total,
                midias
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.erro || 'Erro ao criar orçamento');
        }

        return { sucesso: true, dados: data.dados };
    } catch (erro) {
        console.error('Erro ao criar orçamento:', erro);
        return { sucesso: false, erro: erro.message };
    }
}

async function atualizarOrcamento(orcamentoId, status) {
    try {
        const response = await fetch(`${API_BASE_URL}/orcamentos/${orcamentoId}`, {
            method: 'PUT',
            headers: obterHeaders(),
            body: JSON.stringify({ status })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.erro || 'Erro ao atualizar orçamento');
        }

        return { sucesso: true, dados: data.dados };
    } catch (erro) {
        console.error('Erro ao atualizar orçamento:', erro);
        return { sucesso: false, erro: erro.message };
    }
}

async function deletarOrcamento(orcamentoId) {
    try {
        const response = await fetch(`${API_BASE_URL}/orcamentos/${orcamentoId}`, {
            method: 'DELETE',
            headers: obterHeaders()
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.erro || 'Erro ao deletar orçamento');
        }

        return { sucesso: true };
    } catch (erro) {
        console.error('Erro ao deletar orçamento:', erro);
        return { sucesso: false, erro: erro.message };
    }
}
