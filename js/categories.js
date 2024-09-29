//поиск
var lastResFind = ""; // последний удачный результат
var copy_page = ""; // копия страницы в исходном виде

function TrimStr(s) {
    s = s.replace(/^\s+/g, '');
    return s.replace(/\s+$/g, '');
}

function FindOnPage(inputId) { //ищет текст на странице, в параметр передается ID поля для ввода
    var obj = window.document.getElementById(inputId);
    var textToFind;

    if (obj) {
        textToFind = TrimStr(obj.value); //обрезаем пробелы
    } else {
        alert("Введенная фраза не найдена");
        return;
    }
    if (textToFind == "") {
        alert("Вы ничего не ввели");
        return;
    }

    var pattern = new RegExp(textToFind, "gi");

    if (!pattern.test(document.body.innerHTML)) {
        alert("Ничего не найдено, проверьте правильность ввода!");
        return;
    }

    if (copy_page.length > 0) {
        document.body.innerHTML = copy_page;
    } else {
        copy_page = document.body.innerHTML;
    }

    document.body.innerHTML = document.body.innerHTML.replace(eval("/name=" + lastResFind + "/gi"), " "); //стираем предыдущие якори для скрола
    document.body.innerHTML = document.body.innerHTML.replace(pattern, "<a class='highlighted' name=" + textToFind + ">" + textToFind + "</a>"); //Заменяем найденный текст ссылками с якорем;
    lastResFind = textToFind; // сохраняем фразу для поиска, чтобы в дальнейшем по ней стереть все ссылки

    // Найти элемент с именем, соответствующим найденному тексту, и прокрутить его в видимую область
    var targetElement = document.querySelector("[name='" + textToFind + "']");
    if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}


//   //меню
//   function toggleMenu() {
//     var submenu = document.querySelector('.submenu');
//     submenu.style.display = (submenu.style.display === 'block') ? 'none' : 'block';
// }

//избранное на карточке
function toggleFavorite(button) {
  button.classList.toggle('favorited');
}





//избранное и корзина
// Отладочные сообщения
console.log('Script is loaded');

let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Получение элементов
const favoriteButton = document.getElementById('favorite-button');
const favoriteCount = document.getElementById('favorite-count');
const favoriteList = document.querySelector('#favorite-list tbody');
const favoritesModal = document.getElementById('favorites-modal');
const favoritesClose = document.getElementById('favorites-close');

const cartButton = document.getElementById('cart-button');
const cartCount = document.getElementById('cart-count');
const cartList = document.querySelector('#cart-list tbody');
const cartModal = document.getElementById('cart-modal');
const cartClose = document.getElementById('cart-close');

// Функции для работы с localStorage
function saveFavorites() {
    console.log('Saving favorites:', favorites);
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

function saveCart() {
    console.log('Saving cart:', cart);
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Функции для обновления списка избранного
function updateFavoriteList() {
    console.log('Updating favorite list:', favorites);
    if (favoriteList) {
        favoriteList.innerHTML = '';
        favorites.forEach(product => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><img src="${product.image}" alt="${product.name}" class="favorite-product-image"></td>
                <td>${product.name}</td>
                <td>${product.price}</td>
                <td>${product.stock}</td>
                <td>
                    <button class="add-to-cart" onclick="addToCartFromFavorites('${product.id}')">Добавить в корзину</button>
                    <button class="remove-from-favorites" onclick="removeFromFavorites('${product.id}')">Удалить</button>
                </td>
            `;
            favoriteList.appendChild(tr);
        });
    }
}

// Функции для обновления списка корзины
function updateCartList() {
    console.log('Updating cart list:', cart);
    if (cartList) {
        cartList.innerHTML = '';
        cart.forEach(product => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><img src="${product.image}" alt="${product.name}" class="cart-product-image"></td>
                <td>${product.name}</td>
                <td class="cart-item-price">${product.price}</td>
                <td>
                    <button class="quantity-change" onclick="changeQuantity('${product.id}', -1)">-</button>
                    <span class="cart-item-quantity">${product.quantity}</span>
                    <button class="quantity-change" onclick="changeQuantity('${product.id}', 1)">+</button>
                </td>
                <td>
                    <button class="remove-from-cart" onclick="removeFromCart('${product.id}')">Удалить</button>
                </td>
            `;
            cartList.appendChild(tr);
        });
        updateTotalPrice();
    }
}

// Функция для обновления общей цены корзины
function updateTotalPrice() {
    let totalPrice = 0;
    cart.forEach(product => {
        const price = parseFloat(product.price.replace('руб.', '').replace('₽', '').replace(',', '.'));
        totalPrice += price * product.quantity;
    });
    const totalPriceElement = document.getElementById('total-price');
    if (totalPriceElement) {
        totalPriceElement.innerText = totalPrice.toFixed(2) + ' ₽';
    }
}

// Функция для обработки клика по кнопке "Избранное"
function toggleFavorite(button) {
    const productCard = button.closest('.product-card');
    const productId = productCard.getAttribute('data-id');
    const product = {
        id: productId,
        discount: productCard.querySelector('.discount')?.innerText,
        image: productCard.querySelector('img').src,
        category: productCard.querySelector('.category').innerText,
        name: productCard.querySelector('.name').innerText,
        price: productCard.querySelector('.discounted-price')?.innerText ||
               productCard.querySelector('.original-price')?.innerText ||
               productCard.querySelector('.original-prices')?.innerText,
        stock: productCard.getAttribute('data-stock')
    };

    const index = favorites.findIndex(item => item.id === productId);

    if (index > -1) {
        favorites.splice(index, 1);
        button.querySelector('i').classList.remove('active');
    } else {
        favorites.push(product);
        button.querySelector('i').classList.add('active');
    }

    if (favoriteCount) {
        favoriteCount.innerText = favorites.length;
    }
    updateFavoriteList();
    saveFavorites();
}

// Функция для удаления товара из избранного
function removeFromFavorites(productId) {
    favorites = favorites.filter(item => item.id !== productId);
    const productCard = document.querySelector(`.product-card[data-id="${productId}"] .add-to-favorites i`);
    if (productCard) {
        productCard.classList.remove('active');
    }
    if (favoriteCount) {
        favoriteCount.innerText = favorites.length;
    }
    updateFavoriteList();
    saveFavorites();
}

// Функция для обработки клика по кнопке "Корзина"
function toggleCart(button) {
    const productCard = button.closest('.product-card');
    const productId = productCard.getAttribute('data-id');
    const product = {
        id: productId,
        image: productCard.querySelector('img').src,
        name: productCard.querySelector('.name').innerText,
        price: productCard.querySelector('.discounted-price')?.innerText ||
               productCard.querySelector('.original-price')?.innerText ||
               productCard.querySelector('.original-prices')?.innerText,
        quantity: 1
    };

    const index = cart.findIndex(item => item.id === productId);

    if (index > -1) {
        cart[index].quantity += 1;
    } else {
        cart.push(product);
    }

    if (cartCount) {
        cartCount.innerText = cart.length;
    }
    updateCartList();
    saveCart();
}

// Функция для добавления товара из избранного в корзину
function addToCartFromFavorites(productId) {
    console.log('Adding to cart from favorites:', productId);
    const product = favorites.find(item => item.id === productId);
    if (product) {
        toggleCart(document.querySelector(`.product-card[data-id="${productId}"] .add-to-cart`));
    } else {
        console.error('Product not found in favorites:', productId);
    }
}

// Функция для изменения количества товара в корзине
function changeQuantity(productId, delta) {
    const index = cart.findIndex(item => item.id === productId);
    if (index > -1) {
        cart[index].quantity += delta;
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
    }
    updateCartList();
    saveCart();
    updateTotalPrice();
}

// Функция для удаления товара из корзины
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    if (cartCount) {
        cartCount.innerText = cart.length;
    }
    updateCartList();
    saveCart();
    updateTotalPrice();
}

// Функция для покупки товаров
function buyItems() {
    alert('Оплата произведена, теперь у вас нет денег и нет товара 🤡');
    cart = [];
    if (cartCount) {
        cartCount.innerText = cart.length;
    }
    updateCartList();
    saveCart();
    updateTotalPrice();
    toggleCartModal();
}

// Функция для переключения видимости модального окна
function toggleModal(modal) {
    modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
}

// Инициализация модальных окон
function initializeModals() {
    if (favoriteButton) {
        favoriteButton.addEventListener('click', () => toggleModal(favoritesModal));
    }
    if (favoritesClose) {
        favoritesClose.addEventListener('click', () => toggleModal(favoritesModal));
    }
    if (cartButton) {
        cartButton.addEventListener('click', () => toggleModal(cartModal));
    }
    if (cartClose) {
        cartClose.addEventListener('click', () => toggleModal(cartModal));
    }

    window.addEventListener('click', function(event) {
        if (event.target === favoritesModal) {
            toggleModal(favoritesModal);
        }
        if (event.target === cartModal) {
            toggleModal(cartModal);
        }
    });
}

// Инициализация страницы
function initializePage() {
    if (favoriteCount) {
        favoriteCount.innerText = favorites.length;
    }
    if (cartCount) {
        cartCount.innerText = cart.length;
    }
    updateFavoriteList();
    updateCartList();
    updateTotalPrice();

    // Обновление состояния кнопок на карточках товаров при загрузке страницы
    document.querySelectorAll('.product-card').forEach(card => {
        const productId = card.getAttribute('data-id');
        if (favorites.find(item => item.id === productId)) {
            card.querySelector('.add-to-favorites i').classList.add('active');
        }
        // Убедитесь, что вы добавили необходимые изменения для корзины, если это необходимо
    });
}

// Событие DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
    initializePage();
    initializeModals();
});




document.getElementById('favorite-button').addEventListener('click', function() {
    window.location.href = 'favorites.html';
});
document.getElementById('account-button').addEventListener('click', function() {
    window.location.href = 'account.html';
});


//личный кабинет, управление отображением форм
document.getElementById('account-button').addEventListener('click', function() {
    window.location.href = 'account.html';
});

document.addEventListener('DOMContentLoaded', function() {
    const userInfo = document.getElementById('user-info');
    const registrationForm = document.getElementById('registration-form');
    const loginForm = document.getElementById('login-form');

    // Проверка, авторизован ли пользователь
    fetch('check_session.php')
        .then(response => response.json())
        .then(data => {
            if (data.logged_in) {
                userInfo.style.display = 'block';
                registrationForm.style.display = 'none';
                loginForm.style.display = 'none';

                document.getElementById('user_name').value = data.name;
                document.getElementById('user_dob').value = data.dob;
                document.getElementById('user_address').value = data.address;
                document.getElementById('user_email').value = data.email;
            } else {
                userInfo.style.display = 'none';
                registrationForm.style.display = 'block';
                loginForm.style.display = 'block';
            }
        });
});





//навигация
document.addEventListener('DOMContentLoaded', function() {
    const cardsPerRow = 4; // Количество карточек в ряду
    const rowsPerPage = 3; // Количество рядов на странице
    let currentPage = parseInt(getQueryParam('page') || '1', 10);
    const cardsContainer = document.getElementById('cards-container');
    const cards = Array.from(cardsContainer.getElementsByClassName('product-card'));
    const totalCards = cards.length;
    const totalPages = Math.ceil(totalCards / (rowsPerPage * cardsPerRow));

    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    function setQueryParam(param, value) {
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set(param, value);
        window.history.replaceState(null, '', '?' + urlParams.toString());
    }

    function displayCards() {
        const startIndex = (currentPage - 1) * rowsPerPage * cardsPerRow;
        const endIndex = Math.min(startIndex + rowsPerPage * cardsPerRow, totalCards);

        cards.forEach((card, index) => {
            card.style.display = (index >= startIndex && index < endIndex) ? 'block' : 'none';
        });

        updatePageInfo(startIndex + 1, endIndex, totalCards);
        updatePaginationButtons();
    }

    function updatePaginationButtons() {
        const prevButton = document.getElementById('prev-page');
        const nextButton = document.getElementById('next-page');

        prevButton.classList.toggle('disabled', currentPage === 1);
        nextButton.classList.toggle('disabled', currentPage === totalPages);
    }

    function updatePageInfo(start, end, total) {
        const pageInfo = document.getElementById('page-info');
        pageInfo.textContent = `Отображение ${start}–${end} из ${total}`;
    }

    function setupPagination() {
        const prevButton = document.getElementById('prev-page');
        const nextButton = document.getElementById('next-page');

        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                setQueryParam('page', currentPage);
                displayCards();
            }
        });

        nextButton.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                setQueryParam('page', currentPage);
                displayCards();
            }
        });
    }

    function savePageState() {
        setQueryParam('page', currentPage);
    }

    displayCards();
    setupPagination();

    // Сброс страницы на первую при смене категории
    document.querySelectorAll('.category-link').forEach(link => {
        link.addEventListener('click', () => {
            const newCategory = link.getAttribute('data-category');
            if (currentCategory !== newCategory) {
                currentCategory = newCategory;
                currentPage = 1; // Сброс на первую страницу при смене категории
                savePageState();
                window.location.reload(); // Перезагружаем страницу для применения изменений
            }
        });
    });

    // Инициализация
    savePageState();
});





        // Отображение модального окна
function showModal() {
    const modal = document.getElementById('myModal');
    modal.style.display = 'block';
  }
  
// Отображение модального окна
function showModal() {
    const modal = document.getElementById('myModal');
    modal.style.display = 'block';
  }
  
  // Закрытие модального окна при клике вне его
  window.onclick = function(event) {
    const modal = document.getElementById('myModal');
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  }
  
  // Закрытие модального окна при клике на крестик
  function closeModal() {
    const modal = document.getElementById('myModal');
    modal.style.display = 'none';
  }
  
  // Переадресация на WhatsApp
  function redirectToWhatsApp() {
    window.location.href = 'https://wa.me/номер_WhatsApp';
  }
  
  // Переадресация на Telegram
  function redirectToTelegram() {
    window.location.href = 'https://t.me/Calm_the_loony';
  }
  
  // Инициирование звонка
  function makePhoneCall() {
    window.location.href = 'tel:+9614277510';
  }
  
  
// Обработка кликов на карточках товаров
document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', function(event) {
            // Проверяем, если клик был по кнопке добавления в корзину или избранное
            if (event.target.closest('.add-to-favorites') || event.target.closest('.add-to-cart')) {
                return; // Не открываем карточку товара
            }

            // Создаем объект с информацией о товаре
            const product = {
                image: this.querySelector('img').src,
                name: this.querySelector('.name').innerText || "Название не указано",
                price: this.querySelector('.discounted-price') ? 
                        this.querySelector('.discounted-price').innerText : 
                        this.querySelector('.original-prices')?.innerText || "Цена не указана",
                availability: this.dataset.stock || "Нет данных",
                article: (this.querySelector('.product-info .article')?.innerText.split(': ')[1]) || "Артикул не указан",
                category: this.querySelector('.category').innerText || "Категория не указана",
                tags: (this.querySelector('.product-info .tags')?.innerText.split(': ')[1]) || "Метки не указаны",
                dimensions: (this.querySelector('.product-info .dimensions')?.innerText.split(': ')[1]) || "Габариты не указаны",
                weight: (this.querySelector('.product-info .weight')?.innerText.split(': ')[1]) || null,
                additional: (this.querySelector('.product-info .extra')?.innerText.split(': ')[1]) || "Доп. комплект не указан",
                description: (this.querySelector('.product-info .description')?.innerText.split(': ')[1]) || null
            };

            // Сохраняем информацию о товаре в localStorage
            localStorage.setItem('selectedProduct', JSON.stringify(product));

            // Перенаправляем на страницу товара
            window.location.href = 'product.html';
        });
    });
});

// Обработка страницы товара
document.addEventListener("DOMContentLoaded", function() {
    // Получаем информацию о товаре из localStorage
    const product = JSON.parse(localStorage.getItem('selectedProduct'));

    if (product) {
        // Заполняем информацию на странице товара
        document.getElementById('product-image').src = product.image || "";
        document.getElementById('product-name').innerText = product.name || "Без названия";
        document.getElementById('product-price').innerText = product.price || "Цена не указана";
        document.getElementById('product-availability').innerText = `На складе: ${product.availability || "Нет данных"}`;
        document.getElementById('product-sku').innerText = product.article || "Артикул не указан";
        document.getElementById('product-category').innerText = product.category || "Категория не указана";
        document.getElementById('product-tags').innerText = product.tags || "Метки не указаны";

        // Отображаем доп. комплект
        document.getElementById('product-additional').innerText = `Доп. комплект: ${product.additional || "Доп. комплект не указан"}`;

        // Отображаем вес (если указан)
        if (product.weight) {
            document.getElementById('product-weight').innerText = `Вес: ${product.weight}`;
        } else {
            document.getElementById('product-weight').style.display = 'none';
        }

        // Отображаем габариты
        document.getElementById('product-dimensions').innerText = product.dimensions || "Габариты не указаны";
    }

    // Обработка переключения вкладок
    const tabs = document.querySelectorAll('.tab');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            document.getElementById(this.id.replace('-tab', '-content')).classList.add('active');
        });
    });

    // Всегда отображаем вкладку "Детали"
    document.getElementById('details-tab').style.display = 'block';
    document.getElementById('details-content').classList.add('active');
});

// Обработка аккордеона
document.addEventListener("DOMContentLoaded", function() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    const product = JSON.parse(localStorage.getItem('selectedProduct'));

    if (product) {
        // Отображаем вес
        document.getElementById('product-weight').innerText = product.weight ? `Вес: ${product.weight}` : "Вес: Не указан";
        // Отображаем габариты
        document.getElementById('product-dimensions').innerText = product.dimensions || "Габариты не указаны";

        const descriptionContent = document.getElementById('description-content');
        const descriptionHeader = document.getElementById('description-header');
        
        // Условие для отображения описания
        if (product.description && product.description.trim()) {
            descriptionContent.querySelector('#product-description').innerText = product.description;
            descriptionHeader.style.display = 'flex'; // Отображаем описание
        } else {
            descriptionHeader.style.display = 'none'; // Скрываем, если описания нет
        }
    }

    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const content = this.nextElementSibling;
            const icon = this.querySelector('i');
            
            // Сворачиваем/разворачиваем блок
            content.classList.toggle('active');
            this.classList.toggle('active');
            
            // Поворачиваем стрелочку
            icon.classList.toggle('fa-chevron-down');
            icon.classList.toggle('fa-chevron-up');
        });
    });
});



//в наличии
document.querySelectorAll('.product-card').forEach(function(card) {
    let stockBar = card.querySelector('.stock-bar');

    // Создаем элемент .stock-label
    let stockLabel = document.createElement('div');
    stockLabel.className = 'stock-label';
    stockLabel.textContent = 'Много';

    // Вставляем .stock-label сразу после .stock-bar
    stockBar.insertAdjacentElement('afterend', stockLabel);
});



// Фильтры
function filterProducts() {
    const minPrice = parseFloat(document.getElementById('price-filter-min').value) || 0;
    const maxPrice = parseFloat(document.getElementById('price-filter-max').value) || Infinity;

    // Получаем все карточки товаров
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        const priceText = card.querySelector('.original-prices').innerText.replace('₽', '').trim();
        const price = parseFloat(priceText) || 0;

        if (price >= minPrice && price <= maxPrice) {
            card.style.display = 'block'; // Показываем карточку
        } else {
            card.style.display = 'none'; // Скрываем карточку
        }
    });
}

// Функция сброса фильтрации по цене
function resetPriceFilter() {
    document.getElementById('price-filter-min').value = '';
    document.getElementById('price-filter-max').value = '';
    filterProducts(); // Применяем фильтр после сброса
}

// Функция сортировки товаров
function sortProducts() {
    const sortOption = document.getElementById('sorting').value;
    const container = document.getElementById('cards-container');
    const productCards = Array.from(container.querySelectorAll('.product-card'));

    // Проверка наличия элементов
    if (!container) {
        console.error('Контейнер для карточек товаров не найден.');
        return;
    }

    // Сортируем карточки в зависимости от выбранного критерия
    productCards.sort((a, b) => {
        const priceA = parseFloat(a.querySelector('.original-prices').innerText.replace('₽', '').trim()) || 0;
        const priceB = parseFloat(b.querySelector('.original-prices').innerText.replace('₽', '').trim()) || 0;
        const availabilityA = a.dataset.stock || 0;
        const availabilityB = b.dataset.stock || 0;

        switch (sortOption) {
            case 'price-asc':
                return priceA - priceB; // По возрастанию
            case 'price-desc':
                return priceB - priceA; // По убыванию
            case 'availability':
                return availabilityB - availabilityA; // По наличию
            default:
                return 0; // По умолчанию
        }
    });

    // Удаляем все карточки из контейнера
    container.innerHTML = '';

    // Добавляем карточки обратно в контейнер в отсортированном порядке
    productCards.forEach(card => container.appendChild(card));
}

// Инициализация обработчиков событий при загрузке страницы
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('sorting').addEventListener('change', sortProducts);
    document.querySelector('button[onclick="filterProducts()"]').addEventListener('click', filterProducts);
    document.querySelector('button[onclick="resetPriceFilter()"]').addEventListener('click', resetPriceFilter);
});

/* <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js"></script>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css"/>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick-theme.css"/>
      

      $(document).ready(function() {
          const allProducts = [
              { id: 1, category: 'Тормозная Система', name: 'Товар 1', image: 'image/product/167_amor160.png', price: '446 ₽' },
              { id: 2, category: 'Аксессуары', name: 'Товар 2', image: 'image/product/168_zerkalo.jpg', price: '996 ₽' },
              { id: 3, category: 'Тормозная Система', name: 'Товар 3', image: 'image/product/203_tormoz.jpg', price: '1193 ₽' },
              { id: 4, category: 'Прокладки и сальники', name: 'Товар 4', image: 'image/product/192_engine23.jpg', price: '398 ₽' },
              { id: 5, category: 'Прокладки и сальники', name: 'Товар 5', image: 'image/product/184_engine15.jpg', price: '429 ₽' },
              { id: 6, category: 'Двигатель', name: 'Товар 6', image: 'image/product/179_engine10.jpg', price: '1899 ₽' },
              { id: 7, category: 'Топливная Система', name: 'Товар 7', image: 'image/product/194_engine25.jpg', price: '479 ₽' },
              { id: 8, category: 'Топливная Система', name: 'Товар 8', image: 'image/product/197_Karb.jpg', price: '2210 ₽' },
          ];
      
          const productIds = [1, 3, 4, 5, 7, 8]; // Массив ID товаров для отображения
          const count = 4; // Количество товаров для отображения
      
          function getRandomProductsByIds(ids, count) {
              const filteredProducts = allProducts.filter(product => ids.includes(product.id));
              const shuffled = filteredProducts.sort(() => 0.5 - Math.random());
              return shuffled.slice(0, count);
          }
      
          function renderCarousel(products) {
              const carouselHtml = products.map(product => `
                  <div class="product-card" data-id="${product.id}">
                      <img src="${product.image}" alt="${product.name}">
                      <div class="details">
                          <p class="category">${product.category}</p>
                          <p class="name ellipsis">${product.name}</p>
                          <div class="price">
                              <span class="discounted-price">${product.price}</span>
                          </div>
                          <button class="add-to-cart" onclick="toggleCart(this)"><i class="fas fa-shopping-cart"></i></button>
                          <button class="add-to-favorites" onclick="toggleFavorite(this)"><i class="fas fa-heart"></i></button>
                      </div>
                  </div>
              `).join('');
      
              $('.carousel').html(carouselHtml);
      
              // Инициализация карусели
              $('.carousel').slick({
                  infinite: true,
                  slidesToShow: 4,
                  slidesToScroll: 2,
                  arrows: true,
                  prevArrow: '<button class="slick-prev slick-arrow" aria-label="Previous" type="button">←</button>',
                  nextArrow: '<button class="slick-next slick-arrow" aria-label="Next" type="button">→</button>',
                  draggable: true,
                  swipeToSlide: true,
                  touchThreshold: 10,
                  autoplay: true,
                  autoplaySpeed: 3000,
                  pauseOnHover: true,
              });
          }
      
          const randomProducts = getRandomProductsByIds(productIds, count);
          renderCarousel(randomProducts);
      }); */
      
      document.addEventListener('DOMContentLoaded', function () {
        const typeSelect = document.getElementById('scooter-type');
        const brandSelect = document.getElementById('scooter-brand');
        const modelSelect = document.getElementById('scooter-model');
        const addToGarageButton = document.getElementById('add-to-garage');
    
        // Пример данных моделей для разных типов и брендов
        const scooterModels = {
            type1: {
                brand1: ['Model A', 'Model B'],
                brand2: ['Model C', 'Model D'],
            },
            type2: {
                brand1: ['Model E', 'Model F'],
                brand2: ['Model G', 'Model H'],
            },
        };
    
        // Обновление моделей в зависимости от выбранного типа и бренда
        function updateModels() {
            const type = typeSelect.value;
            const brand = brandSelect.value;
            modelSelect.innerHTML = '<option value="">Выберите модель</option>';
    
            if (type && brand && scooterModels[type] && scooterModels[type][brand]) {
                scooterModels[type][brand].forEach(model => {
                    const option = document.createElement('option');
                    option.value = model;
                    option.textContent = model;
                    modelSelect.appendChild(option);
                });
            }
        }
    
        // Обработчики изменений
        typeSelect.addEventListener('change', updateModels);
        brandSelect.addEventListener('change', updateModels);
    
        // Функция фильтрации товаров
        function filterProducts() {
            const type = typeSelect.value;
            const brand = brandSelect.value;
            const model = modelSelect.value;
    
            // Ваш код для фильтрации товаров
            // Например, можно скрыть/показать товары в зависимости от выбранных параметров
            const products = document.querySelectorAll('.product');
            products.forEach(product => {
                const productType = product.dataset.type;
                const productBrand = product.dataset.brand;
                const productModel = product.dataset.model;
    
                if ((type === '' || productType === type) &&
                    (brand === '' || productBrand === brand) &&
                    (model === '' || productModel === model)) {
                    product.style.display = '';
                } else {
                    product.style.display = 'none';
                }
            });
        }
    
        // Обработчик кнопки добавления в гараж
        addToGarageButton.addEventListener('click', function () {
            filterProducts();
        });
    });
    
    // Карусель
$(document).ready(function() {
    let isDragging = false;
    let startX = 0;
    let dragThreshold = 10;
    let isMouseMoved = false;

    // Функция для установки одинаковой высоты карточек
    function setEqualHeight() {
        let maxHeight = 0;

        // Находим максимальную высоту карточек
        $('.product-card').each(function() {
            let cardHeight = $(this).outerHeight();
            if (cardHeight > maxHeight) {
                maxHeight = cardHeight;
            }
        });

        // Устанавливаем одинаковую высоту для всех карточек
        $('.product-card').each(function() {
            $(this).css('height', maxHeight + 'px');
        });
    }

    // Инициализация карусели с автопрокруткой
    $('.carousel').on('init', function() {
        setEqualHeight(); // Устанавливаем одинаковую высоту после инициализации карусели
    }).slick({
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 2,
        arrows: true,
        prevArrow: '<button class="slick-prev slick-arrow" aria-label="Previous" type="button">←</button>',
        nextArrow: '<button class="slick-next slick-arrow" aria-label="Next" type="button">→</button>',
        draggable: true,
        swipeToSlide: true,
        touchThreshold: 10,
        autoplay: true,
        autoplaySpeed: 1000,
        pauseOnHover: true,
    });

    // Обработчики перетаскивания карусели
    $('.carousel').on('mousedown touchstart', function(e) {
        isDragging = true;
        isMouseMoved = false;
        startX = e.type === 'mousedown' ? e.pageX : e.originalEvent.touches[0].pageX;
    });

    $('.carousel').on('mousemove touchmove', function(e) {
        if (isDragging) {
            const currentX = e.type === 'mousemove' ? e.pageX : e.originalEvent.touches[0].pageX;
            if (Math.abs(currentX - startX) > dragThreshold) {
                isMouseMoved = true;
            }
        }
    });

    $('.carousel').on('mouseup touchend', function() {
        isDragging = false;
    });

    // Открытие карточки при клике, если не было перетаскивания
    $('.product-card').on('click', function(e) {
        if (!isMouseMoved && !$(e.target).hasClass('add-to-cart') && !$(e.target).hasClass('add-to-favorites')) {
            const productInfo = $(this).find('.product-info');
            productInfo.slideToggle();
        }
    });

    // Функция для добавления товара в корзину
    $('.add-to-cart').on('click', function(e) {
        e.stopPropagation();
        const productCard = $(this).closest('.product-card');
        const productId = productCard.attr('data-id');
        const productInfo = productCard.find('.product-info');
        const product = {
            id: productId,
            image: productCard.find('img').attr('src'),
            name: productCard.find('.name').text(),
            price: productCard.find('.discounted-price').text() || productCard.find('.original-price').text() || productCard.find('.original-prices').text(),
            quantity: 1
        };

        const index = cart.findIndex(item => item.id === productId);

        if (index > -1) {
            cart[index].quantity += 1;
        } else {
            cart.push(product);
        }

        if (productInfo) {
            productInfo.hide();
        }

        if (cartCount) {
            cartCount.text(cart.length);
        }
        updateCartList();
        saveCart();
    });

    // Функция для добавления товара в избранное
    $('.add-to-favorites').on('click', function(e) {
        e.stopPropagation(); // Останавливаем всплытие события
        // Логика добавления товара в избранное
        const productCard = $(this).closest('.product-card');
        const productId = productCard.attr('data-id');
        // Ваша логика добавления в избранное...
    });

    // Устанавливаем одинаковую высоту карточек при изменении размера окна
    $(window).on('resize', function() {
        setEqualHeight();
    });
});
