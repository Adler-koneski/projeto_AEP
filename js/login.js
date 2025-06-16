document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('login-form');
  const errorMessage = document.getElementById('error-message');

  // Carrega a lista de usuários do localStorage
  function carregarUsuarios() {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    // Garante que o usuário 'admin' sempre exista
    if (!usuarios.some(u => u.username === 'admin')) {
      usuarios.unshift({ username: 'admin', password: '1234' });
    }
    return usuarios;
  }

  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const usernameInput = document.getElementById('username').value;
    const passwordInput = document.getElementById('password').value;
    
    const usuarios = carregarUsuarios();
    
    // Procura o usuário na lista
    const usuarioEncontrado = usuarios.find(user => user.username === usernameInput && user.password === passwordInput);

    if (usuarioEncontrado) {
      // Login bem-sucedido
      // Armazena o NOME do usuário na sessão para controle de permissão
      sessionStorage.setItem('usuarioLogado', usuarioEncontrado.username);
      window.location.href = 'index.html';
    } else {
      // Login falhou
      errorMessage.textContent = 'Usuário ou senha inválidos.';
      document.getElementById('password').value = '';
    }
  });
});