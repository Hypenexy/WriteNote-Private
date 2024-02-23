var settings = {},
    firstTimeLaunch = false;
if(localStorage.getItem("options")){
    settings = JSON.parse(localStorage.getItem("options"));
}
else{
    firstTimeLaunch = true;
}

function settingsGui(){
    
}