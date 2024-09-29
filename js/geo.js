document.addEventListener("DOMContentLoaded", function() {
  getUserCity();

  // Обработчик клика на кнопку для сворачивания/разворачивания меню
  document.getElementById('menu-toggle-button').addEventListener('click', function() {
    toggleMenu();
  });
});

function getUserCity() {
  fetch('http://ip-api.com/json/?lang=ru')
    .then(response => response.json())
    .then(data => {
      const city = data.city || "Неизвестно";
      document.getElementById("city-name").textContent = city;
    })
    .catch(error => {
      console.error("Ошибка получения города:", error);
      document.getElementById("city-name").textContent = "Неизвестно";
    });
}

function openCityModal() {
  document.getElementById("city-modal").style.display = "block";
}

function closeCityModal() {
  document.getElementById("city-modal").style.display = "none";
}

function filterCities() {
  const filter = document.getElementById("city-input").value.toLowerCase();
  const cityList = document.getElementById("city-list");
  const li = cityList.getElementsByTagName("li");

  for (let i = 0; i < li.length; i++) {
    const txtValue = li[i].textContent || li[i].innerText;
    li[i].style.display = txtValue.toLowerCase().includes(filter) ? "" : "none";
  }
}

function selectCity(city) {
  document.getElementById("city-name").textContent = city;
  closeCityModal();
}

function enterCityManually() {
  const manualCity = prompt("Введите название вашего города:");
  if (manualCity) {
    selectCity(manualCity);
  }
}

function toggleMenu() {
  const menu = document.getElementById('sticky-menu'); // Укажите правильный id для вашего меню
  const locationContainer = document.getElementById('location-container');

  if (menu.classList.contains('collapsed')) {
    menu.classList.remove('collapsed');
    locationContainer.classList.remove('hidden');
    locationContainer.classList.add('visible');
  } else {
    menu.classList.add('collapsed');
    locationContainer.classList.remove('visible');
    locationContainer.classList.add('hidden');
  }
}



//шапка
let prevScrollPos = window.pageYOffset;

function scrollHandler() {
    const currentScrollPos = window.pageYOffset;
    const header = document.getElementById("header");
    const submenu = document.querySelector('.submenu');
    const locationContainer = document.getElementById("location-container"); // Добавляем элемент геолокации

    if (currentScrollPos < 100) {
        // Разворачиваем шапку
        header.style.height = "100px"; 
        header.classList.remove('collapsed');
        header.classList.add('expanded');

        // Показываем подменю
        submenu.classList.add('visible'); 

        // Показываем геолокацию
        locationContainer.classList.remove('hidden'); 
        locationContainer.classList.add('visible');
    } else {
        // Сворачиваем шапку
        header.style.height = "50px"; 
        header.classList.remove('expanded');
        header.classList.add('collapsed');

        // Скрываем подменю
        submenu.classList.remove('visible'); 

        // Скрываем геолокацию
        locationContainer.classList.remove('visible'); 
        locationContainer.classList.add('hidden');
    }
    
    prevScrollPos = currentScrollPos;
}

// Привязываем обработчик события скролла
window.addEventListener('scroll', scrollHandler);

// Обновляем видимость подменю на старте
window.onload = function () {
    scrollHandler();
};


document.getElementById('favorite-button').addEventListener('click', function() {
  window.location.href = 'favorites.html';
});
document.getElementById('account-button').addEventListener('click', function() {
  window.location.href = 'account.html';
});
document.getElementById('cart-button').addEventListener('click', function() {
  window.location.href = 'cart.html';
});



// Функция для поиска товаров по названию или артикулу
function handleSearch() {
  const query = document.getElementById("text-to-find").value.toLowerCase();
  const products = document.querySelectorAll('.product-card'); // Находим все карточки товаров

  const uniqueResults = {}; // Используем объект для хранения уникальных товаров по артикулу

  products.forEach(product => {
      const productName = product.querySelector('.name').textContent.toLowerCase();
      const productArticle = product.querySelector('.article').textContent.toLowerCase();

      // Проверяем, содержит ли название или артикул введенный запрос
      if (productName.includes(query) || productArticle.includes(query)) {
          const article = product.querySelector('.article').textContent; // Артикул товара
          if (!uniqueResults[article]) { // Если артикул не был добавлен ранее
              uniqueResults[article] = {
                  id: product.getAttribute('data-id'),
                  name: product.querySelector('.name').textContent,
                  article: article,
                  price: product.querySelector('.original-prices').textContent,
                  image: product.querySelector('img').getAttribute('src'),
                  stock: product.getAttribute('data-stock'),
                  category: product.querySelector('.category').innerText || "Категория не указана",
                  tags: (product.querySelector('.product-info .tags')?.innerText.split(': ')[1]) || "Метки не указаны",
                  dimensions: (product.querySelector('.product-info .dimensions')?.innerText.split(': ')[1]) || "Габариты не указаны",
                  additional: (product.querySelector('.product-info .extra')?.innerText.split(': ')[1]) || "Доп. комплект не указан",
              };
          }
      }
  });

  // Сохранение результатов поиска в localStorage для передачи на страницу результатов
  localStorage.setItem("searchResults", JSON.stringify(Object.values(uniqueResults)));

  // Переход на страницу результатов поиска
  window.location.href = "search-results.html";
}

// Функция для загрузки результатов поиска на странице результатов
function loadSearchResults() {
  const searchResults = JSON.parse(localStorage.getItem("searchResults")) || [];
  const resultsContainer = document.getElementById('search-results');

  // Очищаем контейнер перед добавлением результатов
  resultsContainer.innerHTML = '';

  if (searchResults.length === 0) {
      resultsContainer.innerHTML = '<p>Ничего не найдено</p>';
  } else {
      searchResults.forEach(product => {
          const productCard = `
              <div class="product-card" data-id="${product.id}" data-stock="${product.stock}">
                  <img src="${product.image}" alt="${product.name}">
                  <div class="details">
                      <p class="category">${product.category}</p>
                      <p class="name ellipsis">${product.name}</p>
                      <div class="price">
                          <div class="original-price-wrapper no-discount">
                              <span class="original-prices">${product.price}</span>
                          </div>
                          <button class="add-to-cart" onclick="toggleCart(this)">
                              <i class="fas fa-shopping-cart"></i>
                          </button>
                          <div class="stock-bar" title="В наличии: ${product.stock}"></div>
                      </div>
                      <button class="add-to-favorites" onclick="toggleFavorite(this)">
                          <i class="fas fa-heart"></i>
                      </button>
                  </div>
              </div>
          `;
          resultsContainer.insertAdjacentHTML('beforeend', productCard);
      });
  }
}

// Проверяем, находимся ли на странице результатов поиска, и загружаем результаты при открытии страницы
if (window.location.pathname.includes('search-results.html')) {
  window.onload = loadSearchResults;
}
