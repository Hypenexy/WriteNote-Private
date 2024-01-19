<?php

// if (isset($_SERVER['HTTP_ORIGIN'])) {
//     header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
//     header('Access-Control-Allow-Credentials: true');
//     header('Access-Control-Max-Age: 86400');    // cache for 1 day
// }

// if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    
//     if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
//         header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    
//     if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
//         header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

//     exit(0);
// }


require('../../../app/session/index.php');
require('../../../app/server/mysql/db.php');
require('../../../app/server/mdata/smid.php');
require('../../../app/server/mdata/mdcrypt.php');
require('server/version.php');


if(isset($_POST["settings"]["version"]) || isset($_POST["version"])){
    //should i $_SESSION["clientversion"] for later use?
    //maybe i will store it in a "device" "session" place in the mysql
    //should i store the scroll amount for devices?
    
    if(isset($_POST["settings"]["version"])){
        $clientversion = $_POST["settings"]["version"];
    }
    if(isset($_POST["version"])){
        $clientversion = $_POST["version"];
    }

    if($clientversion==$writenoteversion){ // this should be an array of newest versions
        //👍
    }
    else{
        // echo $clientversion;
        // echo $writenoteversion;
        //exit();
    }
}
else{
    //exit();
}

$conn = new mysqli($host, $user, $pass, 'WriteNote');
$time = strtotime("now");
$logdata = $conn->real_escape_string(json_encode($_POST));
$userid = $_SESSION["loggedin"];//$_SESSION["userid"]; MAybe only when logged in the do that?
$conn->query("INSERT INTO `logs` (`mid`, `uid`, `appdata`, `time`) VALUES ('$smid', '$userid', '$logdata', '$time')");
$conn->close();

$datatosend = (object) [];
$datatosend->status = "success";
$datatosend->version = $writenoteversion;

if(isset($_SESSION["loggedin"])){ //make this a function cuz its same across apps
    $conn = new mysqli($host, $user, $pass, 'midelight');
    $userresult = $conn->query("SELECT * FROM profiles where id='".$_SESSION["loggedin"]."'");
    if(mysqli_num_rows($userresult)){
        $userresult = mysqli_fetch_assoc($userresult);
        $datatosend->user = (object) [];
        $datatosend->user->sessionId = $session; // Maybe app having access to this is a bit insecure. Maybe try client-side protection to not send it elsewhere.
        $datatosend->user->username = $userresult["username"];
        if($userresult["pfp"]!=""){
            $datatosend->user->pfp = $userresult["pfp"];
        }
        if($userresult["banner"]!=""){
            $datatosend->user->banner = $userresult["banner"];
        }
    }
    else{
        $datatosend->status = "loginfailure";
    }
    $conn->close();
}
else{
    $datatosend->user = false;
}

if($clientversion=="Console-1.0"){
    $conn = new mysqli($host, $user, $pass, 'midelight');
    $username = $conn->real_escape_string($_POST["username"]);
    $password = $conn->real_escape_string($_POST["password"]);
    $password = encryptMd($password);
    $userresult = $conn->query("SELECT * FROM profiles where username='".$username."' and password='".$password."'");
    if(mysqli_num_rows($userresult)){
        $userresult = mysqli_fetch_assoc($userresult);
        $datatosend->user = (object)[];
        $datatosend->user->username = $userresult["username"];
        if($userresult["pfp"]!=""){
            $imagepath = '../../userdata/'.$userresult["id"].'/img/'.$userresult["pfp"].'64';
        }
        if($userresult["banner"]!=""){
            $datatosend->user->banner = $userresult["banner"];
        }
        list($imagewidth, $imageheight) = getimagesize($imagepath);
        $thumb = imagecreatetruecolor(64, 64); // either this or the old 64 and 32
        $img = imagecreatefrompng($imagepath);
        imagecopyresized($thumb, $img, 0, 0, 0, 0, 64, 64, $imagewidth, $imageheight);
        //temporary rotate until not lazy to fix
        // $thumb = imagerotate($thumb, 180, 0);
        $img = $thumb;

        $width = imagesx($img);
        $height = imagesy($img);
        $datatosend->user->pfp = '';
        for($h=0;$h<$height;$h++)
        {
            for($w=0;$w<=$width;$w++){
                
                @$rgb = imagecolorat($img, $w, $h);
                
                $r = ($rgb >> 16) & 0xFF;
                
                $g = ($rgb >> 8) & 0xFF;
                
                $b = $rgb & 0xFF;
                
                if($w == $width){
                    $datatosend->user->pfp .= 'n';
                }
                else{ 
                    $datatosend->user->pfp .= $r.','.$g.','.$b.';';
                }
            }
        }
    }
    else{
        $datatosend->status = "loginfailure";
    }
    $conn->close();
}

        // //ascii image test ;p
        // $imagepath = "../temp/pfp.jpeg";
        // list($imagewidth, $imageheight) = getimagesize($imagepath);
        // $thumb = imagecreatetruecolor(64, 64);
        // $img = imagecreatefromjpeg($imagepath);
        // imagecopyresized($thumb, $img, 0, 0, 0, 0, 64, 64, $imagewidth, $imageheight);
        // $img = $thumb;

        // $width = imagesx($img);
        // $height = imagesy($img);
        // for($h=0;$h<$height;$h++)
        // {
        //     for($w=0;$w<=$width;$w++){
                
        //         @$rgb = imagecolorat($img, $w, $h);
                
        //         $r = ($rgb >> 16) & 0xFF;
                
        //         $g = ($rgb >> 8) & 0xFF;
                
        //         $b = $rgb & 0xFF;
                
        //         if($w == $width){
        //             echo '<br>';
        //         }
        //         else{ 
        //             echo '<span style="color:rgb('.$r.','.$g.','.$b.');">■</span>'; //or any other symbol
        //         }
        //     }
        // }
//Weather shit


// $ip = '62.176.90.216'; // $_SERVER['REMOTE_ADDR']
// who is 2a01:5a8:108:c8f1:cd90:52c4:c3a2:ed87

$ip = '62.176.90.216';
$query = @unserialize(file_get_contents('http://ip-api.com/php/'.$ip));
if($query && $query['status'] == 'success')
{
    $city = $query['city'];
    $country = $query['countryCode'];
    $lat = $query['lat'];
    $lon = $query['lon'];
}

// This is basically obsolette if lat and lon actually work fine!
// $weatherfile = fopen("weather/".$country.".json", "r");
// $json = fread($weatherfile,filesize("weather/".$country.".json"));

// $arr = json_decode($json,true);
// $find_val = $city;
// foreach ($arr as $key => $value) {
//     if($value['name'] == $find_val)
//     {
//         $citycode = $value['id'];
//     }
// }

$apiKey = "177da1021eb6e9685ccd90769dca69f5";
// $cityId = $citycode;
// $infoURL = "http://api.openweathermap.org/data/2.5/weather?id=" . $cityId . "&lang=en&units=metric&APPID=" . $apiKey;
$infoURL = "http://api.openweathermap.org/data/2.5/weather?lat=$lat&lon=$lon&lang=en&units=metric&APPID=" . $apiKey;

//The metrics and language shit can be changed by profiles
//and here i can just do 1 mysql request and then store it in the session data. idk

//u can just retrieve the app settings u idiot (steal user data ;)

$ch = curl_init();

curl_setopt($ch, CURLOPT_HEADER, 0);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_URL, $infoURL);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
curl_setopt($ch, CURLOPT_VERBOSE, 0);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
$response = curl_exec($ch);
curl_close($ch);

if($response){
    $data = json_decode($response);
    $currentTime = time();
    
    $datatosend->weather = (object) [
    'time' => date("g:i A", $currentTime),
    'temp' => $data->main->temp,
    'desc' => $data->weather[0]->description,
    'altdesc' => $data->weather[0]->main,
    'city' => $city
    ];
}



//images

if($clientversion!="Console-1.0"){
    // $imagepath = "images/3.jpg";
    // $imagefile = fopen($imagepath, "r");
    // $image = fread($imagefile, filesize($imagepath));
    // $datatosend->weather->image = base64_encode($image);
    
    $conn = new mysqli($host, $user, $pass, 'weather');
    $resultImages = $conn->query("SELECT id FROM images");
    $conn->close();
    $imagesIds = mysqli_fetch_all($resultImages);
    $imagesIdsArray = [];
    foreach ($imagesIds as $key) {
        $imagesIdsArray[] = $key[0];
    }

    $randomId = array_rand($imagesIdsArray) + 1;
    $datatosend->weather->image = $randomId;
}


echo json_encode($datatosend);