// --- VARIÁVEIS GLOBAIS ---
let campoAtualId = null;

// --- FUNÇÕES DE DADOS ---
function salvarCampos(campos) {
  localStorage.setItem('campos', JSON.stringify(campos));
}

function carregarCampos() {
  return JSON.parse(localStorage.getItem('campos')) || [];
}

// FUNÇÃO ADICIONADA: Carrega usuários para encontrar os supervisores
function carregarUsuarios() {
  return JSON.parse(localStorage.getItem('usuarios')) || [];
}

function gerarId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

// --- LÓGICA DA TABELA PRINCIPAL ---
function atualizarTabelaCampos() {
  const campos = carregarCampos();
  const tbody = document.querySelector('#tabelaCampos tbody');
  const usuarioLogado = sessionStorage.getItem('usuarioLogado');
  tbody.innerHTML = '';

  campos.forEach(campo => {
    const tr = document.createElement('tr');
    
    let acoesHtml = `<button onclick="abrirModalSupervisores('${campo.id}')">Supervisores</button>`;
    if (usuarioLogado === 'admin' || campo.createdBy === usuarioLogado) {
        acoesHtml += `
            <button onclick="editarCampo('${campo.id}')">Editar</button>
            <button onclick="excluirCampo('${campo.id}')">Excluir</button>
        `;
    }

    tr.innerHTML = `
      <td>${campo.nome}</td>
      <td>${campo.tipo}</td>
      <td>${campo.contato}</td>
      <td><div class="actions-container">${acoesHtml}</div></td>
    `;
    tbody.appendChild(tr);
  });
}

// --- LÓGICA DE CRUD DE CAMPOS (sem alterações) ---
function editarCampo(id) {
  const campos = carregarCampos();
  const campo = campos.find(c => c.id === id);
  if (!campo) return;

  document.getElementById('nome').value = campo.nome;
  document.getElementById('endereco').value = campo.endereco;
  document.getElementById('contato').value = campo.contato;
  document.getElementById('cnpj').value = campo.cnpj;
  document.getElementById('tipo').value = campo.tipo;
  document.getElementById('formCampo').setAttribute('data-id', id);
}

function excluirCampo(id) {
  if (confirm('Tem certeza que deseja excluir este campo de estágio?')) {
    let campos = carregarCampos();
    campos = campos.filter(c => c.id !== id);
    salvarCampos(campos);
    atualizarTabelaCampos();
  }
}


// --- LÓGICA DO MODAL DE SUPERVISORES (TOTALMENTE REFEITA) ---

// ATUALIZADO: Popula a lista de supervisores já associados
function atualizarListaSupervisores() {
    if (!campoAtualId) return;

    const campos = carregarCampos();
    const campo = campos.find(c => c.id === campoAtualId);
    const listaUl = document.getElementById('lista-supervisores');
    listaUl.innerHTML = '';

    if (campo && campo.supervisores && campo.supervisores.length > 0) {
        // O array 'campo.supervisores' agora guarda os usernames (e-mails) dos supervisores
        campo.supervisores.forEach(supervisorUsername => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="supervisor-info">
                    <strong>${supervisorUsername}</strong>
                </div>
                <button onclick="desassociarSupervisor('${supervisorUsername}')">Excluir</button>
            `;
            listaUl.appendChild(li);
        });
    } else {
        listaUl.innerHTML = '<li>Nenhum supervisor associado.</li>';
    }
}

// ATUALIZADO: Popula o dropdown com supervisores disponíveis
function popularSelectSupervisores() {
    const todosUsuarios = carregarUsuarios();
    const campos = carregarCampos();
    const campoAtual = campos.find(c => c.id === campoAtualId);
    const supervisoresAssociados = campoAtual.supervisores || [];

    const supervisoresDisponiveis = todosUsuarios.filter(user => {
        // Pega somente usuários com perfil 'supervisor' E que não estão na lista de associados
        return user.profile === 'supervisor' && !supervisoresAssociados.includes(user.username);
    });

    const select = document.getElementById('select-supervisor');
    select.innerHTML = '<option value="">Selecione um supervisor disponível</option>';

    supervisoresDisponiveis.forEach(user => {
        const option = document.createElement('option');
        option.value = user.username;
        option.textContent = user.username; // Exibe o username (e-mail)
        select.appendChild(option);
    });
}

// ATUALIZADO: Abre o modal e popula os dados
window.abrirModalSupervisores = function(id) {
    campoAtualId = id;
    const campo = carregarCampos().find(c => c.id === id);

    document.getElementById('modal-campo-nome').textContent = campo.nome;
    
    atualizarListaSupervisores();
    popularSelectSupervisores();

    document.getElementById('modal-supervisores').style.display = 'block';
}

// ATUALIZADO: Remove a associação do supervisor com o campo
window.desassociarSupervisor = function(supervisorUsername) {
    if (!confirm(`Tem certeza que deseja desassociar o supervisor "${supervisorUsername}"?`)) return;

    const campos = carregarCampos();
    const campoIndex = campos.findIndex(c => c.id === campoAtualId);

    if (campoIndex > -1) {
        campos[campoIndex].supervisores = campos[campoIndex].supervisores.filter(
            username => username !== supervisorUsername
        );
        salvarCampos(campos);
        
        // Atualiza a UI do modal
        atualizarListaSupervisores();
        popularSelectSupervisores();
    }
}


// --- EVENT LISTENERS ---
document.addEventListener('DOMContentLoaded', function() {
    // Listener para o formulário principal de campos (sem alterações)
    document.getElementById('formCampo').addEventListener('submit', function(e) {
        e.preventDefault();
        const id = this.getAttribute('data-id');
        const usuarioLogado = sessionStorage.getItem('usuarioLogado');
        let campos = carregarCampos();
        
        if (id) {
            const campoIndex = campos.findIndex(c => c.id === id);
            if (campoIndex > -1) {
                campos[campoIndex].nome = document.getElementById('nome').value;
                campos[campoIndex].endereco = document.getElementById('endereco').value;
                campos[campoIndex].contato = document.getElementById('contato').value;
                campos[campoIndex].cnpj = document.getElementById('cnpj').value;
                campos[campoIndex].tipo = document.getElementById('tipo').value;
            }
        } else {
            const novoCampo = {
                id: gerarId(),
                nome: document.getElementById('nome').value,
                endereco: document.getElementById('endereco').value,
                contato: document.getElementById('contato').value,
                cnpj: document.getElementById('cnpj').value,
                tipo: document.getElementById('tipo').value,
                createdBy: usuarioLogado,
                supervisores: [] // A lista de supervisores é um array de usernames
            };
            campos.push(novoCampo);
        }
        salvarCampos(campos);
        atualizarTabelaCampos();
        this.reset();
        this.removeAttribute('data-id');
    });

    // Listeners do Modal de Supervisores (ATUALIZADOS)
    const modal = document.getElementById('modal-supervisores');
    const closeBtn = modal.querySelector('.modal-close');
    // Aponta para o novo ID do formulário
    const formSupervisor = document.getElementById('form-associar-supervisor');

    closeBtn.onclick = () => modal.style.display = 'none';
    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };
    
    // Lógica para o novo formulário de associação
    formSupervisor.addEventListener('submit', function(e) {
        e.preventDefault();
        const supervisorUsername = document.getElementById('select-supervisor').value;
        
        if (!supervisorUsername) {
            alert('Por favor, selecione um supervisor da lista.');
            return;
        }
        
        let campos = carregarCampos();
        const campoIndex = campos.findIndex(c => c.id === campoAtualId);

        if (campoIndex > -1) {
            if (!campos[campoIndex].supervisores) {
                campos[campoIndex].supervisores = [];
            }
            // Adiciona o username do supervisor ao array
            campos[campoIndex].supervisores.push(supervisorUsername);
            salvarCampos(campos);

            // Atualiza a UI do modal
            atualizarListaSupervisores();
            popularSelectSupervisores();
            formSupervisor.reset();
        }
    });

    // Inicializa a tabela principal
    atualizarTabelaCampos();
});