// UA
var useragent = new UAParser(navigator.userAgent);
const device = {
    Browser: useragent.getBrowser(),
    CPU: useragent.getCPU(),
    Device: useragent.getDevice(),
    Engine: useragent.getEngine(),
    OS: useragent.getOS()
};

device["CPU"].cores = navigator.hardwareConcurrency;

var devicesList = {};
function loadDevicesWelcome(data){
    var devicesKeys = Object.keys(data.devices);
    for (let i = 0; i < devicesKeys.length; i++) {
        const DID = Object.keys(data.devices[devicesKeys[i]])[0];
        devicesList[DID] = data.devices[devicesKeys[i]][DID];
        addDeviceElement(DID);
    }
}

function updateDeviceList(data){
    if(data.type == "join"){
        const DID = Object.keys(data.content)[0];
        devicesList[DID] = data.content[DID];
        addDeviceElement(DID);
    }
    if(data.type == "leave"){
        const DID = data.content;
        delete devicesList[DID];
        removeDeviceElement(DID);
    }
    if(data.type != "join" || data.type != "leave"){
        // change datalist
    }
}


function getOS(DID){
    if(socket.id != DID){
        if(devicesList[DID] && devicesList[DID].device){
            return devicesList[DID].device.OS.name + " " + devicesList[DID].device.OS.version;
        }
        else{
            return "No system information";
        }
    }
    else{
        return device.OS.name + " " + device.OS.version + " • " + locale.you;
    }
}
function getOSIcon(DID){
    var icon = "computer";
    if(devicesList[DID] && devicesList[DID].device){
        if(devicesList[DID].device.Device.type == "mobile"){
            icon = "smartphone";
        }
        if(devicesList[DID].device.Device.model == "iPhone"){
            icon = "phone_iphone";
        }
        if(devicesList[DID].device.Device.model == "android"){
            icon = "phone_android";
        }
    }
    return icon;
}


function openDevice(DID){
    const element = document.createElement("div");
    
    const deviceHeader = createAppendElement("header", element);
    const whois = createAppendElement("whois", deviceHeader);

    whois.innerHTML = `
        <i>${getOSIcon(DID)}</i><p>${getOS(DID)}</p>
    `;

    const extraInfo = createAppendElement("extraInfo", element);
    
    
    var UADevice;
    if(DID != socket.id){
        UADevice = devicesList[DID].device;
    }
    else{
        UADevice = device;
    }
        
    function vendorDevice(){
        var vendor = "",
            model = "";
        if(UADevice.Device.vendor){
            vendor = UADevice.Device.vendor;
        }
        if(UADevice.Device.model){
            model = UADevice.Device.model;
        }
        return `${vendor} ${model}`;
    }

    extraInfo.innerHTML = `
        <p><i>web</i><span>${UADevice.Browser.name} ${UADevice.Browser.version}</span></p>
        <p><i>${getOSIcon(DID)}</i><span>${vendorDevice()} ${UADevice.OS.name} ${UADevice.OS.version}</span></p>
        <p><i>dns</i><span>${devicesList[DID].IP}</span></p>
    `;

    CreateModal(element, "device");
}

function disconnectDevice(DID){
    socket.emit("deviceAction", {
            type: "disconnect",
            DID: DID,
        },
        (success, error) => {
            console.log(success);
            console.log(error);
        }
    );
}

function logoutDevice(DID){
    socket.emit("deviceAction", {
            type: "logout",
            DID: DID,
        },
        (success, error) => {
            console.log(success);
            console.log(error);
        }
    );
}

function deviceAction(data){
    if(data.type == "logout"){
        location.reload();
    }
}