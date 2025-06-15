// Este script é o "guarda". Ele roda antes de tudo na página.
// Se não houver 'usuarioLogado' na sessionStorage, redireciona para o login.

if (!sessionStorage.getItem('usuarioLogado')) {
  // O replace() é melhor que o href, pois impede o usuário de clicar em "Voltar"
  // e acessar a página protegida novamente.
  window.location.replace('login.html');
}