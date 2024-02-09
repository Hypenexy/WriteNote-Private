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
        this.writenote = document.createElement("writenote");
        this.features = document.createElement("features");
        this.lastSave;
        this.zoom = 1;
        // this.workspace = workspace; think about this
        this.linkEngine = options.linkEngine; // debug this being null or incorrect
        this.parent;

        this.insertFile = this.insertFile.bind(this);
    }

    init(parent){
        const that = this; // try working this out!
        this.parent = parent;
        const notearea = this.notearea;
        const writenote = this.writenote;
        notearea.contentEditable = true;
        notearea.tabIndex = '0';

        
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
        notearea.addEventListener("drop", function(e){
            dropChangeBack();
            var files = e.dataTransfer.files;
            if(files.length!=0){
                e.stopPropagation();
                e.preventDefault();
            }
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                that.insertFile(file);
            }
        });


        // Find code

        // notearea.addEventListener("click", function(e){
        //     console.log(e.target.innerHTML);
        // });


        writenote.appendChild(notearea);
        parent.appendChild(writenote);
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

    loadData(data){
        this.notearea.innerHTML = data;
    }

    unloadData(){
        return this.notearea.innerHTML;
    }

    insertFile(file){
        const that = this;
        if(file.type.startsWith("image/")){
            
        }
        if(file.type.startsWith("audio/")){
            const jsmediatags = window.jsmediatags;

            jsmediatags.read(file, {
                onSuccess: function(tag){
                    const data = tag.tags.picture.data;
                    const format = tag.tags.picture.format;
                    let base64String = "";
                    for (let i = 0; i < data.length; i++) {
                        base64String += String.fromCharCode(data[i]);
                    }
                    
                    console.log(tag.tags);
                    // document.querySelector("#cover").style.backgroundImage = `url(data:${format};base64,${window.btoa(base64String)})`;
                    
                    // document.querySelector("#title").textContent = tag.tags.title;
                    // document.querySelector("#artist").textContent = tag.tags.artist;
                    // document.querySelector("#album").textContent = tag.tags.album;
                    // document.querySelector("#genre").textContent = tag.tags.genre;
                },
                onError: function(error){
                    console.log(error);
                }
            });
        }
    }
    
    
}