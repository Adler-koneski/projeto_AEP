document.addEventListener('DOMContentLoaded', function() {
    // Guarda de segurança específico para esta página
    if (sessionStorage.getItem('perfilUsuario') !== 'administrador') {
        alert('Acesso negado. Apenas administradores podem acessar esta página.');
        window.location.replace('index.html');
        return;
    }

    const form = document.getElementById('formNovoUsuario');
    const tabelaBody = document.querySelector('#tabelaUsuarios tbody');

    function carregarUsuarios() {
        let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        if (!usuarios.some(u => u.username === 'admin')) {
          usuarios.unshift({ username: 'admin', password: '1234', profile: 'administrador' });
        }
        return usuarios;
    }

    function salvarUsuarios(usuarios) {
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
    }

    function atualizarTabela() {
        const usuarios = carregarUsuarios();
        tabelaBody.innerHTML = '';

        usuarios.forEach(user => {
            if (user.profile === 'administrador') return; // Não exibe o admin na lista

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${user.username}</td>
                <td>${user.profile}</td>
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
        const perfil = document.getElementById('novoPerfil').value;

        if (!novoUsername || !novaSenha || !perfil) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        let usuarios = carregarUsuarios();

        if (usuarios.some(u => u.username === novoUsername)) {
            alert('Este nome de usuário já existe. Por favor, escolha outro.');
            return;
        }

        usuarios.push({ username: novoUsername, password: novaSenha, profile: perfil });
        salvarUsuarios(usuarios);

        alert('Usuário cadastrado com sucesso!');
        form.reset();
        atualizarTabela();
    });

    // Inicializa a tabela
    atualizarTabela();
});