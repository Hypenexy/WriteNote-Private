// Test for performance
// and if slow attempt to fasten it

document.addEventListener("keydown", function(e){
    if(!e.repeat){
        playSound("code/keyboardfx/mech-keyboard-02-102918.mp3", 0.1);
    }
});
document.addEventListener("keyup", function(){
    playSound("code/keyboardfx/mech-keyboard-02-102918.mp3", 0.4);
});