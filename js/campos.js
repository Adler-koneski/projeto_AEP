// --- VARIÁVEIS GLOBAIS ---
let campoAtualId = null;

// --- FUNÇÕES DE DADOS ---
function salvarCampos(campos) {
  localStorage.setItem('campos', JSON.stringify(campos));
}

function carregarCampos() {
  return JSON.parse(localStorage.getItem('campos')) || [];
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
    
    let acoesHtml = `<button onclick="gerenciarSupervisores('${campo.id}')">Supervisores</button>`;
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

// --- LÓGICA DE CRUD DE CAMPOS ---
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

// --- LÓGICA DO MODAL DE SUPERVISORES ---
function atualizarListaSupervisores() {
    if(!campoAtualId) return;

    const campos = carregarCampos();
    const campo = campos.find(c => c.id === campoAtualId);
    const listaUl = document.getElementById('lista-supervisores');
    listaUl.innerHTML = '';

    if (campo && campo.supervisores && campo.supervisores.length > 0) {
        campo.supervisores.forEach(sup => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="supervisor-info">
                    <strong>${sup.nome}</strong>
                    <span>Especialidade: ${sup.especialidade} | Contato: ${sup.contato}</span>
                </div>
                <button onclick="excluirSupervisor('${sup.id}')">Excluir</button>
            `;
            listaUl.appendChild(li);
        });
    } else {
        listaUl.innerHTML = '<li>Nenhum supervisor cadastrado.</li>';
    }
}

window.gerenciarSupervisores = function(id) {
    campoAtualId = id;
    const campo = carregarCampos().find(c => c.id === id);

    document.getElementById('modal-campo-nome').textContent = campo.nome;
    atualizarListaSupervisores();

    document.getElementById('modal-supervisores').style.display = 'block';
}

window.excluirSupervisor = function(supervisorId) {
    if (!confirm('Tem certeza que deseja excluir este supervisor?')) return;

    const campos = carregarCampos();
    const campoIndex = campos.findIndex(c => c.id === campoAtualId);

    if (campoIndex > -1) {
        campos[campoIndex].supervisores = campos[campoIndex].supervisores.filter(s => s.id !== supervisorId);
        salvarCampos(campos);
        atualizarListaSupervisores();
    }
}


// --- EVENT LISTENERS ---
document.addEventListener('DOMContentLoaded', function() {
    // Listener para o formulário principal de campos
    document.getElementById('formCampo').addEventListener('submit', function(e) {
        e.preventDefault();

        const id = this.getAttribute('data-id');
        const usuarioLogado = sessionStorage.getItem('usuarioLogado');
        let campos = carregarCampos();
        
        if (id) {
            // Editando um campo existente
            const campoIndex = campos.findIndex(c => c.id === id);
            if (campoIndex > -1) {
                campos[campoIndex].nome = document.getElementById('nome').value;
                campos[campoIndex].endereco = document.getElementById('endereco').value;
                campos[campoIndex].contato = document.getElementById('contato').value;
                campos[campoIndex].cnpj = document.getElementById('cnpj').value;
                campos[campoIndex].tipo = document.getElementById('tipo').value;
            }
        } else {
            // Criando um novo campo
            const novoCampo = {
                id: gerarId(),
                nome: document.getElementById('nome').value,
                endereco: document.getElementById('endereco').value,
                contato: document.getElementById('contato').value,
                cnpj: document.getElementById('cnpj').value,
                tipo: document.getElementById('tipo').value,
                createdBy: usuarioLogado,
                supervisores: [] // Lista de supervisores começa vazia
            };
            campos.push(novoCampo);
        }

        salvarCampos(campos);
        atualizarTabelaCampos();
        this.reset();
        this.removeAttribute('data-id');
    });

    // Listeners do Modal de Supervisores
    const modal = document.getElementById('modal-supervisores');
    const closeBtn = modal.querySelector('.modal-close');
    const formSupervisor = document.getElementById('form-novo-supervisor');

    closeBtn.onclick = () => modal.style.display = 'none';
    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };
    
    formSupervisor.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nome = document.getElementById('novo-supervisor-nome').value;
        const contato = document.getElementById('novo-supervisor-contato').value;
        const especialidade = document.getElementById('novo-supervisor-especialidade').value;

        if(!nome || !contato || !especialidade) {
            alert('Por favor, preencha todos os campos do supervisor.');
            return;
        }

        const novoSupervisor = { id: gerarId(), nome, contato, especialidade };
        
        let campos = carregarCampos();
        const campoIndex = campos.findIndex(c => c.id === campoAtualId);

        if (campoIndex > -1) {
            if (!campos[campoIndex].supervisores) {
                campos[campoIndex].supervisores = [];
            }
            campos[campoIndex].supervisores.push(novoSupervisor);
            salvarCampos(campos);
            atualizarListaSupervisores();
            formSupervisor.reset();
        }
    });

    // Inicializa
    atualizarTabelaCampos();
});