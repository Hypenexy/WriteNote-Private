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