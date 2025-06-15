document.addEventListener('DOMContentLoaded', function() {
  
  // Funções para carregar dados do localStorage
  function carregarDados(chave) {
    return JSON.parse(localStorage.getItem(chave)) || [];
  }

  // Carrega todos os dados necessários
  const alunos = carregarDados('alunos');
  const campos = carregarDados('campos');
  const vagas = carregarDados('vagas');
  const estagios = carregarDados('estagios');

  // Calcula os estágios que estão "Em andamento"
  const estagiosAtivos = estagios.filter(estagio => estagio.status === 'Em andamento');

  // Atualiza os números nos cards do dashboard
  document.getElementById('total-alunos').textContent = alunos.length;
  document.getElementById('total-campos').textContent = campos.length;
  document.getElementById('total-vagas').textContent = vagas.length;
  document.getElementById('total-estagios-ativos').textContent = estagiosAtivos.length;

});