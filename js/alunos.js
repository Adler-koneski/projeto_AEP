// Funções utilitárias para localStorage
function salvarAlunos(alunos) {
  localStorage.setItem('alunos', JSON.stringify(alunos));
}

function carregarAlunos() {
  return JSON.parse(localStorage.getItem('alunos')) || [];
}

function gerarId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

// Função para atualizar a tabela
function atualizarTabela() {
  const alunos = carregarAlunos();
  const tbody = document.querySelector('#tabelaAlunos tbody');
  tbody.innerHTML = '';

  alunos.forEach(aluno => {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${aluno.nome}</td>
      <td>${aluno.curso}</td>
      <td>${aluno.matricula}</td>
      <td>${aluno.contato}</td>
      <td>
        <button onclick="editarAluno('${aluno.id}')">Editar</button>
        <button onclick="excluirAluno('${aluno.id}')">Excluir</button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

// Função para editar aluno
function editarAluno(id) {
  const alunos = carregarAlunos();
  const aluno = alunos.find(a => a.id === id);

  if (!aluno) return;

  document.getElementById('nome').value = aluno.nome;
  document.getElementById('cpf').value = aluno.cpf;
  document.getElementById('rg').value = aluno.rg;
  document.getElementById('nascimento').value = aluno.nascimento;
  document.getElementById('endereco').value = aluno.endereco;
  document.getElementById('contato').value = aluno.contato;
  document.getElementById('curso').value = aluno.curso;
  document.getElementById('matricula').value = aluno.matricula;
  document.getElementById('periodo').value = aluno.periodo;
  document.getElementById('instituicao').value = aluno.instituicao;
  document.getElementById('alergias').value = aluno.alergias;
  document.getElementById('condicoes').value = aluno.condicoes;

  document.getElementById('formAluno').setAttribute('data-id', id);
}

// Função para excluir aluno
function excluirAluno(id) {
  let alunos = carregarAlunos();
  alunos = alunos.filter(a => a.id !== id);
  salvarAlunos(alunos);
  atualizarTabela();
}

// Função para salvar aluno (novo ou editado)
document.getElementById('formAluno').addEventListener('submit', function(e) {
  e.preventDefault();

  const id = this.getAttribute('data-id') || gerarId();

  const aluno = {
    id,
    nome: document.getElementById('nome').value,
    cpf: document.getElementById('cpf').value,
    rg: document.getElementById('rg').value,
    nascimento: document.getElementById('nascimento').value,
    endereco: document.getElementById('endereco').value,
    contato: document.getElementById('contato').value,
    curso: document.getElementById('curso').value,
    matricula: document.getElementById('matricula').value,
    periodo: document.getElementById('periodo').value,
    instituicao: document.getElementById('instituicao').value,
    alergias: document.getElementById('alergias').value,
    condicoes: document.getElementById('condicoes').value
  };

  let alunos = carregarAlunos();
  const existente = alunos.findIndex(a => a.id === id);

  if (existente >= 0) {
    alunos[existente] = aluno;
  } else {
    alunos.push(aluno);
  }

  salvarAlunos(alunos);
  atualizarTabela();
  this.reset();
  this.removeAttribute('data-id');
});

// Inicialização da tabela
atualizarTabela();
