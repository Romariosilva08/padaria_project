document.addEventListener('DOMContentLoaded', function () {
    const nomeUsuario = localStorage.getItem('nome-usuario'); // Usando 'nome-usuario' como chave
    if (!nomeUsuario) {
        // Se não houver usuário logado, redirecione para a página de login
        window.location.href = 'cadastro.html'; // Altere para a página de login apropriada
    } else {
        // Se houver usuário logado, exiba o nome do usuário e o botão de logout
        const nomeUsuarioElement = document.getElementById('nome-usuario');
        if (nomeUsuarioElement) {
            nomeUsuarioElement.innerText = `Seja bem-vindo(a), ${nomeUsuario}!`;
        }
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.style.display = 'inline-block';
        }
        // Oculte o botão de cadastro, já que o usuário está logado
        const cadastreElement = document.getElementById('cadastre');
        if (cadastreElement) {
            cadastreElement.style.display = 'none';
        }
    }
});

// Configuração do modo noturno
const inputCheck = document.querySelector('#modo-noturno');
const elemento = document.querySelector('body');

inputCheck.addEventListener('click', () => {
    const modo = inputCheck.checked ? 'dark' : 'light';
    elemento.setAttribute("data-bs-theme", modo);
});

// Função de logout
function logout() {
    // Limpar as informações do usuário da sessão
    localStorage.removeItem('nome-usuario');
    // Redirecionar para a página de login ou qualquer outra página apropriada
    window.location.href = 'cadastro.html'; // Altere para a página apropriada
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
//        console.log(`Nome do usuário: ${nomeUsuario}`); // Add this line
//        nomeUsuarioElement.innerText = `Olá, ${nomeUsuario}`;
//    }
//}


//function exibirLogoutButton() {
//    const usuarioLogado = true; // Aqui você pode definir a lógica para verificar se o usuário está logado
//    const logoutBtn = document.getElementById('logoutBtn');

//    // Se o usuário estiver logado, mostrar o botão de logout
//    if (usuarioLogado) {
//        logoutBtn.style.display = 'inline-block';
//    } else {
//        logoutBtn.style.display = 'none'; // Se não estiver logado, ocultar o botão
//    }
//}


//function ocultarElementoCadastro() {
//    // Verificar se há um usuário logado
//    const nomeUsuario = localStorage.getItem('nomeUsuario');
//    if (nomeUsuario) {
//        // Se o usuário estiver logado, ocultar o elemento de cadastro
//        const cadastreElement = document.getElementById('cadastre');
//        if (cadastreElement) {
//            cadastreElement.style.display = 'none';
//        }
//    }
//}