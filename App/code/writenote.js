/** 
 * WriteNote by Hypenexy, Midelight
 */
class WriteNote{
    /**
     * Initialize the writenote class
     * @param {JSON} options Possible options are linkEngine: string
     */
    constructor(options){
        // somewhere i have to check for support
        this.notearea = document.createElement("notearea");
        this.isEnabled = false;
        this.mediaData = {};
        this.workspaceData = {};
        this.writenote = document.createElement("writenote");
        this.features = document.createElement("features");
        this.lastSave;
        this.zoom = 1;
        // this.workspace = workspace; think about this
        this.linkEngine = options.linkEngine; // debug this being null or incorrect
        this.parent;
        this.typeLoaded = false;

        this.insertFile = this.insertFile.bind(this);
    }

    init(parent){
        const that = this; // try working this out!
        this.parent = parent;
        const notearea = this.notearea;
        const writenote = this.writenote;
        notearea.contentEditable = true;
        notearea.tabIndex = '0';

        function SelectAll(){
            window.getSelection().selectAllChildren(notearea);
            notearea.focus();
        }
        
        notearea.addEventListener('click', function (e){
            if(e.detail === 3){
                if(e.target.nodeName == "NOTEAREA" || e.target.nodeName == "P"){
                    e.preventDefault();
                    SelectAll();
                }
            }
        })

        var initP = document.createElement("p");
        initP.innerHTML = "<br>";
        notearea.appendChild(initP);
        this.lastSave = this.data();

        
        var getSelectedNode = this.getSelectedNode
        
        notearea.addEventListener('keydown', function (e){
            if(!e.shiftKey && e.key == "Enter"){ // Maybe remove the shiftKey feature
                // e.preventDefault()
                // notearea.innerText.replace('\n', '')
                // that.pasteHtmlAtCaret('\n', true)
            }
            if(notearea.innerHTML == "<p><br></p>" && e.key == "Backspace"){
                e.preventDefault()
            }
            if(e.key == ' '){
                var focusedElement = getSelectedNode()
                if(focusedElement.nodeName=='A'){
                    e.preventDefault();
                    // setCaretAfterElement(focusedElement) // I cannot fix the escaping of the element!
                    // document.execCommand("insertHTML", false, "&nbsp;")
                    let selection = window.getSelection();
                    selection.collapse(focusedElement.parentNode, focusedElement.parentNode.childNodes.length);
                    // with this method the cadet goes at the end of the element
                    // need to block the deletion of text after the link

                    // if (e.code === 'Enter' && selectionTag === 'SUP') {
                    //     e.preventDefault()
                    //     // Insert a 'space' symbol at the end
                    //     selection.anchorNode.parentNode.insertAdjacentHTML('beforeend', '&nbsp;')
                    //     // Select the parent node
                    //     selection.selectAllChildren(selection.anchorNode.parentNode)
                    //     // Collapse selection to the end, effectively moving the cursor out of the formatted element
                    //     selection.collapseToEnd()
                    //   } Test this out!
                }
            }
            if(e.key == "Enter"){
                var focusedElement = getSelectedNode();
                if(focusedElement.nodeName=='A'){
                    e.preventDefault();
                }
            }
        })
        
        // Drop functionality
        const dropeffect = document.createElement("dropeffect");
        // dropeffect.innerHTML = "<headerfx>Drop here to open as a new file</headerfx><noteareafx>Drop here to insert in current file</noteareafx>"; //add a choice to insert contents or a file! if it's a file lol
        dropeffect.innerHTML = "<p>Drop here to insert in current file</p>";
        writenote.appendChild(dropeffect);


        function dropChange(){
            dropeffect.classList.add("dropeffectvisible");
        }
        function dropChangeBack(){
            dropeffect.classList.remove("dropeffectvisible");
        }

        notearea.addEventListener("dragover", dropChange, false);
        notearea.addEventListener("dragleave", dropChangeBack, false);
        document.addEventListener("visibilitychange", dropChangeBack, false);
        // notearea.addEventListener("drop", function(e){
        //     dropChangeBack();
        //     var files = e.dataTransfer.files;
        //     if(files.length!=0){
        //         e.stopPropagation();
        //         e.preventDefault();
        //     }
        //     for (let i = 0; i < files.length; i++) {
        //         const file = files[i];
        //         that.insertFile(file);
        //     }
        // });
        
        // document.addEventListener("dragover", dropChange, false)
        // document.addEventListener("dragleave", dropChangeBack, false)
        document.addEventListener("drop", function(e){
            dropChangeBack()
            var files = e.dataTransfer.files;
            if(files.length!=0){
                e.stopPropagation();
                e.preventDefault();
            }
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if(file.type.startsWith("image/")){
                    that.insertImage(file)
                    continue
                }
                if(file.type.startsWith("audio/")){
                    that.insertAudio(file)
                    continue
                }
                that.insertFile(file)
            }
        })


        // Find code

        // notearea.addEventListener("click", function(e){
        //     console.log(e.target.innerHTML);
        // });


        writenote.appendChild(notearea);
        parent.appendChild(writenote);
    }
    
    /**
     * Used to get the contents that the user sees/inputs
     * @returns the notearea's innerHTML
     */
    data(){
        return this.notearea.innerHTML
    }

    

    enabled(isEnabled){
        this.isEnabled = isEnabled;
        if(isEnabled==true){
            this.notearea.classList.remove("disabled")
        }
        if(isEnabled==false){
            this.notearea.classList.add("disabled")
        }
    }

    undo(){

    }

    redo(){

    }

    unloadType(){
        this.typeLoaded = false;
        const workspaces = this.writenote.getElementsByClassName("workspace");
        for (let i = 0; i < workspaces.length; i++) {
            const element = workspaces[i];
            element.remove();
        }
    }

    loadData(data, type){
        const parsedType = arguments[1].toLowerCase();
        if(this.typeLoaded == true){
            this.unloadType();
        }
        if(parsedType == "presentation"){
            this.loadPresentation(data);
        }
        if(parsedType == "note"){
            this.notearea.innerHTML = data;
        }
        else{
            this.typeLoaded = true;
        }
    }

    unloadData(type){
        if(type == "note"){
            return this.notearea.innerHTML;
        }
    }

    // Workspaces

    present(){
        this.workspaceData.currentSlide = 1;
        this.workspaceData.changeSlide = function(i) {
            that.workspaceData.currentSlide = i;
            viewport.style.backgroundImage = `url(${getURL(i)})`;
        }

        var that = this;
        function nextSlide(){
            that.workspaceData.changeSlide(that.workspaceData.currentSlide + 1);
        }
        function previousSlide(){
            that.workspaceData.changeSlide(that.workspaceData.currentSlide - 1);
        }

        var docElm = document.documentElement;
        if (docElm.requestFullscreen) {
            docElm.requestFullscreen();
        } else if (docElm.mozRequestFullScreen) {
            docElm.mozRequestFullScreen();
        } else if (docElm.webkitRequestFullScreen) {
            docElm.webkitRequestFullScreen();
        } else if (docElm.msRequestFullscreen) {
            docElm.msRequestFullscreen();
        }

        const viewport = document.createElement("div")
        viewport.classList.add("presentViewport");
        function getURL(i){
            return `./assets/ui/presentTemp/${i}.png`;
        }


        viewport.style.backgroundImage = `url(${getURL(1)})`;
        app.appendChild(viewport);

        document.addEventListener("keydown", function(e){
            if(e.key == "Escape"){
                viewport.remove();
            }
        });
        document.addEventListener("fullscreenchange", () => {
            if(!document.fullscreenElement){
                viewport.remove();
            }
        });
        viewport.addEventListener("click", nextSlide);
    }

    
    loadPresentation(data){
        const presentationLayer = document.createElement("div");
        presentationLayer.classList.add("workspace");
        presentationLayer.classList.add("presentation");
        this.writenote.appendChild(presentationLayer);

        const slidesSide = document.createElement("div");
        slidesSide.classList.add("slidesSide");
        presentationLayer.appendChild(slidesSide);

        var that = this;

        this.workspaceData.slidesCount = 0;
        this.workspaceData.currentSlide = 0;

        const slideButtons = [];

        function addSlide(imageId, text){
            that.workspaceData.slidesCount++;
        }

        function newSlide(){
            that.workspaceData.slidesCount++;
            var slideButton = document.createElement("div");
            slideButton.classList.add("btn");
            slidesSide.insertBefore(slideButton, createSlideBtn)

            slideButtons.push(slideButton);
        }
        
        if(data!=""){

        }

        const createSlideBtn = document.createElement("div");
        createSlideBtn.classList.add("btn");
        createSlideBtn.innerHTML = `<i>add</i> ${locale.add_slide}`;
        ButtonEvent(createSlideBtn, newSlide);
        slidesSide.appendChild(createSlideBtn);

        
        const viewportContainer = document.createElement("div");
        const viewport = document.createElement("div");
        viewportContainer.appendChild(viewport);
        viewportContainer.classList.add("viewport");
        presentationLayer.appendChild(viewportContainer);
        
        
        // viewport.addEventListener("drop", function(e){
        //     console.log("im triggered");
        //     var files = e.dataTransfer.files;
        //     if(files.length!=0){
        //         e.stopPropagation();
        //         e.preventDefault();
        //     }
        //     for (let i = 0; i < files.length; i++) {
        //         const file = files[i];
        //         if(file.type.startsWith("image/")){
        //             that.insertImage(file)
        //             continue
        //         }
        //         if(file.type.startsWith("audio/")){
        //             that.insertAudio(file)
        //             continue
        //         }
        //         that.insertFile(file)
        //     }
        // })

        for (let i = 1; i <= 7; i++) {
            const imgURL = `./assets/ui/presentTemp/${i}.png`;

            var slideButton = document.createElement("div");
            slideButton.classList.add("btn");
            slideButton.style.backgroundImage = `url(${imgURL})`;
            
            slidesSide.insertBefore(slideButton, createSlideBtn);

            const buttonNow = slideButton;

            ButtonEvent(slideButton, () => {
                var lastSelected = slidesSide.getElementsByClassName("active");
                for (let i = 0; i < lastSelected.length; i++) {
                    const element = lastSelected[i];
                    element.classList.remove("active");
                }
                buttonNow.classList.add("active");
                view(i);
            });
            
            this.workspaceData.slidesCount++;
        }
        this.workspaceData.currentSlide = 1;

        function view(content){
            if(content == "noimage"){
                viewport.textContent = "Drop image here";
            }
            else{
                const url = `./assets/ui/presentTemp/${content}.png`;
                viewport.innerHTML = `<img src="${url}">`;
            }
        }

        view(1);
        slidesSide.children[0].classList.add("active");
    }

    loadPresentationRemote(data){
        const presentationRemoteElement = document.createElement("div");
        presentationRemoteElement.classList.add("presentationRemote");
        this.writenote.appendChild(presentationRemoteElement);
        

        const presentBtn = document.createElement("div");
        presentBtn.classList.add("present");
        presentationRemoteElement.appendChild(presentBtn);
        const presentingOn = document.createElement("div");
        presentingOn.textContent = `${locale.presenting_on} ${getOS(data.presentingDevice)}`;
        presentationRemoteElement.appendChild(presentingOn);
        const slides = document.createElement("div");
        function slideCounter(){
            slides.innerHTML = `<span>Slide ${data.currentSlide}</span>/<span>${data.totalSlides}</span>`;
        }
        slideCounter();
        presentationRemoteElement.appendChild(slides);

        function changeSlide(i){
            slideCounter();
            presentationAction({
                type: "changeSlide",
                device: data.presentingDevice,
                data: i,
            });
        }

        function nextSlideFunc(){
            data.currentSlide++;
            changeSlide(data.currentSlide);
        }
        function previousSlideFunc(){
            data.currentSlide--;
            changeSlide(data.currentSlide);
        }

        const buttons = document.createElement("div");
        buttons.classList.add("buttons");
        presentationRemoteElement.appendChild(buttons);
        const previousSlide = document.createElement("div");
        previousSlide.classList.add("btn");
        previousSlide.textContent = locale.previous_slide;
        ButtonEvent(previousSlide, ()=>{previousSlideFunc()});
        buttons.appendChild(previousSlide);
        const nextSlide = document.createElement("div");
        nextSlide.classList.add("btn");
        nextSlide.textContent = locale.next_slide;
        ButtonEvent(nextSlide, ()=>{nextSlideFunc()});
        buttons.appendChild(nextSlide);
    }

    // Some functions

    insertNode(element){
        var range = window.getSelection().getRangeAt(0)
        // if(range.startContainer.parentElement.parentElement===this.notearea){// debug this
            range.deleteContents()
            // range.insertNode(element)
            this.insertNodesAtCaret(element, "\u00a0")
        // }
    }
    insertNodesAtCaret() {
        var i, len, node, sel, range, html, id;
        var escapeHtml = function(text) {
            var div = document.createElement("div");
            div.appendChild( document.createTextNode(text) );
            return div.innerHTML;
        };
        
        if (typeof window.getSelection != "undefined") {
            sel = window.getSelection();
            if (sel.rangeCount) {
                range = sel.getRangeAt(0);
                range.collapse(false);
                for (i = 0, len = arguments.length, node; i < len; ++i) {
                    node = arguments[i];
                    if (typeof node == "string") {
                        node = document.createTextNode(node);
                    }
                    range.insertNode(node);
                    range.setStartAfter(node);
                    range.collapse(true);
                }
                range = range.cloneRange();
                range.selectNodeContents(node);
                range.collapse(false);
                sel.removeAllRanges();
                sel.addRange(range);
            }
        } else if (typeof document.selection != "undefined" && document.selection.type != "Control") {
            html = "";
            for (i = 0, len = arguments.length, node; i < len; ++i) {
                node = arguments[i];
                if(typeof node == "string"){
                    html += escapeHtml(node);
                }else if(node.nodeType == 1){
                    html += node.outerHTML;
                }else if(node.nodeType == 3){
                    html += escapeHtml(node.data);
                }
            }
            id = "marker_" + ("" + Math.random()).slice(2);
            html += '<span id="' + id + '"></span>';
            var textRange = document.selection.createRange();
            textRange.collapse(false);
            textRange.pasteHTML(html);
            var markerSpan = document.getElementById(id);
            textRange.moveToElementText(markerSpan);
            textRange.select();
            markerSpan.parentNode.removeChild(markerSpan);
        }
    }


    restoreSelection(state, referenceNode){
        referenceNode = referenceNode || document.body

        var i
        , node
        , nextNodeCharIndex
        , currentNodeCharIndex = 0
        , nodes = [referenceNode]
        , sel = window.getSelection()
        , range = document.createRange()

        range.setStart(referenceNode, 0)
        range.collapse(true)

        while(node = nodes.pop()){
        if (node.nodeType === 3){
            nextNodeCharIndex = currentNodeCharIndex + node.length

            if(state.start >= currentNodeCharIndex && state.start <= nextNodeCharIndex){
            range.setStart(node, state.start - currentNodeCharIndex)
            }

            if(state.end >= currentNodeCharIndex && state.end <= nextNodeCharIndex){
            range.setEnd(node, state.end - currentNodeCharIndex)
            break
            }

            currentNodeCharIndex = nextNodeCharIndex
        }else{

            i = node.childNodes.length
            while (i--) {
            nodes.push(node.childNodes[i])
            }
        }
        }

        sel.removeAllRanges()
        sel.addRange(range)
        return sel
    }

    saveSelection(referenceNode){
        referenceNode = referenceNode || document.body

        var sel = window.getSelection()
        , range = sel.rangeCount
            ? sel.getRangeAt(0).cloneRange()
            : document.createRange()
        , startContainer = range.startContainer
        , startOffset = range.startOffset
        , state = {content: range.toString()}

        range.selectNodeContents(referenceNode)
        range.setEnd(startContainer, startOffset)

        state.start = range.toString().length
        state.end = state.start + state.content.length

        state.restore = restore.bind(null, state, referenceNode)

        return state
    }
    
    /**
     * TODO: Finish this
     */
    displayUserSelection(){
        const selObj = window.getSelection()
        const selRange = selObj.getRangeAt(0)
        const writenote = this.writenote
        var userSelection = document.getElementById("u1")
        if(!userSelection){
            userSelection = document.createElement("userselection")
            userSelection.id = "u1"
            writenote.getElementsByTagName("overlay")[0].appendChild(userSelection)
        }

        var selectionPositions = selRange.getClientRects()
        userSelection.innerHTML = ""
        for (let i = 0; i < selectionPositions.length; i++) {
            const arrElement = selectionPositions[i];
            const element = document.createElement("us")
            element.style.top = arrElement.top * this.zoom + "px"
            element.style.left = arrElement.left * this.zoom + "px"
            var width = arrElement.width
            if(arrElement.width == this.notearea.getElementsByTagName("p")[0].offsetWidth){
                width = 8
            }
            element.style.width = width * this.zoom + "px"
            element.style.height = arrElement.height * this.zoom + "px"
            userSelection.appendChild(element)
        }
    }

    /**
     * 
     * @returns The line that is selected.
     */
    getSelectedLine(){
        const notearea = this.notearea
        const selection = window.getSelection()
        const range = selection.getRangeAt(0)
        const caretPosition = range.startOffset

        let currentNode = range.startContainer
        while(currentNode.nodeName !== "P"){
            if(currentNode === notearea){
                return -1
            }
            currentNode = currentNode.parentNode
        }

        const lineIndex = Array.prototype.indexOf.call(
            notearea.childNodes,
            currentNode
        )

        return lineIndex
    }



    getInputSelection(el) {
        var start = 0, end = 0, normalizedValue, range,
            textInputRange, len, endRange;
    
        if (typeof el.selectionStart == "number" && typeof el.selectionEnd == "number") {
            start = el.selectionStart;
            end = el.selectionEnd;
        } else {
            range = document.selection.createRange();
    
            if (range && range.parentElement() == el) {
                len = el.value.length;
                normalizedValue = el.value.replace(/\r\n/g, "\n");
    
                // Create a working TextRange that lives only in the input
                textInputRange = el.createTextRange();
                textInputRange.moveToBookmark(range.getBookmark());
    
                // Check if the start and end of the selection are at the very end
                // of the input, since moveStart/moveEnd doesn't return what we want
                // in those cases
                endRange = el.createTextRange();
                endRange.collapse(false);
    
                if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
                    start = end = len;
                } else {
                    start = -textInputRange.moveStart("character", -len);
                    start += normalizedValue.slice(0, start).split("\n").length - 1;
    
                    if (textInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
                        end = len;
                    } else {
                        end = -textInputRange.moveEnd("character", -len);
                        end += normalizedValue.slice(0, end).split("\n").length - 1;
                    }
                }
            }
        }
    
        return {
            start: start,
            end: end
        };
    }

    getSelectionCoords(win) {
        win = win || window;
        var doc = win.document;
        var sel = doc.selection, range, rects, rect;
        var x = 0, y = 0;
        if (sel) {
            if (sel.type != "Control") {
                range = sel.createRange();
                range.collapse(true);
                x = range.boundingLeft;
                y = range.boundingTop;
            }
        } else if (win.getSelection) {
            sel = win.getSelection();
            if (sel.rangeCount) {
                range = sel.getRangeAt(0).cloneRange();
                if (range.getClientRects) {
                    range.collapse(true);
                    rects = range.getClientRects();
                    if (rects.length > 0) {
                        rect = rects[0];
                    }
                    x = rect.left;
                    y = rect.top;
                }
                // Fall back to inserting a temporary element
                if (x == 0 && y == 0) {
                    var span = doc.createElement("span");
                    if (span.getClientRects) {
                        // Ensure span has dimensions and position by
                        // adding a zero-width space character
                        span.appendChild( doc.createTextNode("\u200b") );
                        range.insertNode(span);
                        rect = span.getClientRects()[0];
                        x = rect.left;
                        y = rect.top;
                        var spanParent = span.parentNode;
                        spanParent.removeChild(span);
    
                        // Glue any broken text nodes back together
                        spanParent.normalize();
                    }
                }
            }
        }
        return { x: x, y: y };
    }

    setCaretAfterElement(element){
        if(window.getSelection){
            var range, selection   
            range = document.createRange()
            range.setStartAfter(element)
            selection = window.getSelection()
            selection.removeAllRanges()
            selection.addRange(range)
        }
    }

    setCaretAtEndOfElement(element){
        var range, selection
        if(document.createRange){
            range = document.createRange()
            range.selectNodeContents(element)
            range.collapse(false)
            selection = window.getSelection()
            selection.removeAllRanges()
            selection.addRange(range)
        }
        else if(document.selection){
            range = document.body.createTextRange()
            range.moveToElementText(element)
            range.collapse(false)
            range.select()
        }
    }

    changeZoom(value){
        if(CSS.supports("zoom", value)){
            this.notearea.style.zoom = value
        }
        else{
            if(CSS.supports("-moz-transform", `scale(${value})`)){// firefox doesn't support it and no fix i can think of
                this.notearea.style.transform = `scale(${value})`
                this.notearea.style.transformOrigin = '0 0'
            }
        }
        this.zoom = value
    }

    getSelectedNode(){
        if(document.selection){
            return document.selection.createRange().parentElement();
        }
        else{
            var selection = window.getSelection()
            if(selection.rangeCount > 0){
                return selection.getRangeAt(0).startContainer.parentNode;
            }
        }
    }

    getSelectionStyles(){
        return {
            "isBold" : isSelectionEl("b"),
            "isItalic" : isSelectionEl("i"),
            "isUnderlined" : isSelectionEl("u"),
            "isStrikeThrough" : isSelectionEl("strike")
        }
    }

    isSelectionEl(el){
        var sel;
        if (window.getSelection){
            sel = window.getSelection(); 
        }
        else if (document.getSelection){
            sel = document.getSelection(); 
        }
    
        var raw_html = getSelectionAsHtml();
    
        if(raw_html==="") return false;
    
        var tempDiv = document.createElement('div')
        tempDiv.innerHTML = raw_html
    
        var el_nodes = []
        for (var node of tempDiv.childNodes){
            var tags = [node.nodeName.toLowerCase()]
            if(tags.includes("#text")){
            for (let i = 0; i < 4; i++){
                    var tagName = getParentNode(sel.anchorNode, i+1).nodeName.toLowerCase()
                    el_nodes.push(tagName)
                }
            }
        }
    
        if(el_nodes.includes(el)){
            return (true)
        }
        return false
    }

    getSelectionAsHtml() {
        var html = "";
        if(typeof window.getSelection != "undefined"){
            var sel = window.getSelection();
            if (sel.rangeCount) {
                var container = document.createElement("div");
                for (var i = 0, len = sel.rangeCount; i < len; ++i){
                    container.appendChild(sel.getRangeAt(i).cloneContents());
                }
                html = container.innerHTML;
            }
        }else if (typeof document.selection != "undefined"){
            if (document.selection.type == "Text"){
                html = document.selection.createRange().htmlText;
            }
        }
        return html;
    }

    

    readFromSerialPort(){
        // https://developer.mozilla.org/en-US/docs/Web/API/SerialPort
        // bad idea, but good if u use it in nodejs
    }

    insertTicTacToe(){
        var tictactoe = document.createElement("tictactoe")
        tictactoe.contentEditable = false
        var status = document.createElement("status")
        var player = 1
        function updateStatus(){
            status.innerText = "Player "+player+"'s turn"
        }
        function finishGame(p){
            status.innerText = "Player "+p+" has won!"
            for (let i = 0; i < btns.children.length; i++) {
                const element = btns.children[i];
                element.classList.add("marked")
            }
        }
        function checkWin(){
            var plays = btns.children
            var p1 = []
            var p2 = []
            for (let i = 0; i < plays.length; i++) {
                if(plays[i].innerText=="close"){
                    p1.push(i)
                }
                if(plays[i].innerText=="circle"){
                    p2.push(i)
                }
            }
            function pc(p){
                if(p.includes(0) && p.includes(1) && p.includes(2)){
                    return true
                }
                if(p.includes(3) && p.includes(4) && p.includes(5)){
                    return true
                }
                if(p.includes(6) && p.includes(7) && p.includes(8)){
                    return true
                }

                if(p.includes(0) && p.includes(3) && p.includes(6)){
                    return true
                }
                if(p.includes(1) && p.includes(4) && p.includes(7)){
                    return true
                }
                if(p.includes(2) && p.includes(5) && p.includes(8)){
                    return true
                }
                
                if(p.includes(0) && p.includes(4) && p.includes(8)){
                    return true
                }
                if(p.includes(2) && p.includes(4) && p.includes(6)){
                    return true
                }
            }
            if(pc(p1)){
                return 1
            }
            if(pc(p2)){
                return 2
            }
        }
        updateStatus()
        tictactoe.appendChild(status)
        var btns = document.createElement("btns")
        tictactoe.appendChild(btns)
        for(let i = 0; i < 9; i++){
            const element = document.createElement("sq")
            element.classList.add("m-i")
            element.innerText = "c"
            btns.appendChild(element)
        }
        btns.addEventListener("click", function(e){
            if(!e.target.classList.contains("marked") && e.target.nodeName == "SQ"){
                if(player==1){
                    player = 2
                    e.target.innerText = "close"
                }
                else{
                    player = 1
                    e.target.innerText = "circle"
                }
                updateStatus()
                var checkWinResult = checkWin()
                if(checkWinResult==1){
                    finishGame(1)
                }
                if(checkWinResult==2){
                    finishGame(2)
                }
                e.target.classList.add("marked")
            }
        })
        this.insertNode(tictactoe)
    }



    // insertFile(file){
    //     const that = this;
    //     if(file.type.startsWith("image/")){
            
    //     }
    //     if(file.type.startsWith("audio/")){
    //         const jsmediatags = window.jsmediatags;

    //         jsmediatags.read(file, {
    //             onSuccess: function(tag){
    //                 const data = tag.tags.picture.data;
    //                 const format = tag.tags.picture.format;
    //                 let base64String = "";
    //                 for (let i = 0; i < data.length; i++) {
    //                     base64String += String.fromCharCode(data[i]);
    //                 }
                    
    //                 console.log(tag.tags);
    //                 // document.querySelector("#cover").style.backgroundImage = `url(data:${format};base64,${window.btoa(base64String)})`;
                    
    //                 // document.querySelector("#title").textContent = tag.tags.title;
    //                 // document.querySelector("#artist").textContent = tag.tags.artist;
    //                 // document.querySelector("#album").textContent = tag.tags.album;
    //                 // document.querySelector("#genre").textContent = tag.tags.genre;
    //             },
    //             onError: function(error){
    //                 console.log(error);
    //             }
    //         });
    //     }
    // }
    

    
    insertFile(file){
        var fileEl = document.createElement("wnfile")
        fileEl.contentEditable = false
        fileEl.innerHTML = '<ti>'+file.name+"</ti>"

        var dataId = guidGenerator().slice(0, 5)
        var that = this
        var reader = new FileReader()
        reader.onload = (function(readFile){
            console.log("added") // debug cuz sometimes it adds 2?
            that.mediaData[dataId] = readFile.target.result
            fileEl.setAttribute("dataId", dataId)
        })
        reader.readAsDataURL(file)
    
        this.processFile(fileEl);
        this.insertNode(fileEl)
        onElementRemoved(fileEl, function(){
            delete that.mediaData[dataId]
        })
    }
    processFile(fileEl){
        var that = this
        fileEl.addEventListener("click", function(){
            var dataId = fileEl.getAttribute("dataId");
            var preview = document.createElement("div");
            preview.classList.add("transition");
            setTimeout(() => {
                preview.classList.remove("transition");
            }, 10);
            preview.classList.add("filepreview");
            preview.textContent = atob(that.mediaData[dataId].slice(that.mediaData[dataId].indexOf(",") + 1, that.mediaData[dataId].length));
            var xbtn = document.createElement("x");
            xbtn.innerText = "close";
            ButtonEvent(xbtn, function(){
                preview.classList.add("transition");
                setTimeout(() => {
                    preview.remove();
                }, 300);
            });
            var header = document.createElement("div");
            header.classList.add("header");
            header.innerHTML = "<p>"+fileEl.innerText+"</p>";
            header.appendChild(xbtn);
            preview.appendChild(header);
            that.writenote.appendChild(preview);
        });
    }

    insertImage(file){
        var imageEl = document.createElement("img")

        var that = this
        var reader = new FileReader()
        var dataId = guidGenerator().slice(0, 5)
        reader.onload = (function(readFile){
            var url = window.URL || window.webkitURL;
            var imageUrl = url.createObjectURL(file);
            imageEl.src = imageUrl;
            that.mediaData[dataId] = readFile.target.result
            imageEl.setAttribute("dataId", dataId)
        })
        reader.readAsDataURL(file)
        this.insertNode(imageEl)
        
        onElementRemoved(imageEl, function(){
            delete that.mediaData[dataId]
        })
    }

    //allow only title edit
    //reEvent the events on load!
    insertAudio(file){
        var audioEl = document.createElement("wnaudio")
        audioEl.contentEditable = false
        // append child at selection (caret)
        // add a 3 dots menu with download, speed, volume!
        audioEl.innerHTML = '<ti>'+file.name+'</ti><times><timenow>0:00</timenow>/<timemax>0:00</timemax></times><i class="m-i">play_arrow</i><i class="m-i">repeat</i><input value=0 type="range">'
        
        var that = this
        var reader = new FileReader()
        var dataId = guidGenerator().slice(0, 5)
        reader.onload = (function(readFile){
            that.mediaData[dataId] = readFile.target.result
            audioEl.setAttribute("dataId", dataId)
        })
        reader.readAsDataURL(file)
        this.insertNode(audioEl)
        
        this.processAudio(audioEl)
        onElementRemoved(audioEl, function(){
            delete that.mediaData[dataId]
        })
    }
    // i should foreach every wnaudio element to make them work :/
    processAudio(audioEl){
        var audio
        var btns = audioEl.getElementsByClassName("m-i")
        var seek = audioEl.getElementsByTagName("input")[0]
        var currentTime = audioEl.getElementsByTagName("timenow")[0]
        var totalTime = audioEl.getElementsByTagName("timemax")[0]
        var that = this
        ButtonEvent(btns[0], function(){
            if(typeof audio != "object"){
                var dataId = audioEl.getAttribute("dataId")
                var audioData = that.mediaData[dataId]
                audio = new Audio(audioData)
                
                audio.onplay = function(){btns[0].innerText = "pause"}
                audio.onpause = function(){btns[0].innerText = "play_arrow"}
                seek.addEventListener("change", function(){
                    audio.currentTime = this.value
                    document.activeElement.blur()
                })
                seek.addEventListener("input", function(){
                    currentTime.innerText = formatPlaybackTime(this.value)
                })
                audio.ondurationchange = function(){
                    seek.max = audio.duration
                    totalTime.innerText = formatPlaybackTime(audio.duration)
                }
                audio.ontimeupdate = function(){
                    if(seek != document.activeElement){
                        seek.value = audio.currentTime
                    }
                    currentTime.innerText = formatPlaybackTime(audio.currentTime)
                }
                
                audio.onended = function(){
                    audio.currentTime = 0
                    if(btns[1].innerText=='repeat_one'){
                        btns[1].classList.remove("active")
                        btns[1].innerText = "repeat"
                        audio.play()
                    }
                    if(btns[1].innerText=='repeat_on'){
                        audio.play()
                    }
                }
            }
            if(btns[0].innerText == "play_arrow"){
                audio.play()
            }
            else{
                audio.pause()
            }
        })
        
        ButtonEvent(btns[1], function(){
            switch(btns[1].innerText){
            case "repeat":
                btns[1].innerText = "repeat_one"
                break;
            case "repeat_one":
                btns[1].innerText = "repeat_on"
                break;
            case "repeat_on":
                btns[1].innerText = "repeat"
                break;
            default:
                break;
            }
        })
    }

    processLink(linkEngine, url, requestWholePage){ // Learn to handle errors, rejection ;(
        return new Promise(function(resolve, reject){
            var xhttp = new XMLHttpRequest()

            xhttp.open("POST", linkEngine, true)
            xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
            var body = 'url='+url
            if(requestWholePage==true){
                body +="&wholePage=true" // debug this
            }
            xhttp.send(body)

            xhttp.onreadystatechange = function(){
                if(this.readyState == 4 && this.status == 200){
                    resolve(this.responseText)
                }
            }
        });
    }

    getAverageRGB(element){
        var blockSize = 1, // was 5
            defaultRGB = {r:0,g:0,b:0},
            canvas = document.createElement('canvas'),
            context = canvas.getContext && canvas.getContext('2d'),
            data, width, height,
            i = -4,
            length,
            rgb = {r:0,g:0,b:0},
            count = 0;
    
        if (!context){
            return defaultRGB;
        }

        height = canvas.height = element.naturalHeight || element.offsetHeight || element.height
        width = canvas.width = element.naturalWidth || element.offsetWidth || element.width

        context.drawImage(element, 0, 0)

        try{
            data = context.getImageData(0, 0, width, height)
        } catch(e){
            return defaultRGB;
        }

        length = data.data.length;

        while ( (i += blockSize * 4) < length ) {
            ++count;
            rgb.r += data.data[i]
            rgb.g += data.data[i+1]
            rgb.b += data.data[i+2]
        }

        rgb.r = ~~(rgb.r/count)
        rgb.g = ~~(rgb.g/count)
        rgb.b = ~~(rgb.b/count)

        return rgb;
    }

    setFeatures(isSet, features, writenote){ // reread this https://stackoverflow.com/questions/28767221/flexbox-resizing
        if(!features){                       // and implement it lol :p
            features = this.features
        }
        if(!writenote){
            writenote = this.writenote
        }
        if(!writenote.contains(features)){
            if(isSet==true){
                writenote.appendChild(features)
                features.classList.add("transition")
                setTimeout(() => {
                    features.classList.remove("transition")
                }, 10);
            }
        }
        else{
            if(isSet==false){
                features.remove()
            }
        }
        return features;
    }

    pasteTextAtCaret(text) {
        var sel, range;
        if(window.getSelection){
            sel = window.getSelection();
            if(sel.getRangeAt && sel.rangeCount){
                range = sel.getRangeAt(0);
                range.deleteContents();
                var textNode = document.createTextNode(text);
                range.insertNode(textNode);

                // Preserve the selection
                range = range.cloneRange();
                range.setStartAfter(textNode);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }else if(document.selection && document.selection.type != "Control") {
            document.selection.createRange().text = text;
        }
    }

    pasteHtmlAtCaret(html, selectPastedContent) {
        var sel, range;
        if (window.getSelection) {
            // IE9 and non-IE
            sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount) {
                range = sel.getRangeAt(0);
                range.deleteContents();

                // Range.createContextualFragment() would be useful here but is
                // only relatively recently standardized and is not supported in
                // some browsers (IE9, for one)
                var el = document.createElement("div");
                el.innerHTML = html;
                var frag = document.createDocumentFragment(),
                    node,
                    lastNode;
                while ( (node = el.firstChild) ) {
                    lastNode = frag.appendChild(node);
                }
                var firstNode = frag.firstChild;
                console.log(firstNode)
                range.insertNode(frag);

                // Preserve the selection
                if (lastNode) {
                    range = range.cloneRange();
                    range.setStartAfter(lastNode);
                    if (selectPastedContent) {
                        range.setStartBefore(firstNode);
                    } else {
                        range.collapse(true);
                    }
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
            }
        } else if ( (sel = document.selection) && sel.type != "Control") {
            // IE < 9
            var originalRange = sel.createRange();
            originalRange.collapse(true);
            sel.createRange().pasteHTML(html);
            if (selectPastedContent) {
                range = sel.createRange();
                range.setEndPoint("StartToStart", originalRange);
                range.select();
            }
        }
    }

    // This is really stupid, since now I can't reapply the function to existing links upon loading a note
    insertLink(url){ // if a link is inserted outside this function, either paste or detection, the event handler will not be handlin'
        var parent = this.parent
        var writenote = this.writenote
        var features = this.features
        var setFeatures = this.setFeatures
        var linkEngine = this.linkEngine
        var processLink = this.processLink
        var getAverageRGB = this.getAverageRGB
        var existingLinks = this.notearea.getElementsByTagName("a")
        var id = existingLinks.length
        // document.execCommand("insertHTML", false, "<a contenteditable='false' n="+id+">"+url+"</a>&nbsp;")
        this.pasteHtmlAtCaret("<a n='"+id+"'>"+url+"</a>")
        var existingLinksAfterUpdate = this.notearea.getElementsByTagName("a")
        for (let i = 0; i < existingLinksAfterUpdate.length; i++) {
            const element = existingLinksAfterUpdate[i]
            if(element.getAttribute('n')==id){
                var linkPreviewElement = document.createElement("div")
                linkPreviewElement.innerHTML = "<div class='loader'></div>";
                function remove(){
                    linkPreviewElement.classList.add("transition")
                    setTimeout(() => {
                        linkPreviewElement.remove()
                    }, 400)
                }
                element.addEventListener("mouseenter", function(){
                    processLink(linkEngine, url).then(function(data){
                        var data = JSON.parse(data)
                        var html = "<div class='header'><p>"+url+"</p><div><i>history</i><i>refresh</i></div></div><div class='metadata'>"
                        if(data.image){
                            html += "<div class='image'><img src='data:image/png;base64,"+data.image+"'></div>"
                        }
                        html += "<div><a>"+data.title+"</a><p>"+data.description+"</p></div></div><div class='buttons'><button>Open in WriteNote</button><button>Open in a new tab</button></div>"
                        linkPreviewElement.innerHTML = html
                        var buttons = linkPreviewElement.getElementsByTagName("button");
                        if(data.image){
                            setTimeout(() => {
                                var accentColor = getAverageRGB(linkPreviewElement.getElementsByTagName("img")[0])
                                linkPreviewElement.getElementsByTagName("button")[0].style.background = `rgb(${accentColor.r},${accentColor.g},${accentColor.b})` // I was going to find a contrast friendly color for the text but seems like every site's logo colors are fine for now.
                                // please animate when you press this button,
                                // match the other element to this' size and position
                                // opacity 0 on this element
                                // then move to the preffered location and boom
                                ButtonEvent(buttons[0], function(){
                                    var element = document.createElement("div")
                                    linkPreviewElement.classList.add("opacity")
                                    element.classList.add("sitepreview")
                                    var dimensions = linkPreviewElement.getBoundingClientRect()
                                    element.style.top = dimensions.top + "px"
                                    element.style.left = dimensions.left + "px"
                                    element.style.width = dimensions.width + "px"
                                    element.style.height = dimensions.height + "px"
                                    app.appendChild(element)
                                    setTimeout(() => {
                                        
                                        var top = "8px"
                                        var left = window.innerWidth - dimensions.width + "px"
                                        element.style.top = top
                                        element.style.left = left
                                        linkPreviewElement.style.top = top
                                        linkPreviewElement.style.left = window.innerWidth - dimensions.width + "px"
                                        if(!writenote.classList.contains("flex")){
                                            writenote.classList.add("flex")
                                        }
                                        
                                        setTimeout(() => {
                                            remove()
                                            linkPreviewElement.classList.remove("opacity")
                                            linkPreviewElement.style = ""
                                            element.classList.add("relative")
                                            element.style = ""
                                            features = setFeatures(true, features, writenote)
                                            features.prepend(element)
                                        }, 400)
                                    }, 10)
                                    processLink(linkEngine, url, true).then(function(data){
                                        console.log(data)
                                    }).catch(function(err){
                                        console.log(err)
                                    })
                                })
                            }, 10)
                        }
                        function openInNew(){
                            window.open(url, '_blank');
                        }
                        ButtonEvent(buttons[1], openInNew)
                        buttons[1].addEventListener("auxclick", openInNew)
                    }).catch(function(err){
                        console.log(err)
                    })
                    linkPreviewElement.classList.add("linkPreview")
                    linkPreviewElement.classList.add("transition")
                    // I need to add a tooltip for the buttons!
                    // Maybe make it in a function at MDUtilities or MDUI
                    parent.appendChild(linkPreviewElement)
                    setTimeout(() => {
                        linkPreviewElement.classList.remove("transition")
                    }, 10)
                })
                // element.addEventListener("mouseleave", function(){
                //     remove()
                // })
            }
        }
    }
    
}