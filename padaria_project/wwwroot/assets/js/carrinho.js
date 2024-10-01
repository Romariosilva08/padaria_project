let totalAmount = 0; // Valor total dos produtos
// let discount = 0; // Valor do desconto, se aplicável
// let deliveryFee = 0; // Taxa de entrega, se aplicável



document.addEventListener('DOMContentLoaded', () => {
    carregarProdutos();
    iniciarFuncionalidadeCarrinho();
});


async function carregarProdutos() {
    try {
        const response = await fetch('http://localhost:5284/api/produtos');
        if (!response.ok) {
            throw new Error('Erro ao carregar produtos.');
        }
        const produtos = await response.json();
        const tableBody = document.getElementById('cartTableBody');

        produtos.forEach(produto => {
            const row = document.createElement('tr');
            row.classList.add('product-row');
            row.dataset.productId = produto.id;

            row.innerHTML = `
                <td>
                    <p class="m-0 d-inline-block align-middle font-16">
                        <a href="#" class="text-body">${produto.nome}</a>
                    </p>
                </td>
                <td>R$ ${produto.preco.toFixed(2).replace('.', ',')}</td>
                <td>
                    <input type="number" min="0" value="0" class="form-control qty-input" placeholder="Qty" style="width: 90px;">
                </td>
                <td class="total">R$ ${produto.preco.toFixed(2).replace('.', ',')}</td>
                <td>
                    <div class="btn-container">
                        <button class="btn btn-small btn-add-to-cart add-to-cart-btn">
                            <i class="bi bi-cart-plus"></i> Adicionar
                        </button>
                        <button class="btn btn-small btn-remove">
                            <i class="bi bi-trash"></i> Remover
                        </button>
                    </div>
                </td>
            `;

            tableBody.appendChild(row);
        });

        iniciarFuncionalidadeCarrinho();

    } catch (error) {
        console.error('Erro ao carregar os produtos:', error);
        alert('Houve um problema ao carregar os produtos. Tente novamente.');
    }
}

function adicionarAoCarrinho(id, quantidade, preco, nome) {
    const detalhesCompra = {
        ProdutoId: id,
        Quantidade: quantidade,
        Nome: nome
    };

    comprarProduto(id, detalhesCompra, preco * quantidade); 
}

async function comprarProduto(id, detalhesCompra, total) {
    try {
        const response = await fetch(`http://localhost:5284/api/produtos/comprar/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(detalhesCompra)
        });

        if (!response.ok) {
            throw new Error('Erro ao comprar o produto.');
        }

        const data = await response.json();
        console.log('Produto comprado com sucesso:', data);
        atualizarCarrinho(detalhesCompra, total);
        atualizarResumoPedido(); 
    } catch (error) {
        console.error('Erro ao comprar o produto:', error);
        alert('Houve um problema ao adicionar o produto ao carrinho. Tente novamente.');
    }
}

function atualizarCarrinho(detalhesCompra, total) {
    const cart = document.getElementById('cart');
    if (cart) {
        const cartItem = document.createElement('li');
        cartItem.innerText = `Produto: ${detalhesCompra.Nome}, Quantidade: ${detalhesCompra.Quantidade}, Total: R$ ${(total).toFixed(2).replace('.', ',')}`;
        cart.appendChild(cartItem);
        totalAmount += total; 
        console.log('Total Amount Atualizado:', totalAmount);
    }
}

function atualizarResumoPedido() {
    console.log('Atualizando o resumo do pedido com:', {
        totalAmount: totalAmount,
        // discount: discount, // Comentado para não usar desconto
        // deliveryFee: deliveryFee, // Comentado para não usar taxa de entrega
        finalAmount: totalAmount 
    });

    const totalAmountElement = document.getElementById('totalAmount');
    const finalAmountElement = document.getElementById('finalAmount');

    if (totalAmountElement && finalAmountElement) {
        // const finalAmount = totalAmount - discount + deliveryFee; // Comentado para não usar desconto e taxa de entrega
        const finalAmount = totalAmount; // Ajustado para mostrar apenas o valor total

        totalAmountElement.innerText = `R$ ${totalAmount.toFixed(2).replace('.', ',')}`;
        finalAmountElement.innerText = `R$ ${finalAmount.toFixed(2).replace('.', ',')}`; // Ajustado para mostrar apenas o valor total
    } else {
        console.error('Elementos para atualização do resumo do pedido não encontrados.');
    }
}

function iniciarFuncionalidadeCarrinho() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const row = button.closest('tr');
            const id = row.dataset.productId;
            const nome = row.querySelector('a.text-body').innerText;
            const quantidade = parseInt(row.querySelector('.qty-input').value, 10);
            const preco = parseFloat(row.querySelector('td:nth-child(2)').innerText.replace('R$ ', '').replace(',', '.'));

            if (quantidade > 0) {
                adicionarAoCarrinho(id, quantidade, preco, nome);
            } else {
                alert('A quantidade deve ser maior que 0 para adicionar ao carrinho.');
            }
        });
    });

}
