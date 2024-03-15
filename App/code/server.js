const MidelightServer = "https://writenote.midelight.net/",
    WriteNoteServer = "https://midelight.net:2053",
    imageServer = MidelightServer.replace("writenote", "i"),
    weatherServer = MidelightServer.replace("writenote", "weather"),
    assetsServer = MidelightServer.replace("writenote", "assets");
var socket;
var storedData; // Object is linked not cloned! Do not modify response.
var socketOnline = false;

async function connectMidelight(){
    const loadStartDate = Date.now();
    const data = queryStringSerialize(datalog);
    try {
        const response = await fetch(MidelightServer + "app/startup.php", {
            method: 'POST',
            body: data,
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).catch((error) => {
            console.log(error);
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
                if(responseData.user != false){
                    loadWelcome(responseData);
                    socket = io(WriteNoteServer);

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
                        socket.emit("logon", responseData.user.sessionId, (success, error) => {
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
                }
                else{
                    unloggedWelcome();
                }
        }
        return response;
        } catch (error) {
            loadErrorWelcome("wrong_response", error);
        }
    } catch (error) {
        loadErrorWelcome("couldnt_connect", error);
    }
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