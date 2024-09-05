document.addEventListener('DOMContentLoaded', function () {
    const nomeUsuario = localStorage.getItem('nome-usuario'); // Usando 'nome-usuario' como chave
    if (!nomeUsuario) {
        // Se n�o houver usu�rio logado, redirecione para a p�gina de login
        window.location.href = 'cadastro.html'; // Altere para a p�gina de login apropriada
    } else {
        // Se houver usu�rio logado, exiba o nome do usu�rio e o bot�o de logout
        const nomeUsuarioElement = document.getElementById('nome-usuario');
        if (nomeUsuarioElement) {
            nomeUsuarioElement.innerText = `Seja bem-vindo(a), ${nomeUsuario}!`;
        }
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.style.display = 'inline-block';
        }
        // Oculte o bot�o de cadastro, j� que o usu�rio est� logado
        const cadastreElement = document.getElementById('cadastre');
        if (cadastreElement) {
            cadastreElement.style.display = 'none';
        }
    }
});

// Configura��o do modo noturno
const inputCheck = document.querySelector('#modo-noturno');
const elemento = document.querySelector('body');

inputCheck.addEventListener('click', () => {
    const modo = inputCheck.checked ? 'dark' : 'light';
    elemento.setAttribute("data-bs-theme", modo);
});

// Fun��o de logout
function logout() {
    // Limpar as informa��es do usu�rio da sess�o
    localStorage.removeItem('nome-usuario');
    // Redirecionar para a p�gina de login ou qualquer outra p�gina apropriada
    window.location.href = 'cadastro.html'; // Altere para a p�gina apropriada
}


//function verificarUsuarioLogado() {
//    const nomeUsuario = localStorage.getItem('nomeUsuario');
//    if (nomeUsuario) {
//        const cadastreElement = document.getElementById('cadastre');
//        if (cadastreElement) {
//            cadastreElement.style.display = 'none';
//        }
//    }
//}


//function exibirNomeUsuario() {
//    const nomeUsuario = localStorage.getItem('nomeUsuario');
//    const nomeUsuarioElement = document.getElementById('nome-usuario');
//    if (nomeUsuario && nomeUsuarioElement) {
//        console.log(`Nome do usu�rio: ${nomeUsuario}`); // Add this line
//        nomeUsuarioElement.innerText = `Ol�, ${nomeUsuario}`;
//    }
//}


//function exibirLogoutButton() {
//    const usuarioLogado = true; // Aqui voc� pode definir a l�gica para verificar se o usu�rio est� logado
//    const logoutBtn = document.getElementById('logoutBtn');

//    // Se o usu�rio estiver logado, mostrar o bot�o de logout
//    if (usuarioLogado) {
//        logoutBtn.style.display = 'inline-block';
//    } else {
//        logoutBtn.style.display = 'none'; // Se n�o estiver logado, ocultar o bot�o
//    }
//}


//function ocultarElementoCadastro() {
//    // Verificar se h� um usu�rio logado
//    const nomeUsuario = localStorage.getItem('nomeUsuario');
//    if (nomeUsuario) {
//        // Se o usu�rio estiver logado, ocultar o elemento de cadastro
//        const cadastreElement = document.getElementById('cadastre');
//        if (cadastreElement) {
//            cadastreElement.style.display = 'none';
//        }
//    }
//}