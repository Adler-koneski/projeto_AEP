document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('login-form');
  const errorMessage = document.getElementById('error-message');

  // Define as credenciais corretas (em um app real, viria do servidor)
  const USUARIO_CORRETO = 'admin';
  const SENHA_CORRETA = '1234';

  loginForm.addEventListener('submit', function(e) {
    e.preventDefault(); // Impede o envio do formulário

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === USUARIO_CORRETO && password === SENHA_CORRETA) {
      // Login bem-sucedido
      // Usamos sessionStorage: o login dura até o fechamento da aba/navegador
      sessionStorage.setItem('usuarioLogado', 'true');

      // Redireciona para o dashboard
      window.location.href = 'index.html';
    } else {
      // Login falhou
      errorMessage.textContent = 'Usuário ou senha inválidos.';
      // Limpa o campo de senha
      document.getElementById('password').value = '';
    }
  });
});