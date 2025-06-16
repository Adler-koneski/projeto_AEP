document.addEventListener('DOMContentLoaded', function() {
   
    if (sessionStorage.getItem('usuarioLogado') !== 'admin') {
        alert('Acesso negado. Apenas administradores podem acessar esta página.');
        window.location.replace('index.html');
        return;
    }

    const form = document.getElementById('formNovoUsuario');
    const tabelaBody = document.querySelector('#tabelaUsuarios tbody');

    function carregarUsuarios() {
        return JSON.parse(localStorage.getItem('usuarios')) || [];
    }

    function salvarUsuarios(usuarios) {
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
    }

    function atualizarTabela() {
        const usuarios = carregarUsuarios();
        tabelaBody.innerHTML = '';

        usuarios.forEach(user => {
            // Não exibe o usuário 'admin' na lista para não ser excluído
            if (user.username === 'admin') return;

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${user.username}</td>
                <td>
                    <button onclick="excluirUsuario('${user.username}')">Excluir</button>
                </td>
            `;
            tabelaBody.appendChild(tr);
        });
    }

    window.excluirUsuario = function(username) {
        if (confirm(`Tem certeza que deseja excluir o usuário "${username}"?`)) {
            let usuarios = carregarUsuarios();
            usuarios = usuarios.filter(u => u.username !== username);
            salvarUsuarios(usuarios);
            atualizarTabela();
        }
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const novoUsername = document.getElementById('novoUsername').value;
        const novaSenha = document.getElementById('novaSenha').value;

        if (!novoUsername || !novaSenha) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        let usuarios = carregarUsuarios();

        
        if (usuarios.some(u => u.username === novoUsername)) {
            alert('Este nome de usuário já existe. Por favor, escolha outro.');
            return;
        }

        usuarios.push({ username: novoUsername, password: novaSenha });
        salvarUsuarios(usuarios);

        alert('Usuário cadastrado com sucesso!');
        form.reset();
        atualizarTabela();
    });

    
    atualizarTabela();
});