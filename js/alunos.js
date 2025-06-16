// --- VARIÁVEIS GLOBAIS ---
let alunoAtualId = null;

// --- FUNÇÕES DE DADOS ---
function salvarAlunos(alunos) {
  localStorage.setItem('alunos', JSON.stringify(alunos));
}
function carregarAlunos() {
  return JSON.parse(localStorage.getItem('alunos')) || [];
}
function carregarUsuarios() {
    return JSON.parse(localStorage.getItem('usuarios')) || [];
}
function salvarUsuarios(usuarios) {
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
}
function gerarId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

// --- LÓGICA DE ENDEREÇO (CEP) ---
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

// --- LÓGICA DA TABELA PRINCIPAL ---
function atualizarTabela() {
  const alunos = carregarAlunos();
  const tbody = document.querySelector('#tabelaAlunos tbody');
  const usuarioLogado = sessionStorage.getItem('usuarioLogado');
  tbody.innerHTML = '';

  alunos.forEach(aluno => {
    const tr = document.createElement('tr');
    
    let acoesHtml = `<button onclick="gerenciarDocumentos('${aluno.id}')">Docs</button>`;
    if (usuarioLogado === 'admin' || aluno.createdBy === usuarioLogado) {
        acoesHtml += `
            <button onclick="editarAluno('${aluno.id}')">Editar</button>
            <button onclick="excluirAluno('${aluno.id}')">Excluir</button>
        `;
    }

    tr.innerHTML = `
      <td>${aluno.nome}</td>
      <td>${aluno.curso || '-'}</td>
      <td>${aluno.matricula || '-'}</td>
      <td>${aluno.contato}</td>
      <td><div class="actions-container">${acoesHtml}</div></td>
    `;
    tbody.appendChild(tr);
  });
}

// --- LÓGICA DE CRUD DE ALUNOS ---
function editarAluno(id) {
  const alunos = carregarAlunos();
  const aluno = alunos.find(a => a.id === id);
  if (!aluno) return;

  // Esconde os campos de acesso ao editar e mostra o e-mail (somente leitura)
  document.getElementById('fieldset-acesso').style.display = 'block';
  document.getElementById('email-container').style.display = 'block';
  document.getElementById('password-container').style.display = 'none';
  document.getElementById('email').readOnly = true;

  // Preenche todos os campos
  document.getElementById('nome').value = aluno.nome || '';
  document.getElementById('email').value = aluno.email || '';
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

function excluirAluno(id) {
  if (confirm('Tem certeza que deseja excluir este aluno e todos os seus dados?')) {
    const alunos = carregarAlunos();
    const alunoExcluir = alunos.find(a => a.id === id);
    
    // Remove também o usuário de login, se existir
    if (alunoExcluir && alunoExcluir.email) {
        let usuarios = carregarUsuarios();
        usuarios = usuarios.filter(u => u.username !== alunoExcluir.email);
        salvarUsuarios(usuarios);
    }
    
    // Remove o aluno
    const novosAlunos = alunos.filter(a => a.id !== id);
    salvarAlunos(novosAlunos);
    atualizarTabela();
  }
}

function prepararFormularioNovoAluno() {
    document.getElementById('formAluno').reset();
    document.getElementById('formAluno').removeAttribute('data-id');
    document.getElementById('fieldset-acesso').style.display = 'block';
    document.getElementById('email-container').style.display = 'block';
    document.getElementById('password-container').style.display = 'block';
    document.getElementById('email').readOnly = false;
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
}

// --- LÓGICA DO MODAL DE DOCUMENTOS --- (Omitido por brevidade, sem alterações)
// ...

// --- EVENT LISTENERS ---
document.addEventListener('DOMContentLoaded', function() {
    // Listener para o campo de CEP
    document.getElementById('cep').addEventListener('blur', (event) => {
        buscarEndereco(event.target.value);
    });

    // Listener para o formulário principal de alunos
    document.getElementById('formAluno').addEventListener('submit', function(e) {
        e.preventDefault();
        const id = this.getAttribute('data-id');
        const usuarioLogado = sessionStorage.getItem('usuarioLogado');
        let alunos = carregarAlunos();
        
        if (id) {
            // Editando aluno existente
            const alunoIndex = alunos.findIndex(a => a.id === id);
            if (alunoIndex > -1) {
                const alunoParaSalvar = alunos[alunoIndex];
                // Atualiza todos os campos exceto o de acesso
                alunoParaSalvar.nome = document.getElementById('nome').value;
                alunoParaSalvar.cpf = document.getElementById('cpf').value;
                alunoParaSalvar.rg = document.getElementById('rg').value;
                alunoParaSalvar.nascimento = document.getElementById('nascimento').value;
                alunoParaSalvar.cep = document.getElementById('cep').value;
                alunoParaSalvar.endereco = document.getElementById('endereco').value;
                alunoParaSalvar.bairro = document.getElementById('bairro').value;
                alunoParaSalvar.cidade = document.getElementById('cidade').value;
                alunoParaSalvar.uf = document.getElementById('uf').value;
                alunoParaSalvar.contato = document.getElementById('contato').value;
                alunoParaSalvar.curso = document.getElementById('curso').value;
                alunoParaSalvar.matricula = document.getElementById('matricula').value;
                alunoParaSalvar.periodo = document.getElementById('periodo').value;
                alunoParaSalvar.instituicao = document.getElementById('instituicao').value;
                alunoParaSalvar.alergias = document.getElementById('alergias').value;
                alunoParaSalvar.condicoes = document.getElementById('condicoes').value;
                
                salvarAlunos(alunos);
                alert('Aluno atualizado com sucesso!');
            }
        } else {
            // Criando um novo aluno
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            let usuarios = carregarUsuarios();

            if (usuarios.some(u => u.username === email)) {
                alert('Erro: Este e-mail já está sendo utilizado por outro usuário.');
                return;
            }

            // Cria o novo usuário de login
            const novoUsuario = { username: email, password, profile: 'aluno' };
            usuarios.push(novoUsuario);
            salvarUsuarios(usuarios);

            // Cria o novo registro de aluno
            const novoAluno = {
                id: gerarId(),
                nome: document.getElementById('nome').value,
                email: email, // CORREÇÃO: Garante que o email seja salvo no perfil
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
                createdBy: usuarioLogado,
                documentos: []
            };
            alunos.push(novoAluno);
            salvarAlunos(alunos);
            alert('Aluno e conta de acesso criados com sucesso!');
        }

        prepararFormularioNovoAluno();
        atualizarTabela();
    });

    // ... (Listeners do Modal de Documentos, omitidos por brevidade)

    // --- INICIALIZAÇÃO ---
    prepararFormularioNovoAluno();
    atualizarTabela();
}); 