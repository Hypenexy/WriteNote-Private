<?php

$datatosend = (object) [];

if(isset($_POST["getExistingLanguages"])){
    $languagesDir = new DirectoryIterator("../../img/locales");
    $datatosend->status = "success";
    $datatosend->languages = [];
    foreach($languagesDir as $file){
        if(!$file->isDot()){
            $fileName = $file->getFilename();
            $datatosend->languages[] = explode('.', $fileName)[0];
        }
    }
}
if(isset($_POST["getLanguage"])){
    $language = $_POST["getLanguage"];
    if(str_contains($language, '..') || strlen($language) > 4){
        exit("Illegal request");
    }
    $datatosend->status = "success";
    $datatosend->language = file_get_contents("../../img/locales/$language.js");
}

echo json_encode($datatosend);