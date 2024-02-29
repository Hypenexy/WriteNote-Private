const welcome = document.createElement("div");
welcome.classList.add("welcome");
welcome.innerHTML = "<img class='logo' src='/assets/ui/logo.svg'>";
// welcome.appendChild(logo);
app.appendChild(welcome);
const notesSide = document.createElement("div");

function loadWelcome(responseData){
    function createMOTD(name){
        var now24 = new Date().toLocaleTimeString([], { hour: '2-digit', minute: "2-digit", hour12: false });
        var hour = parseInt(now24.slice(0, 2));
        var welcomeMessage = locale.goodmorning;
        if(hour>13&&hour<18){
            welcomeMessage = locale.goodafternoon;
        }
        if(hour>17&&hour<23){
            welcomeMessage = locale.goodevening;
        }
        if(hour>22||hour<6){
            welcomeMessage = locale.goodnight;
        }
        if(hour==0||hour==24){
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

        if(hour<12&&hour>=6){
            timedescription += locale.morningin;
        }
        if(hour==12){
            timedescription += locale.noonin;
        }
        if(hour>13&&hour<18){
            timedescription += locale.afternoonin;
        }
        if(hour>17&&hour<23){
            timedescription += locale.eveningin;
        }
        if(hour>22||hour<6){
            timedescription += locale.nightin;
        }
        if(hour==0&&hour==24){
            timedescription += locale.midnightin;
        }

        timedescription += " " + info.city;

        return '<img src="'+weatherServer+'images/'+info.image+'.jpg"><timed> '+locale.lastupdated+ ' ' + now + '</timed><p>' + timedescription +'.</p><w>' + info.temp.toString().slice(0, 2) + '°C ' + info.desc + '</w>';
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
    }

    
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
    


    welcomeContextMenu.add("button", locale.name, {
        "icon":"sort_by_alpha",
        "submenu":extraSort,
        "action":()=>{appendNoteList("name")},
        "selectedReason":()=>{return settings.sort == "name";}
        // ...(settings.sort == "name" || console.log(settings.sort)) && {selected: true}
    });
    welcomeContextMenu.add("button", locale.size, {
        "icon":"save",
        "submenu":extraSort,
        "action":()=>{appendNoteList("size")},
        "selectedReason":()=>{return settings.sort == "size";}
    });
    welcomeContextMenu.add("button", locale.type, {
        "icon":"note",
        "submenu":extraSort,
        "action":()=>{appendNoteList("type")},
        "selectedReason":()=>{return settings.sort == "type";}
    });
    
    welcomeContextMenu.add("line", null, {"submenu":extraSort});

    welcomeContextMenu.add("button", locale.date_created, {
        "icon":"calendar_month",
        "submenu":extraSort,
        "action":()=>{appendNoteList("dateCreated")},
        "selectedReason":()=>{return settings.sort == "dateCreated";}
    });
    welcomeContextMenu.add("button", locale.date_modified, {
        "icon":"calendar_month",
        "submenu":extraSort,
        "action":()=>{appendNoteList("dateModified")},
        "selectedReason":()=>{return settings.sort == "dateModified";}
    });
    welcomeContextMenu.add("button", locale.date_opened, {
        "icon":"calendar_month",
        "submenu":extraSort,
        "action":()=>{appendNoteList("dateOpened")},
        "selectedReason":()=>{return settings.sort == "dateOpened";}
    });

    // welcomeContextMenu.add("text", locale.edit);
    welcomeContextMenu.add("button", locale.select_all, {"icon":"select_all"});
    welcomeContextMenu.add("button", locale.new_folder, {"icon":"folder"});
    welcomeContextMenu.attach(notesSide);
}

const notesElement = document.createElement("div");
notesElement.classList.add("notes");

function noteContextMenuUpdated(noteData, element){
    const NID = Object.keys(noteData)[0];
    const name = noteData[NID].name;
    if(!noteData[NID].size){
        noteData[NID].size = 0;
    }
    const size = humanFileSize(noteData[NID].size);
    const dateOpen = new Date(noteData[NID].fO);
    const dateOpenFormatted = dateOpen.toLocaleDateString() + ", " + dateOpen.toLocaleTimeString();
    const dateModified = new Date(noteData[NID].fM);
    const dateModifiedFormatted = dateModified.toLocaleDateString() + ", " + dateModified.toLocaleTimeString();
    
    const noteContextMenu = contextMenu();

    noteContextMenu.add("input", name); // add rename functions

    noteContextMenu.add("text", locale.actions); // make so that the line can have text alongside it

    noteContextMenu.add("button", locale.share, {"icon":"share", "disabled":true});
    noteContextMenu.add("button", locale.duplicate, {"icon":"content_copy"});
    noteContextMenu.add("button", locale.delete, {"icon":"delete"});

    noteContextMenu.add("text", locale.properties);
    
    noteContextMenu.add("text", dateOpenFormatted, {"icon":"calendar_month"});
    noteContextMenu.add("text", dateModifiedFormatted, {"icon":"calendar_month"});
    noteContextMenu.add("text", size, {"icon":"save"});

    // noteContextMenu.add("button", locale.retry, {"action": retry, "icon":"refresh"});
    // noteContextMenu.add("line", null, {"action": retry});
    // noteContextMenu.add("button", locale.status, {"action": status, "icon":"public"});
    // const extraTest = noteContextMenu.add("extra", locale.recover, {"action": status, "icon":"logout"});
    // noteContextMenu.add("button", locale.actions, {"action":status,"submenu": extraTest});
    noteContextMenu.attach(element);
}

function noteContextMenu(noteData, e, element){
    e.preventDefault();
    var show = showContext();

    if(e.left){
        contextMenu.style.top = e.top + 20 + "px";
        contextMenu.style.left = e.left + 20 + "px";
    }
    else{
        contextMenu.style.top = e.clientY + "px";
        contextMenu.style.left = e.clientX + "px";
    }
    const NID = Object.keys(noteData)[0];

    const name = noteData[NID].name;
    if(!noteData[NID].size){
        noteData[NID].size = 0;
    }
    const size = humanFileSize(noteData[NID].size);
    const dateOpen = new Date(noteData[NID].fO);
    const dateOpenFormatted = dateOpen.toLocaleDateString() + ", " + dateOpen.toLocaleTimeString();
    const dateModified = new Date(noteData[NID].fM);
    const dateModifiedFormatted = dateModified.toLocaleDateString() + ", " + dateModified.toLocaleTimeString();

    if(!noteData[NID].bin){
        contextMenu.innerHTML = '<input value="'+name+'" placeholder=>'+
        "<de>"+locale.actions+"</de>"+
        "<p><i>share</i> "+locale.share+"</p>"+
        "<p><i>content_copy</i>"+locale.duplicate+"</p>"+
        "<p><i>delete</i>"+locale.delete+"</p>"+
        "<de>"+locale.properties+"</de>"+
        "<pr><i>calendar_month</i>opened: "+dateOpenFormatted+"</pr>"+
        "<pr><i>calendar_month</i>modified: "+dateModifiedFormatted+"</pr>"+
        "<pr><i>save</i>"+size+"</pr>";

        ButtonEvent(contextMenu.getElementsByTagName("p")[2], function(e){
            // e.stopPropagation();
            deleteNote(NID, function(success, error){
                if(success){
                    element.remove();
                    hideContext();
                }
            });
        }, null, true)
    }
    else{
        contextMenu.innerHTML = "<pr>"+name+"</pr>"+
        "<de>"+locale.actions+"</de>"+
        "<p><i>star</i> "+locale.recover+"</p>"+
        "<p><i>delete_forever</i> "+locale.perm_delete+"</p>"
    }



    show();
}

const notesList = [];

function appendNoteList(sort){
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

    for (let i = 0; i < notesList.length; i++) {
        const element = notesList[i];
        addNoteToList(element);
    }
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
    ButtonEvent(element, openNote, notedata);
    // element.addEventListener("contextmenu", function(e){noteContextMenu(notedata, e, element)});
    noteContextMenuUpdated(notedata, element)
    element.innerHTML = "<p class='title'>"+notedata.name+"</p>";
    if(notedata.fL){
        element.innerHTML += "<p class='description'>"+notedata.fL+"</p>";
    }
    notesElement.appendChild(element);
}

var storedNotesData;
function loadNotesWelcome(data, space){
    storedNotesData = data;
    notesElement.innerHTML = "";

    const filters = document.createElement("div");
    filters.classList.add("filters");
    notesElement.appendChild(filters);
    const sort = createSelect("Modified Date")
    sort.addOption("Opened Date");
    sort.classList.add("sort");
    filters.appendChild(sort);
     

    for (let i = 0; i < data.notes.length; i++) {
        const element = data.notes[i];
        // addNoteToList(element, space);
        const pushelement = element[Object.keys(element)[0]];
        pushelement["nid"] = Object.keys(element)[0];
        notesList.push(pushelement);
    }

    appendNoteList();

    const createBtn = document.createElement("div");
    createBtn.classList.add("note");
    createBtn.classList.add("create");
    createBtn.innerHTML = "<p><i>add</i> "+locale.create_new+"</p>";
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

function loadDevicesWelcome(data){
    const count = data.devices.length;
    console.log(count); // work!! here.
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