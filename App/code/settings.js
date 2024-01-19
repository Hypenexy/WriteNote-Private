var settings = {},
    firstTime = false
if(localStorage.getItem("options")){
    settings = JSON.parse(localStorage.getItem("options"))
}
else{
    firstTime = true
}
settings.version = "1.0.0Dev";