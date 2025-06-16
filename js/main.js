
document.addEventListener('DOMContentLoaded', function() {
    
    
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            sessionStorage.removeItem('usuarioLogado');
            window.location.href = 'login.html';
        });
    }

    const adminPanelLink = document.getElementById('admin-panel-link');
    const usuarioLogado = sessionStorage.getItem('usuarioLogado');

    if (adminPanelLink && usuarioLogado === 'admin') {
        
        adminPanelLink.style.display = 'inline-flex';
    }
});