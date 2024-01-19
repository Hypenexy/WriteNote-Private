<?php

if(isset($_POST["settings"]["version"]) || isset($_POST["version"])){
    $datatosend = (object) [];
    $datatosend->status = "success";
    $clientversion;
    if(isset($_POST["settings"]["version"])){
        $clientversion = $_POST["settings"]["version"];
    }
    if(isset($_POST["version"])){
        $clientversion = $_POST["version"];
    }

    if($clientversion=="Console-1.0"){
        // $datatosend->notes = ['getyouhigh.txt', 'todo.note', 'hi.note', 'ok.note'];
    }
    
    echo json_encode($datatosend);
}


// if(isset($_POST["settings"]["version"])){
//     $clientversion = $_POST["settings"]["version"];
//     //should i $_SESSION["clientversion"] for later use?
//     //maybe i will store it in a "device" "session" place in the mysql
//     //should i store the scroll amount for devices?
//     if($clientversion==$writenoteversion){
//         //👍
//     }
//     else{
//         echo $clientversion;
//         echo $writenoteversion;
//         //exit();
//     }
// }
// else{
//     //exit();
// }