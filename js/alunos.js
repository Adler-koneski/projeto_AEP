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

// Função para buscar endereço via CEP
async function buscarEndereco(cep) {
  const cepLimpo = cep.replace(/\D/g, '');
  if (cepLimpo.length !== 8) return;
  const url = `https://viacep.com.br/ws/${cepLimpo}/json/`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.erro) {
      alert('CEP não encontrado.');
    } else {
      document.getElementById('endereco').value = data.logradouro;
      document.getElementById('bairro').value = data.bairro;
      document.getElementById('cidade').value = data.localidade;
      document.getElementById('uf').value = data.uf;
    }
  } catch (error) {
    alert('Não foi possível buscar o CEP.');
  }
}

// Função para atualizar a tabela
function atualizarTabela() {
  const alunos = carregarAlunos();
  const tbody = document.querySelector('#tabelaAlunos tbody');
  const usuarioLogado = sessionStorage.getItem('usuarioLogado');
  tbody.innerHTML = '';

  alunos.forEach(aluno => {
    const tr = document.createElement('tr');
    
    // Define o HTML dos botões de ação com base na permissão
    let acoesHtml = '';
    if (usuarioLogado === 'admin' || aluno.createdBy === usuarioLogado) {
        acoesHtml = `
            <button onclick="editarAluno('${aluno.id}')">Editar</button>
            <button onclick="excluirAluno('${aluno.id}')">Excluir</button>
        `;
    }

    tr.innerHTML = `
      <td>${aluno.nome}</td>
      <td>${aluno.curso}</td>
      <td>${aluno.matricula}</td>
      <td>${aluno.contato}</td>
      <td>${acoesHtml}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Função para editar aluno
function editarAluno(id) {
  const alunos = carregarAlunos();
  const aluno = alunos.find(a => a.id === id);

  if (!aluno) return;

  document.getElementById('nome').value = aluno.nome || '';
  document.getElementById('cpf').value = aluno.cpf || '';
  document.getElementById('rg').value = aluno.rg || '';
  document.getElementById('nascimento').value = aluno.nascimento || '';
  document.getElementById('cep').value = aluno.cep || '';
  document.getElementById('endereco').value = aluno.endereco || '';
  document.getElementById('bairro').value = aluno.bairro || '';
  document.getElementById('cidade').value = aluno.cidade || '';
  document.getElementById('uf').value = aluno.uf || '';
  document.getElementById('contato').value = aluno.contato || '';
  document.getElementById('curso').value = aluno.curso || '';
  document.getElementById('matricula').value = aluno.matricula || '';
  document.getElementById('periodo').value = aluno.periodo || '';
  document.getElementById('instituicao').value = aluno.instituicao || '';
  document.getElementById('alergias').value = aluno.alergias || '';
  document.getElementById('condicoes').value = aluno.condicoes || '';
  document.getElementById('formAluno').setAttribute('data-id', id);
}

// Função para excluir aluno
function excluirAluno(id) {
  let alunos = carregarAlunos();
  alunos = alunos.filter(a => a.id !== id);
  salvarAlunos(alunos);
  atualizarTabela();
}

// Adiciona o Event Listener para o campo de CEP
document.getElementById('cep').addEventListener('blur', (event) => {
    buscarEndereco(event.target.value);
});

// Função para salvar aluno (novo ou editado)
document.getElementById('formAluno').addEventListener('submit', function(e) {
  e.preventDefault();

  const id = this.getAttribute('data-id') || gerarId();
  const usuarioLogado = sessionStorage.getItem('usuarioLogado');

  const aluno = {
    id,
    nome: document.getElementById('nome').value,
    cpf: document.getElementById('cpf').value,
    rg: document.getElementById('rg').value,
    nascimento: document.getElementById('nascimento').value,
    cep: document.getElementById('cep').value,
    endereco: document.getElementById('endereco').value,
    bairro: document.getElementById('bairro').value,
    cidade: document.getElementById('cidade').value,
    uf: document.getElementById('uf').value,
    contato: document.getElementById('contato').value,
    curso: document.getElementById('curso').value,
    matricula: document.getElementById('matricula').value,
    periodo: document.getElementById('periodo').value,
    instituicao: document.getElementById('instituicao').value,
    alergias: document.getElementById('alergias').value,
    condicoes: document.getElementById('condicoes').value,
    createdBy: this.getAttribute('data-id') ? carregarAlunos().find(a => a.id === id).createdBy : usuarioLogado
  };

  let alunos = carregarAlunos();
  const existenteIndex = alunos.findIndex(a => a.id === id);

  if (existenteIndex >= 0) {
    alunos[existenteIndex] = aluno;
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