// Funções de validação
function validateName(name) {
    const namePattern = /^[A-Za-zÀ-ÖØ-öø-ÿ]+$/; // Inclui caracteres acentuados
    return namePattern.test(name);
}

function validatePassword(password) {
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    return passwordPattern.test(password);
}

function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

function displayError(element, message) {
    element.textContent = message;
}

// Registro do formulário
let form = document.getElementById('register-form');
let submit = document.getElementById('btn-submit');

form.addEventListener('submit', function (e) {
    e.preventDefault();

    let isValid = true;

    // Validação do Nome
    const name = document.getElementById('name');
    const nameError = document.getElementById('name-error');
    if (name.value.length < 3 || name.value.length > 16 || !validateName(name.value)) {
        isValid = false;
        displayError(nameError, 'O nome deve ter entre 3 e 16 caracteres e conter apenas letras.');
    } else {
        displayError(nameError, '');
    }

    // Validação do Sobrenome
    const lastname = document.getElementById('lastname');
    const lastnameError = document.getElementById('lastname-error');
    if (!validateName(lastname.value)) {
        isValid = false;
        displayError(lastnameError, 'O sobrenome deve conter apenas letras.');
    } else {
        displayError(lastnameError, '');
    }

    // Validação do Email
    const email = document.getElementById('email');
    const emailError = document.getElementById('email-error');
    if (!validateEmail(email.value)) {
        isValid = false;
        displayError(emailError, 'E-mail inválido.');
    } else {
        displayError(emailError, '');
    }

    // Validação da Senha
    const password = document.getElementById('password');
    const passwordError = document.getElementById('password-error');
    if (!validatePassword(password.value)) {
        isValid = false;
        displayError(passwordError, 'A senha deve ter pelo menos 6 caracteres e conter letras e números.');
    } else {
        displayError(passwordError, '');
    }

    // Validação da Confirmação de Senha
    const passwordConfirmation = document.getElementById('passwordconfirmation');
    const passwordConfirmationError = document.getElementById('passwordconfirmation-error');
    if (password.value !== passwordConfirmation.value) {
        isValid = false;
        displayError(passwordConfirmationError, 'As senhas não coincidem.');
    } else {
        displayError(passwordConfirmationError, '');
    }

    // Validação da Aceitação de Termos
    const agreement = document.getElementById('agreement');
    const agreementError = document.getElementById('agreement-error');
    if (!agreement.checked) {
        isValid = false;
        displayError(agreementError, 'Você deve aceitar os termos de uso.');
    } else {
        displayError(agreementError, '');
    }

    if (isValid) {
        // Obtenha os dados do formulário
        let nome = document.getElementById('name').value;
        let email = document.getElementById('email').value;
        let senha = document.getElementById('password').value;

        // Crie um objeto com os dados do usuário
        let userData = {
            Nome: nome,
            Email: email,
            Senha: senha
        };

        // Envie os dados do usuário para o servidor
        fetch('http://localhost:5284/api/usuarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);

                // Salvar o nome do usuário no armazenamento local para exibir posteriormente
                localStorage.setItem('nome-usuario', data.nome);
                console.log(localStorage);

                // Redirecionar o usuário para a página Nossos Produtos
                window.location.href = 'https://localhost:7039/index.html';
            })
            .catch((error) => {
                console.error('Erro:', error);
            });
    }
});

// Elementos do DOM
const cadastroForm = document.getElementById('cadastro-form');
const loginForm = document.getElementById('login-form');
const toggleLoginLink = document.getElementById('toggle-login');
const toggleCadastroLink = document.getElementById('toggle-cadastro');

// Função para alternar entre visualização de Cadastro e Login
function toggleForms(event) {
    event.preventDefault();
    cadastroForm.style.display = cadastroForm.style.display === 'none' ? 'block' : 'none';
    loginForm.style.display = loginForm.style.display === 'none' ? 'block' : 'none';
}

// Eventos de clique para alternar entre Cadastro e Login
toggleLoginLink.addEventListener('click', toggleForms);
toggleCadastroLink.addEventListener('click', toggleForms);

document.getElementById('btn-login').addEventListener('click', function (e) {
    e.preventDefault();

    // Validações para Login
    let isValid = true;

    // Email
    const loginEmail = document.getElementById('login-email');
    const loginEmailError = document.getElementById('login-email-error');
    if (!validateEmail(loginEmail.value)) {
        isValid = false;
        displayError(loginEmailError, 'E-mail inválido.');
    } else {
        displayError(loginEmailError, '');
    }

    // Senha
    const loginPassword = document.getElementById('login-password');
    const loginPasswordError = document.getElementById('login-password-error');
    if (!validatePassword(loginPassword.value)) {
        isValid = false;
        displayError(loginPasswordError, 'A senha deve ter pelo menos 6 caracteres e conter letras e números.');
    } else {
        displayError(loginPasswordError, '');
    }

    if (isValid) {
        // Obtenha os dados do formulário de login
        let email = loginEmail.value;
        let senha = loginPassword.value;

        // Crie um objeto com os dados de login do usuário
        let userData = {
            Email: email,
            Senha: senha
        };

        // Envie os dados do usuário para o servidor
        fetch('http://localhost:5284/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Erro ao efetuar o login');
                }

                // Add try-catch block here
                try {
                    return response.json();
                } catch (error) {
                    console.error('Error parsing JSON:', error, response);
                    throw error;
                }
            })
            .then((data) => {
                console.log(data); // Exibe o objeto data no console
                if (data && data.nome) {
                    console.log(data.token); // Access the token like this

                    // Salvar o nome do usuário no armazenamento local para exibir posteriormente
                    localStorage.setItem('nome-usuario', data.nome);

                    // Atualize o conteúdo do nome do usuário no header
                    const nomeUsuarioElement = document.getElementById('nome-usuario');
                    if (nomeUsuarioElement) {
                        nomeUsuarioElement.textContent = `Seja bem-vindo(a), ${data.nome}!`;
                    } else {
                        console.error('Elemento com ID "nome-usuario" não encontrado na página.');
                    }

                    // Redirecione para a página de destino após um pequeno intervalo para garantir que o nome do usuário seja exibido
                    setTimeout(() => {
                        window.location.href = 'https://localhost:7039/index.html';
                    }, 1000); // Redirecionar após 1 segundo
                } else {
                    console.error('O objeto de dados não contém a propriedade "nome".', data);
                }
            })
            .catch((error) => {
                console.error('Erro:', error);
            });
    }
});
