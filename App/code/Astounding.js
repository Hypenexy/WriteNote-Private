class Astounding{
    applet = document.createElement("app");
    displayElement = document.createElement("div");

    display(options){
        this.displayElement.innerHTML = "";
        this.displayElement.className = "display";
        if(options.type == "text"){
            this.displayElement.classList.add("text");
            this.displayElement.innerText = options.text;
        }
        if(options.type == "home"){
            const clockBase = createAppendElement("clockBase", this.displayElement);
            const hourHead = createAppendElement("hourHead", clockBase);
            const minHead = createAppendElement("minHead", clockBase);

        }
    }

    // load(){

    // }

    datetime;
    setSystemTime(){
        this.datetime = Date.now();
        this.display({type: "text", text: "SET TIME!"});
    }

    setFileStructure(){
        this.display({type: "text", text: "SETTING UP THE FILE STRUCTURE. PLEASE WAIT."});
    }
    
    /**
     * Initialize the Astounding class
     * @param {*} options Options aren't present yet
     */
    constructor(options){
        // this.load();
        this.applet.classList.add("Astounding");
        this.displayElement.classList.add("display");
        document.body.appendChild(this.applet);
        this.applet.appendChild(this.displayElement);
        this.display({type: "text", text: "ASTOUNDING\nDigital Diary"});
        setTimeout(() => {
            this.setFileStructure();
            setTimeout(() => {
                this.setSystemTime();
                setTimeout(() => {
                    this.display({type: "home"});
                }, 100);
            }, 1000);
        }, 2000);
    }
}

// new Astounding();