//геолокация
document.addEventListener("DOMContentLoaded", function() {
    getUserCity();
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
  