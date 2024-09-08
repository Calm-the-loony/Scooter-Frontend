function performSearch() {
    const query = document.getElementById('search-input').value.trim().toLowerCase(); // Получаем запрос пользователя
    const productCards = document.querySelectorAll('.product-card'); // Получаем все карточки товаров

    if (query === "") {
        alert("Введите запрос для поиска!");
        return;
    }

    // Проходим по каждой карточке и проверяем её содержимое
    productCards.forEach(card => {
        // Получаем текстовое содержимое карточки: название, артикул, описание
        const productName = card.querySelector('.name').innerText.toLowerCase();
        const productArticle = card.querySelector('.article') ? card.querySelector('.article').innerText.toLowerCase() : '';
        const productExtra = card.querySelector('.extra') ? card.querySelector('.extra').innerText.toLowerCase() : '';
        
        // Проверяем, содержит ли карточка запрос пользователя
        if (productName.includes(query) || productArticle.includes(query) || productExtra.includes(query)) {
            card.style.display = "block"; // Если совпадение найдено, показываем карточку
        } else {
            card.style.display = "none"; // Если совпадений нет, скрываем карточку
        }
    });
}



//избранное на карточке
function toggleFavorite(button) {
  button.classList.toggle('favorited');
}

//карусель
$(document).ready(function(){
    $('.carousel').slick({
      infinite: true,
      slidesToShow: 4, // Количество отображаемых слайдов
      slidesToScroll: 2, // Количество прокручиваемых слайдов
    });
  });


//кнопка View more
let isHidden = true; 

function hideCards() {
  // Получаем все карточки, которые не находятся внутри карусели
  const productCards = document.querySelectorAll('.featured-products .product-card:not(.carousel .product-card)');
  
  // Показываем первые два ряда (2*4=8 карточек)
  for (let i = 0; i < productCards.length; i++) {
    if (i < 8) {
      productCards[i].classList.remove('hidden');
    } else if (isHidden && i >= 8) {
      // Скрываем третий ряд (9 и дальше карточки)
      productCards[i].classList.add('hidden');
    } else if (!isHidden && i >= 8) {
      // Показываем третий ряд при клике на "Показать ещё"
      productCards[i].classList.remove('hidden');
    }
  }
}

function toggleVisibility() {
  isHidden = !isHidden; // Изменяем состояние флага
  hideCards(); // Обновляем видимость карточек
}

// Вызываем функцию hideCards() при загрузке страницы, чтобы скрыть лишние карточки
hideCards();

// Кнопка "Показать ещё"
const viewMoreButton = document.querySelector('.view-more');

// Обработчик клика на кнопку "Показать ещё"
viewMoreButton.addEventListener('click', toggleVisibility);




//баннер
// Отображение модального окна
function showModal() {
  const modal = document.getElementById('myModal');
  modal.style.display = 'block';
}

// Закрытие модального окна при клике вне его
window.onclick = function(event) {
  const modal = document.getElementById('myModal');
  if (event.target == modal) {
    modal.style.display = 'none';
  }
}

// Переадресация на WhatsApp
function redirectToWhatsApp() {
  window.location.href = 'https://wa.me/номер_WhatsApp';
}
function redirectToTelegram() {
  window.location.href = 'https://t.me/Calm_the_loony';
}

// Инициирование звонка
function makePhoneCall() {
  window.location.href = 'tel:+9614277510';
}

//шапка
let prevScrollPos = window.pageYOffset;
let isMenuOpen = false;

function scrollHandler() {
    const currentScrollPos = window.pageYOffset;
    const header = document.getElementById("header");
    const actionContainer = document.querySelector(".action-container");
    const submenu = document.querySelector('.submenu');
    const locationText = document.querySelector('.location-text');
    const changeCityButton = document.getElementById('change-city-button');

    if (currentScrollPos < 100) {
        // Разворачиваем шапку
        header.style.height = "100px"; 
        header.classList.remove('collapsed');
        header.classList.add('expanded');
        actionContainer.style.marginLeft = "0"; 

        // Показать подменю, если оно открыто
        submenu.style.display = 'block';
        submenu.style.opacity = "1"; // Стабильное отображение меню

        locationText.classList.remove('hidden'); 
        changeCityButton.classList.remove('hidden-button'); 
    } else {
        // Сворачиваем шапку
        header.style.height = "50px"; 
        header.classList.remove('expanded');
        header.classList.add('collapsed');

        // Скрываем подменю
        submenu.style.opacity = '0'; 
        setTimeout(() => submenu.style.display = 'none', 500); 

        actionContainer.style.marginLeft = "-7px"; // Смещаем контейнер при сворачивании

        locationText.classList.add('hidden'); 
        changeCityButton.classList.add('hidden-button'); 
    }
    
    prevScrollPos = currentScrollPos;
}

function toggleMenu() {
    const header = document.querySelector('.header');
    const submenu = document.querySelector('.submenu');
    const locationElements = document.querySelectorAll('.location-text');

    if (!isMenuOpen && window.pageYOffset < 100) {
        // Разворачиваем шапку и показываем подменю
        header.style.height = '100px';
        header.classList.add('expanded');
        header.classList.remove('collapsed');
        submenu.style.display = 'block';
        submenu.style.opacity = "1"; // Стабильное появление
        isMenuOpen = true;

        // Показываем элементы геолокации
        locationElements.forEach(el => el.classList.remove('hidden'));
    } else {
        // Сворачиваем шапку и скрываем подменю
        header.style.height = '50px';
        header.classList.add('collapsed');
        header.classList.remove('expanded');
        submenu.style.opacity = '0';
        setTimeout(() => submenu.style.display = 'none', 500);
        isMenuOpen = false;

        // Скрываем элементы геолокации
        locationElements.forEach(el => el.classList.add('hidden'));
    }
}

// Обработка события прокрутки
window.addEventListener('scroll', function() {
    const container = document.querySelector('.action-container');
    container.style.left = '259px'; // Обновляем значение left
    container.style.transform = 'skew(-20deg)'; // Обновляем трансформацию
});

// Привязываем обработчик события скролла
window.onscroll = function () {
    scrollHandler();

    // Обновляем меню независимо от текущей позиции прокрутки
    if (window.pageYOffset < 100) {
        const submenu = document.querySelector('.submenu');
        submenu.style.display = 'block'; 
        submenu.style.opacity = "1"; // Убеждаемся, что текст отображается стабильно
    }
};


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
document.getElementById('account-button').addEventListener('click', function() {
    window.location.href = 'account.html';
});


// Событие DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
    initializePage();
    initializeModals();
});


//личный кабинет, управление отображением форм

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


// Обработка клика по карточке товара
document.querySelectorAll('.product-card').forEach(function(card) {
    card.addEventListener('click', function() {
        let category = card.getAttribute('data-category');
        let weight = card.getAttribute('data-weight');
        let dimensions = card.getAttribute('data-dimensions');
        let article = card.getAttribute('data-article');
        let tags = card.getAttribute('data-tags');
        let extra = card.getAttribute('data-extra');
        
        console.log("Категория:", category);
        console.log("Вес:", weight);
        console.log("Габариты:", dimensions);
        console.log("Артикул:", article);
        console.log("Метки:", tags);
        console.log("Доп. комплект:", extra);
        
        // Открытие карточки товара с использованием этой информации
    });
});

// Добавление элемента 'В наличии' после .stock-bar
document.querySelectorAll('.product-card').forEach(function(card) {
    let stockBar = card.querySelector('.stock-bar');

    // Проверяем, существует ли .stock-bar в карточке
    if (stockBar) {
        // Создаем элемент .stock-label
        let stockLabel = document.createElement('div');
        stockLabel.className = 'stock-label';
        stockLabel.textContent = 'В наличии';

        // Вставляем .stock-label сразу после .stock-bar
        stockBar.insertAdjacentElement('afterend', stockLabel);
    } else {
        console.warn('Элемент .stock-bar не найден в одной из карточек');
    }
});



// //геолокация
// document.addEventListener("DOMContentLoaded", function() {
//     getUserCity();
//   });
  
//   function getUserCity() {
//     fetch('http://ip-api.com/json/?lang=ru')
//       .then(response => response.json())
//       .then(data => {
//         const city = data.city || "Неизвестно";
//         document.getElementById("city-name").textContent = city;
//       })
//       .catch(error => {
//         console.error("Ошибка получения города:", error);
//         document.getElementById("city-name").textContent = "Неизвестно";
//       });
//   }
  
//   function openCityModal() {
//     document.getElementById("city-modal").style.display = "block";
//   }
  
//   function closeCityModal() {
//     document.getElementById("city-modal").style.display = "none";
//   }
  
//   function filterCities() {
//     const filter = document.getElementById("city-input").value.toLowerCase();
//     const cityList = document.getElementById("city-list");
//     const li = cityList.getElementsByTagName("li");
  
//     for (let i = 0; i < li.length; i++) {
//       const txtValue = li[i].textContent || li[i].innerText;
//       li[i].style.display = txtValue.toLowerCase().includes(filter) ? "" : "none";
//     }
//   }
  
//   function selectCity(city) {
//     document.getElementById("city-name").textContent = city;
//     closeCityModal();
//   }
  
//   function enterCityManually() {
//     const manualCity = prompt("Введите название вашего города:");
//     if (manualCity) {
//       selectCity(manualCity);
//     }
//   }
  