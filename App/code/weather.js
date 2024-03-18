function openWeather(){
    const element = document.createElement("div");
    
    const weather = storedData.weather;

    element.innerHTML = `
        <img src='${weatherServer}images/${storedData.weather.image}-og.jpg'>
        <p class='big'><span>${weather.city} ${weather.temp}°C</span></p>
    `;
    
    CreateModal(element, "weatherBig");
}