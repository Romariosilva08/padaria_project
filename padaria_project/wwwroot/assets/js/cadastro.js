function validateName(name) {
    const namePattern = /^[A-Za-zÀ-ÖØ-öø-ÿ]+$/; // Inclui caracteres acentuados
    return namePattern.test(name);
}

function validatePassword(password) {
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    return passwordPattern.test(password);
}

document.getElementById('register-form').addEventListener('submit', function(event) {
    event.preventDefault();
    let isValid = true;

    // Email validation
    const email = document.getElementById('email');
    const emailError = document.getElementById('email-error');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.value)) {
        isValid = false;
        emailError.textContent = 'E-mail inválido.';
    } else {
        emailError.textContent = '';
    }

    // Name validation
    const name = document.getElementById('name');
    const nameError = document.getElementById('name-error');
    if (name.value.length < 3 || name.value.length > 16 || !validateName(name.value)) {
        isValid = false;
        nameError.textContent = 'O nome deve ter entre 3 e 16 caracteres e conter apenas letras.';
    } else {
        nameError.textContent = '';
    }

    // Lastname validation
    const lastname = document.getElementById('lastname');
    const lastnameError = document.getElementById('lastname-error');
    if (!validateName(lastname.value)) {
        isValid = false;
        lastnameError.textContent = 'O sobrenome deve conter apenas letras.';
    } else {
        lastnameError.textContent = '';
    }

    // Password validation
    const password = document.getElementById('password');
    const passwordError = document.getElementById('password-error');
    if (!validatePassword(password.value)) {
        isValid = false;
        passwordError.textContent = 'A senha deve ter pelo menos 6 caracteres e conter letras e números.';
    } else {
        passwordError.textContent = '';
    }

    // Password confirmation validation
    const passwordConfirmation = document.getElementById('passwordconfirmation');
    const passwordConfirmationError = document.getElementById('passwordconfirmation-error');
    if (password.value !== passwordConfirmation.value) {
        isValid = false;
        passwordConfirmationError.textContent = 'As senhas não coincidem.';
    } else {
        passwordConfirmationError.textContent = '';
    }

    // Agreement validation
    const agreement = document.getElementById('agreement');
    const agreementError = document.getElementById('agreement-error');
    if (!agreement.checked) {
        isValid = false;
        agreementError.textContent = 'Você deve aceitar os termos de uso.';
    } else {
        agreementError.textContent = '';
    }

    if (isValid) {
        alert('Formulário enviado com sucesso!');
        // Aqui você pode enviar o formulário
        // this.submit();
    }
});

document.getElementById('login-form-id').addEventListener('submit', function(event) {
    event.preventDefault();
    let isValid = true;

    // Login Email validation
    const loginEmail = document.getElementById('login-email');
    const loginEmailError = document.getElementById('login-email-error');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(loginEmail.value)) {
        isValid = false;
        loginEmailError.textContent = 'E-mail inválido.';
    } else {
        loginEmailError.textContent = '';
    }

    // Login Password validation
    const loginPassword = document.getElementById('login-password');
    const loginPasswordError = document.getElementById('login-password-error');
    if (loginPassword.value.length < 6) {
        isValid = false;
        loginPasswordError.textContent = 'A senha deve ter pelo menos 6 caracteres.';
    } else {
        loginPasswordError.textContent = '';
    }

    if (isValid) {
        alert('Login efetuado com sucesso!');
        // Aqui você pode enviar o formulário
        // this.submit();
    }
});

document.getElementById('forgot-password-form-id').addEventListener('submit', function(event) {
    event.preventDefault();
    let isValid = true;

    // Forgot Email validation
    const forgotEmail = document.getElementById('forgot-email');
    const forgotEmailError = document.getElementById('forgot-email-error');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(forgotEmail.value)) {
        isValid = false;
        forgotEmailError.textContent = 'E-mail inválido.';
    } else {
        forgotEmailError.textContent = '';
    }

    if (isValid) {
        alert('Link de redefinição de senha enviado com sucesso!');
        // Aqui você pode enviar o formulário
        // this.submit();
    }
});

// Toggle between forms
document.getElementById('toggle-login').addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById('cadastro-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('forgot-password-form').style.display = 'none';
});

document.getElementById('toggle-cadastro').addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('cadastro-form').style.display = 'block';
    document.getElementById('forgot-password-form').style.display = 'none';
});

document.getElementById('toggle-forgot-password').addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('forgot-password-form').style.display = 'block';
    document.getElementById('cadastro-form').style.display = 'none';
});

document.getElementById('toggle-login-forgot').addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById('forgot-password-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('cadastro-form').style.display = 'none';
});

// Pega o modal
var modal = document.getElementById("terms-modal");

// Pega o link que abre o modal
var termsLink = document.getElementById("terms-link");

// Pega o elemento <span> que fecha o modal
var span = document.getElementsByClassName("close")[0];

// Quando o usuário clicar no link, abre o modal
termsLink.onclick = function(event) {
    event.preventDefault(); // Previne o comportamento padrão do link
    modal.style.display = "block";
}

// Quando o usuário clicar no <span> (x), fecha o modal
span.onclick = function() {
    modal.style.display = "none";
}

// Quando o usuário clicar em qualquer lugar fora do modal, fecha o modal
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}