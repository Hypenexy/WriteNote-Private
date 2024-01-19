<?php

//take errors here!
//like i take them in my ass

if(isset($_POST['clienterror'])){
    // include('../../app/server/session.php');
    require('../../app/server/db.php');
    $conn = new mysqli($host, $user, $pass, 'writenote');
    $clienterror = $conn->real_escape_string($_POST['clienterror']);
    $serverresponse = $conn->real_escape_string($_POST['serverresponse']);
    $time = strtotime("now");
    $userid = 1;//$_SESSION["userid"]; add userid support bicht
    if($result = $conn->query("INSERT INTO `errorlogs` (`clienterror`, `serverresponse`, `time`) VALUES ('$clienterror', '$serverresponse', '$time')")){
        echo "success";
    }
    else{
        echo $result->error;
    }
    $conn->close();
}
else{
    echo "invalid request bro";
}
