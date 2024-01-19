const logo = document.createElement("div");
logo.innerHTML = "<img src='/assets/ui/logo.svg'>";
logo.classList.add("loading")
// setTimeout(() => {

//     logo.classList.add("loaded")
// }, 1000);
app.appendChild(logo);