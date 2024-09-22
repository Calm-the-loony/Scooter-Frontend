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
