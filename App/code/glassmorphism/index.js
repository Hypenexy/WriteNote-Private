class glassmorphism{
    constructor(){
        var btns = document.getElementsByClassName("btn");
        for (let i = 0; i < btns.length; i++) {
            const element = btns[i];
            element.classList.add("glassmorphism");
        }
        var welcome = document.getElementsByClassName("welcome");
        welcome.classList.add("glassmorphism");
    }
}

// on newly added buttons (to DOM) class wouldn't be applied.