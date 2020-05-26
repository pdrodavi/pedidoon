let cart = []; // carrinho
let modalQtd = 1;
let modalKey = 0;

const queryS = (el) => document.querySelector(el);
const querySA = (el) => document.querySelectorAll(el);

// listagem das pizzas no site e com modal
pizzaJson.map((item, index) => {
    let pizzaItem = queryS('.models .pizza-item').cloneNode(true);

    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

    pizzaItem.querySelector('a').addEventListener('click', (e) => {
        // quando clicar o a não atualize a tela previne a ação padrão
        e.preventDefault();
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalQtd = 1;
        // pra enviar a referência do item do modal ao evento adicionar carrinho
        modalKey = key;

        // preenchendo modal pelo id
        queryS('.pizzaBig img').src = pizzaJson[key].img;
        queryS('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        queryS('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        queryS('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
        queryS('.pizzaInfo--size.selected').classList.remove('selected');
        querySA('.pizzaInfo--size').forEach((size, sizeIndex) => {
            if (sizeIndex == 2) {
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });

        queryS('.pizzaInfo--qt').innerHTML = modalQtd;

        // fx
        queryS('.pizzaWindowArea').style.opacity = 0;
        queryS('.pizzaWindowArea').style.display = 'flex';
        setTimeout(() => {
            queryS('.pizzaWindowArea').style.opacity = 1;
        }, 200);
    });

    queryS('.pizza-area').append(pizzaItem);
});

// eventos do modal
function closeModal() {
    // fechar modal
    queryS('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() => {
        queryS('.pizzaWindowArea').style.display = 'none';
    }, 500);
}

// evento de click pra fechar modal
querySA('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) => {
    item.addEventListener('click', closeModal);
});

// evento de click para diminuir quantidade -
queryS('.pizzaInfo--qtmenos').addEventListener('click', () => {
    if (modalQtd > 1) {
        modalQtd--;
        queryS('.pizzaInfo--qt').innerHTML = modalQtd;
    }
});

// evento de click para aumentar quantidade +
queryS('.pizzaInfo--qtmais').addEventListener('click', () => {
    modalQtd++;
    queryS('.pizzaInfo--qt').innerHTML = modalQtd;
});

// evento add selected na opção de tamanho clicada
querySA('.pizzaInfo--size').forEach((size, sizeIndex) => {
    size.addEventListener('click', (e) => {
        queryS('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});

// evento adicionar ao carrinho
queryS('.pizzaInfo--addButton').addEventListener('click', () => {
    let size = parseInt(queryS('.pizzaInfo--size.selected').getAttribute('data-key'));
    let identifier = pizzaJson[modalKey].id + '@' + size;
    let key = cart.findIndex((item) => item.identifier == identifier);
    if (key > -1) {
        cart[key].qtd += modalQtd;
    } else {
        cart.push({
            identifier,
            id: pizzaJson[modalKey].id,
            size: size,
            qtd: modalQtd
        });
    }
    updateCart();
    closeModal();
});

// abrir carrinho mobile
queryS('.menu-openner').addEventListener('click', () => {
    if (cart.length > 0) {
        queryS('aside').style.left = '0';
    }
});

// fechar carrinho mobile
queryS('.menu-closer').addEventListener('click', () => {
    queryS('aside').style.left = '100vw';
});

// atualizar carrinho - mostrar carrinho ou fechar
function updateCart() {
    queryS('.menu-openner span').innerHTML = cart.length;

    if (cart.length > 0) {
        queryS('aside').classList.add('show');
        queryS('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for (let i in cart) {
            let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);

            subtotal += pizzaItem.price * cart[i].qtd;

            let cartItem = queryS('.models .cart--item').cloneNode(true);
            let pizzaSizeName;

            switch (cart[i].size) {
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2:
                    pizzaSizeName = 'G';
                    break;
            }

            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qtd;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if (cart[i].qtd > 1) {
                    cart[i].qtd--;
                } else {
                    cart.splice(i, 1);
                }
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].qtd++;
                updateCart();
            });

            queryS('.cart').append(cartItem);
        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        queryS('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        queryS('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        queryS('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

    } else {
        queryS('aside').classList.remove('show');
        queryS('aside').style.left = '100vw';
    }
}