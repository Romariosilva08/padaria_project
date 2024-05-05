
class Validator {

    constructor() {
      this.validations = [
        'data-min-length',
        'data-max-length',
        'data-only-letters',
        'data-email-validate',
        'data-required',
        'data-equal',
        'data-password-validate',
      ]
    }
  
    // inicia a validação de todos os campos
    validate(form) {
  
      // limpa todas as validações antigas
      let currentValidations = document.querySelectorAll('form .error-validation');
  
      if(currentValidations.length) {
        this.cleanValidations(currentValidations);
      }
  
      // pegar todos inputs
      let inputs = form.getElementsByTagName('input');
      // transformar HTMLCollection em arr
      let inputsArray = [...inputs];
  
      // loop nos inputs e validação mediante aos atributos encontrados
      inputsArray.forEach(function(input, obj) {
  
        // fazer validação de acordo com o atributo do input
        for(let i = 0; this.validations.length > i; i++) {
          if(input.getAttribute(this.validations[i]) != null) {
  
            // limpa string para saber o método
            let method = this.validations[i].replace("data-", "").replace("-", "");
  
            // valor do input
            let value = input.getAttribute(this.validations[i])
  
            // invoca o método
            this[method](input,value);
  
          }
        }
  
      }, this);
  
    }
  
    // método para validar se tem um mínimo de caracteres
    minlength(input, minValue) {
  
      let inputLength = input.value.length;
  
      let errorMessage = `O campo precisa ter pelo menos ${minValue} caracteres`;
  
      if(inputLength < minValue) {
        this.printMessage(input, errorMessage);
      }
  
    }
  
    // método para validar se passou do máximo de caracteres
    maxlength(input, maxValue) {
  
      let inputLength = input.value.length;
  
      let errorMessage = `O campo precisa ter menos que ${maxValue} caracteres`;
  
      if(inputLength > maxValue) {
        this.printMessage(input, errorMessage);
      }
  
    }
  
    // método para validar strings que só contem letras
    onlyletters(input) {
  
      let re = /^[A-Za-z]+$/;;
  
      let inputValue = input.value;
  
      let errorMessage = `Este campo não aceita números nem caracteres especiais`;
  
      if(!re.test(inputValue)) {
        this.printMessage(input, errorMessage);
      }
  
    }
  
    // método para validar e-mail
    emailvalidate(input) {
      let re = /\S+@\S+\.\S+/;
  
      let email = input.value;
  
      let errorMessage = `Insira um e-mail no padrão matheus@email.com`;
  
      if(!re.test(email)) {
        this.printMessage(input, errorMessage);
      }
  
    }
  
    // verificar se um campo está igual o outro
    equal(input, inputName) {
  
      let inputToCompare = document.getElementsByName(inputName)[0];
  
      let errorMessage = `Este campo precisa estar igual ao ${inputName}`;
  
      if(input.value != inputToCompare.value) {
        this.printMessage(input, errorMessage);
      }
    }
    
    // método para exibir inputs que são necessários
    required(input) {
  
      let inputValue = input.value;
  
      if(inputValue === '') {
        let errorMessage = `Este campo é obrigatório`;
  
        this.printMessage(input, errorMessage);
      }
  
    }
  
    // validando o campo de senha
    passwordvalidate(input) {
  
      // explodir string em array
      let charArr = input.value.split("");
  
      let uppercases = 0;
      let numbers = 0;
  
      for(let i = 0; charArr.length > i; i++) {
        if(charArr[i] === charArr[i].toUpperCase() && isNaN(parseInt(charArr[i]))) {
          uppercases++;
        } else if(!isNaN(parseInt(charArr[i]))) {
          numbers++;
        }
      }
  
      if(uppercases === 0 || numbers === 0) {
        let errorMessage = `A senha precisa um caractere maiúsculo e um número`;
  
        this.printMessage(input, errorMessage);
      }
  
    }
  
    // método para imprimir mensagens de erro
    printMessage(input, msg) {
    
      // checa os erros presentes no input
      let errorsQty = input.parentNode.querySelector('.error-validation');
  
      // imprimir erro só se não tiver erros
      if(errorsQty === null) {
        let template = document.querySelector('.error-validation').cloneNode(true);
  
        template.textContent = msg;
    
        let inputParent = input.parentNode;
    
        template.classList.remove('template');
    
        inputParent.appendChild(template);
      }
  
    }
  
    // remove todas as validações para fazer a checagem novamente
    cleanValidations(validations) {
      validations.forEach(el => el.remove());
    }
  
}

let form = document.getElementById('register-form'); 
let submit = document.getElementById('btn-submit');

form.addEventListener('submit', function (e) {
    e.preventDefault();

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
        console.log(localStorage)

        // Redirecionar o usuário para a página Nossos Produtos
        window.location.href = 'https://localhost:7039/index.html';
    })
    .catch((error) => {
        console.error('Erro:', error);
    });
});


//// Recupere o nome do usuário armazenado no localStorage
//let nomeUsuario = localStorage.getItem('nomeUsuario');

//// Verifique se o nome do usuário existe antes de exibi-lo
//if (nomeUsuario) {
//    // Encontre o elemento onde deseja exibir o nome do usuário e defina seu conteúdo como o nome do usuário
//    document.getElementById('nome-usuario').textContent = `Olá, ${nomeUsuario}!`;
//}




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

    // Obtenha os dados do formulário de login
    let email = document.getElementById('login-email').value;
    let senha = document.getElementById('login-password').value;

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
        //.then((data) => {
        //    console.log(data.token); // Access the token like this
        //    document.getElementById('nome-usuario').innerText = `Olá, ${ data.nome }`


        //.then((data) => {
        //    console.log(data); // Exibe o objeto data no console
        //    if (data && data.nome) {
        //        console.log(data.token); // Access the token like this
        //        document.getElementById('nome-usuario').innerText = `Olá, ${data.nome}`;

        //        // Redirecionar o usuário para a página principal após o login bem-sucedido
        //        window.location.href = 'https://localhost:7039/index.html';
        //    } else {
        //        console.error('O objeto de dados não contém a propriedade "nome".', data);
        //    }
        //})

        //.then((data) => {
        //    console.log(data); // Exibe o objeto data no console
        //    if (data && data.nome) {
        //        console.log(data.token); // Access the token like this

        //        // Salvar o nome do usuário no armazenamento local para exibir posteriormente
        //        localStorage.setItem('nomeUsuario', data.nome);

        //        // Atualize o conteúdo do nome do usuário no header
        //        //document.getElementById('nome-usuario').textContent = `Seja bem-vindo, ${data.nome}!`;

        //        // Não redirecione imediatamente, pois queremos exibir o nome do usuário primeiro
        //        window.location.href = 'https://localhost:7039/index.html';

        //        // Atualize o conteúdo do nome do usuário no header
        //        nomeUsuarioElement.textContent = `Seja bem-vindo, ${data.nome}!`;
        //    } else {
        //        console.error('O objeto de dados não contém a propriedade "nome".', data);
        //    }
    //});

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
        });


});






































// Realiza uma requisição GET para a rota da API de usuários
//fetch('http://localhost:5284/api/usuarios', {
//    method: 'GET',
//    headers: {
//        'Accept': 'application/json'
//    }
//})
//    .then(response => {
//        if (!response.ok) {
//            throw new Error('Erro ao obter os usuários da API');
//        }
//        return response.json();
//    })
//    .then(data => {
//        // Manipula os dados recebidos da API
//        console.log('Usuários:', data);
//    })
//    .catch(error => {
//        // Manipula os erros ocorridos durante a requisição
//        console.error('Erro:', error);
//    });


