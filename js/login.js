document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('login-form');
  const errorMessage = document.getElementById('error-message');

  function carregarUsuarios() {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    if (!usuarios.some(u => u.username === 'admin')) {
      usuarios.unshift({ username: 'admin', password: '1234', profile: 'administrador' });
    }
    return usuarios;
  }

  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const usernameInput = document.getElementById('username').value;
    const passwordInput = document.getElementById('password').value;
    const usuarios = carregarUsuarios();
    const usuarioEncontrado = usuarios.find(user => user.username === usernameInput && user.password === passwordInput);

    if (usuarioEncontrado) {
      sessionStorage.setItem('usuarioLogado', usuarioEncontrado.username);
      sessionStorage.setItem('perfilUsuario', usuarioEncontrado.profile);

      // Redireciona para o painel correto com base no perfil
      if (usuarioEncontrado.profile === 'aluno') {
        window.location.href = 'aluno-dashboard.html';
      } else {
        window.location.href = 'index.html';
      }
    } else {
      errorMessage.textContent = 'Usuário ou senha inválidos.';
      document.getElementById('password').value = '';
    }
  });
});