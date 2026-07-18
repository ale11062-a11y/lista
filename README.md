# 📋 App de Orçamentos

Aplicação web para criar e gerenciar orçamentos com login, upload de mídia e cálculos automáticos.

## Funcionalidades

✅ **Autenticação**
- Login com usuário e senha
- Credenciais pré-configuradas (admin / 123456)
- Logout seguro

✅ **Dados do Cliente**
- Nome, email, telefone
- Endereço e cidade
- Data do orçamento

✅ **Itens do Orçamento**
- Quantidade, descrição, valor unitário
- Cálculo automático de subtotal
- Tabela dinâmica com opção de remover itens

✅ **Mídia**
- Upload de fotos e vídeos
- Drag and drop para adicionar arquivos
- Visualização em galeria

✅ **Totalizadores**
- Cálculo automático do total
- Visualização destacada

✅ **Persistência**
- Orçamentos salvos em localStorage
- Visualização de histórico
- Exclusão de orçamentos antigos

✅ **Exportação**
- Geração de PDF para impressão
- Dados formatados profissionalmente

## Credenciais de Teste

```
Usuário: admin
Senha: 123456

OU

Usuário: operador
Senha: senha123
```

## Como Usar

1. Abra `index.html` em seu navegador
2. Faça login com as credenciais fornecidas
3. Preencha os dados do cliente
4. Adicione itens ao orçamento
5. Inclua fotos ou vídeos se necessário
6. Salve o orçamento ou gere PDF para impressão

## Estrutura de Arquivos

```
.
├── index.html           # Página de login
├── dashboard.html       # Página principal de orçamentos
├── css/
│   └── style.css        # Estilos da aplicação
├── js/
│   ├── auth.js          # Sistema de autenticação
│   ├── orcamento.js     # Lógica de orçamentos
│   └── main.js          # Script principal e event listeners
└── README.md            # Este arquivo
```

## Tecnologias Utilizadas

- HTML5
- CSS3 (com Flexbox e Grid)
- JavaScript vanilla (sem dependências externas)
- LocalStorage para persistência

## Funcionalidades Futuras

- 🔄 Sincronização com servidor
- 📧 Envio de orçamentos por email
- 💾 Backup automático
- 🎨 Temas customizáveis
- 📊 Relatórios e gráficos
- 🔐 Autenticação com banco de dados

## Notas

- Os dados são armazenados localmente no navegador (localStorage)
- Para manter os dados, não limpe o cache do navegador
- A aplicação funciona offline após o carregamento inicial
- Máximo de arquivos recomendado: 10 por orçamento

## Suporte

Para dúvidas ou sugestões, entre em contato.

---

**Versão**: 1.0.0  
**Desenvolvido para**: Cast Serviços Técnicos