const MidelightServer = "https://writenote.midelight.net/",
    WriteNoteServer = "https://midelight.net:2053",
    imageServer = MidelightServer.replace("writenote", "i"),
    weatherServer = MidelightServer.replace("writenote", "weather"),
    assetsServer = MidelightServer.replace("writenote", "assets");
var socket;
var storedData; // Object is linked not cloned! Do not modify response.
var socketOnline = false;
var serverOnline = false;

async function midelightStartup(){
    const loadStartDate = Date.now();
    const data = queryStringSerialize({
        type: "startup",
        v: version,
        datalog,
    });

    // const response = await fetch(MidelightServer + "app/startup.php", {
    //     method: 'POST',
    //     body: data,
    //     credentials: "include",
    //     headers: {
    //         'Accept': 'application/json',
    //         'Content-Type': 'application/x-www-form-urlencoded'
    //     }
    // }).catch((error) => {
    //     console.log(error);
    // });
    const response = await fetch(WriteNoteServer, {
        method: "POST",
        body: data,
        credentials: "include",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/x-www-form-urlencoded"
        }
    })
    .catch((error) => {
        serverOnline = false;
        loadErrorWelcome("couldnt_connect", error);
    });

    if(response && response.status == 200){
        serverOnline = true;
    }

    if(serverOnline == false){
        return;
    }

    socket = io(WriteNoteServer, {
        withCredentials: true
    });

    try {
        const responseData = await response.json();
        if(responseData.status=="success"){
            storedData = responseData;
            if(Date.now() - loadStartDate > 1000){
                logo.classList.add("loaded");
            }
            else{
                setTimeout(() => {
                    logo.classList.add("loaded");
                }, 2000);
            }
            // console.log("loading took: " + (Date.now() - loadStartDate) + "ms");
            logForensic("loading " + (Date.now() - loadStartDate) + "ms");
            welcome.classList.add("loaded");
            if(responseData.user != false && responseData.user.loggedout != true){
                WriteNoteLogin(responseData);
            }
            else{
                if(responseData.user.loggedout != true){
                    unloggedWelcome();
                }
                else{
                    unloggedWelcome(responseData.user);
                }
            }
        }
        return response;
    } catch (error) {
        loadErrorWelcome("wrong_response", error);
    }
}

async function connectMidelight(){
    try {
        await midelightStartup();
    } catch (error) {
        loadErrorWelcome("couldnt_connect", error);
    }
}

function createCookie(name, value, days, path) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 *1000));
        var expires = "; expires=" + date.toGMTString();
    } else {
        var expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=" + path;
}


function WriteNoteLogin(responseData){
    if(responseData.refetch == true){
        // createCookie("PHPSESSID", responseData.user.sessionId, 20, ".midelight.net");
        // docCookies.setItem("PHPSESSID", responseData.user.sessionId, 1000, "/", ".midelight.net", true, "none");
        midelightStartup();
    }

    loadWelcome(responseData);

    socket.on("disconnect", () => {
        socketOnline = false;
        for (let i = 0; i < onlineStatusElements.length; i++) {
            const element = onlineStatusElements[i];
            if(element.classList.contains("online")){
                element.classList.remove("online");
            }
            element.classList.add("offline");
        }
    });

    socket.on("connect", () => {
        socketOnline = true;
        const logonData = {
            sessionCookie: responseData.user.sessionId,
            deviceInfo: device
        };
        socket.emit("logon", logonData, (success, error) => {
            if(success){
                socket.emit("getNotes", null, (success, error) => {
                    if(success){
                        loadNotesWelcome(success[0]);
                    }
                });
                socket.emit("getDevices", null, (success, error) => {
                    if(success){
                        loadDevicesWelcome(success[0]);
                    }
                });
                socket.emit("getUsage", null, (success, error) => {
                    if(success){
                        loadUsageWelcome(success);
                    }
                });
                // log('s', success);
                for (let i = 0; i < onlineStatusElements.length; i++) {
                    const element = onlineStatusElements[i];
                    if(element.classList.contains("offline")){
                        element.classList.remove("offline");
                    }
                    element.classList.add("online");
                }
            }
            if(error){
                // log('f', error);
            }
        });
        // notesonline = true;
        
    });
    socket.on("notesInfo", function(type, data){
        notesInfo(type, data);
    });
    socket.on("deviceInfo", function(data){
        updateDeviceList(data);
    });
    socket.on("deviceAction", deviceAction);
}

connectMidelight();



var onlineStatusElements = [];

function attachOnlineStatus(element){
    if(socketOnline==true){
        element.classList.add("online");
    }
    else{
        element.classList.add("offline");
    }
    onlineStatusElements.push(element);
}

function getUserPfpURL(){
    var pfpURL = assetsServer + "/ui/pfp.png";
    if(storedData.user.Avatar){
        pfpURL = imageServer+"?i="+storedData.user.Avatar;
    }
    return pfpURL;
}