document.addEventListener('DOMContentLoaded', function() {
    const usuarioLogado = sessionStorage.getItem('usuarioLogado');
    const perfilUsuario = sessionStorage.getItem('perfilUsuario');

    // Lógica de Logout
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            sessionStorage.clear(); // Limpa toda a sessão (usuário e perfil)
            window.location.href = 'login.html';
        });
    }

    // Controle de visibilidade de menus por perfil
    const adminPanelLink = document.getElementById('admin-panel-link');
    const alunosLink = document.querySelector('a[href="alunos.html"]');
    const camposLink = document.querySelector('a[href="campos.html"]');
    const vagasLink = document.querySelector('a[href="vagas.html"]');
    const estagiosLink = document.querySelector('a[href="estagios.html"]');
    const adminContainer = document.querySelector('.admin-container'); // Para o futuro
    
    if (perfilUsuario === 'administrador') {
        if (adminPanelLink) adminPanelLink.style.display = 'inline-flex';
    } else if (perfilUsuario === 'coordenador') {
        // Coordenador vê tudo, menos o painel de admin
    } else if (perfilUsuario === 'supervisor') {
        // Supervisor só vê alunos e estágios (para avaliações)
        if (camposLink) camposLink.style.display = 'none';
        if (vagasLink) vagasLink.style.display = 'none';
        if (adminPanelLink) adminPanelLink.style.display = 'none';
    } else if (perfilUsuario === 'aluno') {
        // Aluno só vê o início (dashboard com seus dados) e seus estágios
        if (alunosLink) alunosLink.style.display = 'none';
        if (camposLink) camposLink.style.display = 'none';
        if (vagasLink) vagasLink.style.display = 'none';
        if (adminPanelLink) adminPanelLink.style.display = 'none';
    }
});