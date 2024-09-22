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
        autoplaySpeed: 2000,
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
        if (!isMouseMoved && !$(e.target).hasClass('add-to-cart')) {
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

    // Устанавливаем одинаковую высоту карточек при изменении размера окна
    $(window).on('resize', function() {
        setEqualHeight();
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



//модальные окна

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
function redirectToTelegram() {
  window.location.href = 'https://t.me/Calm_the_loony';
}

// Инициирование звонка
function makePhoneCall() {
  window.location.href = 'tel:+9614277510';
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
        stockLabel.textContent = 'Много';

        // Вставляем .stock-label сразу после .stock-bar
        stockBar.insertAdjacentElement('afterend', stockLabel);
    } else {
        console.warn('Элемент .stock-bar не найден в одной из карточек');
    }
});


// // Обработка кликов на карточках товаров
// document.addEventListener("DOMContentLoaded", function() {
//     document.querySelectorAll('.product-card').forEach(card => {
//       card.addEventListener('click', function(event) {
//         // Проверяем, если клик был по кнопкам "Добавить в корзину" или "Добавить в избранное"
//         if (event.target.closest('.add-to-favorites') || event.target.closest('.add-to-cart')) {
//           return; // Не открываем карточку
//         }
  
//         // Создаем объект с информацией о товаре
//         const product = {
//           image: this.querySelector('img').src,
//           name: this.querySelector('.name').innerText || "Название не указано",
//           price: this.querySelector('.discounted-price, .original-price').innerText || "Цена не указана",
//           availability: this.dataset.stock || "Нет данных",
//           article: (this.querySelector('.product-info .article')?.innerText.split(': ')[1]) || "Артикул не указан",
//           category: this.querySelector('.category').innerText || "Категория не указана",
//           tags: (this.querySelector('.product-info .tags')?.innerText.split(': ')[1]) || "Метки не указаны",
//           dimensions: (this.querySelector('.product-info .details').innerText.match(/Габариты: (.+)/)?.[1]) || "Габариты не указаны",
//           weight: (this.querySelector('.product-info .details').innerText.match(/Вес: (.+)/)?.[1]) || "Вес не указан",
//           description: this.querySelector('.product-info .details')?.innerText || "Описание не указано"
//         };
  
//         // Сохраняем информацию о товаре в localStorage
//         localStorage.setItem('selectedProduct', JSON.stringify(product));
  
//         // Перенаправляем на страницу товара
//         window.location.href = 'product.html';
//       });
//     });
//   });
  
//   // Обработка страницы товара
//   document.addEventListener("DOMContentLoaded", function() {
//     const product = JSON.parse(localStorage.getItem('selectedProduct'));
//     if (product) {
//       document.getElementById('product-image').src = product.image || '';
//       document.getElementById('product-name').innerText = product.name || "Без названия";
//       document.getElementById('product-price').innerText = product.price || "Цена не указана";
//       document.getElementById('product-availability').innerText = `На складе: ${product.availability || "Нет данных"}`;
//       document.getElementById('product-sku').innerText = product.article;
//       document.getElementById('product-category').innerText = product.category;
//       document.getElementById('product-tags').innerText = product.tags;
//       document.getElementById('product-dimensions').innerText = product.dimensions;
//       document.getElementById('product-weight').innerText = product.weight;
//       document.getElementById('product-description').innerText = product.description;
//     } else {
//       document.getElementById('product-details').innerText = "Информация о товаре не найдена.";
//     }
//   });
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
                price: this.querySelector('.original-prices').innerText || "Цена не указана",
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
