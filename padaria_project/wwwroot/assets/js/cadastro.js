function validateName(name) {
    const namePattern = /^[A-Za-zÀ-ÖØ-öø-ÿ]+$/;
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

let form = document.getElementById('register-form');
let submit = document.getElementById('btn-submit');

form.addEventListener('submit', function (e) {
    e.preventDefault();

    let isValid = true;

    const name = document.getElementById('name');
    const nameError = document.getElementById('name-error');
    if (name.value.length < 3 || name.value.length > 16 || !validateName(name.value)) {
        isValid = false;
        displayError(nameError, 'O nome deve ter entre 3 e 16 caracteres e conter apenas letras.');
    } else {
        displayError(nameError, '');
    }

    const lastname = document.getElementById('lastname');
    const lastnameError = document.getElementById('lastname-error');
    if (!validateName(lastname.value)) {
        isValid = false;
        displayError(lastnameError, 'O sobrenome deve conter apenas letras.');
    } else {
        displayError(lastnameError, '');
    }

    const email = document.getElementById('email');
    const emailError = document.getElementById('email-error');
    if (!validateEmail(email.value)) {
        isValid = false;
        displayError(emailError, 'E-mail inválido.');
    } else {
        displayError(emailError, '');
    }

    const password = document.getElementById('password');
    const passwordError = document.getElementById('password-error');
    if (!validatePassword(password.value)) {
        isValid = false;
        displayError(passwordError, 'A senha deve ter pelo menos 6 caracteres e conter letras e números.');
    } else {
        displayError(passwordError, '');
    }

    const passwordConfirmation = document.getElementById('passwordconfirmation');
    const passwordConfirmationError = document.getElementById('passwordconfirmation-error');
    if (password.value !== passwordConfirmation.value) {
        isValid = false;
        displayError(passwordConfirmationError, 'As senhas não coincidem.');
    } else {
        displayError(passwordConfirmationError, '');
    }

    const agreement = document.getElementById('agreement');
    const agreementError = document.getElementById('agreement-error');
    if (!agreement.checked) {
        isValid = false;
        displayError(agreementError, 'Você deve aceitar os termos de uso.');
    } else {
        displayError(agreementError, '');
    }

    if (isValid) {
        let nome = document.getElementById('name').value;
        let email = document.getElementById('email').value;
        let senha = document.getElementById('password').value;

        let userData = {
            Nome: nome,
            Email: email,
            Senha: senha
        };

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

            localStorage.setItem('nome-usuario', data.nome);
            console.log(localStorage);

            window.location.href = 'https://localhost:7039/index.html';
        })
        .catch((error) => {
            console.error('Erro:', error);
        });
    }
});

const cadastroForm = document.getElementById('cadastro-form');
const loginForm = document.getElementById('login-form');
const toggleLoginLink = document.getElementById('toggle-login');
const toggleCadastroLink = document.getElementById('toggle-cadastro');

function toggleForms(event) {
    event.preventDefault();
    cadastroForm.style.display = cadastroForm.style.display === 'none' ? 'block' : 'none';
    loginForm.style.display = loginForm.style.display === 'none' ? 'block' : 'none';
}

toggleLoginLink.addEventListener('click', toggleForms);
toggleCadastroLink.addEventListener('click', toggleForms);

document.getElementById('btn-login').addEventListener('click', function (e) {
    e.preventDefault();

    let isValid = true;

    const loginEmail = document.getElementById('login-email');
    const loginEmailError = document.getElementById('login-email-error');
    if (!validateEmail(loginEmail.value)) {
        isValid = false;
        displayError(loginEmailError, 'E-mail inválido.');
    } else {
        displayError(loginEmailError, '');
    }

    const loginPassword = document.getElementById('login-password');
    const loginPasswordError = document.getElementById('login-password-error');
    if (!validatePassword(loginPassword.value)) {
        isValid = false;
        displayError(loginPasswordError, 'A senha deve ter pelo menos 6 caracteres e conter letras e números.');
    } else {
        displayError(loginPasswordError, '');
    }

    if (isValid) {
        let email = loginEmail.value;
        let senha = loginPassword.value;

        let userData = {
            Email: email,
            Senha: senha
        };

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

                try {
                    return response.json();
                } catch (error) {
                    console.error('Error parsing JSON:', error, response);
                    throw error;
                }
            })
            .then((data) => {
                console.log(data); 
                if (data && data.nome) {
                    console.log(data.token); 

                    localStorage.setItem('nome-usuario', data.nome);

                    const nomeUsuarioElement = document.getElementById('nome-usuario');
                    if (nomeUsuarioElement) {
                        nomeUsuarioElement.textContent = `Seja bem-vindo(a), ${data.nome}!`;
                    } else {
                        console.error('Elemento com ID "nome-usuario" não encontrado na página.');
                    }

                    setTimeout(() => {
                        window.location.href = 'https://localhost:7039/index.html';
                    }, 1000);
                } else {
                    console.error('O objeto de dados não contém a propriedade "nome".', data);
                }
            })
            .catch((error) => {
                console.error('Erro:', error);
            });
    }
});


document.getElementById('forgot-password-form-id').addEventListener('submit', function (e) {
    e.preventDefault();

    const forgotEmail = document.getElementById('forgot-email');
    const forgotEmailError = document.getElementById('forgot-email-error');
    if (!validateEmail(forgotEmail.value)) {
        displayError(forgotEmailError, 'E-mail inválido.');
        return;
    } else {
        displayError(forgotEmailError, '');
    }

    const email = forgotEmail.value;

    fetch('http://localhost:5284/api/recuperar-senha', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ Email: email }),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            alert('Um link para redefinição de senha foi enviado para seu e-mail.');
            document.getElementById('forgot-password-form-id').reset();
        })
        .catch((error) => {
            console.error('Erro:', error);
        });
});
