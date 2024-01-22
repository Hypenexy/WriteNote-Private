class keyboardSFX{
    constructor(){
        this.audioCtx = new AudioContext();
        this.buffer = null;

        this.gainNode = this.audioCtx.createGain();
        this.gainNode.connect(this.audioCtx.destination);
        
        this.panNode = this.audioCtx.createStereoPanner();
        this.panNode.connect(this.audioCtx.destination);

        this.load();
        

        const keyboardPhysicalLocation = {
            1:[ // Keys most on the left
                'escape', 'f1', 'f2', 'f3', 'f4',
                '`', '1', '2', '3', '4', '5',
                'q', 'w', 'e', 'r', 't',
                'a', 's', 'd', 'f', 'g',
                'z', 'x', 'c', 'v', 'b'
            ],
            2:[ // Keys little to the left
                'f5', 'f6', 'f7', 'f8',
                '6', '7', '8', '9', '0',
                'y', 'u', 'i', 'o', 'p',
                'h', 'j', 'k', 'l', ';',
                'n', 'm', ',', '.', '/'
            ],
            3:[// Keys very little to the right
                'f9', 'f10', 'f11', 'f12',
                '-', '+',
                "'"
            ],
            4:[ // keys little to the right
                'scrolllock', 'pause', 'launchmediaplayer', 'audiovolumedown', 'audiovolumeup', 'audiovolumemute',
                'insert', 'home', 'pageup', 'numlock', '/', '*', '-',
                'delete', 'end', 'pagedown',
                'arrowleft', 'arrowup', 'arrowdown', 'arrowright'
            ]
        };

        function physicalLocalization(e, isKeydown){
            var volume = 0.1;
            var pan = 0;
            if(isKeydown != true){
                volume = 0.4; // Maybe reverse the values
            }
            if (e.location === KeyboardEvent.DOM_KEY_LOCATION_LEFT || e.key == 'Tab' || e.key == 'CapsLock'){
                pan = -0.4;
            } else if (e.location === KeyboardEvent.DOM_KEY_LOCATION_RIGHT || e.key == '\\' || e.key == '|' || e.key == 'Enter' || e.key == 'Backspace'){
                pan = 0.2;
            }
            else{
                if(keyboardPhysicalLocation[1].includes(e.key.toLowerCase())){
                    pan = -0.4;
                }
                else if(keyboardPhysicalLocation[2].includes(e.key.toLowerCase())){
                    pan = -0.2;
                }
                else if(keyboardPhysicalLocation[3].includes(e.key.toLowerCase())){
                    pan = 0.07;
                }
                else if(keyboardPhysicalLocation[4].includes(e.key.toLowerCase())){
                    pan = 0.2;
                }
            }
            return [volume, pan];
        }

        const play = this.play;
        document.addEventListener("keydown", function(e){
            if(!e.repeat){
                var localization = physicalLocalization(e, true);
                console.log(localization);
                play(localization[0], localization[1]);
            }
        });
        document.addEventListener("keyup", function(e){
            var localization = physicalLocalization(e);
            play(localization[0], localization[1]);
        });
    }
    load = () => {
        const request = new XMLHttpRequest();
        request.open("GET", "code/keyboardfx/keyboard-test-sound.mp3");
        request.responseType = "arraybuffer";
        const audioCtx = this.audioCtx;
        var that = this; 
        request.onload = function() {
            let undecodedAudio = request.response;
            audioCtx.decodeAudioData(undecodedAudio, (data) => that.buffer = data);
        };
        request.send();
    }

    play = (volume, pan) => {
        const audioCtx = this.audioCtx,
            buffer = this.buffer;

        const source = audioCtx.createBufferSource();
        if(volume && pan){

            this.gainNode.gain.value = volume;
            this.panNode.pan.value = pan;
            source.connect(this.gainNode).connect(this.panNode).connect(audioCtx.destination);
        }
        else if(volume){
            this.gainNode.gain.value = volume;
            source.connect(this.gainNode);
        }
        else if(pan){
            this.panNode.pan.value = pan;
            source.connect(this.panNode);
        }
        source.buffer = buffer;
        source.connect(audioCtx.destination);
        
        source.start();
    }
    
    close(){
        this.audioCtx.close();
    }
}

var testkbfx = new keyboardSFX();