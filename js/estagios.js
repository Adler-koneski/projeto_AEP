// Utilitários para localStorage
function salvarEstagios(estagios) {
  localStorage.setItem('estagios', JSON.stringify(estagios));
}

function carregarEstagios() {
  return JSON.parse(localStorage.getItem('estagios')) || [];
}

function carregarAlunos() {
  return JSON.parse(localStorage.getItem('alunos')) || [];
}

function carregarVagas() {
  return JSON.parse(localStorage.getItem('vagas')) || [];
}

function gerarId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

// Preencher selects
function preencherSelects() {
  const alunos = carregarAlunos();
  const vagas = carregarVagas();
  const selAluno = document.getElementById('aluno');
  const selVaga = document.getElementById('vaga');

  selAluno.innerHTML = '<option value="">Selecione o Aluno</option>';
  alunos.forEach(aluno => {
    const opt = document.createElement('option');
    opt.value = aluno.id;
    opt.textContent = aluno.nome;
    selAluno.appendChild(opt);
  });

  selVaga.innerHTML = '<option value="">Selecione a Vaga</option>';
  vagas.forEach(vaga => {
    const opt = document.createElement('option');
    opt.value = vaga.id;
    opt.textContent = `${vaga.area} - ${vaga.campo}`;
    selVaga.appendChild(opt);
  });
}

// Atualiza a tabela
function atualizarTabelaEstagios() {
  const estagios = carregarEstagios();
  const alunos = carregarAlunos();
  const vagas = carregarVagas();
  const tbody = document.querySelector('#tabelaEstagios tbody');
  const usuarioLogado = sessionStorage.getItem('usuarioLogado');
  tbody.innerHTML = '';

  estagios.forEach(estagio => {
    const aluno = alunos.find(a => a.id === estagio.alunoId);
    const vaga = vagas.find(v => v.id === estagio.vagaId);
    const tr = document.createElement('tr');
    
    let acoesHtml = '';
    if(usuarioLogado === 'admin' || estagio.createdBy === usuarioLogado) {
        acoesHtml = `
            <button onclick="editarEstagio('${estagio.id}')">Editar</button>
            <button onclick="excluirEstagio('${estagio.id}')">Excluir</button>
        `;
    }

    tr.innerHTML = `
      <td>${aluno ? aluno.nome : 'N/D'}</td>
      <td>${vaga ? vaga.area : 'N/D'}</td>
      <td>${estagio.status}</td>
      <td>${estagio.inicio || '-'}</td>
      <td>${estagio.termino || '-'}</td>
      <td>${acoesHtml}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Editar estágio
function editarEstagio(id) {
  const estagios = carregarEstagios();
  const estagio = estagios.find(e => e.id === id);
  if (!estagio) return;

  document.getElementById('aluno').value = estagio.alunoId;
  document.getElementById('vaga').value = estagio.vagaId;
  document.getElementById('status').value = estagio.status;
  document.getElementById('inicio').value = estagio.inicio;
  document.getElementById('termino').value = estagio.termino;
  document.getElementById('avaliacao').value = estagio.avaliacao;
  document.getElementById('ocorrencias').value = estagio.ocorrencias;
  document.getElementById('formEstagio').setAttribute('data-id', id);
}

// Excluir estágio
function excluirEstagio(id) {
  let estagios = carregarEstagios();
  estagios = estagios.filter(e => e.id !== id);
  salvarEstagios(estagios);
  atualizarTabelaEstagios();
}

// Salvar estágio
document.getElementById('formEstagio').addEventListener('submit', function(e) {
  e.preventDefault();

  const id = this.getAttribute('data-id') || gerarId();
  const usuarioLogado = sessionStorage.getItem('usuarioLogado');

  const estagio = {
    id,
    alunoId: document.getElementById('aluno').value,
    vagaId: document.getElementById('vaga').value,
    status: document.getElementById('status').value,
    inicio: document.getElementById('inicio').value,
    termino: document.getElementById('termino').value,
    avaliacao: document.getElementById('avaliacao').value,
    ocorrencias: document.getElementById('ocorrencias').value,
    createdBy: this.getAttribute('data-id') ? carregarEstagios().find(e => e.id === id).createdBy : usuarioLogado
  };

  let estagios = carregarEstagios();
  const existenteIndex = estagios.findIndex(e => e.id === id);

  if (existenteIndex >= 0) {
    estagios[existenteIndex] = estagio;
  } else {
    estagios.push(estagio);
  }

  salvarEstagios(estagios);
  atualizarTabelaEstagios();
  this.reset();
  this.removeAttribute('data-id');
});

// Inicialização
preencherSelects();
atualizarTabelaEstagios();