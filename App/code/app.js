const app = document.createElement("app");
document.body.appendChild(app);

const writenote = [new WriteNote({linkEngine: "http://ixeo.midelightdev.localhost/Metadata/"})];
var activeInstanceWN = 0;

writenote[activeInstanceWN].init(app);

writenote[activeInstanceWN].enabled(false);

function addInstance(){
    writenote.push(new WriteNote({linkEngine: "http://ixeo.midelightdev.localhost/Metadata/"}));
}

function createInstanceZones(){
    var zoneHolder = document.createElement("div");
    zoneHolder.classList.add("zoneHolder");
    app.appendChild(zoneHolder);
    for (let i = 0; i < 4; i++) {
        var element = document.createElement("div");
        element.addEventListener("dragenter", function(){
            this.classList.add("active");
        });
        element.addEventListener("dragleave", function(){
            this.classList.remove("active");
        });
        zoneHolder.appendChild(element);
    }
}

function removeInstanceZones(){
    var zoneHolder = document.getElementsByClassName("zoneHolder")[0];
    zoneHolder.remove();
}

/**
 * Creates a <mselect> (custom select element), with search functionality.
 * Read the other 2 comments inside this function to learn about using it.
 * @param {String} defaultOption If this is null it will display the first option 
 * @param {Boolean} isPlaceholder If this is not true, the defaultOption parameter will be added as an option
 * @param {String} usingNames If this is not null it will be used as a name for the first option, and the select will be value:name type. 
 * @returns The element "mselect".
 */
function createSelect(defaultOption, isPlaceholder, usingNames){
    var select = document.createElement("mselect")
    if(defaultOption){
        if(usingNames){
            select.innerHTML = usingNames + "<i>arrow_drop_down</i>"
        }
        else{
            select.innerHTML = defaultOption + "<i>arrow_drop_down</i>"
        }
    }
    var options = []
    if(!isPlaceholder && defaultOption){
        if(usingNames){
            options.push([defaultOption, usingNames])
        }
        else{
            options.push(defaultOption)
        }
    }
    var action
    /**
     * Adds a function on selecting an option.
     * @param {Function} func the function to run with the value as a parameter
     */
    select.addAction = function(func){
        action = func
    }
    if(usingNames && defaultOption){
        select.selecion = usingNames
    }
    else{
        select.selecion = defaultOption
    }
    /**
     * Adds options to the select menu, if defaultOption is not set first added option will be displayed.
     * @param {String} value The value of the option and also the name if the name is null
     * @param {String} name The name of the option
     */
    select.addOption = function(value, name){
        if(!defaultOption && options.length==0){
            select.selecion = name
            select.innerHTML = name + "<i>arrow_drop_down</i>"
        }
        if(name){
            options.push([value, name])
        }
        else{
            options.push(value)
        }
    }
    /**
     * Select an option from the list
     * @param {*} value The value of the option to select.
     */
    select.selectOption = function(value){
        function exists(arr, search) {
            return arr.some(row => row.includes(search))
        }
        if(exists(options, value)){
            select.selecion = value
            select.innerHTML = value + "<i>arrow_drop_up</i>"
        }
    }
    select.addEventListener("click", function(e){
        if(!select.classList.contains("active")){
            select.classList.add("active")
            select.innerHTML = select.selecion + "<i>arrow_drop_up</i>"
            var show = showContext()
            contextMenu.closeFunc = function(){
                document.removeEventListener("keydown", searchContextMenu)
                select.classList.remove("active")
                select.innerHTML = select.selecion + "<i>arrow_drop_down</i>"
            }
            var boundingRect = this.getBoundingClientRect()
            contextMenu.style.top = Math.trunc((boundingRect.bottom + 4)) + "px"
            contextMenu.style.left = Math.trunc(boundingRect.left) + "px"
            contextMenu.style.maxHeight = "500px"
            var search = document.createElement("input")
            search.placeholder = "Search"
            function searchContextMenu(){
                if(document.activeElement!=search){
                    search.focus()
                }
            }
            document.addEventListener("keydown", searchContextMenu)
            function searchEvent(){
                var options = contextMenu.getElementsByTagName("p")
                for (let i = 0; i < options.length; i++) {
                    const element = options[i]
                    var words = search.value.trim().toLowerCase().split(' ')
                    var item = element.innerText.trim().toLowerCase()
                    var itemWords = item.split(' ')
                    var res = false
                    itemWords.forEach(element => {
                        words.forEach(word => {
                            wordChars = Array.from(word)
                            if(wordChars.every(char => element.includes(char))){
                                res = true
                            }
                        })
                    })
                    if(!res){
                        element.style.display = "none"
                    }
                    else{
                        element.style.removeProperty("display")
                    }
                }
            }
            search.addEventListener("input", searchEvent)
            contextMenu.appendChild(search)
            options.forEach(value => {
                var element = document.createElement("p")
                element.addEventListener("click", function(){
                    if(action){
                        if(usingNames){
                            action(value[0])
                        }
                        else{
                            action(value)
                        }
                    }
                    if(usingNames){
                        select.selecion = value[1]
                        select.innerHTML = value[1] + "<i>arrow_drop_up</i>"
                    }
                    else{
                        select.selecion = value
                        select.innerHTML = value + "<i>arrow_drop_up</i>"
                    }
                    hideContext()
                })
                if(usingNames){
                    element.innerHTML = value[1]
                }
                else{
                    element.innerHTML = value
                }
                contextMenu.appendChild(element)
            })
            show()
            e.stopPropagation()
        }
        // else{
        //     select.classList.remove("active")
        //     select.innerHTML = select.selecion + "<i>arrow_drop_down</i>"
        // }
    })
    return select
}


// REWRITE AS SOON AS YOU FIND MOTIVATION!


var contextMenu

function hideContext(){
    if(contextMenu.closeFunc){
        contextMenu.closeFunc()
    }
    contextMenu.classList.add("transition")
    var altVar = contextMenu
    contextMenu = ""
    setTimeout(() => {
        altVar.remove()
        altVar = ""
    }, 200);
}

/**
 * Cool contextmenu function
 * @returns The function which shows the context menu
 */
function showContext(){
    if(contextMenu && contextMenu.nodeType){
        hideContext()
    }

    contextMenu = document.createElement("div")
    contextMenu.classList.add("contextmenu")
    contextMenu.classList.add("transition")

    function show(){
        app.appendChild(contextMenu)
        var offset = normalizeOffset(getBoundingClientRectObject(contextMenu))
        contextMenu.style.transition = 'initial'
        contextMenu.style.top = offset.top + "px"
        contextMenu.style.left = offset.left + "px"
        setTimeout(() => {
            contextMenu.style.transition = ''
            contextMenu.classList.remove("transition")
        }, 5);
    }
    return show;
}

// document.addEventListener("contextmenu", function(e){
    // e.preventDefault();
    // Probably uncomment after everything is supported with
    // custom context menus. Yes, even the inputs inside the
    // other context menus so you should make a child context
    // menu.
// })

document.addEventListener("click", function(e){
    if(contextMenu && contextMenu.nodeType){
        if(e.target != contextMenu && e.target.parentElement != contextMenu && e.target.parentElement.parentElement != contextMenu){
            hideContext()
        }
        else{
            e.preventDefault()
            e.stopPropagation()
        }
    }
})



/**
 * Dims the background and focuses on the element.
 * @param {Function} RemoteClose A function that executes when the modal is clicked.
 * @param {Color} Intensity The background's color.
 * @param {Number} Index A custom Z-Index for the modal. Default is 29
 * @returns The modal element to remove it.
 */

function ShowModal(RemoteClose, Intensity, Index){
    var modal = document.createElement("modal")
    app.appendChild(modal)
    setTimeout(() => {
        modal.style.opacity = 1
    }, 10);
    if(Intensity){
        modal.style.background = Intensity
    }
    if(Index){
        modal.style.zIndex = Index
    }
    
    function HideModal(){
        modal.style = ""
        setTimeout(() => {
            modal.remove()
        }, 300);
    }
    modal.onclick = function(e){
        if(e.target == modal){
            HideModal()
            RemoteClose()
        }
    }

    return HideModal;
}

function CreateModal(Element, ClassName, Intensity, Index){
    const element = document.createElement("div");
    element.classList.add("modalElement");
    if(ClassName){
        element.classList.add(ClassName);
    }

    const closeButton = document.createElement("x");
    closeButton.innerText = "close";
    function modalClose(){
        closeModal();
        element.remove();
    }
    ButtonEvent(closeButton, modalClose);
    element.appendChild(closeButton);

    element.appendChild(Element);
    const closeModal = ShowModal(modalClose, Intensity, Index);
    app.appendChild(element);
}



function expandableBox(text){
    var element = document.createElement("div");
    element.classList.add("expandableBox");

    var btn = document.createElement("i");
    btn.innerText = "chevron_right";
    element.appendChild(btn);
    var lastTooltipRemove;
    ButtonEvent(element, () => {
        lastTooltipRemove();
        if(element.classList.toggle("expanded") == true){   
            attachTooltip(element, locale["click_shrink"]);
        }
        else{
            attachTooltip(element, locale["click_expand"]);
        }
    });

    var copybtn = document.createElement("i");
    copybtn.classList.add("btn");
    copybtn.innerText = "copy";
    element.appendChild(copybtn);
    ButtonEvent(copybtn, function(e){
        e.stopPropagation();
        copyTextToClipboard(textElement.textContent);
        // navigator.clipboard.writeText(textElement.textContent);
    }, null, true);

    var textElement = document.createElement("span");
    textElement.textContent = text;
    element.appendChild(textElement);

    lastTooltipRemove = attachTooltip(element, locale["click_expand"]);
    return element;
}


/**
 * Play a sound
 * @param {String} url Link to the audio file 
 * @param {Int} volume Volume from 0 (0%) to 1 (100%)
 */
function playSound(url, volume) {
    // if(interacted==true){
        const audio = new Audio(url);
        if(volume){
            audio.volume = volume;
        }
        audio.play();
    // }
}

// Implement later when I'm for sure this is the correct way
// document.addEventListener("click", function(){
//     interacted = true
// })
// document.addEventListener("keydown", function(){
//     interacted = true
// })




var textPopupsContainer = document.createElement("div");
/**
 * Text popups
 * @param {*} text 
 */
function textPopup(text){
    if(textPopupsContainer.parentNode != app){
        textPopupsContainer.classList.add("textPopupsContainer");
        app.appendChild(textPopupsContainer);
    }
    

    var element = document.createElement("div");
    element.textContent = text;
    element.classList.add("textPopups");
    textPopupsContainer.appendChild(element);

    setTimeout(() => {
        element.classList.add("hide");
        setTimeout(() => {
            element.remove();
            if(textPopupsContainer.childElementCount == 0){
                textPopupsContainer.remove();
            }
        }, element.computedStyleMap().get('animation-duration').value * 1000);
    }, 2000);
}




// Copying text

function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
}

function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
    }
    navigator.clipboard.writeText(text).then(function() {
        textPopup("Copied to clipboard");
    }, function (err) {
        console.error('Async: Could not copy text: ', err);
    });
}



/**
 * Creates a contextMenu to attach to specific element
 * @param {*} type not used 
 * @returns An object with functions and properties.
 */
function contextMenu(type){
    const contextMenu = {};
    contextMenu.node = document.createElement("div");
    contextMenu.node.classList.add("contextMenu", "hide");
    contextMenu.type = type;
    contextMenu.submenus = [];

    function hideSubmenu(submenu){
        // Using animations makes everything shitty and buggy
        // Make this with 1 class not animations and more classes
        submenu.classList.remove("visible");
        // submenu.classList.add("hide");
        // setTimeout(() => {
        //     submenu.classList.remove("hide");
        //     submenu.classList.remove("visible");
        // }, submenu.computedStyleMap().get('animation-duration').value * 1000);
    }

    /**
     * Add elements to the context menu.
     * @param {String} type Type of element, either Text, Line, Button, Input, Extra
     * @param {String} text Display text of the element
     * @param {JSON} options Option of element, either {disabled: Boolean, action: Function, actionEvent: Boolean, icon: String}
     */
    contextMenu.add = (type, text, options) => {
        const element = document.createElement("div");
        if(options){
            if(typeof options.action == "function" && options.disabled != true){
                ButtonEvent(element, options.action, null, options.actionEvent);
            }
            if(options.disabled == true){
                element.classList.add("disabled");
            }
            if(options.icon){
                text = '<i>'+options.icon+'</i>' + text;
                element.classList.add("i");
            }
        }
        switch (type) {
            case "text":
                element.classList.add("text");
                break;
            case "button":
                element.classList.add("btn");
                break;
            case "line":
                element.classList.add("hr");
                break;
            case "extra":
                element.classList.add("extra", "btn");
                text += '<i>chevron_right</i>';
                element.classList.add("i");
                break;
            default:
                break;
            }
        if(typeof text == "string"){
            element.innerHTML = text;
        }
        if(options && typeof options.submenu == "object"){
            options.submenu.appendChild(element);
        }
        else{
            contextMenu.node.appendChild(element);
        }
        if(type == "extra"){
            const subMenu = document.createElement("div");
            subMenu.classList.add("contextMenu", "submenu");
            function showSubmenu(){
                var getPosition = element.getBoundingClientRect();
                subMenu.style.left = getPosition.right + "px";
                subMenu.style.top = getPosition.top + "px";
                subMenu.classList.add("visible");
            }
            function mouseOut(event){ // I need to figure a way for when user TABs after the last child element.
                if(event.type == "focusout" && event.relatedTarget != element.previousElementSibling){
                    event.preventDefault();
                    subMenu.children[0].focus();
                    return;
                }
                if(event.toElement != subMenu && event.toElement != element){
                    hideSubmenu(subMenu);
                }
            }
            element.addEventListener("mouseenter", showSubmenu);
            element.addEventListener("focusin", showSubmenu);
            element.addEventListener("focusout", mouseOut);
            element.addEventListener("mouseleave", mouseOut);
            subMenu.addEventListener("mouseleave", mouseOut);
            app.appendChild(subMenu);
            contextMenu.submenus.push(subMenu);
            return subMenu;
        }
    }

    /**
     * Attach to specific element to contain context menu.
     * @param {HTMLElement} element An html element that
     * if context clicked will spawn the menu
     */
    contextMenu.attach = (element) =>{
        element.addEventListener("contextmenu", contextMenu.append);
        document.addEventListener("click", contextMenu.remove);
    }

    /**
     * Display the created context menu.
     * @param {Object} Event event info
     * @param {HTMLElement} toElement If an element is specified
     * the context menu will position (appear) under it
     */
    contextMenu.append = (event, toElement) => {
        event.preventDefault();
        if(contextMenu.node.classList.contains("hide")){
            contextMenu.node.classList.remove("hide");
        }
        // compute width here
        contextMenu.node.style.top = event.clientY + "px"; // test event.clientY with buttons and mobile browsers
        contextMenu.node.style.left = event.clientX + "px";// and make functions for fitting inside the app
        app.appendChild(contextMenu.node);
        // contextMenu.node.children[0].focus(); Doesn't focus
        for (let i = 0; i < contextMenu.submenus.length; i++) {
            const element = contextMenu.submenus[i];
            app.appendChild(element);
        }
    }

    contextMenu.remove = (event) => {
        if(!contextMenu.node.classList.contains("hide")){
            // var composedPath = event.composedPath();
            // if(composedPath.includes(contextMenu.node) || composedPath.some(r=> contextMenu.submenus.includes(r))){
            // this is way too slow!
            if(event.target == contextMenu.node || contextMenu.submenus.includes(event.target)){
                return;
            }
            for (let i = 0; i < contextMenu.submenus.length; i++) {
                const element = contextMenu.submenus[i];
                if(element.classList.contains("visible")){
                    hideSubmenu(element);
                }
            }
            contextMenu.node.classList.add("hide");
            setTimeout(() => {
                contextMenu.node.remove();
            }, contextMenu.node.computedStyleMap().get('animation-duration').value * 1000);
        }
    }

    return contextMenu;
}