function selectRemote(deviceId){
    socket.emit("presentationRemote", {
        type: "assignRemote",
        device: deviceId,
        data: {
            presentingDevice: socket.id,
            totalSlides: writenote[activeInstanceWN].workspaceData.slidesCount,
            currentSlide: writenote[activeInstanceWN].workspaceData.currentSlide
        } // UPDATE THIS
    },
    (success, error) => {
        console.log(success);

    });
}

function presentationAction(data){
    socket.emit("presentationRemote", data);
}

function presentationRemote(data){
    if(data.type == "assignRemote"){
        writenote[activeInstanceWN].loadPresentationRemote(data.data);
        socket.emit("presentationRemote", {
            type: "successAssign",
            device: data.data.presentingDevice
        });
    }
    if(data.type == "successAssign"){
        textPopup(locale.success_set_remote);
    }
    if(data.type == "changeSlide"){
        console.log(data);
        writenote[activeInstanceWN].workspaceData.changeSlide(data.data);
    }
}