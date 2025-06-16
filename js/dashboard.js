document.addEventListener('DOMContentLoaded', function() {
    
    // --- 1. MENSAGEM DE BOAS-VINDAS ---
    const welcomeMessageEl = document.getElementById('welcome-message');
    const usuarioLogado = sessionStorage.getItem('usuarioLogado');
    if (welcomeMessageEl && usuarioLogado) {
        welcomeMessageEl.textContent = `| Bem-vindo(a), ${usuarioLogado}!`;
    }

    // --- FUNÇÃO AUXILIAR PARA CARREGAR DADOS ---
    function carregarDados(chave) {
        return JSON.parse(localStorage.getItem(chave)) || [];
    }

    // --- 2. CARDS DE RESUMO ---
    const alunos = carregarDados('alunos');
    const campos = carregarDados('campos');
    const vagas = carregarDados('vagas');
    const estagios = carregarDados('estagios');
    
    document.getElementById('total-alunos').textContent = alunos.length;
    document.getElementById('total-campos').textContent = campos.length;
    document.getElementById('total-vagas').textContent = vagas.length;
    const estagiosAtivos = estagios.filter(e => e.status === 'Em andamento');
    document.getElementById('total-estagios-ativos').textContent = estagiosAtivos.length;

    // --- 3. LISTA DE ATIVIDADE RECENTE ---
    const listaUltimosAlunos = document.getElementById('lista-ultimos-alunos');
    if(listaUltimosAlunos) {
        const ultimosAlunos = [...alunos].reverse().slice(0, 5); // Pega os 5 mais recentes
        if(ultimosAlunos.length > 0) {
            ultimosAlunos.forEach(aluno => {
                const li = document.createElement('li');
                li.textContent = aluno.nome;
                listaUltimosAlunos.appendChild(li);
            });
        } else {
            listaUltimosAlunos.innerHTML = '<li>Nenhum aluno cadastrado.</li>';
        }
    }

    // --- 4. GRÁFICOS (CHART.JS) ---
    // Gráfico 1: Status dos Estágios (Pizza)
    const ctxEstagios = document.getElementById('graficoStatusEstagios');
    if (ctxEstagios && estagios.length > 0) {
        const concluidos = estagios.filter(e => e.status === 'Concluído').length;
        const interrompidos = estagios.filter(e => e.status === 'Interrompido').length;

        new Chart(ctxEstagios, {
            type: 'doughnut',
            data: {
                labels: ['Em Andamento', 'Concluído', 'Interrompido'],
                datasets: [{
                    label: 'Status dos Estágios',
                    data: [estagiosAtivos.length, concluidos, interrompidos],
                    backgroundColor: [
                        'rgba(25, 118, 210, 0.8)', // Azul
                        'rgba(40, 167, 69, 0.8)',  // Verde
                        'rgba(220, 53, 69, 0.8)'   // Vermelho
                    ],
                    borderColor: '#fff',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                }
            }
        });
    }

    // Gráfico 2: Vagas por Área (Barras)
    const ctxVagas = document.getElementById('graficoVagasPorArea');
    if (ctxVagas && vagas.length > 0) {
        const vagasPorArea = vagas.reduce((acc, vaga) => {
            const area = vaga.area || 'Não especificada';
            if (!acc[area]) {
                acc[area] = 0;
            }
            acc[area] += parseInt(vaga.quantidade, 10) || 0;
            return acc;
        }, {});

        const labels = Object.keys(vagasPorArea);
        const data = Object.values(vagasPorArea);

        new Chart(ctxVagas, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Nº de Vagas por Área',
                    data: data,
                    backgroundColor: 'rgba(25, 118, 210, 0.7)',
                    borderColor: 'rgba(25, 118, 210, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                indexAxis: 'y', // Deixa as barras na horizontal para melhor leitura
                scales: {
                    x: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
});