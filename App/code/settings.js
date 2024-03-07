var settings = {},
    firstTimeLaunch = false;
if(localStorage.getItem("options")){
    settings = JSON.parse(localStorage.getItem("options"));
}
else{
    firstTimeLaunch = true;
}

var saveSettingsTimeout = true;
function saveSettings(isInstant){
    if(isInstant == true){
        localStorage.setItem("options", JSON.stringify(settings));
    }
    else{
        if(saveSettingsTimeout==true){
            saveSettingsTimeout = false;
            saveSettings(true);
            setTimeout(()=>{
                saveSettingsTimeout = true;
            }, 500)
        }
    }
}

document.addEventListener("visibilitychange", function(){
    if(document.visibilityState === "visible"){
        
    }
    else{
        saveSettings(true);
    }
});

// Alternative to saveSettings()
// var settingsProxy = new Proxy(settings, {
//     set: function(target, key, value){
//         console.log(`${key} set to ${value}`);
//     },
//     get: function(target, key, value){
//         console.log(`${key} get ${value}`);
//     }
// }) 

function settingsGui(){
    
}