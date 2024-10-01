let tabela;
let resize = false
let widthTabela;

window.addEventListener("DOMContentLoaded", async () => {
    await carregaItensEstoque();

    renderizaDataTable()

    iniciarFuncionalidadePesquisa()

    handleRefreshButtonClick();

    renderCharts();
})

async function obterProdutosDaAPI() {
    try {
        const URL = 'http://localhost:5284/api/produtos';
        const response = await fetch(URL, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            },
            mode: 'cors'
        });

        if (!response.ok) {
            throw new Error('Erro ao obter os produtos da API');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro:', error);
        throw error;
    }
}

async function criarProduto(produto) {
    try {
        const URL = 'http://localhost:5284/api/produtos';
        const response = await fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nome: produto.nome,
                categoria: produto.categoria,
                dataProducao: produto.dataProducao,
                preco: produto.preco,
                quantidade: produto.quantidade
            })
        });

        if (!response.ok) {
            throw new Error(`Erro na requisição para ${URL}`);
        }

        const novoProduto = await response.json();
        return novoProduto;

    } catch (error) {
        console.error(error);
    }
}

async function deletarProduto(id) {
    try {
        const URL = 'http://localhost:5284/api/produtos/' + id;
        const response = await fetch(URL, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Erro na requisição para ${URL}`);
        }

        // Se a exclusão for bem-sucedida, recarregue os itens de estoque na tabela
        await carregaItensEstoque();

        // Exiba uma mensagem de sucesso
        showSuccessAlert('Produto excluído com sucesso!');
    } catch (error) {
        console.error(error);
        // Em caso de erro, exiba uma mensagem de erro
        chamaAlert('alert-danger', 'Erro ao excluir o produto!');
    }
}

function chamaAlert(classe, mensagem) {
    // Criar elemento de alerta
    const alertElement = $('<div class="alert ' + classe + '" role="alert">' + mensagem + '</div>');

    // Adicionar o elemento de alerta ao corpo do documento
    $('body').append(alertElement);

    // Remover o elemento de alerta após um período de tempo (por exemplo, 5 segundos)
    setTimeout(function () {
        alertElement.fadeOut('slow', function () {
            $(this).remove();
        });
    }, 5000);
}

async function carregaItensEstoque() {
    try {
        const dataProdutos = await obterProdutosDaAPI(); 
        console.log(dataProdutos);
        await renderizaTabelaItens(dataProdutos);
        renderizaDataTable();
        handleResize();
    } catch (error) {
        chamaAlert('alert-danger', 'Problemas ao carregar o painel!');
    }
}

async function renderizaTabelaItens(dataProdutos) {
    if ($.fn.DataTable.isDataTable('#productsDatatable')) {
        $('#productsDatatable').DataTable().destroy();
    }

    tabela = $('#productsDatatable').DataTable({

        dom: 'Bfrtip',  
        buttons: [
            'copy', 'csv', 'excel', 'pdf', 'print'  
        ],


        "data": dataProdutos,
        "columns": [


            { "data": "nome" },
            { "data": "categoria" },
            {
                "data": "dataProducao",
                "render": function (data) {
                    let dataFormatada = new Date(data).toLocaleDateString('pt-BR');
                    return dataFormatada;
                }
            },
            {
                "data": "preco",
                "className": "text-center",
            },
            {
                "data": "quantidade",
                "className": "text-center",
            },
            {
                "data": "status",
                "className": "text-center",
                "render": function (data, type, row) {
                    let badgeClass;
                    switch (data) {
                        case 'Estoque alto':
                            badgeClass = 'bg-success';
                            break;
                        case 'Estoque médio':
                            badgeClass = 'bg-warning';
                            break;
                        case 'Estoque baixo':
                            badgeClass = 'bg-danger';
                            break;
                        default:
                            badgeClass = 'bg-secondary';
                            break;
                    }
                    return '<span class="badge ' + badgeClass + '">' + data + '</span>';
                }
            },

            {
                "data": null,
                "className": "text-center",
                "render": function (data, type, row) {
                    return '<td class="table-action">' +
                        '<a href="javascript:void(0);" class="action-icon" style="margin: 0 5px;"><i class="mdi mdi-eye"></i></a>' +
                        '<a href="javascript:void(0);" class="action-icon" style="margin: 0 5px;" onclick="abrirModalEdicao(' + row.id + ')"><i class="mdi mdi-square-edit-outline"></i></a>' +
                        '<a href="javascript:void(0);" class="action-icon" onclick="deletarProduto(' + row.id + ')"><i class="mdi mdi-delete"></i></a>' +
                        '</td>';
                }
            }


        ],
        "language": {
            "sInfo": "Mostrando de _START_ até _END_ de _TOTAL_ registros",
            "searchPlaceholder": ""
        },
        "responsive": resize == false ? false : true,
        "paging": true,
        "pageLength": 30,
        "renderer": "bootstrap",
        "searching": true,
        "lengthChange": false,
        "ordering": false,
        "scrollY": resize == false ? (window.innerHeight - 320) : false,
        "scrollCollapse": true,
        "autoWidth": true,
        "initComplete": function () {
            widthTabela = document.getElementById('productsDatatable').offsetWidth;
        }
        
       
    });

    tabela.clear().rows.add(dataProdutos).draw();
//    widthTabela = document.getElementById('productsDatatable').offsetWidth;  
}


function handleResize() {
    let productsDatatable = document.getElementById('productsDatatable');

    if (productsDatatable) {
        let widthAtual = productsDatatable.offsetWidth;

        if (widthAtual !== widthTabela) {
            // Se a largura atual for diferente da largura anterior, redesenha a tabela
            tabela.draw()
            widthTabela = widthAtual;
        } else {
            // Se a largura não mudou, verifica se é necessário atualizar a tabela em resposta a uma mudança de tamanho da janela
            if (window.innerWidth <= 1024 && !resize) {
                resize = true;
                // Recarrega a tabela apenas se necessário
                carregaItensEstoque();
            } else if (window.innerWidth > 1024 && resize) {
                resize = false;
                // Recarrega a tabela apenas se necessário
                carregaItensEstoque();
            }
        }
    }
}


function renderizaDataTable() {
    window.addEventListener('resize', handleResize);
    handleResize();
}

function iniciarFuncionalidadePesquisa() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', function () {
        const searchTerm = this.value;
        tabela.search(searchTerm).draw();
    });
    
}

function showSuccessAlert(message) {
    const alertElement = document.createElement('div');
    alertElement.classList.add('alert', 'alert-success', 'mt-2', 'position-fixed', 'w-100', 'text-center', 'p-2');
    alertElement.setAttribute('role', 'alert');
    alertElement.style.maxWidth = "400px";
    alertElement.style.top = "80px";
    alertElement.style.left = "50%";
    alertElement.style.transform = "translateX(-50%)";
    alertElement.style.paddingLeft = "10px"; 
    alertElement.textContent = message;
    document.body.appendChild(alertElement); 
    setTimeout(function () {
        alertElement.remove();
    }, 4000);
}

function handleRefreshButtonClick() {
    document.getElementById('btnRefresh').addEventListener('click', async function () {
        try {
            await carregaItensEstoque(); 
            showSuccessAlert('Operação realizada com sucesso!');
        } catch (error) {
            console.error('Erro ao atualizar a tabela:', error);
            chamaAlert('alert-danger', 'Erro ao atualizar a tabela!');
        }
    });
}


document.getElementById('btnNovoProduto').addEventListener('click', (e) => {
    e.preventDefault();
    // Abra o modal
    //document.getElementById('modalNovoProduto').setAttribute('data-modal-criacao', "true");
    document.getElementById('modalTituloProduto').innerHTML = 'Entrada de Produto...';
    $('#modalNovoProduto').modal('show');
});

$('#btnFecharModal').click(function () {
    $('#modalNovoProduto').modal('hide');
});


let formNovoProduto = document.getElementById('formNovoProduto');
let nomeProdutoInput = document.getElementById('nomeProduto');
let categoriaProdutoInput = document.getElementById('categoriaProduto');
let dataProducaoInput = document.getElementById('dataProducao');
let precoProdutoInput = document.getElementById('precoProduto');
let quantidadeProdutoInput = document.getElementById('quantidadeProduto');

document.getElementById('btnSalvarNovoProduto').addEventListener('click', async () => {
    highlightRequiredFields();

    if (formNovoProduto.checkValidity()) {

        //let dataProducaoDate = new Date(dataProducaoInput.value);
        //let dataProducaoFormatted = dataProducaoDate.toLocaleDateString('pt-BR');

        // Extrair o valor do campo de data
        let dataProducaoValue = dataProducaoInput.value;

        // Criar um novo objeto DateTime
        let dataProducaoDate = new Date(dataProducaoValue);

        // Converter a data para o formato ISOString
        let dataProducaoISOString = dataProducaoDate.toISOString();

        const produto = {
            nome: nomeProdutoInput.value,
            categoria: categoriaProdutoInput.value,
            dataProducao: dataProducaoISOString, 
            preco: parseFloat(precoProdutoInput.value),
            quantidade: parseInt(quantidadeProdutoInput.value)
        };

        console.log("Produto object:", produto); 
        try {
            const novoProduto = await criarProduto(produto);
            console.log(novoProduto);

            // Close the modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('modalNovoProduto').closest('.modal'));
            modal.hide();         

            clearFormFields();
            await carregaItensEstoque();
        } catch (error) {
            console.error(error);
        }
    }
});


function highlightRequiredFields() {
    const requiredFields = formNovoProduto.querySelectorAll('[required]');

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('highlighted');
        } else {
            field.classList.remove('highlighted');
        }
    });
}

function clearFormFields() {
    nomeProdutoInput.value = '';
    categoriaProdutoInput.value = '';
    dataProducaoInput.value = '';
    precoProdutoInput.value = '';
    quantidadeProdutoInput.value = '';
}


// Adiciona manipuladores de eventos aos campos do formulário
nomeProdutoInput.addEventListener('input', updateHighlight);
categoriaProdutoInput.addEventListener('input', updateHighlight);
dataProducaoInput.addEventListener('input', updateHighlight);
precoProdutoInput.addEventListener('input', updateHighlight);
quantidadeProdutoInput.addEventListener('input', updateHighlight);

// Função para atualizar o destaque
function updateHighlight() {
    if (this.value.trim()) {
        this.classList.remove('highlighted');
    } else {
        this.classList.add('highlighted');
    }
}

async function abrirModalEdicao(produtoId) {
    try {
        const URL = `http://localhost:5284/api/produtos/${produtoId}`;
        const response = await fetch(URL, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            },
            mode: 'cors'
        });

        if (!response.ok) {
            throw new Error('Erro ao obter os detalhes do produto da API');
        }

        const produto = await response.json();

        document.getElementById('editNomeProduto').value = produto.nome;
        document.getElementById('editCategoriaProduto').value = produto.categoria;
        document.getElementById('editDataProducao').value = produto.dataProducao;
        document.getElementById('editPrecoProduto').value = produto.preco;
        document.getElementById('editQuantidadeProduto').value = produto.quantidade;

        document.getElementById('btnSalvarEdicaoProduto').dataset.produtoId = produtoId;


        // Abrir o modal de edição
        $('#modalEdicaoProduto').modal('show');
    } catch (error) {
        console.error('Erro ao abrir o modal de edição:', error);
        chamaAlert('alert-danger', 'Erro ao abrir o modal de edição do produto!');
    }
}


function salvarAlteracoesProduto() {
    let productId = document.getElementById('btnSalvarEdicaoProduto').dataset.produtoId;

    try {
        const updatedProduct = {
            nome: document.getElementById('editNomeProduto').value,
            categoria: document.getElementById('editCategoriaProduto').value,
            dataProducao: document.getElementById('editDataProducao').value,
            preco: document.getElementById('editPrecoProduto').value,
            quantidade: document.getElementById('editQuantidadeProduto').value
        };

        fetch(`http://localhost:5284/api/produtos/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedProduct)
        }).then(() => {
            carregaItensEstoque();

            // Close the update modal
            $('#modalEdicaoProduto').modal('hide');

            // Show success message
            showSuccessAlert('Produto atualizado com sucesso!');
        });
    } catch (error) {
        console.error(error);
        // Show error message
        chamaAlert('alert-danger', 'Erro ao atualizar o produto!');
    }
}

document.getElementById('btnSalvarEdicaoProduto').addEventListener('click', function () {
    salvarAlteracoesProduto();
});




////shopping cart
//const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
//addToCartButtons.forEach(button => {
//    button.addEventListener('click', () => {
//        const row = button.closest('tr');
//        const id = row.dataset.id;
//        const quantidade = row.querySelector('.qty-input').value;
//        const preco = parseFloat(row.querySelector('td:nth-child(2)').innerText.replace('R$ ', ''));

//        comprarProduto(id, quantidade, preco);
//    });
//});

//async function comprarProduto(id, quantidade, preco) {
//    const detalhesCompra = {
//        ProdutoId: id,
//        Quantidade: quantidade,
//        Preco: preco
//    };

//    try {
//        const response = await fetch('/api/produtos/comprar', {
//            method: 'POST',
//            headers: {
//                'Content-Type': 'application/json'
//            },
//            body: JSON.stringify(detalhesCompra)
//        });

//        if (!response.ok) {
//            throw new Error('Erro ao comprar o produto.');
//        }

//        const data = await response.json();
//        console.log('Compra realizada com sucesso:', data);

//        atualizarCarrinho(detalhesCompra);
//    } catch (error) {
//        console.error('Erro ao comprar o produto:', error);
//    }
//}

//function atualizarCarrinho(detalhesCompra) {
//    // Update the cart UI or navigate to the cart page
//    const cart = document.getElementById('cart');
//    const cartItem = document.createElement('li');
//    cartItem.innerText = `Produto: ${detalhesCompra.Preco}, Quantidade: ${detalhesCompra.Quantidade}, Total: ${detalhesCompra.Preco * detalhesCompra.Quantidade}`;
//    cart.appendChild(cartItem);

//    // Alternatively, you can navigate to the cart page
//    // window.location.href = '/carrinho';
//}


async function renderCharts() {
    try {
        const dataProdutos = await obterProdutosDaAPI();

        const stockLevelData = dataProdutos.reduce((acc, produto) => {
            acc.labels.push(produto.nome);
            acc.data.push(produto.quantidade);
            return acc;
        }, { labels: [], data: [] });

        const ctxStockLevel = document.getElementById('stockLevelChart').getContext('2d');
        new Chart(ctxStockLevel, {
            type: 'bar',
            data: {
                labels: stockLevelData.labels,
                datasets: [{
                    label: 'Níveis de Estoque',
                    data: stockLevelData.data,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Placeholder for sales data chart
        const salesData = {
            labels: ['Produto A', 'Produto B', 'Produto C'],
            datasets: [{
                label: 'Vendas',
                data: [120, 150, 180],
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1
            }]
        };

        const ctxSales = document.getElementById('salesChart').getContext('2d');
        new Chart(ctxSales, {
            type: 'line',
            data: salesData,
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

    } catch (error) {
        console.error('Erro ao carregar dados para os gráficos:', error);
    }
}

function handleExportButtonClick() {
    document.getElementById('exportData').addEventListener('click', () => {
        tabela.button('.buttons-excel').trigger();
    });
}