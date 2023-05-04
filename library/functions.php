<?php

require_once("config.php");

error_reporting(E_ALL ^ E_NOTICE ^ E_WARNING);  

// Connect to database
function db_init(){
    global $config_host, $config_db, $config_username, $config_password;
    $r = mysqli_connect($config_host, $config_username, $config_password) or trigger_error(mysqli_connect_error(), E_USER_ERROR);
    mysqli_set_charset($r,'utf8');
    mysqli_select_db($r, $config_db);
    return $r;
}

// Return results (array) of SQL request
function db_select($query){
    $action = mysqli_query(db_init(), $query);
    $result = mysqli_fetch_assoc($action);
    $data = array();

    do{
        if ($result) {
            array_push($data, $result);
        }
    } while ($result = mysqli_fetch_assoc($action));

    return $data;
}

// Insert/Update/Delete in database
function db_exec($query){
    $result = mysqli_query(db_init(), $query);
    return $result;
}

function normalize($str){
    $str = str_replace(array("\r", "\n"), '', $str);
    $str = str_replace("'", '’', $str);
    $str = str_replace('"', "’’", $str);
    $str = ltrim($str);
    $str = rtrim($str);
    return $str;
}

?>