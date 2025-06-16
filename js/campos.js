// Utilitários para localStorage
function salvarCampos(campos) {
  localStorage.setItem('campos', JSON.stringify(campos));
}

function carregarCampos() {
  return JSON.parse(localStorage.getItem('campos')) || [];
}

function gerarId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

// Atualiza a tabela com os campos
function atualizarTabelaCampos() {
  const campos = carregarCampos();
  const tbody = document.querySelector('#tabelaCampos tbody');
  const usuarioLogado = sessionStorage.getItem('usuarioLogado');
  tbody.innerHTML = '';

  campos.forEach(campo => {
    const tr = document.createElement('tr');
    
    let acoesHtml = '';
    if (usuarioLogado === 'admin' || campo.createdBy === usuarioLogado) {
        acoesHtml = `
            <button onclick="editarCampo('${campo.id}')">Editar</button>
            <button onclick="excluirCampo('${campo.id}')">Excluir</button>
        `;
    }

    tr.innerHTML = `
      <td>${campo.nome}</td>
      <td>${campo.tipo}</td>
      <td>${campo.contato}</td>
      <td>${acoesHtml}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Editar campo
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

// Excluir campo
function excluirCampo(id) {
  let campos = carregarCampos();
  campos = campos.filter(c => c.id !== id);
  salvarCampos(campos);
  atualizarTabelaCampos();
}

// Salvar campo novo ou atualizado
document.getElementById('formCampo').addEventListener('submit', function(e) {
  e.preventDefault();

  const id = this.getAttribute('data-id') || gerarId();
  const usuarioLogado = sessionStorage.getItem('usuarioLogado');

  const campo = {
    id,
    nome: document.getElementById('nome').value,
    endereco: document.getElementById('endereco').value,
    contato: document.getElementById('contato').value,
    cnpj: document.getElementById('cnpj').value,
    tipo: document.getElementById('tipo').value,
    createdBy: this.getAttribute('data-id') ? carregarCampos().find(c => c.id === id).createdBy : usuarioLogado
  };

  let campos = carregarCampos();
  const existenteIndex = campos.findIndex(c => c.id === id);

  if (existenteIndex >= 0) {
    campos[existenteIndex] = campo;
  } else {
    campos.push(campo);
  }

  salvarCampos(campos);
  atualizarTabelaCampos();
  this.reset();
  this.removeAttribute('data-id');
});

// Inicializa
atualizarTabelaCampos();