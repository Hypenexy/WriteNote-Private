const welcome = document.createElement("div");
welcome.classList.add("welcome");
welcome.innerHTML = "<img class='logo' src='/assets/ui/logo.svg'>";
// welcome.appendChild(logo);
app.appendChild(welcome);
const notesSide = document.createElement("div");
const devicesSide = document.createElement("div");
devicesSide.classList.add("devicesSide");

var binBtn;
var usageElement = document.createElement("div");
usageElement.classList.add("usageElement");
function loadWelcome(responseData){
    function createMOTD(name){
        var now24 = new Date().toLocaleTimeString([], { hour: '2-digit', minute: "2-digit", hour12: false });
        var hour = parseInt(now24.slice(0, 2));
        var welcomeMessage = locale.goodmorning; // From 6 to 12
        if(hour>12&&hour<18){ // From 14:00 to 17:00
            welcomeMessage = locale.goodafternoon;
        }
        if(hour>17&&hour<23){ // From 18:00 to 22:00
            welcomeMessage = locale.goodevening;
        }
        if(hour>22||hour<6){ // From 23:00 to 5:00
            welcomeMessage = locale.goodnight;
        }
        if(hour==0||hour==24){ // At 00:00 midnight (24:00)
            welcomeMessage = locale.goodmidnight;
        }
        welcomeMessage += ", " + name;
        return welcomeMessage;
    }

    const motd = document.createElement("div");
    motd.classList.add("motd");
    if(responseData.user != false){
        motd.innerText = createMOTD(responseData.user.username);
    }
    else{
        motd.innerText = createMOTD();
    }
    welcome.appendChild(motd);


    const userHalf = document.createElement("div");
    userHalf.classList.add("userHalf");
    if(responseData.user.banner){
        userHalf.innerHTML = "<div style='background-image: url(\""+imageServer+"?i="+responseData.user.banner+"\")'>"
    }
    if(responseData.user.pfp){
        userHalf.innerHTML += "<img src='"+imageServer+"?i="+responseData.user.pfp+"'>";
    }
    userHalf.innerHTML += "<p>"+responseData.user.username+"</p>";
    welcome.appendChild(userHalf);

    function WeatherStyled(info){ // reconsider these 💫 cute names ✨
        if(info.altdesc=="Thunderstorm"){
            info.desc = locale.thunderstorm;
        }
        if(info.altdesc=="Drizzle"){
            info.desc = locale.rainy;
        }
        if(info.altdesc=="Rain"){
            info.desc = locale.rainy;
        }
        if(info.altdesc=="Snow"){
            info.desc = locale.snow;
        }
        if(info.altdesc=="Clouds"){
            info.desc = locale.cloudy;
        }
        if(info.desc=="clear sky"){
            info.desc = locale.clearsky;
        }
        if(info.desc=="few clouds"){
            info.desc = locale.fewclouds;
        }
        if(info.desc=="scattered clouds"){
            info.desc = locale.scatteredclouds;
        }
        if(info.desc=="very heavy rain"||info.desc=="extreme rain"||info.desc=="heavy intensity rain"){
            info.desc = locale.veryrain;
        }
        if(info.desc=="Rain and snow"||info.desc=="Light rain and snow"){
            info.desc = locale.snowrain;
        }
        if(info.altdesc=="Mist"){
            info.desc = locale.mist;
        }
        
        var now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: "2-digit" });
        var now24 = new Date().toLocaleTimeString([], { hour: '2-digit', minute: "2-digit", hour12: false });
        var hour = parseInt(now24.slice(0, 2));
        var timedescription = info.city;
        var temp = parseInt(info.temp.toString().slice(0, 2));
        var feel = locale.feel;
        if(Math.floor(Math.random() * 4)==2){
            feel = locale.peaceful;
        }
        if(temp<1){
            feel = locale.freezing;
        }
        if(temp<14){
            feel = locale.cold;
        }
        if(temp>20){
            feel = locale.mild;
        }
        if(temp>28){
            feel = locale.hot;
        }
        if(temp>36){
            feel = locale.extremelyhot;
        }

        timedescription = `${locale.its} ${feel} `;

        if(hour<12&&hour>=6){ // From 6:00 to 12:00
            timedescription += locale.morningin;
        }
        if(hour==12){ // At 12:00
            timedescription += locale.noonin;
        }
        if(hour>12&&hour<18){ // From 13:00 to 17:00
            timedescription += locale.afternoonin;
        }
        if(hour>17&&hour<23){ // From 18:00 to 22:00
            timedescription += locale.eveningin;
        }
        if(hour>22||hour<6){ // From 23:00 to 5:00
            timedescription += locale.nightin;
        }
        if(hour==0&&hour==24){ // At midnight 0:00, 24:00
            timedescription += locale.midnightin;
        }

        timedescription += " " + info.city;
        return '<img src="'+weatherServer+'images/'+info.image+'.jpg"><timed> '+locale.lastupdated+ ' ' + now + '</timed><p>' + timedescription +'.</p><w>' + info.temp.toString().split('.')[0] + "<span class='extra'>."+info.temp.toString().split('.')[1]+"</span>" + '°C ' + info.desc + '</w>';
    }


    const weatherHalf = document.createElement("div");
    weatherHalf.classList.add("weatherHalf");
    weatherHalf.innerHTML = WeatherStyled(responseData.weather);
    welcome.appendChild(weatherHalf);


    notesSide.classList.add("notesSide");
    welcome.appendChild(notesSide);
    
    const top = document.createElement("div");
    top.classList.add("top");
    notesSide.appendChild(top);
    const topBtns = [locale.new_folder, locale.bin];
    const topBtnsIcons = ["folder", "delete"];
    for (let i = 0; i < topBtns.length; i++) {
        const element = topBtns[i];
        const htmlElement = document.createElement("p");
        htmlElement.classList.add("btn");
        htmlElement.innerHTML = "<i>"+topBtnsIcons[i]+"</i><span>"+element+"</span>";
        
        top.appendChild(htmlElement);

        if(topBtnsIcons[i] == "delete"){
            binBtn = htmlElement;
        }
        if(topBtnsIcons[i] == "folder"){
            ButtonEvent(htmlElement, createFolder)
        }
    }
    top.appendChild(usageElement);
    top.appendChild(devicesSide);

    
    // const side = document.createElement("div");
    // side.classList.add("side");
    // notesSide.appendChild(side);

    // const sideBtns = ["Home", "Bin"];
    // const sideBtnsIcons = ["home", "delete"];
    // for (let i = 0; i < sideBtns.length; i++) {
    //     const element = sideBtns[i];
    //     const htmlElement = document.createElement("p");
    //     htmlElement.innerHTML = "<i>"+sideBtnsIcons[i]+"</i>" + element;
    //     const htmlElementExtra = document.createElement("div");
    //     htmlElementExtra.classList.add("extra");
    //     // htmlElementExtra.innerHTML = "<label><div class='label'><div>Used 1.3 GB of 2 GB</div><div class='storageLine'><div></div></div></label>"
    //     ButtonEvent(htmlElement, function(){
    //         var actives = side.querySelectorAll(".active");
    //         actives.forEach(element => {
    //             element.classList.add("hide");
    //             element.classList.remove("active");
    //         });
    //         htmlElement.classList.add("active");
    //         htmlElement.classList.add("instant");
    //         htmlElementExtra.classList.add("active");
    //         htmlElementExtra.classList.add("instant");
    //         loadNotesWelcome(storedNotesData, sideBtns[i].toLowerCase());
    //     });
    //     side.appendChild(htmlElement);
    //     side.appendChild(htmlElementExtra);
    //     if(i==0){
    //         htmlElement.classList.add("active");
    //         htmlElementExtra.classList.add("active");
    //     }
    // }

    notesSide.appendChild(notesElement);

    
    const welcomeContextMenu = contextMenu();

    // welcomeContextMenu.add("text", locale.display);

    const extraView = welcomeContextMenu.add("extra", locale.view, {"icon":"view_carousel"});
    welcomeContextMenu.add("button", locale.grid, {"icon":"grid_view", "submenu":extraView});
    welcomeContextMenu.add("button", locale.list, {"icon":"view_list", "submenu":extraView});

    const extraSort = welcomeContextMenu.add("extra", locale.sort, {"icon":"sort"});
    
    function createObjectParams(icon, type){
        return {
            "icon":icon,
            "submenu":extraSort,
            "action":()=>{appendNoteList(type)},
            "selectedReason":()=>{return settings.sort == type;}
        }
    }

    welcomeContextMenu.add("button", locale.name, createObjectParams("sort_by_alpha", "name"));
    welcomeContextMenu.add("button", locale.size, createObjectParams("save", "size"));
    welcomeContextMenu.add("button", locale.type, createObjectParams("note", "type"));
    
    welcomeContextMenu.add("line", null, {"submenu":extraSort});

    welcomeContextMenu.add("button", locale.date_created, createObjectParams("calendar_month", "dateCreated"));
    welcomeContextMenu.add("button", locale.date_modified, createObjectParams("calendar_month", "dateModified"));
    welcomeContextMenu.add("button", locale.date_opened, createObjectParams("calendar_month", "dateOpened"));

    // welcomeContextMenu.add("text", locale.edit);
    welcomeContextMenu.add("button", locale.select_all, {"icon":"select_all"});
    welcomeContextMenu.add("button", locale.new_folder, {"icon":"folder"});
    welcomeContextMenu.attach(notesSide);
}

const notesElement = document.createElement("div");
notesElement.classList.add("notes");

function noteContextMenu(noteData, element){
    const NID = noteData.nid;
    const name = noteData.name;
    if(!noteData.size){
        noteData.size = 0;
    }
    const size = humanFileSize(noteData.size);
    const dateOpen = new Date(noteData.fO);
    const dateOpenFormatted = dateOpen.toLocaleDateString() + ", " + dateOpen.toLocaleTimeString();
    const dateModified = new Date(noteData.fM);
    const dateModifiedFormatted = dateModified.toLocaleDateString() + ", " + dateModified.toLocaleTimeString();
    
    const noteContextMenu = contextMenu();

    noteContextMenu.add("input", name); // add rename functions

    noteContextMenu.add("text", locale.actions); // make so that the line can have text alongside it

    noteContextMenu.add("button", locale.share, {"icon":"share", "disabled":true});
    noteContextMenu.add("button", locale.duplicate, {"icon":"content_copy"});
    noteContextMenu.add("button", locale.delete, {"icon":"delete", "action":()=>{deleteNote(NID, (success, error)=>{
        if(success){
            element.remove();
        }
    });}});

    noteContextMenu.add("text", locale.properties);
    
    noteContextMenu.add("text", dateOpenFormatted, {"icon":"calendar_month"});
    noteContextMenu.add("text", dateModifiedFormatted, {"icon":"calendar_month"});
    noteContextMenu.add("text", size, {"icon":"save"});
}

var notesList = [];

function appendNoteList(sort, space){
    notesElement.innerHTML = "";

    if(!sort && settings && settings.sort){
        sort = settings.sort;
    }
    if(!sort){
        settings.sort = "dateModified";
    }
    if(sort){
        settings.sort = sort
    }

    function sortData(type){
        notesList.sort(function(b, a){
            if(typeof a[type] == "undefined"){
                a[type] = 0;
            }
            if(typeof b[type] == "undefined"){
                b[type] = 0;
            }
            if(type == "name"){
                return b["name"].localeCompare(a["name"]);
            }
            return a[type] - b[type];
        });
    }

    if(sort == "dateModified"){
        sortData("fM");
    }
    if(sort == "dateCreated"){
        sortData("fC");
    }
    if(sort == "dateOpened"){
        sortData("fO");
    }
    if(sort == "name"){
        sortData("name");
    }
    if(sort == "type"){
        sortData("type");
    }
    if(sort == "size"){
        sortData("size");
    }

    notesList.sort(function(b){
        if(b["type"] == "folder"){
            return -1;
        }
    });

    for (let i = 0; i < notesList.length; i++) {
        const element = notesList[i];
        addNoteToList(element);
    }

    const createBtn = document.createElement("div");
    createBtn.classList.add("note");
    createBtn.classList.add("create");
    createBtn.innerHTML = "<i>add</i><p> "+locale.create_new+"</p>";
    ButtonEvent(createBtn, createNewNote);
    notesElement.appendChild(createBtn);

    if(!space){
        for (let i = 0; i < notesElement.children.length; i++) {
            const element = notesElement.children[i];
            element.style.animationDelay = .5 + i/10 + "s";
        }
    }
    else{
        for (let i = 0; i < notesElement.children.length; i++) {
            const element = notesElement.children[i];
            element.style.animationDelay = i/100 + "s";
            element.style.animationDuration = ".3s";
        }
    }
}

const selectedNotes = [];
function selectNote(notedata){
    binBtn.children[1].textContent = `Move ${selectedNotes.length + 1} to Bin`;
    selectedNotes.push(notedata);
}

function addNoteToList(notedata, space){
    const element = document.createElement("div");
    element.classList.add("note");
    const NID = notedata.nid;
    if(notedata.bin==true && space!="bin"){
        return;
    }
    if(!notedata.bin && space=="bin"){
        return;
    }
    element.setAttribute("NID", NID);
    element.addEventListener("click", function(e){
        if(e.ctrlKey){
            e.stopPropagation();
            element.classList.add("selected");
            selectNote(notedata);
        }
    });
    
    noteContextMenu(notedata, element);
    if(notedata.type != "folder"){
        ButtonEvent(element, openNote, notedata);
        element.innerHTML = "<p class='title'>"+notedata.name+"</p>";
        if(notedata.fL){
            element.innerHTML += "<p class='description'>"+notedata.fL+"</p>";
        }
        element.innerHTML += `<p class='info'><span>${humanFileSize(notedata.size)}</span><span>${notedata.type}</span></p>`;
    }
    else{
        element.classList.add("folder");
        if(notedata.name == "New folder"){
            notedata.name = locale.new_folder;
        }
        element.innerHTML = "<i>folder</i><span>"+notedata.name+"<span>";
    }
    notesElement.appendChild(element);
}

var storedNotesData;
function loadNotesWelcome(data, space){
    storedNotesData = data;
    notesElement.innerHTML = "";
    
    if(notesList.length > 0){
        notesList = [];
    }

    for (let i = 0; i < data.notes.length; i++) {
        const element = data.notes[i];
        const pushelement = element[Object.keys(element)[0]];
        pushelement["nid"] = Object.keys(element)[0];
        notesList.push(pushelement);
    }

    appendNoteList(null, space);
}

// UA
var useragent = new UAParser(navigator.userAgent);
const device = {
    Browser: useragent.getBrowser(),
    CPU: useragent.getCPU(),
    Device: useragent.getDevice(),
    Engine: useragent.getEngine(),
    OS: useragent.getOS()
};

device["CPU"].cores = navigator.hardwareConcurrency;

var devicesList = {};
function loadDevicesWelcome(data){
    var devicesKeys = Object.keys(data.devices);
    for (let i = 0; i < devicesKeys.length; i++) {
        const DID = Object.keys(data.devices[devicesKeys[i]])[0];
        devicesList[DID] = data.devices[devicesKeys[i]][DID];
        addDeviceElement(DID);
    }
    // const count = data.devices.length;
    // console.log(data);
    // console.log(count); // work!! here. Okey
}
function updateDeviceList(data){ // This might not be properly formatted on the database. Check later!
    if(data.type == "leave"){
        var devicesKeys = Object.keys(data.devices);
        for (let i = 0; i < devicesKeys.length; i++) {
            const element = devicesKeys[i];
            if(devicesList[element].DID){ // device id

            }
            
        }
    }
    if(data.type == "join"){
        // devicesList[data.content] This scheme is weird
        addDeviceElement(data) // fr fix the schema first then finish up here
    }
    // devicesList
    // console.log(data)
}

function getOS(DID){
    if(socket.id != DID){
        if(devicesList[DID] && devicesList[DID].device){
            return devicesList[DID].device.OS.name + " " + devicesList[DID].device.OS.version;
        }
        else{
            return "No system information";
        }
    }
    else{
        return device.OS.name + " " + device.OS.version + " • " + locale.you;
    }
}
function getOSIcon(DID){
    var icon = "computer";
    if(socket.id != DID && devicesList[DID] && devicesList[DID].device){
        if(devicesList[DID].device.Device.type == "mobile"){
            icon = "smartphone";
        }
        if(devicesList[DID].device.Device.model == "iPhone"){
            icon = "phone_iphone";
        }
        if(devicesList[DID].device.Device.model == "android"){
            icon = "phone_android";
        }
    }
    return icon;
}

function showDeviceOptions(){
    const element = arguments[0];
    const DID = arguments[1];
    // Add the functionality to change other devices' settings
    // from this one



    const infoElement = document.createElement("div");
    infoElement.classList.add("deviceInfo");

    var name = document.createElement("div");
    infoElement.appendChild(name);

    var btns = [ // Rethink those
        ["travel_explore", "View device"],
        ["settings", "Change device settings"],
        ["wifi_off", "Disconnect"],
    ];
    for (let i = 0; i < btns.length; i++) {
        const btn = btns[i];
        const htmlElement = document.createElement("div");
        htmlElement.classList.add("btn");
        if(btns.length - 1 == i){
            htmlElement.classList.add("logout");
        }
        htmlElement.innerHTML = `<i>${btn[0]}</i><span>${btn[1]}</span>`;
        infoElement.appendChild(htmlElement);

        switch (i) {
            case 0:
                ButtonEvent(htmlElement, openDevice, DID);
                break;
            case 1:
                ButtonEvent(htmlElement, openDevice, DID);
                break;
            case 2:
                ButtonEvent(htmlElement, openDevice, DID);
                break;
            default:
                break;
        }
    }
    const caret = document.createElement("div");
    caret.classList.add("caret");
    infoElement.appendChild(caret);

    
    function show(){
        name.textContent = getOS(DID);


        // var elementOffset = normalizeOffset([element.offsetLeft, element.offsetTop, element.offsetLeft + element.offsetWidth, element.offsetTop + element.offsetHeight]);
        var elementOffset = getBoundingClientRectObject(element);

        infoElement.style.top = (elementOffset.bottom + 10) + "px";
        infoElement.style.left = (elementOffset.right) + "px";

        app.appendChild(infoElement);
        
        infoElement.style.left = (elementOffset.right) - (infoElement.offsetWidth / 2) + "px";
       
        var offsetRight = infoElement.offsetLeft + infoElement.offsetWidth;
        if(offsetRight > window.innerWidth){
            infoElement.style.left = infoElement.offsetLeft - (offsetRight - window.innerWidth) + "px";
        }

        infoElement.classList.add("show");

        var caretOffset = getBoundingClientRectObject(caret);
        var infoElOffset = getBoundingClientRectObject(infoElement);
        // caret.style.left = ((elementOffset.left - infoElement.offsetLeft) + elementOffset.width / 2 - caret.offsetWidth / 2) + "px";
        caret.style.left = ((elementOffset.left - infoElOffset.left) + elementOffset.width / 2 - caretOffset.width / 2) - 1 + "px";
    }
    function hide(e){
        if(e.toElement == infoElement || e.toElement == element){
            return;
        }
        infoElement.classList.remove("show");
        // var transitionDuration = infoElement.computedStyleMap().get('transition').value * 1000;
        var transitionDuration = .2 * 1000;
        setTimeout(() => {
            infoElement.remove();
        }, transitionDuration);
    }

    element.addEventListener("mouseover", show);
    element.addEventListener("mouseleave", hide);
    infoElement.addEventListener("mouseleave", hide);
}

function addDeviceElement(DID){
    const element = document.createElement("i");
    element.textContent = getOSIcon(DID);
    showDeviceOptions(element, DID);
    devicesSide.appendChild(element);
}
function removeDeviceElement(DID){
    devicesSide.querySelector("['DID'='"+DID+"']");
}

function loadUsageWelcome(data, isDecoration){
    if(typeof isDecoration != "undefined"){
        console.log(typeof isDecoration)
        usageElement = isDecoration;
    }
    const rawRatio = data/1000000000;
    attachTooltip(usageElement, `${rawRatio*100}%`);
    const percentage = Math.round((rawRatio*100 + Number.EPSILON) * 100) / 100;
    const roundedPercentage = Math.round(percentage);
    const gradient = `linear-gradient(90deg, rgba(0,207,255,1) 0%, rgba(127,255,212,1) ${100 + 36 - roundedPercentage}%, rgba(228,243,89,1) ${100 + 76 - roundedPercentage}%, rgba(243,89,89,1) ${100 + 94 - roundedPercentage}%)`;
    usageElement.style.setProperty('--gradient', gradient);
    function rangeTranslate(n, x, y){
        var OldRange = (x[1] - x[0]);
        var NewRange = (y[1] - y[0]);
        return (((n - x[0]) * NewRange) / OldRange) + y[0];
    }
    usageElement.style.setProperty('--size', `${rangeTranslate(roundedPercentage, [0, 100], [0, 88])}%`);
    usageElement.textContent = `${humanFileSize(data)} (${percentage}%) / 1 GB`;
}

function loadErrorWelcome(errorType, error){
    function retry(){
        location.reload();
    }
    function status(){
        window.open(MidelightServer + "status");
    }

    const welcomeContextMenu = contextMenu();

    welcomeContextMenu.add("text", locale[errorType]);
    welcomeContextMenu.add("button", locale.retry, {"action": retry, "icon":"refresh"});
    // welcomeContextMenu.add("line", null, {"action": retry}); line example
    welcomeContextMenu.add("button", locale.status, {"action": status, "icon":"public"});
    const extraTest = welcomeContextMenu.add("extra", locale.recover, {"action": status, "icon":"logout"});
    welcomeContextMenu.add("button", locale.actions, {"action":status,"submenu": extraTest});
    welcomeContextMenu.attach(welcome);

    welcome.classList.add("loaded");
    welcome.classList.add("error");
    logo.classList.add("loaded");
    welcome.innerHTML += "<div class='motd'>"+locale[errorType]+"</div>"+
        "<div class='btn i' data-btn='error'><i>refresh</i> "+locale.retry+"</div>"+
        "<div class='btn i' data-btn='error'><i>public</i> "+locale.status+"</div>";

    // const btns = welcome.getElementsByClassName("btn");
    const btns = welcome.querySelectorAll(".btn[data-btn='error']");

    const errorInfo = expandableBox(error);
    // welcome.appendChild(errorInfo);
    welcome.insertBefore(errorInfo, btns[0]);

    ButtonEvent(btns[0], retry);
    ButtonEvent(btns[1], status);
}

function unloggedWelcome(){
    const mdblock = createAppendElement("mdblock", welcome);

    const imaginery = createAppendElement("imaginery", welcome);
    
    createAppendElement("fill", imaginery);
    const line = createAppendElement("line", imaginery);
    line.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#0099ff" fill-opacity="1" d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,250.7C1248,256,1344,288,1392,304L1440,320L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>`;

    const notesSide = createAppendElement("notesSide", imaginery);
    const top = createAppendElement("top", notesSide);
    
    const usageDecoration = createAppendElement("usageElement", top);
    loadUsageWelcome(1000000000, usageDecoration);

    const otherTop = createAppendElement("otherTop", top);
    otherTop.innerHTML = `
        <p class="btn create" tabindex="0"><i>folder</i><span>${locale.new_folder}</span></p>
        <div class="contextMenu"><div class="drag"></div><div class="i extra btn"><i>view_carousel</i>${locale.view}<i>chevron_right</i></div><div class="i extra btn"><i>sort</i>${locale.sort}<i>chevron_right</i></div><div class="i btn"><i>select_all</i>${locale.select_all}</div><div class="i btn"><i>folder</i>${locale.new_folder}</div></div>
    `;

    const notes = createAppendElement("notes", notesSide);
    notes.innerHTML = `
        <div class="note create"><i>add</i><p> ${locale.create_new}</p></div>
        <div class="note" nid="3053ba"><p class="title">Star</p><p class="description">One star in the sky</p><p class="info"><span>2.6 kB</span><span>note</span></p></div>
    `;

    const welcomeText = createAppendElement("welcomeText", mdblock);
    welcomeText.textContent = locale.welcome_to;

    const trait = createAppendElement("trait", mdblock);
    var traits = [
        locale.text_editor,
        locale.photo_editor,
        locale.calculator,
        locale.audio_player,
        locale.notes_app
    ];

    function traitscroll(){
        foreachDelayed(traits, function(element){
            trait.style.transition = "initial"
            trait.style.opacity = 0
            trait.style.transform = "translateX(-20px)"
            setTimeout(function(){
                trait.style.transition = ".3s"
                trait.style.opacity = "initial"
                trait.style.transform = "initial"
                trait.innerHTML = element
                setTimeout(function(){
                    trait.style.opacity = 0
                    trait.style.transform = "translateX(20px)"
                    if(element == traits[traits.length-1]){
                        setTimeout(function(){
                            trait.innerHTML = traits[0]
                            trait.style.transition = "initial"
                            trait.style.opacity = 0
                            trait.style.transform = "translateX(-20px)"
                            setTimeout(function(){
                                trait.style.transition = ".3s"
                                trait.style.opacity = "initial"
                                trait.style.transform = "initial"
                            },0)
                        }, 300)
                    }
                }, 1150)
            }, 0);
        }, 1500, true)
    }
    
    traitscroll()
    
}