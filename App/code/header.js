const header = document.createElement("header");
const noteList = createAppendElement("noteList", header);

function loadHeader(){
    if(window.innerWidth <= 590){
        toggleSubHeader();
    }
    
    const headerContextMenu = contextMenu();
    headerContextMenu.add("button", locale.create_new, {"action": createNewNote, "icon":"add"});
    headerContextMenu.add("button", locale.open_new, {"action": function(e){
        e.stopPropagation();
        showHeaderDropdown("notes", openNew);
        headerContextMenu.remove(e);
    }, "actionEvent":true, "icon":"file_open"});
    headerContextMenu.attach(header);

    const createNew = document.createElement("i");
    createNew.classList.add("new");
    createNew.innerText = "add";
    attachTooltip(createNew, locale["create_new"]);
    ButtonEvent(createNew, createNewNote);
    noteList.appendChild(createNew);
    const openNew = document.createElement("i");
    openNew.classList.add("new");
    openNew.innerText = "file_open";
    attachTooltip(openNew, locale["open_new"]);
    ButtonEvent(openNew, function(e){
        e.stopPropagation();
        showHeaderDropdown("notes", openNew);
    }, null, true);
    noteList.appendChild(openNew);

    const infotainment = createAppendElement("infotainment", header);

    const showSubHeader = createAppendElement("showSubHeader", infotainment);
    showSubHeader.classList.add("m-i");
    showSubHeader.classList.add("btn");
    showSubHeader.innerText = "expand_more";
    attachTooltip(showSubHeader, locale["show_subheader"]);
    ButtonEvent(showSubHeader, toggleSubHeader);

    const weather = createAppendElement("weather", infotainment);
    weather.innerHTML = "<div>" + storedData.weather.main.temp.toString().split('.')[0] + "°C</div>";
    weather.style.backgroundImage = `url("${weatherServer}images/${storedData.weather.image}.jpg")`;
    ButtonEvent(weather, openWeather);

    const profile = createAppendElement("profile", infotainment);
    attachOnlineStatus(profile);
    attachTooltip(profile, locale["view_profile"]);
    profile.innerHTML = "<div class='line'></div><p>"+storedData.user.Username+"</p> ";
    const pfpURL = getUserPfpURL();
    profile.innerHTML += "<img src='"+pfpURL+"'>";
    ButtonEvent(profile, function(e){
        e.stopPropagation();
        const element = document.createElement("div");
        const closeNotebtn = createAppendElement("btn", element);
        closeNotebtn.innerText = "Close";
        ButtonEvent(closeNotebtn, function(){
            
        });
        showHeaderDropdown("account", profile, element);
    }, null, true);

    app.appendChild(header);
}

const subHeader = document.createElement("div");
subHeader.classList.add("subHeader");

var lastSubHeaderType = "";

function showSubHeader(type){
    if(lastSubHeaderType==type){
        return;
    }
    app.appendChild(subHeader);
    lastSubHeaderType = type;
    subHeader.innerHTML = "";
    function subHeaderButton(icon, tooltip, action){
        const element = createAppendIcon(icon, "btn", subHeader);
        attachTooltip(element, locale[tooltip]);
        ButtonEvent(element, action);
        return element;
    }
    if(type == "note"){
        subHeaderButton("undo", "undo", writenote[activeInstanceWN].undo);
        subHeaderButton("redo", "redo", writenote[activeInstanceWN].redo);
        createAppendElement("vl", subHeader);
        const insert = subHeaderButton("add_to_photos", "insert");
        const find = subHeaderButton("search", "search");
        createAppendElement("vl", subHeader);
        const cut = subHeaderButton("cut", "cut");
        const copy = subHeaderButton("copy", "copy");
        const selectAll = subHeaderButton("select_all", "select_all");
        createAppendElement("vl", subHeader);
        const bold = subHeaderButton("format_bold", "bold");
        const italic = subHeaderButton("format_italic", "italic");
        const underline = subHeaderButton("format_underline", "underline");
        const strikethrough = subHeaderButton("format_strikethrough", "strikethrough");
    }

    if(type == "presentation"){
        const present = document.createElement("div");
        present.classList.add("btn", "submit");
        present.textContent = locale.present;
        ButtonEvent(present,
            function(){
                writenote[activeInstanceWN].present();
            } 
        );
        subHeader.appendChild(present);

        // subHeaderButton("phonelink_ring", "select_device_remote_control");
        var selectedDevice = locale.none;
        var selectedDeviceName = locale.none;
        if(openNotes[activeNID] && openNotes[activeNID].remoteDevice){
            selectedDevice = openNotes[activeNID].remoteDevice
            var deviceInfo = devicesList[selectedDevice];
            selectedDeviceName = `${deviceInfo.OS.name} ${deviceInfo.OS.version}`;
        }

        const deviceSelector = createSelect(selectedDevice, null, selectedDeviceName);

        var devicesIds = Object.keys(devicesList);
        for (let i = 0; i < devicesIds.length; i++) {
            const element = devicesIds[i];
            deviceSelector.addOption(element, `${devicesList[element].device.OS.name} ${devicesList[element].device.OS.version}`)
        }

        deviceSelector.addAction(selectRemote);

        subHeader.appendChild(deviceSelector);
    }

    const hideMenu = subHeaderButton("expand_less", "hide_subheader");
    hideMenu.classList.add("hideMenu");
    ButtonEvent(hideMenu, toggleSubHeader);
}

function toggleSubHeader(){
    subHeader.classList.toggle("hidden");
    writenote[activeInstanceWN].notearea.classList.toggle("noSubHeader");
    header.classList.toggle("noSubHeader");
}

const headerDropdown = document.createElement("div");
headerDropdown.classList.add("headerDropdown");

function showHeaderDropdown(menu, element, elementToAppend){
    if(headerDropdown.innerHTML != ""){
        hideHeaderDropdown(true);
    }
    app.appendChild(headerDropdown);
    
    if(menu=="notes"){
        const xbtn = createAppendElement("x", headerDropdown);
        xbtn.innerText = "close";
        ButtonEvent(xbtn, hideHeaderDropdown);

        headerDropdown.classList.add("welcome");
        headerDropdown.classList.add("loaded");
        headerDropdown.classList.add("loadedAgain");
        if(notesElement.children[0].style.animationDelay == '0.5s'){
            for (let i = 0; i < notesElement.children.length; i++) {
                const element = notesElement.children[i];
                element.style.animationDelay = i/100 + "s";
                element.style.animationDuration = ".3s";
            }
        }
        headerDropdown.appendChild(notesSide);
        return;
    }

    headerDropdown.appendChild(elementToAppend);

    var targetRect = getBoundingClientRectObject(element);
    headerDropdown.style.top = targetRect.bottom + "px";
    headerDropdown.style.left = targetRect.left + "px";

    var rect = getBoundingClientRectObject(headerDropdown);
    var normalizedRect = normalizeOffsetRightBottom(rect);
    headerDropdown.style.top = normalizedRect.top + "px";
    headerDropdown.style.left = normalizedRect.left + "px";
}

function hideHeaderDropdown(instant){
    headerDropdown.classList.add("hide");
    function hide(){
        if(headerDropdown.classList.contains("welcome")){
            headerDropdown.classList.remove("welcome");
            headerDropdown.classList.remove("loaded");
        }
        headerDropdown.innerHTML = "";
        headerDropdown.style = "";
        headerDropdown.classList.remove("hide");
        headerDropdown.remove();
    }
    if(instant==true){
        hide();
    }
    else{
        setTimeout(() => {
            hide();
        }, 100);
    }
}

// !! Maybe make it so that it only closes when elements BELOW
// the popup are clicked? Wouldn't be such a mess here
document.addEventListener("click", function(e){
    function isContextMenu(composedPath){
        var isIt = false;
        for (let i = 0; i < composedPath.length; i++) {
            if(composedPath[i].className && composedPath[i].classList.contains("contextMenu")){
                isIt = true;
            }
        }
        return isIt;
    }
    
    if(headerDropdown.innerHTML != ""){
        var composedPath = e.composedPath();
        if(
            composedPath.includes(headerDropdown)
            || isContextMenu(composedPath)
        ){}
        else{
            hideHeaderDropdown();
        }
    }
});
// ??????????????????
// Looks weird with multiple menus being closed at the same time
document.addEventListener("keydown", function(e){
    if(e.key == "Escape"){
        hideHeaderDropdown();
    }
});