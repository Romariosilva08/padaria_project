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


// URL da API para obter produtos
const API_URL = 'http://localhost:5284/api/produtos';

// Referências aos elementos HTML
const chatContainer = document.getElementById('chat-container');
const chatMessages = document.getElementById('chat-messages');
const chatInputField = document.getElementById('chat-input-field');
const sendChatBtn = document.getElementById('send-chat-btn');
const toggleChatBtn = document.getElementById('toggle-chat');

// Armazenamento para informações do usuário
const userInfo = {
    name: null,
    favoriteProduct: null,
    wantsRecommendation: false,
};

// Função para gerar emoji com base no nome do produto
function getEmojiForProduct(productName) {
    const productKeywords = {
        "bolo": "🍰",
        "pão": "🍞",
        "torta": "🥧",
        "biscoito": "🍪",
        "chocolate": "🍫",
        "fruta": "🍎",
        // Adicione mais palavras-chave conforme necessário
    };

    for (const keyword in productKeywords) {
        if (productName.toLowerCase().includes(keyword)) {
            return productKeywords[keyword];
        }
    }
    return "🍰"; // Emoji padrão
}

// Função para adicionar mensagens ao chat
function addMessage(user, message) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.innerHTML = `<span class="${user}">${user}:</span> <pre>${message}</pre>`;
    chatMessages.appendChild(messageDiv);
    // Rolagem automática removida
}

// Função para buscar produtos da API
async function fetchProducts() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Erro ao buscar produtos.');
        }
        return await response.json();
    } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        return [];
    }
}

// Função para gerar perguntas personalizadas
function generatePersonalizedQuestions() {
    if (!userInfo.name) {
        return "Qual seu nome";
    } else if (!userInfo.favoriteProduct) {
        return `${userInfo.name} qual seu produto favorito`;
    } else if (!userInfo.wantsRecommendation) {
        return `Posso recomendar algo para ${userInfo.favoriteProduct} sim ou não`;
    }
    return null;
}

// Função para lidar com a lógica de resposta do chat
async function handleUserMessage(userMessage) {
    const lowerCaseMessage = userMessage.toLowerCase();
    let responseMessage = "Não entendi pergunte sobre nossos produtos";

    if (!userInfo.name) {
        userInfo.name = userMessage;
        responseMessage = `Prazer ${userInfo.name}`;
    } else if (!userInfo.favoriteProduct) {
        userInfo.favoriteProduct = userMessage;
        responseMessage = `Legal você gosta de ${userInfo.favoriteProduct}`;
    } else if (!userInfo.wantsRecommendation) {
        responseMessage = await handleRecommendation(lowerCaseMessage);
    } else {
        responseMessage = await handleProductQuery(lowerCaseMessage);
    }

    // Gera uma nova pergunta se necessário
    const nextQuestion = generatePersonalizedQuestions();
    if (nextQuestion) {
        responseMessage += `\n\n${nextQuestion}`;
    }

    addMessage('Bot', responseMessage);
}

// Função para lidar com recomendações
async function handleRecommendation(lowerCaseMessage) {
    if (lowerCaseMessage.includes('sim')) {
        userInfo.wantsRecommendation = true;
        const products = await fetchProducts();
        const recommendations = products.filter(p => p.nome.toLowerCase().includes(userInfo.favoriteProduct.toLowerCase()));

        if (recommendations.length > 0) {
            return formatProductRecommendations(recommendations);
        } else {
            return "Desculpe não encontrei produtos semelhantes";
        }
    } else {
        userInfo.wantsRecommendation = true;
        return "Sem problemas avise se precisar de recomendações";
    }
}

// Função para formatar recomendações de produtos
function formatProductRecommendations(products) {
    let response = "Aqui estão alguns produtos que você pode gostar:\n\n";
    products.forEach(p => {
        response += `${getEmojiForProduct(p.nome)} ${p.nome}\n`;
        response += `Preço: R$${p.preco.toFixed(2)}\n`;
        response += `Estoque: ${p.quantidade} unidades\n`;
        response += `Status: ${p.status}\n\n`;
    });
    return response;
}

// Função para lidar com consultas de produtos
async function handleProductQuery(lowerCaseMessage) {
    if (lowerCaseMessage.includes("pão") || lowerCaseMessage.includes("bolo") || lowerCaseMessage.includes("produto")) {
        const products = await fetchProducts();
        const matchedProducts = products.filter(p => lowerCaseMessage.includes(p.nome.toLowerCase()));

        if (matchedProducts.length > 0) {
            return formatProductRecommendations(matchedProducts);
        } else {
            return "Desculpe não consegui encontrar informações sobre o produto mencionado";
        }
    }
    return "Não entendi pergunte sobre nossos produtos";
}

// Evento de clique para o botão enviar
sendChatBtn.addEventListener('click', () => {
    const userMessage = chatInputField.value.trim();
    if (userMessage) {
        addMessage('User', userMessage);
        handleUserMessage(userMessage);
        chatInputField.value = ''; // Limpa o campo de entrada
    }
});

// Permite enviar a mensagem ao pressionar "Enter"
chatInputField.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendChatBtn.click();
    }
});

// Evento para minimizar/maximizar o chat
toggleChatBtn.addEventListener('click', () => {
    const chatBody = document.getElementById('chat-body');
    const isVisible = chatBody.style.display !== 'none';
    chatBody.style.display = isVisible ? 'none' : 'flex';
    toggleChatBtn.textContent = isVisible ? 'Maximizar' : 'Minimizar';
});
