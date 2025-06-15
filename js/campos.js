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
  tbody.innerHTML = '';

  campos.forEach(campo => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${campo.nome}</td>
      <td>${campo.tipo}</td>
      <td>${campo.contato}</td>
      <td>
        <button onclick="editarCampo('${campo.id}')">Editar</button>
        <button onclick="excluirCampo('${campo.id}')">Excluir</button>
      </td>
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
  const campo = {
    id,
    nome: document.getElementById('nome').value,
    endereco: document.getElementById('endereco').value,
    contato: document.getElementById('contato').value,
    cnpj: document.getElementById('cnpj').value,
    tipo: document.getElementById('tipo').value
  };

  let campos = carregarCampos();
  const existente = campos.findIndex(c => c.id === id);

  if (existente >= 0) {
    campos[existente] = campo;
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
