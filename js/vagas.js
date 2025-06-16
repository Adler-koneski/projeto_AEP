// Utilitários para localStorage
function salvarVagas(vagas) {
  localStorage.setItem('vagas', JSON.stringify(vagas));
}

function carregarVagas() {
  return JSON.parse(localStorage.getItem('vagas')) || [];
}

function carregarCampos() {
  return JSON.parse(localStorage.getItem('campos')) || [];
}

function gerarId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

// Preenche o select com campos de estágio
function preencherCampos() {
  const campos = carregarCampos();
  const select = document.getElementById('campo');
  select.innerHTML = '<option value="">Selecione o Campo de Estágio</option>';
  campos.forEach(campo => {
    const option = document.createElement('option');
    option.value = campo.nome;
    option.textContent = campo.nome;
    select.appendChild(option);
  });
}

// Atualiza a tabela de vagas
function atualizarTabelaVagas() {
  const vagas = carregarVagas();
  const tbody = document.querySelector('#tabelaVagas tbody');
  const usuarioLogado = sessionStorage.getItem('usuarioLogado');
  tbody.innerHTML = '';

  vagas.forEach(vaga => {
    const tr = document.createElement('tr');
    
    let acoesHtml = '';
    if(usuarioLogado === 'admin' || vaga.createdBy === usuarioLogado) {
        acoesHtml = `
            <button onclick="editarVaga('${vaga.id}')">Editar</button>
            <button onclick="excluirVaga('${vaga.id}')">Excluir</button>
        `;
    }

    tr.innerHTML = `
      <td>${vaga.area}</td>
      <td>${vaga.campo}</td>
      <td>${vaga.quantidade}</td>
      <td>${vaga.cargaHoraria}</td>
      <td>${acoesHtml}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Editar vaga
function editarVaga(id) {
  const vagas = carregarVagas();
  const vaga = vagas.find(v => v.id === id);
  if (!vaga) return;

  document.getElementById('area').value = vaga.area;
  document.getElementById('campo').value = vaga.campo;
  document.getElementById('quantidade').value = vaga.quantidade;
  document.getElementById('cargaHoraria').value = vaga.cargaHoraria;
  document.getElementById('periodo').value = vaga.periodo;
  document.getElementById('requisitos').value = vaga.requisitos;
  document.getElementById('formVaga').setAttribute('data-id', id);
}

// Excluir vaga
function excluirVaga(id) {
  let vagas = carregarVagas();
  vagas = vagas.filter(v => v.id !== id);
  salvarVagas(vagas);
  atualizarTabelaVagas();
}

// Salvar vaga nova ou editada
document.getElementById('formVaga').addEventListener('submit', function(e) {
  e.preventDefault();

  const id = this.getAttribute('data-id') || gerarId();
  const usuarioLogado = sessionStorage.getItem('usuarioLogado');

  const vaga = {
    id,
    area: document.getElementById('area').value,
    campo: document.getElementById('campo').value,
    quantidade: document.getElementById('quantidade').value,
    cargaHoraria: document.getElementById('cargaHoraria').value,
    periodo: document.getElementById('periodo').value,
    requisitos: document.getElementById('requisitos').value,
    createdBy: this.getAttribute('data-id') ? carregarVagas().find(v => v.id === id).createdBy : usuarioLogado
  };

  let vagas = carregarVagas();
  const existenteIndex = vagas.findIndex(v => v.id === id);

  if (existenteIndex >= 0) {
    vagas[existenteIndex] = vaga;
  } else {
    vagas.push(vaga);
  }

  salvarVagas(vagas);
  atualizarTabelaVagas();
  this.reset();
  this.removeAttribute('data-id');
});

// Inicialização
preencherCampos();
atualizarTabelaVagas();