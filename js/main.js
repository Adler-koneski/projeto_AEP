// Lógica de Logout - Centralizada
document.addEventListener('DOMContentLoaded', function() {
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            sessionStorage.removeItem('usuarioLogado');
            window.location.href = 'login.html';
        });
    }
});