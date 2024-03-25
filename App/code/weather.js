const loadedBigWeatherImage = document.createElement("img");

function openWeather(){
    const element = document.createElement("div");
    
    const weather = storedData.weather;
    loadedBigWeatherImage.src = `${weatherServer}images/${storedData.weather.image}-og.jpg`;

    element.appendChild(loadedBigWeatherImage);

    const text = document.createElement("p");
    text.classList.add("big");
    text.innerHTML = `<span>${weather.city} ${weather.temp}°C</span>`;
    element.appendChild(text);
    
    CreateModal(element, "weatherBig");
}