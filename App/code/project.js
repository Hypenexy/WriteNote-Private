// const userNotes = {};


function convertNoteData(data){
    const NID = Object.keys(data)[0];
    const noteData = data[NID];
    noteData["nid"] = NID;
    return noteData;
}

const openNotes = {};
var activeNID;

function openNote(noteData){
    if(headerDropdown.classList.contains("welcome")){
        hideHeaderDropdown();
    }
    if(!welcome.classList.contains("hide") && !header.parentElement){
        welcome.classList.add("hide");
        loadHeader();
    }
    if(writenote[activeInstanceWN].isEnabled == false){
        writenote[activeInstanceWN].enabled(true);
    }
    const NID = noteData.nid;
    if(Object.keys(openNotes).includes(NID)){
        if(activeNID!=NID){
            for (let i = 0; i < noteList.children.length; i++) {
                const element = noteList.children[i];
                if(element.getAttribute("NID")==NID){
                    switchToNote(element, noteData);
                }
            }
        }
        return;
    }
    if(activeNID){
        openNotes[activeNID].data = writenote[activeInstanceWN].unloadData();
    }
    if(noteList.getElementsByClassName("active").length > 0){
        noteList.getElementsByClassName("active")[0].classList.remove("active");
    }
    const noteInfo = createAppendElement("note", noteList);
    noteInfo.classList.add("active");

    openNotes[NID] = JSON.parse(JSON.stringify(noteData));
    openNotes[NID].saved = true;
    const dateNow = Date.now();
    openNotes[NID].fO = dateNow;
    for (let i = 0; i < notesList.length; i++) {
        const element = notesList[i];
        if(element.nid == NID){
            element.fO = dateNow;
        }
    }

    activeNID = NID;
    showSubHeader(noteData.type);
    if(noteData.type == "note"){
        noteInfo.innerHTML += "<i>description</i>";
    }
    noteInfo.innerHTML += " <p>"+noteData.name+"</p>";
    noteInfo.innerHTML += "<div class='line'></div>";
    // <i class="status">share</i> Make sure to add the hover tool tips
    // <i class="status">person<p>15</p></i>"
    noteInfo.setAttribute("NID", NID);
    const xBtn = createAppendElement("x", noteInfo);
    xBtn.innerText = "close";
    ButtonEvent(xBtn, function(e){
        e.stopPropagation();
        if(headerDropdown.innerHTML != ""){
            hideHeaderDropdown(true);
        }
        closeNote(noteInfo, noteData);
    }, null, true);
    function noteDropdownMenu(){
        const element = document.createElement("div");
        element.classList.add("noteExtraInfo");
        function createBtn(icon, locale, action){
            const btn = createAppendElement("btn", element);
            btn.classList.add("i");
            btn.innerHTML = "<i>"+icon+"</i> <p>" + locale + "</p>";
            ButtonEvent(btn, action);
        }

        createBtn("close", locale.close, function(){
            hideHeaderDropdown();
            closeNote(noteInfo, noteData); // fix this when closing something else.
        });
        createBtn("save", locale.save, function(){saveNote(NID);});
        createBtn("history", locale.note_history);
        createBtn("share", locale.share);
        createBtn("content_copy", locale.duplicate);
        createBtn("delete", locale.delete);
        if(noteInfo.classList.contains("unsaved")){
            var unsaved = createAppendElement("info", element);
            unsaved.innerHTML = "<i>save</i><p>"+locale.unsaved_changes_longer+"</p>"
        }
        showHeaderDropdown("note", noteInfo, element);
    }
    ButtonEvent(noteInfo, function(e){
        if(!noteInfo.classList.contains("active")){
            switchToNote(noteInfo, noteData);
        }
        else{
            if(e.detail == 2){
                hideHeaderDropdown();
            }
            else{
                e.stopPropagation();
                noteDropdownMenu();
            }
        }
    }, false, true);

    socket.emit("openNote", NID, (success, error) => {
        if(success == true){
            socket.emit("modifyNote", {type: "load"}, (success, error) => {
                if(success){
                    writenote[activeInstanceWN].loadData(success);
                }
                if(error=="Note empty"){
                    writenote[activeInstanceWN].loadData("");
                }
            });
        }
        if(error == "Not found"){
            // error something
        }
    });
    
    noteInfo.addEventListener("click", function(e){
        if(e.detail == 2){
            e.preventDefault();
            e.stopPropagation();
            saveNote(NID);
        }
    });

    noteInfo.addEventListener("contextmenu", function(e){
        e.preventDefault();
        e.stopPropagation();
        noteDropdownMenu();
    });


    // Drag & drop
    noteInfo.draggable = true;
    noteInfo.addEventListener("dragstart", function(){
        createInstanceZones();
        noteInfo.classList.add("dragging");
    });
    var noteCooldown = false;
    // noteInfo.addEventListener("drag", function(e){
    //     if(noteCooldown == false){
    //         console.log(e.clientX > document.body.clientWidth / 2);
    //         noteCooldown = true;
    //         setTimeout(() => {
    //             noteCooldown = false;
    //         }, 500);
    //     }
    // });
    noteInfo.addEventListener("dragend", function(e){
        removeInstanceZones()
        noteInfo.classList.remove("dragging");
        console.log(e.clientX > document.body.clientWidth / 2);
        // addInstance();
    });
}

// This is real weird design, because each time you switch note it connects and awaits for a response
function switchToNote(noteInfo, noteData){
    const NID = noteData.nid;
    socket.emit("openNote", NID, (success, error) => {
        if(success == true){
            if(activeNID){
                openNotes[activeNID].data = writenote[activeInstanceWN].unloadData();
            }

            if(noteList.getElementsByClassName("active").length > 0){
                noteList.getElementsByClassName("active")[0].classList.remove("active");
            }

            showSubHeader(noteData.type);
            noteInfo.classList.add("active");
            activeNID = NID;
            writenote[activeInstanceWN].loadData(openNotes[NID].data);
            openNotes[NID].data = "";
        }
        if(error == "Not found"){
            // error something
        }
    });
}


//rework everything here!!!!!!!!!!!!!!!!!!!!!!!!!!
function closeNote(noteInfo, noteData){
    if(noteInfo == "current"){
        
        return;
    }
    const NID = noteData.nid;
    if(openNotes[NID].saved == false){

    }
    delete openNotes[NID];

    if(NID == activeNID){
        activeNID = undefined;
    }

    var closestSibling;
    if(noteInfo.nextElementSibling != undefined){
        closestSibling = noteInfo.nextElementSibling;
    }
    else{
        if(noteInfo.previousElementSibling != undefined){
            closestSibling = noteInfo.previousElementSibling;
        }
    }
    
    noteInfo.classList.add("hide");
    setTimeout(() => {
        noteInfo.remove();
    }, 100);

    socket.emit("closeNote", null, function(success, error){
        if(success=="success"){
            // idk
        }
    });

    if(NID == activeNID){
        writenote[activeInstanceWN].loadData("");
    }
    
    if(Object.keys(openNotes).length>0){
        var closestNID = closestSibling.getAttribute("NID");
        switchToNote(closestSibling, openNotes[closestNID]);
    }
    else{
        writenote[activeInstanceWN].enabled(false);
    }
}

function saveNote(NID){
    if(openNotes[NID].saved == false){
        var content;
        if(activeNID == NID){
            content = writenote[activeInstanceWN].unloadData();
        }
        else{
            content = openNotes[NID].data;
        }
        socket.emit("modifyNote",
            {
                type: "save",
                content: content
            },
            function(success, error){
                if(success == success || error == "Same content"){
                    openNotes[NID].saved = !openNotes[NID].saved;
                    const headerElement = noteList.querySelectorAll('[NID="'+NID+'"]')[0];
                    headerElement.classList.remove("unsaved");
                    const unsavedIcon = headerElement.getElementsByClassName("unsaved")[0]
                    unsavedIcon.classList.add("hide");
                    setTimeout(() => {
                        unsavedIcon.remove();
                    }, 300);
                }
                if(error == "Same content"){
                    
                }
                if(error == "Server error"){

                }
            }
        )
    }
}

writenote[activeInstanceWN].notearea.addEventListener("input", function(){
    if(openNotes[activeNID].saved == true){
        openNotes[activeNID].saved = false;
        const activeNoteInfo = noteList.getElementsByClassName("active")[0];
        addIconHeaderNote(activeNoteInfo, "save", locale.unsaved_changes, "unsaved");
        activeNoteInfo.classList.add("unsaved");
    }
});

function createNewNote(){
    const selected = {};

    const element = document.createElement("div");
    
    const title = document.createElement("div");
    element.appendChild(title);

    const nameInput = document.createElement("input");
    nameInput.classList.add("md");
    element.appendChild(nameInput);

    var filetypes = {
        "Note" : ["Text with media", "description"],
        "Calculator" : ["Math optimized workspace", "calculate"],
        "Webapp" : ["Site builder", "web_asset"]
    };
    var filetypesKeys = Object.keys(filetypes);

    const fileType = document.createElement("div");
    fileType.classList.add("filetypes");
    function addFileType(type, typedata){
        const element = document.createElement("div");
        element.classList.add("filetype");
        element.innerHTML = `<div class='m-i'>${typedata[1]}</div><div class='title'>${type}</div><div class='description'>${typedata[0]}</div>`;
        element.addEventListener("click", function(e){
            var lastSelected = fileType.getElementsByClassName("active");
            for (let i = 0; i < lastSelected.length; i++) {
                lastSelected[i].classList.remove("active");
            }
            selected["type"] = type;
            element.classList.add("active");
        });
        fileType.appendChild(element);
    }
    for (let i = 0; i < filetypesKeys.length; i++) {
        const type = filetypesKeys[i];
        const typedata = filetypes[type];
        addFileType(type, typedata);
    }
    element.appendChild(fileType);


    const createBtn = document.createElement("div");
    createBtn.classList.add("btn");
    createBtn.textContent = "Create";
    ButtonEvent(createBtn, createValidate);
    element.appendChild(createBtn);

    const closeModal = CreateModal(element, "createNew");

    // var media = document.createElement("media")
    // media.innerHTML = "<h1><i>folder</i>Media</h1><x class='m-i'>close</x>"

    // ButtonEvent(media.getElementsByTagName("x")[0], hidemedia)



    function createValidate(){
        const name = nameInput.value;
        const type = selected.type.toLowerCase();
        create(name, type);
    }
    /**
     * Finalize the form and creation process.
     * @param {String} name The name of the project
     * @param {String} type A specific type, can be note, folder or another
     */
    function create(name, type){
        socket.emit("createNote",
            {
                name: name,
                type: type
            },
            function(success, error){
                if(success){
                    closeModal();
                    const NID = Object.keys(success)[0];
                    const noteData = success[NID];
                    noteData["nid"] = NID;
                    openNote(noteData);
                    notesInfo("created", success);
                }
                if(error){
                    console.log(error);
                }
            }
        );
    }
}

function createFolder(){
    const name = "New folder";
    socket.emit("createNote", 
        {name: name, type: "folder"},
        (success, error) => {
            if(success){
                notesInfo("created", success);
            }
        }
    );
}

function newNoteSuggestions(){
    const suggestionElement = createAppendElement("newSuggestion", app);
}

window.addEventListener("keydown", function(e){
    if(e.ctrlKey && e.code == "KeyS"){
        e.preventDefault();
        saveNote(activeNID);
    }
});

function deleteNote(NID, callback){
    socket.emit("bin", NID, function(success, error){
        if(error){
            callback(null, error);
        }
        if(success == "success"){
            notesInfo("binned", NID);
            callback(true);
        }
    });
}

function notesInfo(type, data){
    if(type=="created"){
        const noteData = convertNoteData(data);
        console.log(noteData);
        notesList.push(noteData);
        appendNoteList();
    }
    if(type=="binned"){
        for (let i = 0; i < notesList.length; i++) {
            const element = notesList[i];
            if(element.nid == data){
                element.bin = true;
            }
        }

        const headerElement = noteList.querySelectorAll('[NID="'+data+'"]')[0];
        if(headerElement){
            addIconHeaderNote(headerElement, "delete", locale.binned_note, "binned");
        }

        const welcomeElement = notesElement.querySelectorAll('[NID="'+data+'"]')[0];
        welcomeElement.remove();
    }
}

function addIconHeaderNote(headerElement, icon, tooltip, customClass){
    const element = document.createElement("i");
    element.classList.add("status");
    if(customClass){
        element.classList.add(customClass);
    }
    element.innerText = icon;
    headerElement.appendChild(element);
    attachTooltip(element, tooltip);
}


document.addEventListener("keydown", function(e){
    if(e.altKey){
        if(e.code == "KeyW"){
            closeNote();
        }
        if(e.code == "KeyN"){
            createNewNote();
        }
    }
});