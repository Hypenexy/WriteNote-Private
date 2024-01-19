<?php
require("../../../app/server/mysql/dev.php");
require("../../../app/server/db.php");

$conn = new mysqli($host, $user, $pass);

$sql = "CREATE DATABASE `WriteNote`";
$reason = "Create DB WriteNote";
querySQL($sql, $conn, $reason);
$sql = "CREATE TABLE `WriteNote`.`logs` ( `mid` VARCHAR(500) , `uid` VARCHAR(20) NOT NULL , `appdata` VARCHAR(700) NOT NULL , `time` INT NOT NULL ) ENGINE = InnoDB;";
$reason = "Create logs table";
querySQL($sql, $conn, $reason);
$sql = "CREATE TABLE `WriteNote`.`errorlogs` ( `uid` VARCHAR(20) NOT NULL , `clienterror` VARCHAR(1500) NOT NULL , `serverresponse` VARCHAR(1500) NOT NULL , `priority` INT NOT NULL, `fixed` BOOLEAN NOT NULL , `time` INT NOT NULL ) ENGINE = InnoDB;";
$reason = "Create errorlogs table";
querySQL($sql, $conn, $reason);
$sql = "CREATE TABLE `writenote`.`notes` (`id` BIGINT NOT NULL AUTO_INCREMENT , `name` VARCHAR(100) NOT NULL , `path` VARCHAR(1000) NOT NULL , `workspace` VARCHAR(50) NOT NULL , `opened` INT NOT NULL , `modified` INT NOT NULL , `created` INT NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;";
$reason = "Create notes' table";
querySQL($sql, $conn, $reason);