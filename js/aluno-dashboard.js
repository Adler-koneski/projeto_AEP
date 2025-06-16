document.addEventListener('DOMContentLoaded', function() {
    const usuarioLogadoEmail = sessionStorage.getItem('usuarioLogado'); 

    // --- FUNÇÕES DE DADOS ---
    function carregarAlunos() { return JSON.parse(localStorage.getItem('alunos')) || []; }
    function salvarAlunos(alunos) { localStorage.setItem('alunos', JSON.stringify(alunos)); }
    function carregarVagas() { return JSON.parse(localStorage.getItem('vagas')) || []; }
    
    // --- LÓGICA DAS ABAS (TABS) ---
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            tabContents.forEach(content => content.classList.remove('active'));
            document.getElementById(button.dataset.tab).classList.add('active');
        });
    });

    // --- LÓGICA DO ALUNO ---
    let alunos = carregarAlunos();
    let alunoLogado = alunos.find(a => a.email === usuarioLogadoEmail);

    if (!alunoLogado) {
        alert("Erro: não foi possível encontrar os dados do aluno. Você será desconectado.");
        sessionStorage.clear();
        window.location.href = 'login.html';
        return;
    }

    // --- ABA "MEUS DADOS" ---
    function preencherFormularioAluno() {
        document.getElementById('nome').value = alunoLogado.nome || '';
        document.getElementById('email').value = alunoLogado.email || '';
        document.getElementById('cpf').value = alunoLogado.cpf || '';
        document.getElementById('rg').value = alunoLogado.rg || '';
        document.getElementById('nascimento').value = alunoLogado.nascimento || '';
        document.getElementById('contato').value = alunoLogado.contato || '';
        document.getElementById('curso').value = alunoLogado.curso || '';
        document.getElementById('matricula').value = alunoLogado.matricula || '';
        document.getElementById('periodo').value = alunoLogado.periodo || '';
        document.getElementById('instituicao').value = alunoLogado.instituicao || '';
    }

    document.getElementById('formAluno').addEventListener('submit', function(e) {
        e.preventDefault();
        const alunoIndex = alunos.findIndex(a => a.id === alunoLogado.id);

        if (alunoIndex > -1) {
            alunos[alunoIndex] = { ...alunos[alunoIndex], 
                nome: document.getElementById('nome').value,
                cpf: document.getElementById('cpf').value,
                rg: document.getElementById('rg').value,
                nascimento: document.getElementById('nascimento').value,
                contato: document.getElementById('contato').value,
                curso: document.getElementById('curso').value,
                matricula: document.getElementById('matricula').value,
                periodo: document.getElementById('periodo').value,
                instituicao: document.getElementById('instituicao').value
            };
            salvarAlunos(alunos);
            alunoLogado = alunos[alunoIndex]; // Atualiza a variável local
            alert('Dados atualizados com sucesso!');
        }
    });

    // --- ABA "VAGAS DE ESTÁGIO" ---
    const tabelaVagasBody = document.querySelector('#tabelaVagas tbody');
    
    function atualizarTabelaVagas() {
        const vagas = carregarVagas();
        tabelaVagasBody.innerHTML = '';
        
        vagas.forEach(vaga => {
            const tr = document.createElement('tr');
            
            const jaCandidatou = alunoLogado.candidaturas && alunoLogado.candidaturas.includes(vaga.id);
            
            const botaoHtml = jaCandidatou 
                ? `<button onclick="desistirVaga('${vaga.id}')">Desistir</button>`
                : `<button onclick="candidatarVaga('${vaga.id}')">Candidatar-se</button>`;

            tr.innerHTML = `
                <td>${vaga.area}</td>
                <td>${vaga.campo}</td>
                <td>${vaga.periodo || '-'}</td>
                <td><div class="actions-container">${botaoHtml}</div></td>
            `;
            tabelaVagasBody.appendChild(tr);
        });
    }

    window.candidatarVaga = function(vagaId) {
        if (!alunoLogado.candidaturas) {
            alunoLogado.candidaturas = [];
        }
        
        alunoLogado.candidaturas.push(vagaId);
        
        const alunoIndex = alunos.findIndex(a => a.id === alunoLogado.id);
        if(alunoIndex > -1) {
            alunos[alunoIndex] = alunoLogado;
            salvarAlunos(alunos);
            alert('Candidatura realizada com sucesso!');
            atualizarTabelaVagas();
        }
    }

    window.desistirVaga = function(vagaId) {
        if(confirm('Tem certeza de que deseja desistir desta candidatura?')) {
            if (alunoLogado.candidaturas) {
                alunoLogado.candidaturas = alunoLogado.candidaturas.filter(id => id !== vagaId);
                
                const alunoIndex = alunos.findIndex(a => a.id === alunoLogado.id);
                if(alunoIndex > -1) {
                    alunos[alunoIndex] = alunoLogado;
                    salvarAlunos(alunos);
                    alert('Você desistiu da vaga.');
                    atualizarTabelaVagas();
                }
            }
        }
    }

    // --- INICIALIZAÇÃO ---
    preencherFormularioAluno();
    atualizarTabelaVagas();
});