document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('register-form');
    const errorMessage = document.getElementById('error-message');

    function carregarUsuarios() {
        return JSON.parse(localStorage.getItem('usuarios')) || [];
    }

    function salvarUsuarios(usuarios) {
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
    }

    function carregarAlunos() {
        return JSON.parse(localStorage.getItem('alunos')) || [];
    }

    function salvarAlunos(alunos) {
        localStorage.setItem('alunos', JSON.stringify(alunos));
    }

    function gerarId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        let usuarios = carregarUsuarios();
        let alunos = carregarAlunos();

        // Verifica se o email (username) já existe na lista de usuários
        if (usuarios.some(u => u.username === email)) {
            errorMessage.textContent = 'Este e-mail já está cadastrado.';
            return;
        }

        // Adiciona o novo usuário à lista de usuários
        const novoUsuario = { username: email, password: password, profile: 'aluno' };
        usuarios.push(novoUsuario);
        salvarUsuarios(usuarios);

        // Cria um registro de aluno correspondente
        const novoAluno = {
            id: gerarId(),
            nome: nome,
            email: email, // Usando o email como contato e identificador único
            contato: email,
            createdBy: email, // O próprio aluno é o criador
            documentos: [],
            candidaturas: [],
            // Outros campos podem ser preenchidos pelo aluno depois
            cpf: '', rg: '', nascimento: '', cep: '', endereco: '', bairro: '', cidade: '', uf: '',
            curso: '', matricula: '', periodo: '', instituicao: '',
            alergias: '', condicoes: ''
        };
        alunos.push(novoAluno);
        salvarAlunos(alunos);

        alert('Cadastro realizado com sucesso! Você será redirecionado para a tela de login.');
        window.location.href = 'login.html';
    });
});